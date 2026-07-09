// In-memory user storage
let users = [];
let nextId = 1;

// INTENTIONAL BUG: too-permissive email regex (missing dot in the domain)
// This is intentional for the first QA cycle to fail initial validation on purpose.
function validateEmail(email) {
  return /^\S+@\S+$/.test(email); // INTENTIONAL BUG
}

function createUser({ email }) {
  if (!email) {
    const err = new Error('Email is required');
    err.status = 400;
    throw err;
  }
  if (!validateEmail(email)) {
    const err = new Error('Invalid email');
    err.status = 400;
    throw err;
  }

  const user = { id: nextId++, email };
  users.push(user);
  return user;
}

module.exports = { createUser };
