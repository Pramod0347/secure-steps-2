#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Run this script to test your database connection
 * Usage: node test-db-connection.js
 */

const { PrismaClient } = require('@prisma/client');

async function testDatabaseConnection() {
  console.log('🔍 Testing database connection...\n');
  
  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL environment variable is not set!');
    console.log('Please make sure you have a .env.local file with DATABASE_URL configured.');
    process.exit(1);
  }

  console.log('✅ DATABASE_URL is configured');
  console.log(`📍 Database URL: ${process.env.DATABASE_URL.replace(/\/\/.*@/, '//***:***@')}\n`);

  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    // Test 1: Basic connection
    console.log('🔄 Test 1: Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful!\n');

    // Test 2: Simple query
    console.log('🔄 Test 2: Testing simple query...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Query execution successful!');
    console.log(`📊 Query result: ${JSON.stringify(result)}\n`);

    // Test 3: Check if tables exist
    console.log('🔄 Test 3: Checking database tables...');
    const tables = await prisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log('✅ Tables query successful!');
    console.log(`📋 Found ${tables.length} tables in the database`);
    
    if (tables.length > 0) {
      console.log('📝 Tables:');
      tables.forEach((table, index) => {
        console.log(`   ${index + 1}. ${table.table_name}`);
      });
    } else {
      console.log('⚠️  No tables found. You may need to run database migrations.');
    }
    console.log('');

    // Test 4: Test Prisma models (if tables exist)
    if (tables.length > 0) {
      console.log('🔄 Test 4: Testing Prisma models...');
      try {
        // Try to count users (this will work if User table exists)
        const userCount = await prisma.user.count();
        console.log(`✅ User model test successful! Found ${userCount} users.`);
      } catch (error) {
        console.log('⚠️  User model test failed (this is normal if migrations haven\'t been run)');
        console.log(`   Error: ${error.message}`);
      }
    }

    console.log('\n🎉 All database tests completed successfully!');
    console.log('✅ Your database connection is working properly.');

  } catch (error) {
    console.error('\n❌ Database connection failed!');
    console.error('Error details:');
    console.error(`   Type: ${error.constructor.name}`);
    console.error(`   Message: ${error.message}`);
    
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    
    // Common error solutions
    console.log('\n🔧 Common solutions:');
    console.log('   1. Check if your database server is running');
    console.log('   2. Verify DATABASE_URL format: postgresql://user:password@host:port/database');
    console.log('   3. Ensure database exists');
    console.log('   4. Check firewall/network connectivity');
    console.log('   5. Verify username/password are correct');
    
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Database connection closed.');
  }
}

// Run the test
testDatabaseConnection().catch((error) => {
  console.error('💥 Unexpected error:', error);
  process.exit(1);
});
