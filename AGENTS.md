# Repository Guidelines

## Project Structure & Module Organization
- `src/app` hosts route segments for the Next.js App Router; `auth` and `(dashboard)` provide isolated layouts, and shared CSS lives in `globals.css`.
- `src/components` contains reusable UI and form primitives; prefer creating new folders with `index.ts` exports and register shared atoms through `components.json`.
- `src/lib` stores cross-cutting helpers such as data transformers or service clients, while static assets (favicons, images) belong in `public/`.

## Build, Test & Development Commands
- `npm install` installs dependencies; rerun after pulling component updates.
- `npm run dev` launches the Next.js dev server at `http://localhost:3000`, hot-reloading the `src/app` tree.
- `npm run build` produces the production bundle; run it before submitting PRs to surface App Router warnings.
- `npm run lint` executes ESLint with the Next.js core-web-vitals preset; use `npx prettier --check "src/**/*.{ts,tsx}"` to enforce formatting.

## Coding Style & Naming Conventions
- Follow TypeScript with strict typing; keep client components explicitly marked with "use client".
- Use two-space indentation, trailing commas, and double quotes ("), matching Prettier defaults in the existing files.
- Name React components and exported hooks in `PascalCase`, local utility functions in `camelCase`, and route directories with kebab-case segments.

## Testing Guidelines
- No automated tests ship yet; when adding coverage, prefer Jest plus React Testing Library and colocate specs as `ComponentName.test.tsx` near the source.
- Stub Next.js APIs with `next/test-utils`, and verify form validation flows with zod schemas.
- Gate PRs on `npm run lint` and future `npm test` once configured; snapshot UI components sparingly.

## Commit & Pull Request Guidelines
- Follow the current history’s imperative, lowercase style (e.g., `add auth pages with own layout`) and keep the first line under 72 characters.
- Group related changes per commit; format and lint before staging to avoid noisy diffs.
- Pull requests should outline the problem, the solution, and manual verification steps; attach UI screenshots for visible updates and reference issue IDs where applicable.
