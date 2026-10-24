#!/usr/bin/env python3
"""Watch and listen to a video file, locally and for free.

    python3 tools/watch-video.py <video> [--out DIR] [--model base] [--every 20]

Produces, in one output directory:
  transcript.md     every word with timestamps, from faster-whisper on the CPU
  sheets/*.jpg      contact sheets of frames, each frame stamped with its time
  report.md         an index tying the two together

Why this exists: Claude can read images and text but cannot open an .mp4. This
turns a video into the two things it can actually take in — stamped frames to
look at, and a timed transcript to read — so "watch this video" stops being a
request that depends on a paid API or on a service that can hallucinate a
summary of a video it never saw.

Needs: ffmpeg, faster-whisper, numpy, pillow. No network after the Whisper
model has been cached once, and no credits ever.

The first run downloads the model (~150MB for base). Speed on 4 CPU cores is
roughly 8x realtime with base, so a two hour talk takes about fifteen minutes.
Use --model small for better accuracy at about half that speed.

It cannot fetch from YouTube: that is a separate problem, and YouTube blocks
datacentre IPs with a bot check. Download the file on a normal machine and
pass it to this script.
"""
from __future__ import annotations

import argparse
import json
import shutil
import subprocess
import sys
from pathlib import Path

FRAME_COLS = 4
FRAME_ROWS = 3
FRAME_W = 480


def need(binary: str) -> None:
    if shutil.which(binary) is None:
        sys.exit(f"{binary} is not installed")


def duration_of(video: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "default=nk=1:nw=1", str(video)],
        capture_output=True, text=True, check=True).stdout.strip()
    return float(out)


def stamp(seconds: float) -> str:
    s = int(seconds)
    h, rem = divmod(s, 3600)
    m, sec = divmod(rem, 60)
    return f"{h:d}:{m:02d}:{sec:02d}" if h else f"{m:02d}:{sec:02d}"


def listen(video: Path, out: Path, model_size: str) -> list[dict]:
    """Transcribe the audio. Decodes with ffmpeg rather than letting
    faster-whisper use PyAV, whose API drifts between versions."""
    import numpy as np
    from faster_whisper import WhisperModel

    raw = subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(video),
         "-f", "f32le", "-ac", "1", "-ar", "16000", "-"],
        capture_output=True, check=True).stdout
    audio = np.frombuffer(raw, dtype=np.float32)

    model = WhisperModel(model_size, device="cpu", compute_type="int8", cpu_threads=4)
    segments, _ = model.transcribe(audio, language="en", vad_filter=True)

    rows = []
    lines = ["# Transcript", ""]
    for seg in segments:
        text = seg.text.strip()
        if not text:
            continue
        rows.append({"start": seg.start, "end": seg.end, "text": text})
        lines.append(f"**[{stamp(seg.start)}]** {text}")
        lines.append("")

    (out / "transcript.md").write_text("\n".join(lines), encoding="utf-8")
    return rows


def watch(video: Path, out: Path, every: int) -> list[Path]:
    """Pull a frame every `every` seconds, stamp each with its timecode, and
    tile them into contact sheets that are small enough to actually look at."""
    frames_dir = out / "frames"
    frames_dir.mkdir(parents=True, exist_ok=True)
    sheets_dir = out / "sheets"
    sheets_dir.mkdir(parents=True, exist_ok=True)

    subprocess.run(
        ["ffmpeg", "-v", "error", "-i", str(video),
         "-vf", f"fps=1/{every},scale={FRAME_W}:-2",
         "-q:v", "4", str(frames_dir / "f-%05d.jpg")],
        check=True)

    frames = sorted(frames_dir.glob("f-*.jpg"))
    if not frames:
        return []

    from PIL import Image, ImageDraw

    per_sheet = FRAME_COLS * FRAME_ROWS
    sheets = []
    for sheet_no, start in enumerate(range(0, len(frames), per_sheet), start=1):
        chunk = frames[start:start + per_sheet]
        cell_w, cell_h = FRAME_W, int(FRAME_W * 9 / 16)
        with Image.open(chunk[0]) as probe:
            cell_h = int(FRAME_W * probe.height / probe.width)

        label = 20
        sheet = Image.new("RGB", (cell_w * FRAME_COLS, (cell_h + label) * FRAME_ROWS), "#111111")
        draw = ImageDraw.Draw(sheet)

        for i, frame in enumerate(chunk):
            row, col = divmod(i, FRAME_COLS)
            index = start + i
            with Image.open(frame) as im:
                sheet.paste(im.convert("RGB").resize((cell_w, cell_h)),
                            (col * cell_w, row * (cell_h + label) + label))
            draw.text((col * cell_w + 6, row * (cell_h + label) + 4),
                      stamp(index * every), fill="#ffaa66")

        path = sheets_dir / f"sheet-{sheet_no:03d}.jpg"
        sheet.save(path, quality=80)
        sheets.append(path)

    shutil.rmtree(frames_dir, ignore_errors=True)
    return sheets


def main() -> int:
    need("ffmpeg")
    need("ffprobe")

    ap = argparse.ArgumentParser(description="Turn a video into frames and a timed transcript")
    ap.add_argument("video", type=Path)
    ap.add_argument("--out", type=Path, default=None)
    ap.add_argument("--model", default="base", choices=["tiny", "base", "small", "medium"])
    ap.add_argument("--every", type=int, default=20, help="seconds between frames")
    ap.add_argument("--no-audio", action="store_true")
    args = ap.parse_args()

    if not args.video.exists():
        sys.exit(f"no such file: {args.video}")

    out = args.out or args.video.parent / (args.video.stem + "-watched")
    out.mkdir(parents=True, exist_ok=True)

    length = duration_of(args.video)
    print(f"{args.video.name}: {stamp(length)}")

    print(f"looking: a frame every {args.every}s")
    sheets = watch(args.video, out, args.every)
    print(f"  {len(sheets)} contact sheet(s)")

    rows = []
    if not args.no_audio:
        print(f"listening: faster-whisper '{args.model}' on CPU")
        rows = listen(args.video, out, args.model)
        print(f"  {len(rows)} transcript segments")

    (out / "report.md").write_text("\n".join([
        f"# {args.video.name}",
        "",
        f"- Length: {stamp(length)}",
        f"- Frames: one every {args.every}s across {len(sheets)} contact sheet(s) in `sheets/`",
        f"- Transcript: {len(rows)} segments in `transcript.md`",
        "",
        "Read the contact sheets as images and the transcript as text; the",
        "timecode burned onto each frame lines up with the transcript stamps.",
        "",
    ]), encoding="utf-8")

    (out / "segments.json").write_text(json.dumps(rows, indent=1), encoding="utf-8")
    print(f"\nwrote {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
