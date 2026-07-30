# DevOpsHub AI Backend

Clean-architecture Express server foundation with no authentication or product features.

## Layers

- `src/config`: loads and validates environment settings.
- `src/database`: owns the MongoDB client connection lifecycle.
- `src/api`: Express routes and HTTP middleware.
- `src/modules`: reserved for future domain modules.
- `src/shared`: reusable errors and framework-neutral utilities.
- `src/app.js`: composes HTTP middleware and routes.
- `src/server.js`: starts and gracefully stops the process.

## Setup

1. Copy `.env.example` to `.env` and configure MongoDB.
2. From the repository root, run `pnpm install`.
3. Run `pnpm --dir backend dev`.

Use `GET /api/health` to confirm both the server and MongoDB connection are healthy.
