const { exec } = require('child_process');
const { createGzip } = require('zlib');
const { createWriteStream } = require('fs');
const { promisify } = require('util');
const logger = require('../src/common/utils/logger');
const config = require('../src/common/config');
const AWS = require('aws-sdk');

const execAsync = promisify(exec);
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY
});

class BackupService {
  constructor() {
    this.backupDir = '/backups';
    this.date = new Date().toISOString().replace(/[:.]/g, '-');
    this.backupFile = `${this.backupDir}/backup-${this.date}.gz`;
  }

  async run() {
    try {
      logger.info('Starting database backup');
      
      await this.createBackup();
      await this.uploadToS3();
      
      logger.info('Backup completed successfully');
      process.exit(0);
    } catch (error) {
      logger.error('Backup failed:', error);
      process.exit(1);
    }
  }

  async createBackup() {
    const cmd = `mongodump --uri="${config.db.uri}" --archive --gzip`;
    const { stdout, stderr } = await execAsync(cmd);
    
    if (stderr) {
      throw new Error(stderr);
    }
    
    return stdout;
  }

  async uploadToS3() {
    if (!process.env.AWS_BUCKET_NAME) {
      logger.warn('AWS_BUCKET_NAME not set, skipping S3 upload');
      return;
    }

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `backups/${this.date}.gz`,
      Body: createReadStream(this.backupFile)
    };

    await s3.upload(params).promise();
    logger.info(`Backup uploaded to S3: ${params.Key}`);
  }

  async cleanupOldBackups() {
    const files = await fs.readdir(this.backupDir);
    const oldBackups = files
      .filter(file => file.endsWith('.gz'))
      .sort()
      .slice(0, -5); // Keep last 5 backups

    await Promise.all(oldBackups.map(file => 
      fs.unlink(`${this.backupDir}/${file}`)
    ));
  }
}

new BackupService().run();
