# Employee Management API

A NestJS + TypeScript backend implementing CRUD for Employees, Departments, and Roles with TypeORM (SQLite by default), validation, and tests.

## Requirements
- Node.js 20

## Setup
1. Install dependencies:
   npm ci

2. Start in dev (SQLite file dev.sqlite):
   npm run start:dev

3. Build:
   npm run build

4. Run tests:
   npm test
   npm run test:e2e

Environment variables can be configured via .env (see .env.example). TypeORM defaults to SQLite for dev and uses in-memory SQLite for tests.

## Endpoints
- Departments: POST /departments, GET /departments, GET /departments/:id, PATCH /departments/:id, DELETE /departments/:id
- Roles: POST /roles, GET /roles, GET /roles/:id, PATCH /roles/:id, DELETE /roles/:id
- Employees: POST /employees, GET /employees (pagination + filters departmentId, roleId, status), GET /employees/:id, PATCH /employees/:id, DELETE /employees/:id

## Docker
Build and run:
- docker build -t employee-api .
- docker run -p 3000:3000 employee-api

## Deployment workflow
A root-level deploy.yml is included to build, test, and push a Docker image to GHCR using GITHUB_TOKEN.
