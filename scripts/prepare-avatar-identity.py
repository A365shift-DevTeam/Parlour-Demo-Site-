from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "avatar-sources" / "human-natural-layers.png"
OUTPUT = ROOT / "assets" / "avatar-sources" / "identity-master.png"


def main() -> None:
    sheet = Image.open(SOURCE).convert("RGB")
    width, height = sheet.size
    # The approved medium-tone portrait is the top-right cell.
    identity = sheet.crop((width // 2, 0, width, height // 2))
    identity = identity.resize((1024, 1024), Image.Resampling.LANCZOS)
    identity.save(OUTPUT, optimize=True)
    print(f"Prepared {OUTPUT} at {identity.size[0]}x{identity.size[1]}")


if __name__ == "__main__":
    main()
