// MongoDB Prisma 客戶端
import { PrismaClient } from '@prisma/client'

declare global {
  var mongoPrisma: PrismaClient | undefined
}

export const mongoPrisma = global.mongoPrisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') global.mongoPrisma = mongoPrisma

export default mongoPrisma