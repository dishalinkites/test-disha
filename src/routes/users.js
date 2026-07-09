const express = require('express');
const { createUser } = require('../models/user');

const router = express.Router();

router.post('/users', (req, res) => {
  try {
    const { email } = req.body || {};
    const user = createUser({ email });
    res.status(201).json(user);
  } catch (err) {
    const status = err && err.status ? err.status : 400;
    res.status(status).json({ error: err.message || 'Bad Request' });
  }
});

module.exports = router;
