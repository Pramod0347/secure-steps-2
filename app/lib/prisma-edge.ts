import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

const prismaEdge = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
}).$extends(withAccelerate())

export { prismaEdge } 