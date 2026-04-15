const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '',
  database: process.env.DB_NAME || 'emergency_system',
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '+00:00'
});

pool.getConnection()
  .then(() => {
    console.log('✅ MySQL Database connected successfully');
  })
  .catch(err => {
    console.error('❌ MySQL Database connection failed:', err);
  });

module.exports = pool;