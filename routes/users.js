const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/users/register
router.post('/register', (req, res) => {
  const { phone, emergencyContacts } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'User phone number is required' });
  }

  const findUser = db.prepare(`SELECT * FROM users WHERE phone = ?`);
  const insertUser = db.prepare(`INSERT INTO users (phone) VALUES (?)`);
  const insertContact = db.prepare(`
    INSERT INTO emergency_contacts (user_id, phone, name, relationship)
    VALUES (?, ?, ?, ?)
  `);

  let user = findUser.get(phone);
  if (!user) {
    const result = insertUser.run(phone);
    user = { id: result.lastInsertRowid, phone };
  }

  if (Array.isArray(emergencyContacts)) {
    for (const contact of emergencyContacts) {
      if (!contact.phone) continue;
      insertContact.run(
        user.id,
        contact.phone,
        contact.name || null,
        contact.relationship || null
      );
    }
  }

  res.status(201).json({ message: 'Success', userId: user.id });
});

// GET /api/users/fetch-all
router.get('/fetch-all', (req, res) => {
  const getAllUsers = db.prepare(`SELECT id, phone FROM users`);
  const users = getAllUsers.all();

  res.json({ users });
});

// GET /api/users/:phone
router.get('/:phone', (req, res) => {
  const phone = req.params.phone;

  const findUser = db.prepare(`SELECT id, phone FROM users WHERE phone = ?`);
  const user = findUser.get(phone);

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  const findContacts = db.prepare(`
    SELECT phone, name, relationship
    FROM emergency_contacts
    WHERE user_id = ?
  `);

  const contacts = findContacts.all(user.id);

  res.json({
    user: {
      id: user.id,
      phone: user.phone,
      emergencyContacts: contacts
    }
  });
});

module.exports = router;
