from pathlib import Path

from PIL import Image, ImageChops, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
AVATAR_DIR = ROOT / "public" / "images" / "avatars"
SOURCE_DIR = AVATAR_DIR

SOURCES = {
    "natural-layers": "human-natural-layers.webp",
    "soft-curls": "human-soft-curls.webp",
    "sleek-bob": "human-sleek-bob.webp",
    "bridal-bun": "human-bridal-bun.webp",
    "textured-crop": "human-textured-crop.webp",
}


def remove_skin_and_clothing(
    draw: ImageDraw.ImageDraw,
    ox: int,
    oy: int,
    cell_width: int,
    cell_height: int,
) -> None:
    cx = ox + cell_width / 2

    # Protect the complete face, ears, jaw and neck. The previous mask removed
    # only a narrow central ellipse, which allowed colour to leak over cheeks,
    # neck shadows and the salon cape.
    draw.ellipse(
        (
            cx - cell_width * 0.235,
            oy + cell_height * 0.165,
            cx + cell_width * 0.235,
            oy + cell_height * 0.69,
        ),
        fill=0,
    )
    draw.polygon(
        (
            (cx - cell_width * 0.13, oy + cell_height * 0.53),
            (cx + cell_width * 0.13, oy + cell_height * 0.53),
            (cx + cell_width * 0.215, oy + cell_height * 0.86),
            (cx - cell_width * 0.215, oy + cell_height * 0.86),
        ),
        fill=0,
    )
    draw.rectangle(
        (
            cx - cell_width * 0.27,
            oy + cell_height * 0.72,
            cx + cell_width * 0.27,
            oy + cell_height,
        ),
        fill=0,
    )


def region_mask(style: str, cell_width: int, cell_height: int) -> Image.Image:
    atlas = Image.new("L", (cell_width * 2, cell_height * 2), 0)
    draw = ImageDraw.Draw(atlas)

    for row in range(2):
        for col in range(2):
            ox, oy = col * cell_width, row * cell_height
            cx = ox + cell_width / 2

            if style in {"natural-layers", "soft-curls"}:
                draw.ellipse(
                    (
                        cx - cell_width * 0.36,
                        oy + cell_height * 0.005,
                        cx + cell_width * 0.36,
                        oy + cell_height * 0.61,
                    ),
                    fill=255,
                )
                draw.rounded_rectangle(
                    (
                        ox + cell_width * 0.035,
                        oy + cell_height * 0.11,
                        ox + cell_width * 0.39,
                        oy + cell_height * 0.95,
                    ),
                    radius=int(cell_width * 0.11),
                    fill=255,
                )
                draw.rounded_rectangle(
                    (
                        ox + cell_width * 0.61,
                        oy + cell_height * 0.11,
                        ox + cell_width * 0.965,
                        oy + cell_height * 0.95,
                    ),
                    radius=int(cell_width * 0.11),
                    fill=255,
                )
            elif style == "sleek-bob":
                draw.ellipse(
                    (
                        cx - cell_width * 0.35,
                        oy + cell_height * 0.005,
                        cx + cell_width * 0.35,
                        oy + cell_height * 0.68,
                    ),
                    fill=255,
                )
                draw.rounded_rectangle(
                    (
                        ox + cell_width * 0.105,
                        oy + cell_height * 0.1,
                        ox + cell_width * 0.895,
                        oy + cell_height * 0.73,
                    ),
                    radius=int(cell_width * 0.15),
                    fill=255,
                )
            elif style == "bridal-bun":
                draw.ellipse(
                    (
                        cx - cell_width * 0.35,
                        oy + cell_height * 0.002,
                        cx + cell_width * 0.35,
                        oy + cell_height * 0.57,
                    ),
                    fill=255,
                )
                draw.ellipse(
                    (
                        ox + cell_width * 0.07,
                        oy + cell_height * 0.16,
                        ox + cell_width * 0.43,
                        oy + cell_height * 0.6,
                    ),
                    fill=255,
                )
                draw.ellipse(
                    (
                        ox + cell_width * 0.57,
                        oy + cell_height * 0.16,
                        ox + cell_width * 0.93,
                        oy + cell_height * 0.6,
                    ),
                    fill=255,
                )
            else:
                draw.ellipse(
                    (
                        cx - cell_width * 0.35,
                        oy + cell_height * 0.002,
                        cx + cell_width * 0.35,
                        oy + cell_height * 0.5,
                    ),
                    fill=255,
                )

            remove_skin_and_clothing(draw, ox, oy, cell_width, cell_height)

    return atlas


