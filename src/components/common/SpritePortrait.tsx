import { cn } from "../../lib/utils";

interface SpritePortraitProps {
  index: number;
  alt: string;
  className?: string;
}

export function SpritePortrait({ index, alt, className }: SpritePortraitProps) {
  const column = index % 4;
  const row = Math.floor((index % 12) / 4);
  return (
    <div
      role="img"
      aria-label={alt}
      className={cn("bg-cover bg-no-repeat", className)}
      style={{
        backgroundImage: "url('/images/specialist-team.png')",
        backgroundSize: "400% 300%",
        backgroundPosition: `${column * (100 / 3)}% ${row * 50}%`,
      }}
    />
  );
}
