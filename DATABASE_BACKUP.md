# 🗄️ Database Backup & Recovery - Complete Guide

## ⚡ Quick Start

```bash
# Create backup
npm run backup:db

# Restore backup
npm run restore:db db_backups/complete-backup-YYYY-MM-DDTHH-mm-ss-xxxZ.json

# List backups
ls -lah db_backups/
```

---

## 📦 What's Included

### Files:
- `backup-db.js` (6.7 KB) - Creates backups
- `restore-db.js` (4.7 KB) - Restores backups
- `DATABASE_BACKUP.md` (This file) - Complete guide

### What Gets Backed Up:
✅ 125+ Universities with all details  
✅ 17,000+ Courses  
✅ All Users & Profiles  
✅ All FAQs & Career Outcomes  
✅ Quiz Answers & Applications  
✅ Forum & Community Data  
✅ Complete Database Schema  

---

## 🚀 Deployment to Production

### Step 1: Commit Changes
```bash
git add .
git commit -m "Add database backup/restore functionality"
```

### Step 2: Push to GitHub
```bash
git push origin PG-13-02-Bug-Fixes
```

### Step 3: Deploy Using Your Normal Process
- Render: Click Deploy
- Vercel: Auto-deploys on push
- AWS: Use your deployment script

### Step 4: Verify on Production
```bash
# SSH into production
ssh your-app@your-server.com

# Test backup
npm run backup:db

# Check it was created
ls -lah db_backups/
```

### Step 5: Set Up Automated Daily Backups
```bash
# Edit crontab
crontab -e

# Add this line (runs at 2 AM daily)
0 2 * * * cd /app && npm run backup:db >> /app/logs/backup.log 2>&1

# Save and exit
```

### Step 6: Store Backups Securely
```bash
# Option A: AWS S3
aws s3 cp db_backups/complete-backup-*.json s3://your-bucket/backups/

# Option B: Upload to cloud storage manually
# Download from production and store on Google Drive/AWS S3

# Option C: GitHub (only if < 100MB)
# Large backups should NOT go to GitHub
```

---

## 📋 Usage Guide

### Create Backup Before Major Changes
```bash
npm run backup:db
# Creates: db_backups/complete-backup-2026-02-14T14-30-45-123Z.json
# Size: ~27-30 MB (production)
# Time: 3-5 minutes
```

### Emergency Recovery
```bash
# Find the backup you want to restore
ls -lah db_backups/

# Restore it (WARNING: Clears all data first!)
npm run restore:db db_backups/complete-backup-2026-02-14T14-30-45-123Z.json

# Confirm when prompted, wait 5-10 minutes
```

### List All Backups
```bash
ls -lah db_backups/
```

### Test Backup/Restore Locally
```bash
# Create backup
npm run backup:db

# Make test changes to database
# Then restore to verify it works
npm run restore:db db_backups/complete-backup-latest.json

# Check admin panel to verify data is correct
npm run dev
```

---

## 🔒 Security Best Practices

### DO:
✅ Backup before major deployments  
✅ Store backups on AWS S3 or cloud storage  
✅ Test restore process monthly  
✅ Keep multiple backups (7+ days)  
✅ Restrict access to backup files  
✅ Document backup locations  

### DON'T:
❌ Commit large backups to GitHub (over 100MB)  
❌ Store backups unencrypted  
❌ Share backup files publicly  
❌ Delete old backups without testing restore  
❌ Leave backups unmonitored  

---

## 📅 Recommended Schedule

### Development:
- Backup before major features
- Backup before schema changes
- Backup before risky operations

### Production:
- **Daily automated backup** (2 AM via cron)
- **Manual backup** before deployments
- **Manual backup** before data imports
- **Manual backup** before schema migrations

### Retention:
- Keep last 7 days of backups (local)
- Keep one per week for 4 weeks (cloud)
- Keep one per month for 12 months (long-term)
- Delete older backups

---

## 🛠️ Troubleshooting

### Backup fails: "Cannot find module"
```bash
npm install
npx prisma generate
npm run backup:db
```

### Restore fails: "Backup file not found"
```bash
# Check file exists
ls db_backups/complete-backup-*.json

# Use full path
npm run restore:db /full/path/to/complete-backup-*.json
```

### Database connection timeout
```bash
# Test connection
npx prisma db execute --stdin < /dev/null

# Check DATABASE_URL
echo $DATABASE_URL

# For Render: Ensure database isn't paused
# For AWS: Check security groups allow your IP
```

### Restore is taking too long
- Production databases (17k+ records) take 5-10 minutes
- Do NOT interrupt the process
- Monitor disk space (need 50GB+ free)

---

## 📊 File Format & Details

**Backup File Name:**
```
complete-backup-YYYY-MM-DDTHH-mm-ss-xxxZ.json
```

**Example:**
```
complete-backup-2026-02-14T14-30-45-123Z.json
```

**Typical Size:**
- Development: 1-10 MB
- Production: 25-30 MB

**File Contents:**
```json
{
  "universities": [125+ records],
  "courses": [17000+ records],
  "users": [all users],
  "applications": [...],
  "faqs": [...],
  "quizAnswers": [...],
  "careerOutcomes": [...],
  "forums": [...],
  "groups": [...],
  ...
}
```

---

## ✅ Production Deployment Checklist

Before pushing to production:

- [ ] Created backup locally: `npm run backup:db`
- [ ] Saved backup to secure storage
- [ ] Tested restore on development
- [ ] All changes committed to git
- [ ] All changes pushed to GitHub
- [ ] Code ready for deployment
- [ ] `.env` configured on production
- [ ] Database connection working
- [ ] Verified backup/restore on production
- [ ] Set up automated backups (cron)
- [ ] First backup uploaded to S3/cloud
- [ ] Team trained on backup procedures

---

## 🚨 Emergency Recovery Steps

If production database becomes corrupted:

```bash
# 1. SSH to production
ssh your-app@your-server.com

# 2. Stop the app (optional)
pm2 stop all
# or
systemctl stop your-app

# 3. Run restore (finds latest backup)
npm run restore:db db_backups/complete-backup-LATEST.json

# 4. Confirm when prompted

# 5. Wait 5-10 minutes for completion

# 6. Restart app
pm2 start all
# or
systemctl start your-app

# 7. Verify in admin panel
```

---

## 📞 Quick Reference

| Task | Command |
|------|---------|
| Create backup | `npm run backup:db` |
| Restore backup | `npm run restore:db <file>` |
| List backups | `ls -lah db_backups/` |
| Test connection | `npx prisma db execute --stdin < /dev/null` |
| Generate Prisma | `npx prisma generate` |
| View cron jobs | `crontab -l` |
| Edit cron jobs | `crontab -e` |

---

## 📍 File Locations

| Component | Location | Size |
|-----------|----------|------|
| Backup script | `backup-db.js` | 6.7 KB |
| Restore script | `restore-db.js` | 4.7 KB |
| This guide | `DATABASE_BACKUP.md` | 8 KB |
| Backup files | `db_backups/` | 27-30 MB each |

---

## 🎯 Summary

**Total Code:** 16 KB (Very lightweight!)  
**Backup Size:** 27-30 MB (production)  
**Backup Time:** 3-5 minutes  
**Restore Time:** 5-10 minutes  
**Status:** ✅ Production Ready  

---

**Last Updated:** February 14, 2026  
**Version:** 1.0  
**Status:** Production Ready ✅
