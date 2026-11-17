"""Deterministic portrait retouching for the portfolio hero image.

Nothing here generates or changes facial features. Every operation is a
standard local image filter applied to the original pixels:
  - light denoise
  - gentle local contrast (CLAHE on luminance only)
  - subtle bilateral skin smoothing (edge-preserving, so eyes/lips stay sharp)
  - mild clarity via unsharp mask
  - mild tonal/temperature refinement
The alpha matte produced by rembg is reused unchanged.
"""

from pathlib import Path
import cv2
import numpy as np
from PIL import Image, ImageFilter
from rembg import new_session, remove

ROOT = Path(__file__).resolve().parents[1]
SOURCE = Path(r"C:\Users\Farhana Yesmin\Pictures\photo.jpeg")
RAW_CUTOUT = ROOT / "assets" / "images" / "_nobg_raw.png"
OUTPUT = ROOT / "assets" / "images" / "portrait.png"
WEB_OUTPUT = ROOT / "assets" / "images" / "portrait-web.png"

# Master export (2x the source) and a lighter derivative for the website.
EXPORT_SIZE = 1180
WEB_SIZE = 720


def ensure_cutout() -> None:
    """Create the transparent matte once, then reuse the cached result."""
    if RAW_CUTOUT.exists():
        return
    session = new_session("u2net")
    result = remove(Image.open(SOURCE).convert("RGBA"), session=session,
                    alpha_matting=False)
    result.save(RAW_CUTOUT)


def main() -> None:
    ensure_cutout()
    src_bgr = cv2.imread(str(SOURCE), cv2.IMREAD_COLOR)
    raw = Image.open(RAW_CUTOUT).convert("RGBA")
    alpha = np.array(raw.getchannel("A"))

    # --- 1. Clean the matte: keep the largest component, fill pinholes, feather 0.4px ---
    binary = (alpha > 128).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(binary, 8)
    if count > 1:
        largest = 1 + np.argmax(stats[1:, cv2.CC_STAT_AREA])
        alpha = np.where(labels == largest, alpha, 0).astype(np.uint8)
    closed = cv2.morphologyEx((alpha > 128).astype(np.uint8), cv2.MORPH_CLOSE,
                              np.ones((3, 3), np.uint8))
    alpha = np.where(closed > 0, alpha, 0).astype(np.uint8)
    alpha_img = Image.fromarray(alpha).filter(ImageFilter.GaussianBlur(0.4))
    alpha = np.array(alpha_img)

    # --- 2. Light denoise (very low strength: no waxing, no detail loss) ---
    clean = cv2.fastNlMeansDenoisingColored(src_bgr, None, 3, 3, 7, 21)

    # --- 3. Edge-preserving skin smoothing at low opacity ---
    smooth = cv2.bilateralFilter(clean, d=7, sigmaColor=24, sigmaSpace=24)
    clean = cv2.addWeighted(clean, 0.76, smooth, 0.24, 0)

    # --- 4. Gentle local contrast on luminance only (protects skin hue) ---
    lab = cv2.cvtColor(clean, cv2.COLOR_BGR2LAB)
    l, a, b = cv2.split(lab)
    clahe = cv2.createCLAHE(clipLimit=1.2, tileGridSize=(8, 8))
    l = clahe.apply(l)
    clean = cv2.cvtColor(cv2.merge((l, a, b)), cv2.COLOR_LAB2BGR)

    # --- 5. Mild exposure/contrast lift and a touch of warmth ---
    clean = clean.astype(np.float32) / 255.0
    clean = np.clip((clean - 0.5) * 1.03 + 0.5 + 0.005, 0, 1)
    clean[:, :, 2] = np.clip(clean[:, :, 2] * 1.006, 0, 1)  # red channel (BGR)
    clean = (clean * 255).astype(np.uint8)

    # --- 6. Subtle clarity ---
    blurred = cv2.GaussianBlur(clean, (0, 0), 1.1)
    clean = cv2.addWeighted(clean, 1.12, blurred, -0.12, 0)

    # --- 7. Composite with the untouched matte, upscale with Lanczos ---
    rgba = cv2.cvtColor(clean, cv2.COLOR_BGR2RGBA)
    rgba[:, :, 3] = alpha
    high_res = cv2.resize(rgba, (EXPORT_SIZE, EXPORT_SIZE), interpolation=cv2.INTER_LANCZOS4)

    out = Image.fromarray(high_res, "RGBA")
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    out.save(OUTPUT, format="PNG", optimize=True, compress_level=9)

    web = out.resize((WEB_SIZE, WEB_SIZE), Image.Resampling.LANCZOS)
    web.save(WEB_OUTPUT, format="PNG", optimize=True, compress_level=9)

    print(f"Saved {OUTPUT} ({out.width}x{out.height}, {OUTPUT.stat().st_size / 1024:.0f} KB)")
    print(f"Saved {WEB_OUTPUT} ({web.width}x{web.height}, {WEB_OUTPUT.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
