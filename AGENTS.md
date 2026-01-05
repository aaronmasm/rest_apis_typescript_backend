# AGENTS.md - Development Guidelines for opencode Agent

This document provides comprehensive guidelines for coding agents working on this Node.js/TypeScript REST API server project. Follow these conventions to maintain code quality and consistency.

## Project Overview

This is a REST API server built with Node.js, TypeScript, Express, and Sequelize ORM with PostgreSQL. The project manages products through a RESTful API with full CRUD operations.

## Build, Lint, and Test Commands

### Development Server

```bash
npm run dev          # Start development server with nodemon and ts-node
```

### Build Commands

```bash
npm run build        # Compile TypeScript to JavaScript (outputs to ./dist)
```

### Testing Commands

```bash
npm test             # Run all tests with Jest
npm run test:coverage # Run tests with coverage report
npm run pretest      # Clear database before tests (runs ts-node ./src/data --clear)
```

### Running Single Tests

```bash
# Run specific test file
npx jest src/handlers/__tests__/product.test.ts

# Run tests matching a pattern
npx jest -t "should create a new product"

# Run tests in watch mode
npx jest --watch

# Run tests for a specific test suite
npx jest -t "GET /api/products"
```

### Linting and Formatting

```bash
# No linting tools configured - use TypeScript compiler for type checking
npx tsc --noEmit     # Type check without emitting files

# Format code with Prettier (if needed)
npx prettier --write "src/**/*.{ts,tsx}"
```

## Code Style Guidelines

### TypeScript Configuration

- **Strict mode**: Currently disabled (`"strict": false`) but should be enabled for better type safety
- **Target**: ESNext with NodeNext module resolution
- **Decorators**: Enabled for Sequelize model decorators
- **Source maps**: Enabled for debugging

### Import Organization

```typescript
// External libraries first
import express from "express";
import colors from "colors";
import cors, { CorsOptions } from "cors";

// Internal imports
import router from "./router";
import db from "./config/db";

// express-validator imports
import { body, param } from "express-validator";
```

### Naming Conventions

#### Files and Directories

- **Source files**: `src/` directory with `.ts` extension
- **Test files**: `__tests__/` subdirectory with `.test.ts` extension
- **Models**: `PascalCase` with `.model.ts` suffix (e.g., `Product.model.ts`)
- **Handlers/Controllers**: `camelCase.ts` (e.g., `product.ts`)
- **Configuration**: `camelCase.ts` (e.g., `db.ts`, `swagger.ts`)

#### Variables and Functions

- **Variables**: `camelCase` (e.g., `productId`, `userName`)
- **Constants**: `UPPER_SNAKE_CASE` (environment variables)
- **Functions**: `camelCase` (e.g., `getProducts`, `createProduct`)
- **Classes/Models**: `PascalCase` (e.g., `Product`)
- **Database columns**: `snake_case` in schema, `camelCase` in code

#### API Routes

- **Base path**: `/api/products`
- **Resource naming**: Plural nouns (`/products`, `/products/:id`)
- **HTTP methods**: RESTful conventions
  - `GET /api/products` - List all products
  - `GET /api/products/:id` - Get single product
  - `POST /api/products` - Create product
  - `PUT /api/products/:id` - Update product
  - `PATCH /api/products/:id` - Partial update (availability toggle)
  - `DELETE /api/products/:id` - Delete product

### Type Annotations

```typescript
// Function parameters with types
export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params; // TypeScript infers string
  // ... rest of function
};

// Sequelize model properties
@Column({
  type: DataType.STRING(100),
})
declare name: string;

@Column({
  type: DataType.FLOAT,
})
declare price: number;
```

### Error Handling Patterns

#### Input Validation

```typescript
// Use express-validator middleware
router.post(
  "/",
  body("name")
    .notEmpty()
    .withMessage("El nombre de Producto no puede ir vacio"),
  body("price")
    .isNumeric()
    .withMessage("Valor no válido")
    .custom((value) => value > 0)
    .withMessage("Precio no válido"),
  handleInputErrors, // Custom middleware to handle validation errors
  createProduct,
);
```

#### Custom Error Middleware

```typescript
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};
```

#### API Error Responses

```typescript
// Consistent error response format
if (!product) {
  return res.status(404).json({ error: "Producto No Encontrado" });
}

// Success responses
res.json({ data: product }); // GET responses
res.status(201).json({ data: product }); // POST responses
```

### Database and Model Patterns

#### Sequelize Model Definition

```typescript
import { Table, Column, Model, DataType, Default } from "sequelize-typescript";

@Table({
  tableName: "products", // snake_case table names
})
class Product extends Model {
  @Column({
    type: DataType.STRING(100),
  })
  declare name: string;

  @Column({
    type: DataType.FLOAT,
  })
  declare price: number;

  @Default(true)
  @Column({
    type: DataType.BOOLEAN,
  })
  declare availability: boolean;
}
```

#### Database Operations

```typescript
// Create
const product = await Product.create(req.body);

// Read
const products = await Product.findAll({ order: [["id", "DESC"]] });
const product = await Product.findByPk(id);

// Update
await product.update(req.body);
await product.save();

// Delete
await product.destroy();
```

### Testing Patterns

#### Test Structure

```typescript
import request from "supertest";
import server from "../../server";

describe("POST /api/products", () => {
  it("should create a new product", async () => {
    const response = await request(server).post("/api/products").send({
      name: "Mouse - testing",
      price: 50,
    });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("data");
  });
});
```

#### Test Naming Conventions

- **Describe blocks**: HTTP method + endpoint (e.g., `"POST /api/products"`)
- **Test cases**: Clear, descriptive names starting with "should"
- **Assertions**: Test both positive and negative cases
- **Status codes**: Verify appropriate HTTP status codes
- **Response structure**: Check for expected properties

### Swagger Documentation

```typescript
/**
 * @swagger
 * /api/products:
 *  post:
 *    summary: Creates a new product
 *    tags:
 *      - Products
 *    description: Return a new record in the database
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: "Monitor Curvo 49 Pulgadas"
 *              price:
 *                type: number
 *                example: 399
 */
```

### Middleware Usage

- **CORS**: Configured with origin validation
- **JSON parsing**: `express.json()` for request body parsing
- **Morgan**: HTTP request logging in development
- **Validation**: express-validator for input sanitization and validation

### Environment Variables

- **Database**: PostgreSQL connection configuration
- **CORS**: Frontend URL validation
- **Other config**: Stored in `.env` file (not committed to git)

### File Structure

```
src/
├── config/          # Database, Swagger configuration
├── handlers/        # Route handlers/controllers
│   └── __tests__/   # Handler tests
├── middleware/      # Custom middleware
├── models/          # Sequelize models
├── data/           # Database utilities/scripts
├── router.ts       # Route definitions
├── server.ts       # Express app configuration
└── index.ts        # Application entry point
```

### Code Quality Practices

#### Avoid

- **Console logs** in production code (comment out for tests)
- **Magic numbers/strings** - use constants or configuration
- **Deep nesting** - extract functions or early returns
- **Mixed languages** - keep comments and strings in Spanish (project convention)

#### Follow

- **Async/await** consistently (no Promises with .then/.catch)
- **Early returns** for error conditions
- **Consistent response formats** across all endpoints
- **Input validation** on all routes that accept data
- **Type safety** - use TypeScript types throughout

### Git Workflow

- **Pre-commit hooks**: Not currently configured but recommended for type checking
- **Commit messages**: Follow conventional commits if adopted
- **Branch naming**: Feature branches for new functionality

This document should be updated as the project evolves and new patterns emerge.
