import { prisma } from './prisma'
import type { Prisma } from '@prisma/client'

/**
 * Transaction options for production environments
 * Production databases may have slower connections, so we use longer timeouts
 */
const DEFAULT_TRANSACTION_OPTIONS = {
  maxWait: 30000, // 30 seconds - maximum time to wait for a transaction slot
  timeout: 30000, // 30 seconds - maximum time the transaction can run
}

// Extract the transaction client type from the actual extended prisma instance
// This ensures we get the correct type including any extensions
// We use a helper type to extract the transaction client from the callback overload
type ExtractTransactionClient<T> = T extends <R>(
  fn: (tx: infer TX) => Promise<R>,
  options?: any
) => Promise<R>
  ? TX
  : never

type PrismaTransactionClient = ExtractTransactionClient<typeof prisma.$transaction>

/**
 * Wrapper for Prisma transactions with extended timeout
 * Use this instead of prisma.$transaction() directly to ensure consistent timeout handling
 * 
 * @param callback - Transaction callback function
 * @param options - Optional transaction options (will merge with defaults)
 * @returns Promise with transaction result
 * 
 * @example
 * ```ts
 * const result = await withTransaction(async (tx) => {
 *   const user = await tx.user.create({ data: {...} })
 *   await tx.profile.create({ data: {...} })
 *   return user
 * })
 * ```
 */
export async function withTransaction<T>(
  callback: (tx: PrismaTransactionClient) => Promise<T>,
  options?: {
    maxWait?: number
    timeout?: number
    isolationLevel?: Prisma.TransactionIsolationLevel
  }
): Promise<T> {
  const transactionOptions = {
    ...DEFAULT_TRANSACTION_OPTIONS,
    ...options,
  }

  return prisma.$transaction(callback, transactionOptions)
}

/**
 * Batch transaction wrapper (for array of promises)
 * Use this for batch transactions that don't need a callback
 * 
 * @param promises - Array of Prisma promises to execute in transaction
 * @param options - Optional transaction options
 * @returns Promise with array of results
 * 
 * @example
 * ```ts
 * const [users, count] = await withBatchTransaction([
 *   prisma.user.findMany(),
 *   prisma.user.count()
 * ])
 * ```
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
    ...DEFAULT_TRANSACTION_OPTIONS,
    ...options,
  }

  return prisma.$transaction(promises, transactionOptions) as unknown as Promise<T>
}

