const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.$connect().then(() => {
  console.log('✅ Database connected!');
  prisma.$disconnect();
}).catch(err => {
  console.error('❌ Connection failed:', err.message);
});
