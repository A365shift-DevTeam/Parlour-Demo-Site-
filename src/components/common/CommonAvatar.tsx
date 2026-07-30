import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties } from "react";
import type { FaceShape, SkinTone } from "../../types";
import type {
  AvatarAppearance,
  AvatarHairColor,
  AvatarHairStyle,
} from "../../types/avatarAppearance";
import { cn } from "../../lib/utils";

export const avatarStyleSheets: Record<AvatarHairStyle, string> = {
  "Natural Layers": "/images/avatars/human-natural-layers.webp",
  "Soft Curls": "/images/avatars/human-soft-curls.webp",
  "Sleek Bob": "/images/avatars/human-sleek-bob.webp",
  "Bridal Bun": "/images/avatars/human-bridal-bun.webp",
  "Textured Crop": "/images/avatars/human-textured-crop.webp",
};

const hairMasks: Record<AvatarHairStyle, string> = {
  "Natural Layers": "/images/avatars/mask-natural-layers.png",
  "Soft Curls": "/images/avatars/mask-soft-curls.png",
  "Sleek Bob": "/images/avatars/mask-sleek-bob.png",
  "Bridal Bun": "/images/avatars/mask-bridal-bun.png",
  "Textured Crop": "/images/avatars/mask-textured-crop.png",
};

export const avatarSkinPositions: Record<SkinTone, string> = {
  Light: "0% 0%",
  Medium: "100% 0%",
  Tan: "0% 100%",
  Deep: "100% 100%",
};

const faceLens: Record<FaceShape, { x: number; y: number }> = {
  Oval: { x: 1, y: 1 },
  Round: { x: 1.012, y: 1.01 },
  Square: { x: 1.016, y: 0.998 },
  Heart: { x: 0.992, y: 1.004 },
  Diamond: { x: 0.986, y: 1.008 },
};

/** Full studio framing — slight zoom-out so crown and hair volume stay in frame. */
const portraitFraming: Record<AvatarHairStyle, { scale: number; y: number }> = {
  "Natural Layers": { scale: 0.94, y: 1.2 },
  "Soft Curls": { scale: 0.92, y: 2.0 },
  "Sleek Bob": { scale: 0.95, y: 0.8 },
  "Bridal Bun": { scale: 0.9, y: 3.2 },
  "Textured Crop": { scale: 0.96, y: 0.4 },
};

/** Card/list framing: same full-head priority, slightly tighter for smaller frames. */
const compactPortraitFraming: Record<AvatarHairStyle, { scale: number; y: number }> = {
  "Natural Layers": { scale: 0.94, y: 1.4 },
  "Soft Curls": { scale: 0.92, y: 2.2 },
  "Sleek Bob": { scale: 0.95, y: 1.0 },
  "Bridal Bun": { scale: 0.9, y: 3.4 },
  "Textured Crop": { scale: 0.96, y: 0.5 },
};

const hairMaterials: Record<
  AvatarHairColor,
  {
    background: string;
    mixBlendMode: CSSProperties["mixBlendMode"];
    opacity: number;
  }
> = {
  Espresso: {
    background: "transparent",
    mixBlendMode: "normal",
    opacity: 0,
  },
  Chocolate: {
    background: "#7a4939",
    mixBlendMode: "color",
    opacity: 0.34,
  },
  "Caramel Balayage": {
    background:
      "linear-gradient(104deg, rgba(61,40,34,.08) 16%, rgba(202,151,91,.75) 46%, rgba(102,64,45,.18) 73%)",
    mixBlendMode: "soft-light",
    opacity: 0.56,
  },
  Burgundy: {
    background: "#712947",
    mixBlendMode: "color",
    opacity: 0.42,
  },
};

const sheetStyle = (
  image: string,
  position: string,
  transform: string,
): CSSProperties => ({
  backgroundImage: `url("${image}")`,
  backgroundPosition: position,
  backgroundRepeat: "no-repeat",
  backgroundSize: "200% 200%",
  transform,
  transformOrigin: "50% 42%",
});

const maskStyle = (
  mask: string,
  position: string,
): Pick<
  CSSProperties,
  | "maskImage"
  | "maskPosition"
  | "maskRepeat"
  | "maskSize"
  | "WebkitMaskImage"
  | "WebkitMaskPosition"
  | "WebkitMaskRepeat"
  | "WebkitMaskSize"
> => ({
  WebkitMaskImage: `url("${mask}")`,
  WebkitMaskPosition: position,
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "200% 200%",
  maskImage: `url("${mask}")`,
  maskPosition: position,
  maskRepeat: "no-repeat",
  maskSize: "200% 200%",
});

