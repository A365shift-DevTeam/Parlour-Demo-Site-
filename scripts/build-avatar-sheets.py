import argparse
import json
from datetime import UTC, datetime
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
CANDIDATE_DIR = ROOT / "assets" / "avatar-candidates"
SOURCE_DIR = ROOT / "assets" / "avatar-sources"
OUTPUT_DIR = ROOT / "public" / "images" / "avatars"
MODEL = "Qwen/Qwen-Image-Edit-2511"
CELL_SIZE = 627

STYLES = (
    "natural-layers",
    "soft-curls",
    "sleek-bob",
    "bridal-bun",
    "textured-crop",
)


def face_difference(master: Image.Image, candidate: Image.Image) -> float:
    box = (0.34, 0.25, 0.66, 0.61)

    def normalized_crop(image: Image.Image) -> np.ndarray:
        width, height = image.size
        crop = image.crop(
            (
                int(width * box[0]),
                int(height * box[1]),
                int(width * box[2]),
                int(height * box[3]),
            )
        )
        crop = crop.resize((96, 108), Image.Resampling.LANCZOS).convert("L")
        values = np.asarray(crop, dtype=np.float32)
        return (values - values.mean()) / max(values.std(), 1.0)

    left = normalized_crop(master)
    right = normalized_crop(candidate)
    return float(np.mean(np.abs(left - right)) / 4.0)


def skin_mask(size: tuple[int, int]) -> Image.Image:
    width, height = size
    mask = Image.new("L", size, 0)
    draw = ImageDraw.Draw(mask)

    # Face, ears and neck are constrained to the fixed studio pose.
    draw.ellipse(
        (
            width * 0.305,
            height * 0.135,
            width * 0.695,
            height * 0.655,
        ),
        fill=255,
    )
    draw.ellipse(
        (
            width * 0.275,
            height * 0.30,
            width * 0.35,
            height * 0.49,
        ),
        fill=235,
    )
    draw.ellipse(
        (
            width * 0.65,
            height * 0.30,
            width * 0.725,
            height * 0.49,
        ),
        fill=235,
    )
    draw.polygon(
        (
            (width * 0.405, height * 0.55),
            (width * 0.595, height * 0.55),
            (width * 0.635, height * 0.76),
            (width * 0.365, height * 0.76),
        ),
        fill=245,
    )
    return mask.filter(ImageFilter.GaussianBlur(width * 0.008))


def detected_skin_mask(image: Image.Image) -> np.ndarray:
    rgb = np.asarray(image.convert("RGB"), dtype=np.float32)
    red, green, blue = rgb[..., 0], rgb[..., 1], rgb[..., 2]
    likely_skin = (
        (red > 58)
        & (green > 34)
        & (blue > 24)
        & (red > green * 1.02)
        & (red > blue * 1.08)
        & ((red.max() - red.min()) >= 0)
    )
    geometric = np.asarray(skin_mask(image.size), dtype=np.float32) / 255.0
    return geometric * likely_skin.astype(np.float32)


def tone_variant(image: Image.Image, tone: str) -> Image.Image:
    if tone == "Medium":
        return image.copy()

    ycbcr = np.asarray(image.convert("YCbCr"), dtype=np.float32)
    original = ycbcr.copy()
    alpha = detected_skin_mask(image)[..., None]

    settings = {
        "Light": (1.03, 20.0, 112.0, 151.0, 0.45),
        "Tan": (0.82, 2.0, 103.0, 160.0, 0.48),
        "Deep": (0.56, 3.0, 105.0, 158.0, 0.70),
    }
    luminance_scale, luminance_offset, cb, cr, strength = settings[tone]
    target = original.copy()
    target[..., 0] = np.clip(
        original[..., 0] * luminance_scale + luminance_offset,
        18,
        238,
    )
    target[..., 1] = original[..., 1] * 0.35 + cb * 0.65
    target[..., 2] = original[..., 2] * 0.35 + cr * 0.65
    mixed = original * (1 - alpha * strength) + target * (alpha * strength)
    return Image.fromarray(np.clip(mixed, 0, 255).astype(np.uint8), "YCbCr").convert(
        "RGB"
    )


def build_sheet(style: str) -> dict[str, object]:
    candidate_matches = sorted(CANDIDATE_DIR.glob(f"qwen-{style}.*"))
    if not candidate_matches:
        return {
            "style": style,
            "status": "pending-free-credit",
            "model": MODEL,
            "reason": "No Qwen candidate is available yet.",
        }

    master = Image.open(SOURCE_DIR / "identity-master.png").convert("RGB")
    candidate = Image.open(candidate_matches[0]).convert("RGB")
    if candidate.width != candidate.height:
        raise ValueError(f"{style}: candidate must be square, got {candidate.size}")

    difference = face_difference(master, candidate)
    approved = difference <= 0.18
    if not approved:
        return {
            "style": style,
            "status": "rejected-identity-drift",
            "model": MODEL,
            "faceDifference": round(difference, 4),
        }

    cell = candidate.resize((CELL_SIZE, CELL_SIZE), Image.Resampling.LANCZOS)
    sheet = Image.new("RGB", (CELL_SIZE * 2, CELL_SIZE * 2))
    tones = ("Light", "Medium", "Tan", "Deep")
    for index, tone in enumerate(tones):
        sheet.paste(
            tone_variant(cell, tone),
            ((index % 2) * CELL_SIZE, (index // 2) * CELL_SIZE),
        )

    output = OUTPUT_DIR / f"human-{style}.webp"
    sheet.save(output, "WEBP", quality=92, method=6)
    return {
        "style": style,
        "status": "approved",
        "model": MODEL,
        "source": candidate_matches[0].name,
        "faceDifference": round(difference, 4),
        "output": output.relative_to(ROOT).as_posix(),
        "skinToneMethod": "identity-preserving deterministic YCbCr transform",
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--style", choices=STYLES)
    parser.add_argument("--all", action="store_true")
    args = parser.parse_args()
    selected = STYLES if args.all else (args.style,) if args.style else STYLES
    results = [build_sheet(style) for style in selected]

    manifest_path = CANDIDATE_DIR / "approval.json"
    existing: dict[str, object] = {}
    if manifest_path.exists():
        existing = json.loads(manifest_path.read_text(encoding="utf-8"))
    approvals = {
        item["style"]: item
        for item in existing.get("approvals", [])
        if item.get("style") not in selected
    }
    approvals.update({item["style"]: item for item in results})
    manifest = {
        "generatedAt": datetime.now(UTC).isoformat(),
        "model": MODEL,
        "approvals": [approvals[style] for style in STYLES if style in approvals],
    }
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    for result in results:
        print(f"{result['style']}: {result['status']}")


if __name__ == "__main__":
    main()
