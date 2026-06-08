import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

const hasRedisCredentials = !!(process.env.UPSTASH_REDIS_URL && process.env.UPSTASH_REDIS_TOKEN);

if (!hasRedisCredentials && process.env.NEXT_PHASE !== 'phase-production-build') {
  throw new Error("Redis credentials are not properly configured");
}

// Create a new ratelimiter that allows 10 requests per 10 seconds
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL || "https://dummy.upstash.io",
  token: process.env.UPSTASH_REDIS_TOKEN || "dummy",
});

export const authLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"),
  prefix: "@upstash/ratelimit/auth",
});

export const apiLimiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 s"),
  prefix: "@upstash/ratelimit/api",
});
