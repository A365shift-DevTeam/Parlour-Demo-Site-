import type { SkinTone } from "../types";
import type { AvatarAppearance } from "../types/avatarAppearance";

const tones: SkinTone[] = ["Light", "Medium", "Tan", "Deep"];

export const previewAppearance = (
  previewIndex: number,
  skinTone: SkinTone = tones[previewIndex % tones.length],
): AvatarAppearance => {
  const appearances: AvatarAppearance[] = [
    {
      skinTone,
      faceShape: "Oval",
      hairStyle: "Natural Layers",
      hairColor: "Espresso",
      makeup: "Bare",
      facialHair: "None",
      accessory: "None",
    },
    {
      skinTone,
      faceShape: "Heart",
      hairStyle: "Soft Curls",
      hairColor: "Chocolate",
      makeup: "Natural Glow",
      facialHair: "None",
      accessory: "None",
    },
    {
      skinTone,
      faceShape: "Diamond",
      hairStyle: "Sleek Bob",
      hairColor: "Espresso",
      makeup: "Natural Glow",
      facialHair: "None",
      accessory: "None",
    },
    {
      skinTone,
      faceShape: "Oval",
      hairStyle: "Natural Layers",
      hairColor: "Caramel Balayage",
      makeup: "Natural Glow",
      facialHair: "None",
      accessory: "None",
    },
    {
      skinTone,
      faceShape: "Heart",
      hairStyle: "Bridal Bun",
      hairColor: "Espresso",
      makeup: "Bridal",
      facialHair: "None",
      accessory: "None",
    },
    {
      skinTone,
      faceShape: "Round",
      hairStyle: "Natural Layers",
      hairColor: "Chocolate",
      makeup: "Natural Glow",
      facialHair: "None",
      accessory: "None",
    },
    {
      skinTone,
      faceShape: "Oval",
      hairStyle: "Soft Curls",
      hairColor: "Burgundy",
      makeup: "Soft Glam",
      facialHair: "None",
      accessory: "Pearl Pins",
    },
    {
      skinTone,
      faceShape: "Square",
      hairStyle: "Textured Crop",
      hairColor: "Espresso",
      makeup: "Bare",
      facialHair: "Sculpted Beard",
      accessory: "None",
    },
  ];
  return appearances[Math.abs(previewIndex) % appearances.length];
};
