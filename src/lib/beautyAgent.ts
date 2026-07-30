import { z } from "zod";

const hairStyleSchema = z.enum([
  "Natural Layers",
  "Soft Curls",
  "Sleek Bob",
  "Bridal Bun",
  "Textured Crop",
]);
const hairColorSchema = z.enum([
  "Espresso",
  "Chocolate",
  "Caramel Balayage",
  "Burgundy",
]);
const makeupSchema = z.enum(["Bare", "Natural Glow", "Soft Glam", "Bridal"]);
const facialHairSchema = z.enum(["None", "Stubble", "Sculpted Beard"]);
const accessorySchema = z.enum(["None", "Pearl Pins", "Bridal Gold"]);

export const beautyAgentAppearanceSchema = z
  .object({
    hairStyle: hairStyleSchema.optional(),
    hairColor: hairColorSchema.optional(),
    makeup: makeupSchema.optional(),
    facialHair: facialHairSchema.optional(),
    accessory: accessorySchema.optional(),
  })
  .strict();

export const beautyAgentRequestSchema = z
  .object({
    prompt: z.string().trim().min(3).max(500),
    occasion: z.enum(["Professional", "Party", "Bridal", "Everyday Beauty"]),
    style: z.enum(["Polished", "Natural", "Statement"]),
    budget: z.number().int().min(1500).max(30000),
    availableMinutes: z.number().int().min(30).max(480),
    maintenance: z.enum(["Low", "Moderate", "Premium"]),
    currentAppearance: z.object({
      skinTone: z.enum(["Light", "Medium", "Tan", "Deep"]),
      faceShape: z.enum(["Oval", "Round", "Square", "Heart", "Diamond"]),
      hairStyle: hairStyleSchema,
      hairColor: hairColorSchema,
      makeup: makeupSchema,
      facialHair: facialHairSchema,
      accessory: accessorySchema,
    }),
  })
  .strict();

export const beautyAgentCoreResultSchema = z
  .object({
    summary: z.string().trim().min(1).max(280),
    reasons: z.array(z.string().trim().min(1).max(180)).min(1).max(3),
    serviceIds: z.array(z.string().trim()).min(1).max(3),
    appearance: beautyAgentAppearanceSchema,
    estimatedPrice: z.number().nonnegative(),
    estimatedDuration: z.number().nonnegative(),
  })
  .strict();

export const beautyAgentResultSchema = beautyAgentCoreResultSchema.extend({
  source: z.enum(["hugging-face", "curated-fallback"]),
  model: z.string().trim().optional(),
});

export type BeautyAgentRequest = z.infer<typeof beautyAgentRequestSchema>;
export type BeautyAgentAppearance = z.infer<typeof beautyAgentAppearanceSchema>;
export type BeautyAgentResult = z.infer<typeof beautyAgentResultSchema>;

export async function askBeautyAgent(input: BeautyAgentRequest): Promise<BeautyAgentResult> {
  const request = beautyAgentRequestSchema.parse(input);
  const controller = new AbortController();
  const timeout = globalThis.setTimeout(() => controller.abort(), 25_000);

  try {
    const response = await fetch("/api/beauty-assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
      signal: controller.signal,
    });
    const payload = (await response.json().catch(() => null)) as unknown;

    if (!response.ok) {
      const message =
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
          ? payload.message
          : "The AI stylist is temporarily unavailable.";
      throw new Error(message);
    }

    return beautyAgentResultSchema.parse(payload);
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new Error("The AI stylist took too long to respond.");
    }
    throw error;
  } finally {
    globalThis.clearTimeout(timeout);
  }
}
