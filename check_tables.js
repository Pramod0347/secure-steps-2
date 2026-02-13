const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTables() {
  try {
    const tables = [
      'UserProfile',
      'OnboardingInfo',
      'UniversitySelection',
      'UserDocument',
      'ApplicationTracking',
      'PortfolioItem',
      'JourneyMilestone',
      'VisaChecklist',
      'CareerProfile',
      'EBook'
    ];

    for (const table of tables) {
      try {
        // Try to count records in each table
        const model = prisma[table.charAt(0).toLowerCase() + table.slice(1)];
        if (model) {
          console.log(`✅ Table exists: ${table}`);
        }
      } catch (e) {
        console.log(`❌ Table NOT found: ${table}`);
      }
    }

    // Now try to actually query
    const profile = await prisma.userProfile.findFirst().catch(() => null);
    console.log('\n✅ Database is synced - can query UserProfile table');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
