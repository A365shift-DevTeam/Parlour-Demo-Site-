import { MoveHorizontal } from "lucide-react";
import { useState } from "react";
import type { AvatarAppearance } from "../../types/avatarAppearance";
import { CommonAvatar } from "./CommonAvatar";

export function BeforeAfterSlider({
  before,
  after,
  beforeLabel = "Original",
  afterLabel = "Curated Look",
}: {
  before: AvatarAppearance;
  after: AvatarAppearance;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [position, setPosition] = useState(50);
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-4xl bg-ivory">
      <CommonAvatar appearance={before} className="absolute inset-0 h-full" compact label={beforeLabel} />
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
        <CommonAvatar appearance={after} className="absolute inset-0 h-full w-full" compact label={afterLabel} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 z-10 w-px bg-white shadow" style={{ left: `${position}%` }}>
        <span className="absolute left-1/2 top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-rose-700 shadow-soft">
          <MoveHorizontal size={19} />
        </span>
      </div>
      <div className="pointer-events-none absolute inset-x-4 top-4 z-20 flex justify-between">
        <span className="rounded-full bg-charcoal/75 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          {beforeLabel}
        </span>
        <span className="rounded-full bg-rose-600/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
          {afterLabel}
        </span>
      </div>
      <input
        type="range"
        min="8"
        max="92"
        value={position}
        onChange={(event) => setPosition(Number(event.target.value))}
        className="absolute inset-0 z-30 h-full w-full cursor-ew-resize opacity-0"
        aria-label="Compare original avatar and curated service look"
      />
    </div>
  );
}
