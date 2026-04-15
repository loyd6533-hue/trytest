const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Essential middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend FIRST
app.use(express.static(path.join(__dirname, 'public')));

// API Routes - CRITICAL LINE
console.log('Loading routes...');
app.use('/api/alerts', require('./routes/alert'));
console.log('✅ Routes loaded!');

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', time: new Date().toISOString() });
});

// Frontend catch-all (LAST)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server: http://localhost:${PORT}`);
  console.log(`📊 Health: http://localhost:${PORT}/api/health`);
  console.log(`🔗 Register: http://localhost:${PORT}/api/alerts/register`);
});