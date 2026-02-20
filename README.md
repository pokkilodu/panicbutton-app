# Adaptive Exam Prep — Static Demo

This is a static, client-side demo of an AI-powered adaptive exam preparation platform. It is designed to be served from GitHub Pages and uses `localStorage` as a lightweight database for demonstration.

Key features in this demo:
- Adaptive study engine with phase timings (theory, reinforcement, mindmap, diagrams, summary)
- Lightweight AI utilities: chapter summarization, formula extraction, mindmap & diagram SVG generation
- Mock test simulator with auto-evaluation and performance stored in `localStorage`
- Simple analytics and 5-year trend SVG
- Pink-blue gradient, glassmorphism UI, responsive layout, dark-mode support

Quickstart (local):
1. Open `index.html` in a browser.
2. Click "Add Sample Subject" to seed data (or reload to auto-seed).
3. Use "Start Adaptive Session" or "Start Mock Test" to see flow.

Deploy to GitHub Pages:
- Create a repo and push the contents of this folder.
- Enable GitHub Pages from repository settings (branch: `main` or `gh-pages`).

Files added:
- `index.html` — main SPA shell
- `css/styles.css` — styling (gradient, glassmorphism, dark mode)
- `js/models.js` — localStorage models & helpers
- `js/ai.js` — demo AI utils (summaries, formulas, SVG generators)
- `js/engine.js` — adaptive study engine
- `js/analytics.js` — analytics helpers and trend renderer
- `js/app.js` — application glue and demo flows

Notes:
- This is a front-end demo; AI modules are simplistic heuristics. For production integrate server-side AI (OpenAI/LLM) and a real backend database.
- Timing values in the UI are in minutes. For quick demo timers are scaled down in `js/app.js` (DEMO_SPEED).
# panicbutton-app
Ai-Exam helper
