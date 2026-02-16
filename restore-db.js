const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function restoreDatabase(backupFilePath) {
  try {
    if (!backupFilePath) {
      console.error('❌ Please provide backup file path');
      console.error('Usage: node restore-db.js <backup-file-path>');
      process.exitCode = 1;
      return;
    }

    if (!fs.existsSync(backupFilePath)) {
      console.error(`❌ Backup file not found: ${backupFilePath}`);
      process.exitCode = 1;
      return;
    }

    console.log('🔄 Starting database restore...');
    console.log(`📁 Reading backup: ${backupFilePath}`);

    const backupData = JSON.parse(fs.readFileSync(backupFilePath, 'utf-8'));

    // Clear existing data (in correct order to avoid foreign key issues)
    console.log('🗑️  Clearing existing data...');
    
    // Clear forum-related data
    await prisma.forumReply.deleteMany({});
    await prisma.forumPost.deleteMany({});
    await prisma.forumTopic.deleteMany({});
    await prisma.forum.deleteMany({});
    
    // Clear group-related data
    await prisma.groupMember.deleteMany({});
    await prisma.group.deleteMany({});
    
    // Clear accommodation-related data
    await prisma.accommodationReview.deleteMany({});
    await prisma.accommodationRating.deleteMany({});
    await prisma.accommodation.deleteMany({});
    
    // Clear loan applications
    await prisma.loanApplication.deleteMany({});
    
    // Clear university-related data
    await prisma.universityApplications.deleteMany({});
    await prisma.favCourse.deleteMany({});
    await prisma.course.deleteMany({});
    await prisma.courseTimelineData.deleteMany({});
    await prisma.salaryChartData.deleteMany({});
    await prisma.employmentRateMeterData.deleteMany({});
    await prisma.careerOutcome.deleteMany({});
    await prisma.faq.deleteMany({});
    await prisma.university.deleteMany({});
    
    // Clear user-related data
    await prisma.quizAnswer.deleteMany({});
    await prisma.user.deleteMany({});
    console.log('✅ Data cleared');

    // Restore data in correct order using createMany for better performance
    console.log('📥 Restoring Users...');
    if (backupData.users && backupData.users.length > 0) {
      await prisma.user.createMany({ data: backupData.users });
      console.log(`   ✅ Restored ${backupData.users.length} users`);
    }

    console.log('📥 Restoring Universities...');
    if (backupData.universities && backupData.universities.length > 0) {
      const universityData = backupData.universities.map(
        ({ courses, faqs, careerOutcomes, applications, ...uniData }) => uniData
      );
      await prisma.university.createMany({ data: universityData });
      console.log(`   ✅ Restored ${backupData.universities.length} universities`);
    }

    console.log('📥 Restoring Courses...');
    if (backupData.courses && backupData.courses.length > 0) {
      await prisma.course.createMany({ data: backupData.courses });
      console.log(`   ✅ Restored ${backupData.courses.length} courses`);
    }

    console.log('📥 Restoring FAQs...');
    if (backupData.faqs && backupData.faqs.length > 0) {
      await prisma.faq.createMany({ data: backupData.faqs });
      console.log(`   ✅ Restored ${backupData.faqs.length} FAQs`);
    }

    console.log('📥 Restoring Career Outcomes...');
    if (backupData.careerOutcomes && backupData.careerOutcomes.length > 0) {
      const careerData = backupData.careerOutcomes.map(
        ({ salaryChartData, employmentRateMeter, courseTimelineData, ...outcomeData }) => outcomeData
      );
      await prisma.careerOutcome.createMany({ data: careerData });
      console.log(`   ✅ Restored ${backupData.careerOutcomes.length} career outcomes`);
    }

    console.log('📥 Restoring Salary Chart Data...');
    if (backupData.salaryChartData && backupData.salaryChartData.length > 0) {
      await prisma.salaryChartData.createMany({ data: backupData.salaryChartData });
      console.log(`   ✅ Restored ${backupData.salaryChartData.length} salary chart entries`);
    }

    console.log('📥 Restoring Employment Rate Meter Data...');
    if (backupData.employmentRateMeterData && backupData.employmentRateMeterData.length > 0) {
      await prisma.employmentRateMeterData.createMany({ data: backupData.employmentRateMeterData });
      console.log(`   ✅ Restored ${backupData.employmentRateMeterData.length} employment rate entries`);
    }

    console.log('📥 Restoring Course Timeline Data...');
    if (backupData.courseTimelineData && backupData.courseTimelineData.length > 0) {
      await prisma.courseTimelineData.createMany({ data: backupData.courseTimelineData });
      console.log(`   ✅ Restored ${backupData.courseTimelineData.length} course timeline entries`);
    }

    console.log('📥 Restoring University Applications...');
    if (backupData.universityApplications && backupData.universityApplications.length > 0) {
      await prisma.universityApplications.createMany({ data: backupData.universityApplications });
      console.log(`   ✅ Restored ${backupData.universityApplications.length} university applications`);
    }

    console.log('📥 Restoring Favorite Courses...');
    if (backupData.favCourses && backupData.favCourses.length > 0) {
      await prisma.favCourse.createMany({ data: backupData.favCourses });
      console.log(`   ✅ Restored ${backupData.favCourses.length} favorite courses`);
    }

    console.log('📥 Restoring Accommodations...');
    if (backupData.accommodations && backupData.accommodations.length > 0) {
      await prisma.accommodation.createMany({ data: backupData.accommodations });
      console.log(`   ✅ Restored ${backupData.accommodations.length} accommodations`);
    }

    console.log('📥 Restoring Accommodation Ratings...');
    if (backupData.accommodationRatings && backupData.accommodationRatings.length > 0) {
      await prisma.accommodationRating.createMany({ data: backupData.accommodationRatings });
      console.log(`   ✅ Restored ${backupData.accommodationRatings.length} accommodation ratings`);
    }

    console.log('📥 Restoring Accommodation Reviews...');
    if (backupData.accommodationReviews && backupData.accommodationReviews.length > 0) {
      await prisma.accommodationReview.createMany({ data: backupData.accommodationReviews });
      console.log(`   ✅ Restored ${backupData.accommodationReviews.length} accommodation reviews`);
    }

    console.log('📥 Restoring Loan Applications...');
    if (backupData.loanApplications && backupData.loanApplications.length > 0) {
      await prisma.loanApplication.createMany({ data: backupData.loanApplications });
      console.log(`   ✅ Restored ${backupData.loanApplications.length} loan applications`);
    }

    console.log('📥 Restoring Forums...');
    if (backupData.forums && backupData.forums.length > 0) {
      await prisma.forum.createMany({ data: backupData.forums });
      console.log(`   ✅ Restored ${backupData.forums.length} forums`);
    }

    console.log('📥 Restoring Forum Topics...');
    if (backupData.forumTopics && backupData.forumTopics.length > 0) {
      await prisma.forumTopic.createMany({ data: backupData.forumTopics });
      console.log(`   ✅ Restored ${backupData.forumTopics.length} forum topics`);
    }

    console.log('📥 Restoring Forum Posts...');
    if (backupData.forumPosts && backupData.forumPosts.length > 0) {
      await prisma.forumPost.createMany({ data: backupData.forumPosts });
      console.log(`   ✅ Restored ${backupData.forumPosts.length} forum posts`);
    }

    console.log('📥 Restoring Forum Replies...');
    if (backupData.forumReplies && backupData.forumReplies.length > 0) {
      await prisma.forumReply.createMany({ data: backupData.forumReplies });
      console.log(`   ✅ Restored ${backupData.forumReplies.length} forum replies`);
    }

    console.log('📥 Restoring Groups...');
    if (backupData.groups && backupData.groups.length > 0) {
      await prisma.group.createMany({ data: backupData.groups });
      console.log(`   ✅ Restored ${backupData.groups.length} groups`);
    }

    console.log('📥 Restoring Group Members...');
    if (backupData.groupMembers && backupData.groupMembers.length > 0) {
      await prisma.groupMember.createMany({ data: backupData.groupMembers });
      console.log(`   ✅ Restored ${backupData.groupMembers.length} group members`);
    }

    console.log('📥 Restoring Quiz Answers...');
    if (backupData.quizAnswers && backupData.quizAnswers.length > 0) {
      await prisma.quizAnswer.createMany({ data: backupData.quizAnswers });
      console.log(`   ✅ Restored ${backupData.quizAnswers.length} quiz answers`);
    }

    console.log('\n✅ DATABASE RESTORE COMPLETED SUCCESSFULLY!');
    console.log('✅ All data has been restored from backup.');

  } catch (error) {
    console.error('\n❌ RESTORE FAILED:', error.message);
    console.error('\n⚠️  Your database may be in an inconsistent state.');
    console.error('Please contact your database administrator.');
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

// Get backup file path from command line arguments
const backupFile = process.argv[2];
restoreDatabase(backupFile);
