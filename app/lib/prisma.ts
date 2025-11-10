import { PrismaClient, Prisma } from '@prisma/client'
import slugify from 'slugify'

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  // Production environments may have slower database connections
  // Use longer timeouts for production, shorter for development
  const isProduction = true
  const transactionTimeout = isProduction ? 60000 : 30000 // 60s for production, 30s for dev

  return new PrismaClient({
    // Set default transaction options to handle long-running operations
    // These are defaults, but individual transactions should use withTransaction() wrapper
    transactionOptions: {
      maxWait: transactionTimeout,
      timeout: transactionTimeout,
    },
    // Log queries in development for debugging
    log: isProduction ? ['error', 'warn'] : ['query', 'error', 'warn'],
  }).$extends({
    query: {
      university: {
        async create({ args, query }) {
          if (typeof args.data.name === 'string' && typeof args.data.location === 'string') {
            args.data.slug = slugify(`${args.data.name}-${args.data.location}`, {
              lower: true, strict: true, trim: true
            })
          }
          return query(args)
        },
        async update({ args, query }) {
          const name = typeof args.data.name === 'string' ?
            args.data.name :
            (args.data.name as Prisma.StringFieldUpdateOperationsInput)?.set

          const location = typeof args.data.location === 'string' ?
            args.data.location :
            (args.data.location as Prisma.StringFieldUpdateOperationsInput)?.set

          if (name && location) {
            args.data.slug = slugify(`${name}-${location}`, {
              lower: true, strict: true, trim: true,
            })
          }
          return query(args)
        },
      },
    },
  })
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClientSingleton }
export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
