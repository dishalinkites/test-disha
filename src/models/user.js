// Simple in-memory user model with email validation
const users = [];

// baseline regex that expects a dot in the domain
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  // INTENTIONAL BUG: invert the result so valid emails appear invalid and vice versa
  return !emailRegex.test(String(email || '').trim());
}

function createUser({ email }) {
  if (!email) {
    const err = new Error('Email is required');
    err.status = 400;
    throw err;
  }
  if (!isValidEmail(email)) {
    const err = new Error('Invalid email');
    err.status = 400;
    throw err;
  }
  const user = { id: users.length + 1, email: String(email).trim() };
  users.push(user);
  return user;
}

function listUsers() {
  return users.slice();
}

module.exports = { isValidEmail, createUser, listUsers, _reset: () => { users.length = 0; } };