function MakeupLayer({
  finish,
  position,
  portraitTransform,
}: {
  finish: AvatarAppearance["makeup"];
  position: string;
  portraitTransform: string;
}) {
  if (finish === "Bare") return null;

  const strength =
    finish === "Bridal" ? 0.68 : finish === "Soft Glam" ? 0.5 : 0.24;
  return (
    <motion.div
      key={finish}
      data-avatar-layer="makeup"
      initial={{ opacity: 0 }}
      animate={{ opacity: strength }}
      transition={{ duration: 0.22 }}
      className="pointer-events-none absolute inset-0"
      style={{
        ...maskStyle("/images/avatars/mask-makeup.png", position),
        transform: portraitTransform,
        transformOrigin: "50% 42%",
      }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-0 mix-blend-soft-light"
        style={{
          background: [
            "radial-gradient(ellipse 6.5% 2% at 42.2% 34.6%, rgba(84,45,56,.45), transparent 72%)",
            "radial-gradient(ellipse 6.5% 2% at 57.8% 34.6%, rgba(84,45,56,.45), transparent 72%)",
            "radial-gradient(circle 6.5% at 40.8% 43.5%, rgba(194,91,101,.32), transparent 72%)",
            "radial-gradient(circle 6.5% at 59.2% 43.5%, rgba(194,91,101,.32), transparent 72%)",
          ].join(","),
        }}
      />

    </motion.div>
  );
}

function AccessoryLayer({
  accessory,
  position,
}: {
  accessory: AvatarAppearance["accessory"];
  position: string;
}) {
  // Only soft side pins are drawn. Forehead maang tikka ("Bridal Gold") is intentionally omitted.
  if (accessory !== "Pearl Pins") return null;

  return (
    <motion.svg
      key={accessory}
      data-avatar-layer="accessory"
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.24 }}
      viewBox="0 0 100 100"
      className="pointer-events-none absolute inset-0"
      style={maskStyle("/images/avatars/mask-accessory.png", position)}
      aria-hidden="true"
    >
      <defs>
        <radialGradient id="pearl-real" cx="34%" cy="28%">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset=".45" stopColor="#f4ece4" />
          <stop offset="1" stopColor="#a68e82" />
        </radialGradient>
        <filter id="pearl-real-shadow">
          <feDropShadow dx=".15" dy=".35" stdDeviation=".28" floodOpacity=".38" />
        </filter>
      </defs>
      <g filter="url(#pearl-real-shadow)" stroke="#9d8272" strokeWidth=".16">
        <circle cx="67.6" cy="22.2" r="1.05" fill="url(#pearl-real)" />
        <circle cx="69.1" cy="24.7" r=".88" fill="url(#pearl-real)" />
        <circle cx="69.7" cy="27.1" r=".72" fill="url(#pearl-real)" />
        <circle cx="67.2" cy="28.7" r=".58" fill="url(#pearl-real)" />
      </g>
    </motion.svg>
  );
}

function FacialHairLayer({
  facialHair,
  portraitTransform,
}: {
  facialHair: AvatarAppearance["facialHair"];
  portraitTransform: string;
}) {
  if (facialHair === "None") return null;
  const sculpted = facialHair === "Sculpted Beard";
  const texture = sculpted
    ? "radial-gradient(circle,rgba(25,17,17,.78) 0 .55px,transparent .8px)"
    : "radial-gradient(circle,rgba(31,22,22,.52) 0 .4px,transparent .72px)";

  return (
    <motion.div
      key={facialHair}
      data-avatar-layer="facial-hair"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="pointer-events-none absolute inset-0"
      style={{ transform: portraitTransform, transformOrigin: "50% 42%" }}
      aria-hidden="true"
    >
      <div
        className="absolute left-[40.2%] top-[42%] h-[16.2%] w-[19.6%]"
        style={{
          backgroundImage: texture,
          backgroundSize: sculpted ? "2.1px 2.1px" : "3px 3px",
          opacity: sculpted ? 0.62 : 0.32,
          WebkitMaskImage:
            "radial-gradient(ellipse 49% 53% at 50% 19%,transparent 0 39%,#000 47% 67%,transparent 74%)",
          maskImage:
            "radial-gradient(ellipse 49% 53% at 50% 19%,transparent 0 39%,#000 47% 67%,transparent 74%)",
        }}
      />
    </motion.div>
  );
}

interface CommonAvatarProps {
  appearance: AvatarAppearance;
  className?: string;
  label?: string;
  compact?: boolean;
  style?: CSSProperties;
}

