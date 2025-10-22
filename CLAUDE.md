# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Grammaroll** is a child-friendly grammar practice web app for identifying complete subjects and complete predicates in sentences. Built as a single-page application with Vite + React + TypeScript, designed to run entirely in-browser with zero backend dependencies.

## Development Commands

```bash
# Start dev server with HMR at http://localhost:5173
npm run dev

# Type-check and build for production to dist/
npm run build

# Preview production build locally
npm run preview

# Build and deploy to GitHub Pages (via gh-pages branch)
npm run deploy
```

**Note:** Before deploying to GitHub Pages, set `VITE_BASE=/your-repo-name/` in your environment. The GitHub Actions workflow automatically handles this during CI/CD.

## Architecture & Core Concepts

### Data Flow

1. **Sentence Bank** ([src/data/bank.ts](src/data/bank.ts)) contains pre-authored sentences with ground-truth annotations:
   - Each `Sentence` includes tokenized text, correct subject/predicate spans, grammatical tags, and difficulty level
   - Tokens are word-level strings; spans are token index arrays

2. **Scoring Logic** ([src/lib/scoring.ts](src/lib/scoring.ts)) uses Intersection-over-Union (IoU) to grade student selections:
   - Filters out punctuation tokens for fairness
   - Requires 80% IoU threshold on both subject and predicate to pass
   - Generates contextual tips based on common error patterns (e.g., crossing the main verb boundary)

3. **App State** ([src/App.tsx](src/App.tsx)) manages a three-step workflow:
   - Step 0: Select complete subject
   - Step 1: Select complete predicate
   - Step 2: Review feedback
   - Mode toggle controls which span the user is currently selecting

### Component Structure

- **[TokenChips](src/components/TokenChips.tsx)**: Renders clickable token buttons with visual states (selected subject/predicate, verb hint)
- **[FeedbackCard](src/components/FeedbackCard.tsx)**: Displays correctness scores, answer key, and educational tips
- **[Celebration](src/components/Celebration.tsx)**: Animated success feedback
- **[ModeToggle](src/components/ModeToggle.tsx)**: UI for switching between subject/predicate selection modes

### Key Design Patterns

- **Token-based selection**: Everything is based on token indices rather than character offsets, simplifying state management
- **Stateless scoring**: The `grade()` function is pure, taking request + sentence item and returning a response
- **Hint system**: Optional "reveal verb" hint shows the main verb (simple predicate) to help students find the split point

## TypeScript Configuration

- **Strict mode enabled**: All strict checks are on
- **Module system**: ESNext with bundler resolution (Vite handles it)
- **Target**: ES2020 for modern browser features
- **No custom path aliases**: Use relative imports

## GitHub Pages Deployment

The project uses **GitHub Actions** ([.github/workflows/pages.yml](.github/workflows/pages.yml)) for automatic deployment:
- Triggers on push to `main`/`master` or manual workflow dispatch
- Automatically sets `VITE_BASE` based on repository name (project pages get `/<repo>/`, user pages get `/`)
- Builds and uploads to GitHub Pages environment (not `gh-pages` branch)

**Manual deployment** via `npm run deploy` still works (uses `gh-pages` package), but requires manually setting `VITE_BASE` first.

## Vite Base Path

The [vite.config.ts](vite.config.ts) reads `process.env.VITE_BASE` to set the base path for assets. This is critical for GitHub Pages:
- Local dev: defaults to `/`
- GitHub Actions: automatically set to `/<repo-name>/` or `/` depending on repo type
- Manual deploy: export `VITE_BASE=/your-repo/` before `npm run deploy`

## Future Extension Points

- **LLM-generated sentences**: The architecture supports adding a serverless function (Netlify/Vercel) to generate new sentences on demand
- **Additional grammar topics**: The `Sentence` type can be extended with new span types (e.g., direct objects, adjective phrases)
- **Progress tracking**: Currently random selection; could add localStorage-based progress or difficulty adaptation
- **Testing**: No test framework configured yet; recommended to add Vitest + React Testing Library for unit tests on scoring logic and component behavior
