#!/bin/bash
DATE=$(date +%Y-%m-%d_%H-%M-%S)
BACKUP_DIR="/backups/mongo"
mkdir -p $BACKUP_DIR

mongodump \
  --uri="$DB_URL" \
  --out="$BACKUP_DIR/$DATE" \
  --gzip

# Удаляем старые бэкапы (старше 7 дней)
find $BACKUP_DIR -type d -mtime +7 -exec rm -rf {} \;

# Отправка в S3 (опционально)
aws s3 sync $BACKUP_DIR s3://your-bucket/mongo-backups/
