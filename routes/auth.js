const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, contact, address, password } = req.body;
    if (!name || !email || !contact || !address || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }

    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ error: 'User exists' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, contact, address, password: hashedPassword });

    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ message: 'Success', token, user: { id: user.id, name, email, contact } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Success', token, user: { id: user.id, name: user.name, email, contact: user.contact } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;