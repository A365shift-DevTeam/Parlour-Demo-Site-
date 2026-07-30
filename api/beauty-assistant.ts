import { BeautyAgentError, runBeautyAgent } from "../server/beautyAgent";
import { beautyAgentRateLimiter, resolveClientKey } from "../server/rateLimit";

interface ApiRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
}

interface ApiResponse {
  status: (statusCode: number) => ApiResponse;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}

export default async function handler(request: ApiRequest, response: ApiResponse) {
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "POST") {
    response.status(405).json({ message: "Method not allowed." });
    return;
  }

  const rateLimit = beautyAgentRateLimiter.check(
    resolveClientKey(request.headers ?? {}, request.socket?.remoteAddress),
  );
  response.setHeader("X-RateLimit-Limit", String(rateLimit.limit));
  response.setHeader("X-RateLimit-Remaining", String(rateLimit.remaining));
  if (!rateLimit.allowed) {
    response.setHeader("Retry-After", String(rateLimit.retryAfterSeconds));
    response.status(429).json({
      message: "The AI stylist limit has been reached. Use the curated fallback or try again later.",
      code: "RATE_LIMITED",
    });
    return;
  }

  try {
    const result = await runBeautyAgent(request.body, {
      token: process.env.HF_TOKEN,
      model: process.env.HF_MODEL,
    });
    response.status(200).json(result);
  } catch (error) {
    const knownError =
      error instanceof BeautyAgentError
        ? error
        : new BeautyAgentError("The AI stylist request failed.", 500, "INTERNAL_ERROR");
    response.status(knownError.status).json({
      message: knownError.message,
      code: knownError.code,
    });
  }
}