export function CommonAvatar({
  appearance,
  className,
  label = "Curated common salon avatar preview",
  compact = false,
  style,
}: CommonAvatarProps) {
  const reducedMotion = useReducedMotion();
  const position = avatarSkinPositions[appearance.skinTone];
  const portrait = avatarStyleSheets[appearance.hairStyle];
  const framing = compact
    ? compactPortraitFraming[appearance.hairStyle]
    : portraitFraming[appearance.hairStyle];
  const portraitTransform = `translateY(${framing.y}%) scale(${framing.scale})`;
  const material = hairMaterials[appearance.hairColor];
  const lens = faceLens[appearance.faceShape];

  return (
    <div
      className={cn(
        "relative isolate overflow-hidden bg-gradient-to-b from-[#eaded8] via-[#e7d8d3] to-[#cdb9b7]",
        className,
      )}
      style={{ containerType: "size", ...style } as CSSProperties}
      data-testid="common-avatar"
      role="img"
      aria-label={`${label}. ${appearance.skinTone} skin tone, ${appearance.faceShape.toLowerCase()} face, ${appearance.hairStyle.toLowerCase()}, ${appearance.hairColor.toLowerCase()} hair, ${appearance.makeup.toLowerCase()} finish, ${appearance.accessory.toLowerCase()} accessory.`}
    >
      <div
        className="absolute left-1/2 top-1/2 aspect-square -translate-x-1/2 -translate-y-1/2 overflow-hidden"
        style={{
          // Cover the frame while keeping the full photographic head in view for portrait cards.
          width: "max(100cqw, 100cqh)",
          height: "max(100cqw, 100cqh)",
        }}
        aria-hidden="true"
      >
        <motion.div
          key={`${appearance.skinTone}-${appearance.hairStyle}`}
          data-avatar-layer="photographic-portrait"
          initial={reducedMotion ? false : { opacity: 0.72 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.24, ease: "easeOut" }}
          className="absolute inset-0 will-change-[opacity]"
          style={sheetStyle(portrait, position, portraitTransform)}
        />

        {appearance.faceShape !== "Oval" && (
          <div
            data-avatar-layer="face-proportion"
            className="absolute inset-0"
            style={{
              ...sheetStyle(
                portrait,
                position,
                `translateY(${framing.y}%) scaleX(${lens.x}) scaleY(${lens.y}) scale(${framing.scale})`,
              ),
              WebkitMaskImage:
                "radial-gradient(ellipse 18% 25% at 50% 39%,#000 44%,rgba(0,0,0,.72) 64%,transparent 82%)",
              maskImage:
                "radial-gradient(ellipse 18% 25% at 50% 39%,#000 44%,rgba(0,0,0,.72) 64%,transparent 82%)",
            }}
          />
        )}

        {material.opacity > 0 && (
          <motion.div
            key={`${appearance.hairStyle}-${appearance.hairColor}`}
            data-avatar-layer="hair-colour"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: material.opacity }}
            transition={{ duration: reducedMotion ? 0 : 0.26 }}
            className="absolute inset-0 will-change-[opacity]"
            style={{
              ...maskStyle(hairMasks[appearance.hairStyle], position),
              background: material.background,
              mixBlendMode: material.mixBlendMode,
              transform: portraitTransform,
              transformOrigin: "50% 42%",
            }}
          />
        )}

        <MakeupLayer
          finish={appearance.makeup}
          position={position}
          portraitTransform={portraitTransform}
        />
        <FacialHairLayer
          facialHair={appearance.facialHair}
          portraitTransform={portraitTransform}
        />
        <AccessoryLayer accessory={appearance.accessory} position={position} />

        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_50%_35%,rgba(255,255,255,.08),transparent_72%)] mix-blend-screen" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(125deg,rgba(255,255,255,.07),transparent_28%,transparent_76%,rgba(71,36,44,.05))]" />
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-charcoal/12 to-transparent" />
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/35" />
    </div>
  );
}

export const avatarOptionSets = {
  skinTone: ["Light", "Medium", "Tan", "Deep"],
  faceShape: ["Oval", "Round", "Square", "Heart", "Diamond"],
  hairStyle: [
    "Natural Layers",
    "Soft Curls",
    "Sleek Bob",
    "Bridal Bun",
    "Textured Crop",
  ],
  hairColor: ["Espresso", "Chocolate", "Caramel Balayage", "Burgundy"],
  makeup: ["Bare", "Natural Glow", "Soft Glam", "Bridal"],
  facialHair: ["None", "Stubble", "Sculpted Beard"],
  accessory: ["None", "Pearl Pins"],
} satisfies Record<keyof AvatarAppearance, readonly string[]>;
