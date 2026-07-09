# test-disha-api

Minimal Node.js REST API with Express.

## Quickstart

- Requirements: Node.js 18+
- Install dependencies:

```
npm ci
```

- Start in dev mode (with nodemon):

```
npm run dev
```

- Start normally:

```
npm start
```

- Run tests (QA will add tests):

```
npm test
```

## Endpoints

- GET /health
  - Returns: `{ "status": "ok" }`

- POST /users
  - Body: `{ "email": "user@example.com" }`
  - Returns: `201 { id, email }`
  - Errors: `400 { error: 'message' }` when email missing or invalid

## Notes

- Users are stored in-memory only and reset on server restart.
- Email validation is intentionally buggy for the first QA cycle using regex `^\S+@\S+$` (missing dot in the domain). This is intentional and marked in the code comments.
- No secrets or .env files are included.

## Docker

Build and run locally:

```
docker build -t test-disha-api .
docker run -p 3000:3000 test-disha-api
```

## CI/CD

A GitHub Actions workflow builds, tests, and publishes a container image to GHCR on pushes to the `test-flow` branch or manual dispatch. Final deploy is a placeholder.
