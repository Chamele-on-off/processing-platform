const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');

module.exports = {
  async up() {
    const client = new MongoClient(process.env.DB_URL);
    try {
      await client.connect();
      const db = client.db();

      // Создаем администратора
      const adminExists = await db.collection('users').findOne({ email: 'admin@example.com' });
      if (!adminExists) {
        await db.collection('users').insertOne({
          email: 'admin@example.com',
          password: await bcrypt.hash('Admin123!', 12),
          role: 'admin',
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      // Базовые настройки системы
      await db.collection('settings').updateOne(
        { name: 'system' },
        { $set: { 
          maintenanceMode: false,
          defaultRoles: ['user', 'trader', 'merchant'],
          currencyRates: { USD: 1, EUR: 0.85 }
        }},
        { upsert: true }
      );
    } finally {
      await client.close();
    }
  },

  async down() {
    // Откат (не рекомендуется для production)
  }
};
