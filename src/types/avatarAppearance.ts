import type { FaceShape, SavedLook, SkinTone } from "./index";

export type AvatarHairStyle =
  | "Natural Layers"
  | "Soft Curls"
  | "Sleek Bob"
  | "Bridal Bun"
  | "Textured Crop";
export type AvatarHairColor = "Espresso" | "Chocolate" | "Caramel Balayage" | "Burgundy";
export type AvatarMakeup = "Bare" | "Natural Glow" | "Soft Glam" | "Bridal";
export type AvatarFacialHair = "None" | "Stubble" | "Sculpted Beard";
export type AvatarAccessory = "None" | "Pearl Pins" | "Bridal Gold";

export interface AvatarAppearance {
  skinTone: SkinTone;
  faceShape: FaceShape;
  hairStyle: AvatarHairStyle;
  hairColor: AvatarHairColor;
  makeup: AvatarMakeup;
  facialHair: AvatarFacialHair;
  accessory: AvatarAccessory;
}

export interface SavedStudioLook extends SavedLook {
  appearance: AvatarAppearance;
}
