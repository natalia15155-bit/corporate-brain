interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitOptions {
  limit: number;
  windowMs: number;
  now?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

const maximumTrackedClients = 10_000;
const entries = new Map<string, RateLimitEntry>();

function pruneExpiredEntries(now: number) {
  for (const [key, entry] of entries) {
    if (entry.resetAt <= now) entries.delete(key);
    if (entries.size <= maximumTrackedClients) break;
  }
}

export function consumeRateLimit(
  key: string,
  options: RateLimitOptions,
): RateLimitResult {
  const now = options.now ?? Date.now();
  if (entries.size >= maximumTrackedClients) pruneExpiredEntries(now);

  const current = entries.get(key);
  const entry =
    !current || current.resetAt <= now
      ? { count: 0, resetAt: now + options.windowMs }
      : current;

  entry.count += 1;
  entries.set(key, entry);

  return {
    allowed: entry.count <= options.limit,
    remaining: Math.max(0, options.limit - entry.count),
    retryAfterSeconds: Math.max(
      1,
      Math.ceil((entry.resetAt - now) / 1_000),
    ),
  };
}

export function resetRateLimitsForTests() {
  entries.clear();
}

export function getRequestClientKey(request: Request): string {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "local";

  return forwarded.split(",")[0]?.trim().slice(0, 128) || "local";
}
