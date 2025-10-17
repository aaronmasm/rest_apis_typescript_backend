# REST APIs Backend (Node.js + Express + TypeScript)

Backend service for a product admin dashboard. It exposes a REST API to manage products (CRUD + availability toggle), documented with OpenAPI/Swagger and covered by Jest/Supertest tests.

Related frontend repo (TypeScript + React):
- Repo: https://github.com/aaronmasm/rest_apis_typescript_frontend
- Live app: https://restapistypescriptfrontend.vercel.app/

## Overview
- Products resource with the following fields:
  - id (auto increment), name (string), price (number), availability (boolean)
- Endpoints under /api/products with validation and proper status codes
- Swagger UI available at /docs
- PostgreSQL database via Sequelize (sequelize-typescript)
- CORS allow-list controlled by FRONTEND_URL

## PERN Stack Overview
- Architecture: React (frontend) -> Express/Node.js (API) -> PostgreSQL (database)
- Data access layer uses Sequelize (sequelize-typescript) to map models and run queries
- CORS: only the configured FRONTEND_URL is allowed to call this API

## Tech Stack (PERN)
- PERN: PostgreSQL, Express, React, Node.js
  - This repository covers the backend: PostgreSQL (via Sequelize) + Express + Node.js
  - The React frontend lives here: https://github.com/aaronmasm/rest_apis_typescript_frontend
- Language: TypeScript
- Runtime: Node.js
- Framework: Express
- ORM: Sequelize (sequelize-typescript) + PostgreSQL
- Validation: express-validator
- Docs: swagger-jsdoc + swagger-ui-express (OpenAPI 3)
- Logging: morgan
- Env management: dotenv
- Dev: ts-node + nodemon
- Tests: Jest + Supertest

## Requirements
- Node.js and npm installed
- A PostgreSQL database accessible via a single DATABASE_URL connection string

## Environment Variables
Create a .env file in the project root with at least the following variables:

- DATABASE_URL: PostgreSQL connection string
  - Example: postgresql://user:password@host:port/dbname?ssl=true
- FRONTEND_URL: URL allowed by CORS (e.g., http://localhost:5173 for local dev)
- PORT: Optional. Defaults to 5000

Example .env:
```
DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<db>?ssl=true
FRONTEND_URL=http://localhost:5173
# PORT=5000
```

## Installation
1. Clone this repository (this directory is the server backend)
2. Install dependencies
   - npm install
3. Create and configure your .env file (see above)

## Running
- Development (watch mode with ts-node and nodemon):
  - npm run dev
  - The server listens on PORT (defaults to 5000)
  - Entry point: src/index.ts (creates and starts the Express server from src/server.ts)

- Build TypeScript to JavaScript:
  - npm run build
  - Output goes to dist/

- Start compiled build (no start script provided):
  - After building, run: node dist/index.js

## API Docs
- Swagger UI is served at: /docs
- OpenAPI sources are defined in src/config/swagger.ts and annotations in src/router.ts

## Available Scripts
- npm run dev
  - Start the dev server with nodemon and ts-node (src/index.ts)
- npm run build
  - Compile TypeScript to JavaScript into dist/
- npm test
  - Run Jest test suite (ts-jest)
- npm run test:coverage
  - Clear and re-sync the database, then run tests with coverage
- npm run pretest
  - Internal script used by test:coverage to clear the DB using ts-node ./src/data --clear

Notes:
- The pretest script ts-node ./src/data --clear will force a DB sync that drops and recreates tables. Do not point DATABASE_URL to a production database when running tests.

## Testing
- Ensure DATABASE_URL targets a non-production database suitable for destructive operations
- Run:
  - npm test
  - or npm run test:coverage for coverage report
- Tests are written with Jest and Supertest and cover the product endpoints under src/handlers/__tests__/

## Project Structure
Abridged structure highlighting key files and directories:
```
server/
├─ src/
│  ├─ index.ts              # App entry (reads PORT, starts server)
│  ├─ server.ts             # Express app setup, CORS, routes, Swagger, DB connect
│  ├─ router.ts             # Routes + Swagger annotations for /api/products
│  ├─ handlers/
│  │  ├─ product.ts         # Controllers for product CRUD
│  │  └─ __tests__/product.test.ts  # Jest/Supertest tests
│  ├─ config/
│  │  ├─ db.ts              # Sequelize config (uses DATABASE_URL)
│  │  └─ swagger.ts         # OpenAPI/Swagger spec configuration
│  ├─ models/
│  │  └─ Product.model.ts   # Sequelize model (name, price, availability)
│  ├─ middleware/
│  │  └─ index.ts           # Input validation handling
│  └─ data/
│     └─ index.ts           # DB reset utility used by tests
├─ jest.config.js           # Jest + ts-jest configuration
├─ tsconfig.json            # TypeScript configuration (outDir=dist)
├─ package.json             # Scripts and dependencies
├─ LICENSE                  # Project license
└─ README.md                # This file
```

## CORS
- Only requests from FRONTEND_URL are allowed. If origin differs, CORS will reject with an error.

## Database
- Sequelize connects using DATABASE_URL and automatically loads models from src/models
- On startup, the app authenticates and syncs models

## Related Frontend
- Repo: https://github.com/aaronmasm/rest_apis_typescript_frontend
- Live app: https://restapistypescriptfrontend.vercel.app/

## License
This project is licensed under the MIT License. See the LICENSE file for details.
