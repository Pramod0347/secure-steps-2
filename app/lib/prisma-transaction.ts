import { prisma } from './prisma'
import type { Prisma } from '@prisma/client'

/**
 * Transaction timeout configuration
 * Vercel/production databases may have slower connections
 */
const isVercel = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production'
const TRANSACTION_TIMEOUT = isVercel ? 60000 : 30000 // 60s for Vercel/production, 30s for local

/**
 * Common transaction wrapper that ensures extended timeouts are always applied
 * Use this instead of prisma.$transaction() directly
 * 
 * @param callback - Transaction callback function
 * @param options - Optional transaction options (will merge with defaults)
 * @returns Promise with transaction result
 */
export async function withTransaction<T>(
  callback: (tx: any) => Promise<T>,
  options?: {
    maxWait?: number
    timeout?: number
    isolationLevel?: Prisma.TransactionIsolationLevel
  }
): Promise<T> {
  const transactionOptions = {
    maxWait: options?.maxWait ?? TRANSACTION_TIMEOUT,
    timeout: options?.timeout ?? TRANSACTION_TIMEOUT,
    ...(options?.isolationLevel && { isolationLevel: options.isolationLevel }),
  }

  // Explicitly pass timeout options - critical for Vercel where extended clients might not forward options
  return (prisma.$transaction as any)(callback, transactionOptions) as Promise<T>
}

/**
 * Batch transaction wrapper for array of promises
 */
export async function withBatchTransaction<T extends readonly unknown[]>(
  promises: [...Prisma.PrismaPromise<T[number]>[]],
  options?: {
    maxWait?: number
    timeout?: number
    isolationLevel?: Prisma.TransactionIsolationLevel
  }
): Promise<T> {
  const transactionOptions = {
    maxWait: options?.maxWait ?? TRANSACTION_TIMEOUT,
    timeout: options?.timeout ?? TRANSACTION_TIMEOUT,
    ...(options?.isolationLevel && { isolationLevel: options.isolationLevel }),
  }

  return (prisma.$transaction as any)(promises, transactionOptions) as Promise<T>
}

