"""Crop, resize and re-encode the chosen Carmel photographs for the site."""
from PIL import Image, ImageOps
import pathlib

RAW = pathlib.Path("raw")
OUT = pathlib.Path("/home/user/Claude-code/sites/carmel-homes/assets/img")
OUT.mkdir(parents=True, exist_ok=True)

# source file -> (output name, width, aspect w/h, quality)
JOBS = [
    ("the-sanctuary__0__DSC_0580-1.jpg",                      "hero-sanctuary",      2200, 16 / 9, 72),
    ("classic-contemporary__2__9.jpg",                        "classic-contemporary", 1000, 4 / 3, 74),
    ("terbush-residence-paradise-valley__2__Terbush-3-Front-of-home-built-by-Carmel-Homes-Design-Group-LLC.jpg",
                                                              "terbush",              1000, 4 / 3, 74),
    ("the-sanctuary__2__DSC_0611-1.jpg",                      "sanctuary",            1000, 4 / 3, 74),
    ("canyon-court-residence-2__2__3-Back-of-Home.jpg",       "canyon-court",         1000, 4 / 3, 74),
    ("private-residence-scottsdale-az__4__DSC_0947.jpg",      "private-scottsdale",   1000, 4 / 3, 74),
    ("southwest2__3__Southwest4.jpg",                         "southwest",            1000, 4 / 3, 74),
    ("private-residence-arcadia-light__1__DSC_1817-1_2.jpg",  "arcadia-light",        1000, 4 / 3, 74),
    ("paradise-valley__1__2_Scottsdale_home_remodeling_2.jpg", "paradise-valley",     1000, 4 / 3, 74),
    ("mountain-shadows__1__carmel-homes-projects-11.png",     "mountain-shadows",     1000, 4 / 3, 74),
    ("jamie.png",                                             "jamie-vaughn",          900, 4 / 5, 78),
]


def resolve(name: str) -> pathlib.Path | None:
    exact = RAW / name
    if exact.exists():
        return exact
    # fall back to the first file with the same slug__index prefix
    prefix = "__".join(name.split("__")[:2])
    matches = sorted(RAW.glob(prefix + "__*"))
    return matches[0] if matches else None


for src_name, out_name, width, aspect, quality in JOBS:
    src = resolve(src_name)
    if src is None:
        print(f"MISSING  {src_name}")
        continue

    im = Image.open(src)
    im = ImageOps.exif_transpose(im).convert("RGB")
    height = round(width / aspect)
    im = ImageOps.fit(im, (width, height), Image.LANCZOS, centering=(0.5, 0.45))

    dest = OUT / f"{out_name}.webp"
    im.save(dest, "WEBP", quality=quality, method=6)
    print(f"{out_name:22} {im.size[0]}x{im.size[1]}  {dest.stat().st_size // 1024} KB   <- {src.name[:46]}")

total = sum(p.stat().st_size for p in OUT.glob("*.webp"))
print(f"\n{len(list(OUT.glob('*.webp')))} images, {total / 1024:.0f} KB total")
