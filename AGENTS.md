# Repository Guidelines

## Project Structure & Module Organization
- `src/components/`:
  React UI components (e.g., `ModeToggle.tsx`, `FeedbackCard.tsx`).
- `src/lib/`:
  Pure logic and helpers (e.g., `scoring.ts`).
- `src/data/`:
  Static content and sample items (e.g., `bank.ts`).
- `src/assets/`:
  Images and static assets (e.g., `logo.svg`).
- Entrypoints: `index.html`, `src/main.tsx`, app shell `src/App.tsx`.
- Tooling: `vite.config.ts`, `tsconfig.json`, `package.json`.

## Build, Test, and Development Commands
- `npm run dev`:
  Start Vite dev server with HMR at `http://localhost:5173`.
- `npm run build`:
  Type-check (`tsc`) and bundle for production to `dist/`.
- `npm run preview`:
  Serve the production build locally.
- `npm run deploy`:
  Build then publish `dist/` to the `gh-pages` branch via `gh-pages`.
  Tip: set `VITE_BASE=/your-repo/` before building for GitHub Pages.

## Coding Style & Naming Conventions
- Language: TypeScript + React 18; strict mode enabled.
- Indentation: 2 spaces; keep lines focused and self-explanatory.
- Components: PascalCase filenames (`TokenChips.tsx`).
- Utilities/data: lowercase filenames (`scoring.ts`, `bank.ts`).
- Props, variables, and functions: `camelCase`.
- CSS: colocated global styles in `src/index.css`.

## Testing Guidelines
- No test runner is configured yet. If adding tests, prefer Vitest + React Testing Library.
- Co-locate tests next to sources using `*.test.ts`/`*.test.tsx`.
- Aim for fast, deterministic unit tests around `src/lib/` (e.g., IoU calculations) and component behavior.

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits when possible (`feat:`, `fix:`, `chore:`, `docs:`). Keep messages imperative and scoped.
- PRs: include a concise summary, screenshots/GIFs for UI changes, and linked issues.
- Scope: small, reviewable changes; keep UI/logic refactors separate from content updates.
- Checks: ensure `npm run build` passes and the app runs locally.

## Security & Configuration Tips
- Do not commit secrets. GitHub Pages deploys are static; dynamic keys are unnecessary.
- For Pages deploys, set `VITE_BASE` (e.g., `/grammaroll-spa/`) so asset paths resolve correctly.
