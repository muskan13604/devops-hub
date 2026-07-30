# DevOpsHub AI

Production-oriented monorepo skeleton for a React/Vite frontend and a Node.js/Express/MongoDB backend. This repository intentionally contains no product features, routes, database models, or UI implementation yet.

## Repository layout

```text
devopshub-ai/
├── frontend/                 # React + Vite application
├── backend/                  # Express API application
├── packages/                 # Shared, framework-agnostic workspace packages
├── package.json              # Workspace manifest
└── .gitignore
```

## Frontend

```text
frontend/
├── public/                   # Static files served as-is
└── src/
    ├── app/                  # Application bootstrap and provider composition
    ├── assets/               # Imported images, fonts, and other bundled assets
    ├── components/           # Reusable presentational UI components
    ├── config/               # Client-side configuration and environment access
    ├── features/             # Domain-oriented Redux slices, UI, and workflows
    ├── hooks/                # Reusable React hooks
    ├── layouts/              # Shared page shells and layout components
    ├── pages/                # Route-level screens
    ├── routes/               # Route definitions and navigation guards
    ├── services/             # API clients and external-service adapters
    ├── store/                # Redux Toolkit store and typed store helpers
    ├── styles/               # Tailwind entry styles and global CSS
    ├── types/                # Frontend-specific TypeScript types
    └── utils/                # Pure client-side helper functions
```

## Backend

```text
backend/
├── src/
│   ├── api/
│   │   ├── middlewares/      # Express middleware (auth, errors, validation, etc.)
│   │   └── routes/           # HTTP route registration layer
│   ├── config/               # Runtime configuration and environment validation
│   ├── database/             # MongoDB connection and persistence setup
│   ├── modules/              # Self-contained business domains (created as needed)
│   ├── shared/
│   │   ├── constants/        # Cross-module constants
│   │   ├── errors/           # Shared error types and HTTP error mapping
│   │   └── utils/            # Framework-independent server utilities
│   └── types/                # Backend-specific TypeScript types
└── tests/                    # API, integration, and test fixtures
```

Each future `modules/<domain>/` directory should own its controller, service/use-case, repository, validation schema, and model. This keeps HTTP concerns, business rules, and MongoDB access separate.

## Shared packages

```text
packages/
├── config/                   # Shared runtime/tool configuration exports
├── eslint-config/            # Reusable linting presets
└── tsconfig/                 # Reusable TypeScript base configurations
```

Shared packages must stay free of frontend- or Express-specific assumptions unless they are deliberately named for one consumer.

## Technology boundaries

- `frontend`: React, Vite, Tailwind CSS, and Redux Toolkit.
- `backend`: Node.js, Express, and MongoDB.
- `packages`: shared developer tooling and future framework-neutral code only.

