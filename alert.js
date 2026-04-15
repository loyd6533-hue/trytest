const express = require('express');
const router = express.Router();

// In-memory storage (no database needed for testing)
let users = [];
let alerts = [];
// 1. USER REGISTRATION - POST /api/alerts/register
router.post('/register', (req, res) => {
  console.log('✅ REGISTER HIT:', req.body);
  
  const { name, email, contact, address } = req.body;
  
  res.json({  // ← FORCE JSON RESPONSE
    success: true,
    message: 'Registered!',
    userId: Date.now(),
    received: { name, email, contact, address }
  });
});
// 2. SEND EMERGENCY ALERT - POST /api/alerts/send-alert
router.post('/send-alert', (req, res) => {
  console.log('🚨 ALERT FROM:', req.body.email);
  
  const alertData = {
    ...req.body,
    id: Date.now(),
    timestamp: new Date().toISOString(),
    status: 'sent'
  };
  
  alerts.push(alertData);
  
  res.json({
    success: true,
    message: '🚨 Emergency alert sent successfully!',
    alertId: alertData.id,
    totalAlerts: alerts.length
  });
});

// 3. GET ALERT HISTORY - GET /api/alerts/history/:email
router.get('/history/:email', (req, res) => {
  const userAlerts = alerts.filter(a => a.email === req.params.email);
  res.json({
    success: true,
    alerts: userAlerts,
    count: userAlerts.length
  });
});

// 4. Health check
router.get('/health', (req, res) => {
  res.json({
    ok: true,
    users: users.length,
    alerts: alerts.length
  });
});

module.exports = router;