def build_mask(style: str, source_name: str) -> None:
    image = Image.open(SOURCE_DIR / source_name).convert("RGB")
    width, height = image.size
    cell_width, cell_height = width // 2, height // 2
    pixels = image.load()
    alpha = Image.new("L", image.size, 0)
    alpha_pixels = alpha.load()

    for y in range(height):
        for x in range(width):
            red, green, blue = pixels[x, y]
            luminance = 0.2126 * red + 0.7152 * green + 0.0722 * blue
            chroma = max(red, green, blue) - min(red, green, blue)
            warm_background = red - green > 58 and red - blue > 42
            likely_hair = (
                luminance < 124
                and green < 116
                and blue < 116
                and not warm_background
            ) or (luminance < 84 and chroma < 64)
            if likely_hair:
                alpha_pixels[x, y] = 255

    allowed = region_mask(style, cell_width, cell_height)
    alpha = ImageChops.multiply(alpha, allowed)
    alpha = alpha.filter(ImageFilter.MaxFilter(7))
    alpha = ImageChops.multiply(alpha, allowed)
    alpha = alpha.filter(ImageFilter.GaussianBlur(1.35))

    output = Image.new("RGBA", image.size, (255, 255, 255, 0))
    output.putalpha(alpha)
    output_path = AVATAR_DIR / f"mask-{style}.png"
    output.save(output_path, optimize=True)

    coverage = sum(alpha.get_flattened_data()) / (255 * width * height)
    print(f"{output_path.name}: {coverage:.1%} coverage")


def save_alpha_mask(name: str, alpha: Image.Image) -> None:
    output = Image.new("RGBA", alpha.size, (255, 255, 255, 0))
    output.putalpha(alpha)
    output.save(AVATAR_DIR / name, optimize=True)


def build_makeup_mask() -> None:
    sample = Image.open(SOURCE_DIR / SOURCES["natural-layers"])
    width, height = sample.size
    cell_width, cell_height = width // 2, height // 2
    alpha = Image.new("L", sample.size, 0)
    draw = ImageDraw.Draw(alpha)

    for row in range(2):
        for col in range(2):
            ox, oy = col * cell_width, row * cell_height
            cx = ox + cell_width / 2
            draw.ellipse(
                (
                    cx - cell_width * 0.205,
                    oy + cell_height * 0.145,
                    cx + cell_width * 0.205,
                    oy + cell_height * 0.665,
                ),
                fill=255,
            )
            # Protect the eye whites and keep eye makeup opt-in through its
            # own tightly positioned gradients.
            draw.ellipse(
                (
                    cx - cell_width * 0.142,
                    oy + cell_height * 0.315,
                    cx - cell_width * 0.025,
                    oy + cell_height * 0.382,
                ),
                fill=90,
            )
            draw.ellipse(
                (
                    cx + cell_width * 0.025,
                    oy + cell_height * 0.315,
                    cx + cell_width * 0.142,
                    oy + cell_height * 0.382,
                ),
                fill=90,
            )

    save_alpha_mask("mask-makeup.png", alpha.filter(ImageFilter.GaussianBlur(2.2)))


def build_accessory_mask() -> None:
    sample = Image.open(SOURCE_DIR / SOURCES["natural-layers"])
    width, height = sample.size
    cell_width, cell_height = width // 2, height // 2
    alpha = Image.new("L", sample.size, 0)
    draw = ImageDraw.Draw(alpha)

    for row in range(2):
        for col in range(2):
            ox, oy = col * cell_width, row * cell_height
            cx = ox + cell_width / 2
            # Center forehead jewellery plus the right-side pin placement.
            draw.rounded_rectangle(
                (
                    cx - cell_width * 0.075,
                    oy + cell_height * 0.025,
                    cx + cell_width * 0.075,
                    oy + cell_height * 0.37,
                ),
                radius=int(cell_width * 0.06),
                fill=255,
            )
            draw.rounded_rectangle(
                (
                    ox + cell_width * 0.61,
                    oy + cell_height * 0.13,
                    ox + cell_width * 0.755,
                    oy + cell_height * 0.36,
                ),
                radius=int(cell_width * 0.06),
                fill=255,
            )

    save_alpha_mask("mask-accessory.png", alpha.filter(ImageFilter.GaussianBlur(1.3)))


if __name__ == "__main__":
    for asset_style, asset_name in SOURCES.items():
        build_mask(asset_style, asset_name)
    build_makeup_mask()
    build_accessory_mask()
