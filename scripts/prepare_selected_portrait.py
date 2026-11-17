"""Prepare the selected portfolio portrait (Option 1) as square web assets.

Source: the retouched Option 1 export in the user's Desktop folder. Nothing is
generated or altered - this only crops the existing pixels and resizes them.

The crop starts 15% down the tall source (measured from the subject mask: the
head begins at 17.6% and is horizontally centred there), so the face sits
comfortably in the upper-middle of a circular frame.
"""
from pathlib import Path
from PIL import Image

SOURCE = Path(r"C:\Users\Farhana Yesmin\Desktop\for_portfolio\edited\portrait_option_1.png")
OUT_DIR = Path(__file__).resolve().parents[1] / "assets" / "images"
SIZE = 720
TOP_RATIO = 0.15


def main() -> None:
    image = Image.open(SOURCE).convert("RGB")
    w, h = image.size
    top = round(h * TOP_RATIO)
    square = image.crop((0, top, w, top + w)).resize((SIZE, SIZE), Image.Resampling.LANCZOS)

    square.save(OUT_DIR / "portrait-web.png", format="PNG", optimize=True, compress_level=9)
    square.save(OUT_DIR / "portrait-web.webp", format="WEBP", quality=90, method=6)

    print(f"Cropped {w}x{h} -> top {top}px -> {SIZE}x{SIZE}")
    for name in ("portrait-web.png", "portrait-web.webp"):
        p = OUT_DIR / name
        print(f"Saved {p.name} ({p.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
