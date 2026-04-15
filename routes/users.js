const express = require('express');
const QRCode = require('qrcode');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Token required' });
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
};

router.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId);
  res.json({ user: { id: user.id, name: user.name, email: user.email, contact: user.contact, address: user.address } });
});

router.get('/qr', authenticateToken, async (req, res) => {
  const user = await User.findById(req.user.userId);
  const qrData = { name: user.name, email: user.email, contact: user.contact, address: user.address, timestamp: new Date().toISOString() };
  const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(qrData));
  const filename = `qr_${req.user.userId}_${Date.now()}.png`;
  const filepath = path.join(__dirname, '../uploads', filename);
  const base64Data = qrCodeDataURL.replace(/^data:image\/png;base64,/, '');
  await fs.writeFile(filepath, base64Data, 'base64');
  res.json({ qrCode: `/uploads/${filename}`, downloadUrl: `http://localhost:5000/uploads/${filename}` });
});

module.exports = router;