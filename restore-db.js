const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function restoreDatabase(backupFilePath) {
  try {
    if (!backupFilePath) {
      console.error('❌ Please provide backup file path');
      console.error('Usage: node restore-db.js <backup-file-path>');
      process.exit(1);
    }

    if (!fs.existsSync(backupFilePath)) {
      console.error(`❌ Backup file not found: ${backupFilePath}`);
      process.exit(1);
    }

    console.log('🔄 Starting database restore...');
    console.log(`📁 Reading backup: ${backupFilePath}`);

    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));

    // Clear existing data (in correct order to avoid foreign key issues)
    console.log('🗑️  Clearing existing data...');
    await prisma.universityApplications.deleteMany({});
    await prisma.favCourse.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.courseTimelineData.deleteMany({});
    await prisma.salaryChartData.deleteMany({});
    await prisma.employmentRateMeterData.deleteMany({});
    await prisma.careerOutcome.deleteMany({});
    await prisma.faq.deleteMany({});
    await prisma.university.deleteMany({});
    await prisma.quizAnswer.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Data cleared');

    // Restore data in correct order
    console.log('📥 Restoring Users...');
    if (backupData.users && backupData.users.length > 0) {
      for (const user of backupData.users) {
        await prisma.user.create({ data: user });
      }
      console.log(`   ✅ Restored ${backupData.users.length} users`);
    }

    console.log('📥 Restoring Universities...');
    if (backupData.universities && backupData.universities.length > 0) {
      for (const university of backupData.universities) {
        const { courses, faqs, careerOutcomes, ...uniData } = university;
        await prisma.university.create({ data: uniData });
      }
      console.log(`   ✅ Restored ${backupData.universities.length} universities`);
    }

    console.log('📥 Restoring Courses...');
    if (backupData.courses && backupData.courses.length > 0) {
      for (const course of backupData.courses) {
        await prisma.course.create({ data: course });
      }
      console.log(`   ✅ Restored ${backupData.courses.length} courses`);
    }

    console.log('📥 Restoring FAQs...');
    if (backupData.faqs && backupData.faqs.length > 0) {
      for (const faq of backupData.faqs) {
        await prisma.faq.create({ data: faq });
      }
      console.log(`   ✅ Restored ${backupData.faqs.length} FAQs`);
    }

    console.log('📥 Restoring Career Outcomes...');
    if (backupData.careerOutcomes && backupData.careerOutcomes.length > 0) {
      for (const outcome of backupData.careerOutcomes) {
        const { salaryChartData, employmentRateMeter, courseTimelineData, ...outcomeData } = outcome;
        const created = await prisma.careerOutcome.create({ data: outcomeData });
        
        if (salaryChartData && salaryChartData.length > 0) {
          for (const salary of salaryChartData) {
            await prisma.salaryChartData.create({
              data: { ...salary, careerOutcomeId: created.id }
            });
          }
        }
        
        if (employmentRateMeter) {
          await prisma.employmentRateMeterData.create({
            data: { ...employmentRateMeter, careerOutcomeId: created.id }
          });
        }
        
        if (courseTimelineData && courseTimelineData.length > 0) {
          for (const timeline of courseTimelineData) {
            await prisma.courseTimelineData.create({
              data: { ...timeline, careerOutcomeId: created.id }
            });
          }
        }
      }
      console.log(`   ✅ Restored ${backupData.careerOutcomes.length} career outcomes`);
    }

    console.log('📥 Restoring Quiz Answers...');
    if (backupData.quizAnswers && backupData.quizAnswers.length > 0) {
      for (const answer of backupData.quizAnswers) {
        await prisma.quizAnswer.create({ data: answer });
      }
      console.log(`   ✅ Restored ${backupData.quizAnswers.length} quiz answers`);
    }

    console.log('\n✅ DATABASE RESTORE COMPLETED SUCCESSFULLY!');
    console.log('✅ All data has been restored from backup.');

  } catch (error) {
    console.error('\n❌ RESTORE FAILED:', error.message);
    console.error('\n⚠️  Your database may be in an inconsistent state.');
    console.error('Please contact your database administrator.');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Get backup file path from command line arguments
const backupFile = process.argv[2];
restoreDatabase(backupFile);
