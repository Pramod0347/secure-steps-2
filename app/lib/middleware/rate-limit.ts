import { NextRequest } from 'next/server'
import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
})

const limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  prefix: "app:ratelimit"
})

export async function checkRateLimit(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
    const { success } = await limiter.limit(ip)
    return success
  } catch (error) {
    console.error('Rate limit error:', error)
    return true // Allow on error
  }
} 