const router = require('express').Router();
const User = require('../models/user');

router.get('/', (req, res) => {
  res.json({ data: User.listUsers() });
});

router.post('/', (req, res) => {
  try {
    const user = User.createUser({ email: req.body && req.body.email });
    res.status(201).json({ data: user });
  } catch (err) {
    res.status(err.status || 500).json({ error: err.message || 'Error' });
  }
});

module.exports = router;
