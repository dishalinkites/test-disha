const express = require('express');
const usersRouter = require('./routes/users');

const app = express();

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Mount users routes
app.use('/', usersRouter);

module.exports = app;
