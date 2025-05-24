const { MongoClient } = require('mongodb');
const { DB_URL, DB_NAME } = require('../src/common/config');

module.exports = {
  async up() {
    const client = new MongoClient(DB_URL);
    try {
      await client.connect();
      const db = client.db(DB_NAME);

      // Создаем индексы для пользователей
      await db.collection('users').createIndexes([
        { key: { email: 1 }, unique: true },
        { key: { status: 1 } }
      ]);

      // Создаем индексы для транзакций
      await db.collection('transactions').createIndexes([
        { key: { userId: 1 } },
        { key: { createdAt: -1 } },
        { key: { status: 1 } }
      ]);
    } finally {
      await client.close();
    }
  },

  async down() {
    // Откат миграции (для разработки)
    const client = new MongoClient(DB_URL);
    try {
      await client.connect();
      const db = client.db(DB_NAME);
      
      await db.collection('users').dropIndexes();
      await db.collection('transactions').dropIndexes();
    } finally {
      await client.close();
    }
  }
};
