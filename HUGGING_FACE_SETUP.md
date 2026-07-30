# Hugging Face AI stylist setup

The Virtual Studio uses Hugging Face only for text-based look recommendations.
The base avatar is never uploaded or regenerated. The model may return only
validated service IDs and the existing hair, colour, makeup, facial-hair, and
accessory layer values.

## Free-tier model

Default model:

```text
google/gemma-3-4b-it:fastest
```

This is an open instruction model routed through Hugging Face Inference
Providers. Hugging Face currently provides a small monthly free credit for free
accounts; it is not an unlimited free service.

## Image model for creating new curated avatar assets

Gemma is intentionally not used to render the avatar: it is a text model.
For a future asset-production pass, use:

```text
Qwen/Qwen-Image-Edit-2511
```

Qwen Image Edit is Apache-2.0 licensed and is designed for image-to-image edits
with improved character consistency. Use it outside the customer click path to
create and manually approve a small matrix of common-avatar hairstyle variants.
The website should continue serving those approved portraits instantly, then
apply the deterministic colour, makeup, facial-hair, and accessory layers.

Do not regenerate the whole person after every option click. That would change
the face between selections, add several seconds of latency, and consume the
very small free inference credit quickly. If local hardware with roughly 13 GB
of VRAM is available later, `black-forest-labs/FLUX.2-klein-4B` is the smaller
Apache-2.0 alternative for a self-hosted interactive editing pipeline.

## Local setup

1. Create a Hugging Face access token that can call Inference Providers.
2. Copy `.env.example` to `.env`.
3. Replace `hf_replace_with_your_token` with the real token.
4. Run `npm run dev`.
5. Open Virtual Studio, then choose **Beauty Assistant**.

The token stays on the server. It is never included in the browser bundle.

## Runtime behavior

- `/api/beauty-assistant` calls the Hugging Face router.
- The response is schema-validated and checked against the local service
  catalog, budget, and available time.
- AI cannot book automatically; the user must choose **Apply Services & Avatar
  Layers**.
- If the token, free credits, provider, or model is unavailable, the modal uses
  the built-in zero-cost curated fallback.
- `api/beauty-assistant.ts` provides a serverless adapter for Vercel-style
  deployments. Other static hosts need an equivalent server-side route.

Official references:

- https://huggingface.co/docs/inference-providers/tasks/chat-completion
- https://huggingface.co/docs/inference-providers/pricing
