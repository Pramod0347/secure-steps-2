const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function backupDatabase() {
  try {
    console.log('🔄 Starting COMPLETE database backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupDir = path.join(__dirname, 'db_backups');
    
    if (!fs.existsSync(backupDir)) {
      fs.mkdirSync(backupDir, { recursive: true });
    }
    
    // Backup ALL tables
    const backup = {};
    let totalRecords = 0;
    
    // Backing up normalized data (related tables exported separately)
    console.log('📦 Backing up Universities...');
    backup.universities = await prisma.university.findMany();
    totalRecords += backup.universities.length;
    
    console.log('📦 Backing up Users...');
    backup.users = await prisma.user.findMany();
    totalRecords += backup.users.length;
    
    console.log('📦 Backing up University Applications...');
    backup.universityApplications = await prisma.universityApplications.findMany();
    totalRecords += backup.universityApplications.length;
    
    console.log('📦 Backing up Accommodations...');
    backup.accommodations = await prisma.accommodation.findMany();
    totalRecords += backup.accommodations.length;
    
    console.log('📦 Backing up Accommodation Ratings...');
    backup.accommodationRatings = await prisma.accommodationRating.findMany();
    totalRecords += backup.accommodationRatings.length;
    
    console.log('📦 Backing up Accommodation Reviews...');
    backup.accommodationReviews = await prisma.accommodationReview.findMany();
    totalRecords += backup.accommodationReviews.length;
    
    console.log('📦 Backing up Favorite Courses...');
    backup.favCourses = await prisma.favCourse.findMany();
    totalRecords += backup.favCourses.length;
    
    console.log('📦 Backing up FAQs...');
    backup.faqs = await prisma.faq.findMany();
    totalRecords += backup.faqs.length;
    
    console.log('📦 Backing up Career Outcomes...');
    backup.careerOutcomes = await prisma.careerOutcome.findMany({
      include: {
        salaryChartData: true,
        employmentRateMeter: true,
        courseTimelineData: true,
      }
    });
    totalRecords += backup.careerOutcomes.length;
    
    console.log('📦 Backing up Salary Chart Data...');
    backup.salaryChartData = await prisma.salaryChartData.findMany();
    totalRecords += backup.salaryChartData.length;
    
    console.log('📦 Backing up Employment Rate Meter Data...');
    backup.employmentRateMeterData = await prisma.employmentRateMeterData.findMany();
    totalRecords += backup.employmentRateMeterData.length;
    
    console.log('📦 Backing up Course Timeline Data...');
    backup.courseTimelineData = await prisma.courseTimelineData.findMany();
    totalRecords += backup.courseTimelineData.length;
    
    console.log('📦 Backing up Courses...');
    backup.courses = await prisma.course.findMany();
    totalRecords += backup.courses.length;
    
    console.log('📦 Backing up Loan Applications...');
    backup.loanApplications = await prisma.loanApplication.findMany();
    totalRecords += backup.loanApplications.length;
    
    console.log('📦 Backing up Forums...');
    backup.forums = await prisma.forum.findMany();
    totalRecords += backup.forums.length;
    
    console.log('📦 Backing up Forum Topics...');
    backup.forumTopics = await prisma.forumTopic.findMany();
    totalRecords += backup.forumTopics.length;
    
    console.log('📦 Backing up Forum Posts...');
    backup.forumPosts = await prisma.forumPost.findMany();
    totalRecords += backup.forumPosts.length;
    
    console.log('📦 Backing up Forum Replies...');
    backup.forumReplies = await prisma.forumReply.findMany();
    totalRecords += backup.forumReplies.length;
    
    console.log('📦 Backing up Groups...');
    backup.groups = await prisma.group.findMany();
    totalRecords += backup.groups.length;
    
    console.log('📦 Backing up Group Members...');
    backup.groupMembers = await prisma.groupMember.findMany();
    totalRecords += backup.groupMembers.length;
    
    console.log('📦 Backing up Quiz Answers...');
    backup.quizAnswers = await prisma.quizAnswer.findMany();
    totalRecords += backup.quizAnswers.length;
    
    const backupFile = path.join(backupDir, `complete-backup-${timestamp}.json`);
    // NOTE: Backup contains sensitive data; using restrictive permissions (owner read/write only)
    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), { mode: 0o600 });
    
    const fileSizeKB = (fs.statSync(backupFile).size / 1024).toFixed(2);
    
    console.log(`\n✅ COMPLETE BACKUP CREATED SUCCESSFULLY!`);
    console.log(`📁 Location: ${backupFile}`);
    console.log(`💾 File Size: ${fileSizeKB} KB`);
    console.log(`📊 Total Records Backed Up: ${totalRecords}`);
    console.log(`\n📋 Breakdown:`);
    console.log(`   - Universities: ${backup.universities.length}`);
    console.log(`   - Courses: ${backup.courses.length}`);
    console.log(`   - Users: ${backup.users.length}`);
    console.log(`   - University Applications: ${backup.universityApplications.length}`);
    console.log(`   - Accommodations: ${backup.accommodations.length}`);
    console.log(`   - Accommodation Ratings: ${backup.accommodationRatings.length}`);
    console.log(`   - Accommodation Reviews: ${backup.accommodationReviews.length}`);
    console.log(`   - Favorite Courses: ${backup.favCourses.length}`);
    console.log(`   - FAQs: ${backup.faqs.length}`);
    console.log(`   - Career Outcomes: ${backup.careerOutcomes.length}`);
    console.log(`   - Salary Chart Data: ${backup.salaryChartData.length}`);
    console.log(`   - Employment Rate Meter Data: ${backup.employmentRateMeterData.length}`);
    console.log(`   - Course Timeline Data: ${backup.courseTimelineData.length}`);
    console.log(`   - Loan Applications: ${backup.loanApplications.length}`);
    console.log(`   - Forums: ${backup.forums.length}`);
    console.log(`   - Forum Topics: ${backup.forumTopics.length}`);
    console.log(`   - Forum Posts: ${backup.forumPosts.length}`);
    console.log(`   - Forum Replies: ${backup.forumReplies.length}`);
    console.log(`   - Groups: ${backup.groups.length}`);
    console.log(`   - Group Members: ${backup.groupMembers.length}`);
    console.log(`   - Quiz Answers: ${backup.quizAnswers.length}`);
    
  } catch (error) {
    console.error('❌ Backup failed:', error.message);
    console.error('Stack:', error.stack);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
