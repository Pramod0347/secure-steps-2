import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

if (!process.env.UPSTASH_REDIS_URL || !process.env.UPSTASH_REDIS_TOKEN) {
  throw new Error("Redis credentials are not properly configured");
}

// Create a new ratelimiter that allows 10 requests per 10 seconds
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
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
