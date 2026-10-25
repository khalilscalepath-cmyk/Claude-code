import { useEffect, useRef, useState } from 'react';

const VIDEO_URL =
  'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260715_090628_7052d8a6-a094-4341-a4a2-ad58493a67a9.mp4';

const MAX_CAPTURE_WIDTH = 960;
const FPS = 30;

/**
 * Plays the clip through once while copying every frame to an offscreen
 * canvas, then drops the <video> and plays those frames back forward and
 * reverse forever.
 *
 * A native `loop` would snap from the last frame to the first, which reads as
 * a cut. Ping-ponging the captured frames means the motion always reverses
 * into itself, so there is no seam to see.
 */
export default function BoomerangVideoBg() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const framesRef = useRef<HTMLCanvasElement[]>([]);
  const [ready, setReady] = useState(false);

  // --- pass one: play it through, keeping each frame ---
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let stopped = false;
    let lastTime = -1;
    let rvfc = 0;
    let raf = 0;
    let w = 0;
    let h = 0;

    const grab = () => {
      if (stopped || !video.videoWidth) return;
      // The same frame can be offered twice; currentTime is what tells them apart.
      if (video.currentTime === lastTime) return;
      lastTime = video.currentTime;

      if (!w) {
        const scale = Math.min(1, MAX_CAPTURE_WIDTH / video.videoWidth);
        w = Math.round(video.videoWidth * scale);
        h = Math.round(video.videoHeight * scale);
      }
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      if (!ctx) return;
      ctx.drawImage(video, 0, 0, w, h);
      framesRef.current.push(c);
    };

    // requestVideoFrameCallback fires once per decoded frame, so it catches
    // every one; rAF only fires per repaint and will miss frames on a slow
    // display, which is why it is the fallback rather than the default.
    const hasRVFC = typeof (video as any).requestVideoFrameCallback === 'function';

    const stepRVFC = () => {
      grab();
      if (!stopped) rvfc = (video as any).requestVideoFrameCallback(stepRVFC);
    };
    const stepRAF = () => {
      grab();
      if (!stopped) raf = requestAnimationFrame(stepRAF);
    };

    let started = false;
    const start = () => {
      if (started || stopped) return;
      started = true;
      void video.play().catch(() => {});
      if (hasRVFC) rvfc = (video as any).requestVideoFrameCallback(stepRVFC);
      else raf = requestAnimationFrame(stepRAF);
    };

    const finish = () => {
      if (stopped) return;
      stopped = true;
      if (rvfc && (video as any).cancelVideoFrameCallback) {
        (video as any).cancelVideoFrameCallback(rvfc);
      }
      if (raf) cancelAnimationFrame(raf);
      if (framesRef.current.length > 1) setReady(true);
    };

    video.addEventListener('loadeddata', start);
    video.addEventListener('ended', finish);
    if (video.readyState >= 2) start();

    return () => {
      stopped = true;
      video.removeEventListener('loadeddata', start);
      video.removeEventListener('ended', finish);
      if (rvfc && (video as any).cancelVideoFrameCallback) {
        (video as any).cancelVideoFrameCallback(rvfc);
      }
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // --- pass two: forward to the end, back to the start, forever ---
  useEffect(() => {
    if (!ready) return;
    const canvas = canvasRef.current;
    const frames = framesRef.current;
    if (!canvas || frames.length < 2) return;

    canvas.width = frames[0].width;
    canvas.height = frames[0].height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let i = 0;
    let dir = 1;
    const id = window.setInterval(() => {
      ctx.drawImage(frames[i], 0, 0);
      if (dir === 1 && i === frames.length - 1) dir = -1;
      else if (dir === -1 && i === 0) dir = 1;
      i = Math.max(0, Math.min(frames.length - 1, i + dir));
    }, 1000 / FPS);

    return () => window.clearInterval(id);
  }, [ready]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <div className="w-full h-full scale-[1.15] origin-top overflow-hidden">
        <video
          ref={videoRef}
          src={VIDEO_URL}
          muted
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          className="w-full h-full object-cover object-top"
          style={{ display: ready ? 'none' : 'block' }}
        />
        <canvas
          ref={canvasRef}
          className="w-full h-full object-cover object-top"
          style={{ display: ready ? 'block' : 'none' }}
        />
      </div>
    </div>
  );
}
