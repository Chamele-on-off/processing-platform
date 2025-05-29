const { exec } = require('child_process');
const moment = require('moment');
const logger = require('../src/common/utils/logger');

const backupDir = '/backups';
const date = moment().format('YYYY-MM-DD_HH-mm');
const backupFile = `${backupDir}/backup_${date}.gz`;

logger.info(`Starting backup to ${backupFile}`);

exec(`mongodump --uri="${process.env.MONGODB_URI}" --archive=${backupFile} --gzip`, 
  (error, stdout, stderr) => {
    if (error) {
      logger.error('Backup failed:', error);
      process.exit(1);
    }
    
    logger.info(`Backup completed: ${backupFile}`);
    // Upload to S3 or other storage here
  }
);
