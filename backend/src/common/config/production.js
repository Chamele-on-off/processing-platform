module.exports = {
  db: {
    uri: process.env.MONGODB_URI,
    options: {
      ssl: true,
      sslValidate: true,
      sslCA: require('fs').readFileSync('/path/to/ca.pem'),
      replicaSet: 'rs0',
      readPreference: 'secondaryPreferred'
    }
  },
  redis: {
    url: process.env.REDIS_URL,
    ttl: 3600,
    socket: {
      tls: true,
      rejectUnauthorized: false
    }
  },
  cookie: {
    secret: process.env.COOKIE_SECRET,
    options: {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      domain: process.env.COOKIE_DOMAIN
    }
  },
  cors: {
    origins: JSON.parse(process.env.ALLOWED_ORIGINS || '[]')
  }
};
