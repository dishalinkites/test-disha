# test-disha-api

Simple Node.js REST API.

Endpoints:
- GET /health -> { status: 'ok' }
- GET /users -> list users
- POST /users { email } -> create user (email is required; validation intentionally buggy for first QA cycle)

Local dev:
- npm install
- npm run dev

Do not add any secrets.
