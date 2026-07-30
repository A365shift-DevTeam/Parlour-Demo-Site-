interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  retryAfterSeconds: number;
}

export class MemoryRateLimiter {
  private readonly requests = new Map<string, number[]>();

  constructor(private readonly options: RateLimitOptions) {}

  check(key: string, now = Date.now()): RateLimitResult {
    const windowStart = now - this.options.windowMs;
    const recent = (this.requests.get(key) ?? []).filter(
      (timestamp) => timestamp > windowStart,
    );
    const allowed = recent.length < this.options.limit;

    if (allowed) recent.push(now);
    if (recent.length) this.requests.set(key, recent);
    else this.requests.delete(key);

    const oldest = recent[0] ?? now;
    return {
      allowed,
      limit: this.options.limit,
      remaining: Math.max(this.options.limit - recent.length, 0),
      retryAfterSeconds: allowed
        ? 0
        : Math.max(
            1,
            Math.ceil((oldest + this.options.windowMs - now) / 1_000),
          ),
    };
  }

  clear(): void {
    this.requests.clear();
  }
}

export const beautyAgentRateLimiter = new MemoryRateLimiter({
  limit: 5,
  windowMs: 60 * 60 * 1_000,
});

export function resolveClientKey(
  headers: Record<string, string | string[] | undefined>,
  remoteAddress?: string,
): string {
  const forwarded = headers["x-forwarded-for"];
  const candidate = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return candidate?.split(",")[0]?.trim() || remoteAddress || "unknown-client";
}
