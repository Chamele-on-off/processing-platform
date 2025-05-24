const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log('Database connection OK');
    process.exit(0);
  })
  .catch(err => {
    console.error('Database connection failed', err);
    process.exit(1);
  });
