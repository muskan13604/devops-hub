# DevOpsHub AI Frontend

React/Vite dashboard with Tailwind CSS, Redux Toolkit, Axios, React Query, React Router, and JWT session handling.

Copy `.env.example` to `.env`, install workspace packages with `pnpm install`, then run `pnpm --dir frontend dev`.

The access token remains in Redux memory. The backend issues and rotates the refresh token in an HttpOnly cookie; Axios refreshes expired access tokens automatically.
