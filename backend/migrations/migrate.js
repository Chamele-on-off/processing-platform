const mongoose = require('mongoose');
const logger = require('../src/common/utils/logger');
const config = require('../src/common/config');

class Migrator {
  constructor() {
    this.migrations = [];
  }

  addMigration(name, fn) {
    this.migrations.push({ name, fn });
  }

  async run() {
    try {
      await mongoose.connect(config.db.uri, config.db.options);
      logger.info('Connected to database for migrations');

      const db = mongoose.connection.db;
      const migrationsCollection = db.collection('migrations');

      for (const migration of this.migrations) {
        const alreadyRun = await migrationsCollection.findOne({ name: migration.name });
        if (!alreadyRun) {
          logger.info(`Running migration: ${migration.name}`);
          await migration.fn(db);
          await migrationsCollection.insertOne({ 
            name: migration.name, 
            runAt: new Date() 
          });
          logger.info(`Completed migration: ${migration.name}`);
        }
      }

      logger.info('All migrations completed');
      process.exit(0);
    } catch (error) {
      logger.error('Migration failed:', error);
      process.exit(1);
    }
  }
}

const migrator = new Migrator();

// Add your migrations here
migrator.addMigration('initial_setup', async (db) => {
  await db.createCollection('users', {
    validator: {
      $jsonSchema: {
        bsonType: 'object',
        required: ['email', 'password', 'role'],
        properties: {
          email: { bsonType: 'string' },
          role: { enum: ['admin', 'trader', 'merchant'] }
        }
      }
    }
  });
  
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
});

migrator.run();
