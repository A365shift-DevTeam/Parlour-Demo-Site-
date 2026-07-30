import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { InferenceClient } from "@huggingface/inference";

const projectRoot = resolve(import.meta.dirname, "..");
const envPath = resolve(projectRoot, ".env");
const sourcePath = resolve(
  projectRoot,
  "assets/avatar-sources/identity-master.png",
);
const outputDirectory = resolve(projectRoot, "assets/avatar-candidates");
const defaultModel = "Qwen/Qwen-Image-Edit-2511";

const styles = {
  "natural-layers": {
    label: "Natural Layers",
    instruction:
      "refined shoulder-length natural layers with soft face-framing pieces and realistic individual strands",
  },
  "soft-curls": {
    label: "Soft Curls",
    instruction:
      "polished shoulder-length soft curls with natural volume, realistic curl variation and controlled salon definition",
  },
  "sleek-bob": {
    label: "Sleek Bob",
    instruction:
      "a precise chin-length sleek bob with a clean salon finish, subtle natural flyaways and realistic strand texture",
  },
  "bridal-bun": {
    label: "Bridal Bun",
    instruction:
      "an elegant low bridal bun with a clean center part, softly controlled hairline and no jewellery or accessories",
  },
  "textured-crop": {
    label: "Textured Crop",
    instruction:
      "a short textured crop with refined salon separation, natural hairline and realistic fine strands",
  },
};

function readEnv(contents) {
  return Object.fromEntries(
    contents
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#") && line.includes("="))
      .map((line) => {
        const separator = line.indexOf("=");
        const key = line.slice(0, separator).trim();
        const value = line
          .slice(separator + 1)
          .trim()
          .replace(/^['"]|['"]$/g, "");
        return [key, value];
      }),
  );
}

function selectedStyles() {
  const styleFlag = process.argv.indexOf("--style");
  if (styleFlag >= 0) {
    const slug = process.argv[styleFlag + 1];
    if (!styles[slug]) {
      throw new Error(
        `Unknown style "${slug}". Choose: ${Object.keys(styles).join(", ")}`,
      );
    }
    return [slug];
  }

  if (process.argv.includes("--all")) return Object.keys(styles);
  throw new Error("Pass --style <name> for one candidate or --all for every style.");
}

function promptFor(style) {
  return [
    "Edit this exact front-facing salon portrait.",
    `Change only the hair to ${style.instruction}.`,
    "Preserve the adult woman's identity exactly: facial geometry, skin tone, pores, expression, eyes, eyebrows, nose, lips, ears and head angle must not change.",
    "Preserve the exact straight-on pose, crop, camera distance, warm salon background, soft studio lighting and plain white salon cape.",
    "Keep the face centered at the same pixel position.",
    "Do not add makeup, jewellery, hair accessories, text, borders, hands or new objects.",
    "Photorealistic premium salon editorial photography with natural pores and individual hair strands.",
  ].join(" ");
}

if (!existsSync(envPath)) {
  throw new Error("Missing .env. Add HF_TOKEN before generating candidates.");
}

const env = readEnv(await readFile(envPath, "utf8"));
const token = env.HF_TOKEN;
const model = env.HF_IMAGE_MODEL || defaultModel;

if (!token || !token.startsWith("hf_")) {
  throw new Error("HF_TOKEN is missing or invalid.");
}

const source = await readFile(sourcePath);
const client = new InferenceClient(token);
await mkdir(outputDirectory, { recursive: true });

const keepAlive = setInterval(() => {}, 1_000);

try {
for (const slug of selectedStyles()) {
  const style = styles[slug];
  process.stdout.write(`Generating ${style.label} with ${model}... `);
  const image = await client.imageToImage({
    provider: "fal-ai",
    model,
    inputs: new Blob([source], { type: "image/png" }),
    parameters: {
      prompt: promptFor(style),
      negative_prompt:
        "different person, changed face, changed expression, asymmetric eyes, plastic skin, illustration, painting, 3d render, extra accessories, text, watermark, changed clothing, changed background, different crop, tilted pose",
      guidance_scale: 4,
      num_inference_steps: 40,
      target_size: { width: 1024, height: 1024 },
    },
  });

  const extension = image.type.includes("webp")
    ? "webp"
    : image.type.includes("jpeg")
      ? "jpg"
      : "png";
  const outputPath = resolve(
    outputDirectory,
    `qwen-${slug}.${extension}`,
  );
  await writeFile(outputPath, Buffer.from(await image.arrayBuffer()));
  process.stdout.write(`${outputPath}\n`);
}

} finally {
  clearInterval(keepAlive);
}
