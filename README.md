# Grammaroll (SPA)

Cute, child-friendly grammar practice web app for identifying **complete subjects** and **complete predicates**.  
Built with **Vite + React + TypeScript**, deployable on **GitHub Pages** for $0.

## Quick start
```bash
npm install
npm run dev
```

Open http://localhost:5173

## Deploy to GitHub Pages
1. Edit the `homepage` URL in `package.json` (optional for gh-pages) and set the Vite base via env when building:
   - **Option A (recommended)**: set env once in your terminal before deploy
     ```bash
     export VITE_BASE=/eleanor-grammar/
     ```
     (replace with your repo name)
2. Build and deploy:
```bash
npm run deploy
```
This runs `npm run build` then publishes `dist/` to the `gh-pages` branch.

## Structure
- `src/data/bank.ts` – 5th-grade sentence bank with ground-truth spans
- `src/lib/scoring.ts` – IoU scoring + helpers
- `src/components/*` – Token chips, mode toggle, feedback card
- `src/App.tsx` – practice screen

## Notes
- Everything runs in-browser; no server needed.
- Later you can add an API for LLM generation as a Netlify/Vercel function.
