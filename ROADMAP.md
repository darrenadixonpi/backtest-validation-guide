# Backtest Validation Guide — Roadmap

Living plan for content and product work. Code on `main` is the source of truth for what ships; this file captures intent, checklists, and non-goals so plans survive repo moves and new threads.

**Live site:** https://backtest-validation-guide.vercel.app/  
**Repo:** https://github.com/darrenadixonpi/backtest-validation-guide

---

## Shipped

### App shell

- [x] Vite + React + TypeScript static SPA
- [x] Eight tabs: Overview, Use cases, Protocol builder, Methods, Glossary, Math framework, Statistics, Tools & stack
- [x] Deployed on Vercel (static build from `dist/`)

### Content & UX

- [x] **67 glossary terms** — beginner / professional / math detail levels; category accordion (one section open per selection)
- [x] **Protocol builder** — strategy type, window mode, trials, label horizon, refit; segmented controls
- [x] **Methods explorer** — 8 methodologies, comparison table, charts
- [x] **Use-case playbooks** — scenario cards with glossary links
- [x] **Math framework** — estimands, purge with \(L_f\), Sharpe inference (Lo, non-normal, DSR), bias decomposition
- [x] **Statistics appendix** — hypothesis tests table, assumptions checklist, “what this does NOT prove”, panel / factor methods
- [x] **Tools & stack** — by validation step, tool catalog, languages, use-case stacks (`src/data/tools.ts`)
- [x] **KaTeX rendering** — `$...$` delimiter model, `MathNote` / `MathMixed` / `MathBlock` / `MathDisplay` (see [docs/CONTENT.md](./docs/CONTENT.md))
- [x] **Glossary navigation** — links from Statistics, Methods, playbooks expand target category and collapse others
- [x] **Feedback (Phase 1)** — “Suggest an edit” pre-filled GitHub Issue links (`src/utils/feedback.ts`, toolbar + per-term glossary link)
- [x] **Hash deep linking** — `#section/detail` URLs; back/forward button support; shareable links to terms and methods
- [x] **ARIA tablist keyboard nav** — `useTabList` hook; arrow keys, Home/End across Statistics and Tools sub-tabs
- [x] **Code splitting** — `React.lazy` per tab; `manualChunks` for KaTeX, Recharts, React vendor bundles
- [x] **ESLint** — typescript-eslint + react-hooks; 0 errors; wired to `npm run lint`
- [x] **GitHub Actions CI** — tsc + lint + build on every push/PR to main (`./github/workflows/ci.yml`)
- [x] **Meta / Open Graph tags** — description, og:title/description/image, twitter:card in `index.html`

### Data files (edit content here)

| File | Contents |
|------|----------|
| `src/data/terms.ts` | Glossary entries |
| `src/data/statistician.ts` | Hypothesis table, assumptions, limits, panel stats, math blocks |
| `src/data/methods.ts` | Validation methods |
| `src/data/scenarios.ts` | Use-case playbooks |
| `src/data/tools.ts` | Tools & stack guides |

---

## P0 — Polish & correctness

| Item | Notes |
|------|--------|
| README / docs sync | Keep term counts and tab list aligned with app |
| Spot-check math rendering | Glossary math level + Statistics table after content edits |
| Mobile glossary layout | Sticky detail + list scroll; verify on narrow viewports |
| GitHub issue label | Optional `suggestion` label in repo for feedback prefill URLs |

---

## P1 — Content depth

| Item | Notes |
|------|--------|
| Glossary cross-links | More “related term” coverage where concepts overlap |
| Tools catalog maintenance | `lastReviewed`-style notes if tools churn |
| Statistics table copy | Keep hypothesis / bootstrap columns aligned with `$...$` conventions |
| Panel / factor expansion | More Fama–MacBeth / cluster examples if users ask |

---

## P2 — Feedback (Phase 2, optional)

| Item | Notes |
|------|--------|
| Serverless submit endpoint | Vercel function + GitHub API — one-click submit without opening GitHub |
| Spam / rate limits | Basic protection if public form is added |
| Keep Phase 1 links | Issue prefill remains fallback |

---

## P3 — Platform (optional)

| Item | Notes |
|------|--------|
| Search across tabs | Global find (glossary has local search only today) |
| Printable / PDF export | Statistics checklist + assumptions for model reviews |
| i18n | Unlikely near-term; content is English-only |

---

## Explicit non-goals

- Live backtesting or data connectors
-