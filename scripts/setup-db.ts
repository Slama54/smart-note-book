import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Setting up database...');
  
  try {
    // Test the connection
    await prisma.$executeRawUnsafe('SELECT 1');
    console.log('Database connection successful!');
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
