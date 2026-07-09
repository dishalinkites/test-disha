const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');

const healthRouter = require('./routes/health');
const usersRouter = require('./routes/users');

const app = express();
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));

app.use('/health', healthRouter);
app.use('/users', usersRouter);

app.get('/', (req, res) => res.json({ name: 'test-disha-api', status: 'up' }));

module.exports = app;
