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

- [x] **60 glossary terms** — beginner / professional / math detail levels; category accordion (one section open per selection)
- [x] **Protocol builder** — strategy type, window mode, trials, label horizon, refit; segmented controls
- [x] **Methods explorer** — 8 methodologies, comparison table, charts
- [x] **Use-case playbooks** — scenario cards with glossary links
- [x] **Math framework** — estimands, purge with \(L_f\), Sharpe inference (Lo, non-normal, DSR), bias decomposition
- [x] **Statistics appendix** — hypothesis tests table, assumptions checklist, “what this does NOT prove”, panel / factor methods
- [x] **Tools & stack** — by validation step, tool catalog, languages, use-case stacks (`src/data/tools.ts`)
- [x] **KaTeX rendering** — `$...$` delimiter model, `MathNote` / `MathMixed` / `MathBlock` / `MathDisplay` (see [docs/CONTENT.md](./docs/CONTENT.md))
- [x] **Glossary navigation** — links from Statistics, Methods, playbooks expand target category and collapse others
- [x] **Feedback (Phase 1)** — “Suggest an edit” pre-filled GitHub Issue links (`src/utils/feedback.ts`, toolbar + per-term glossary link)

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
- Broker / vendor integrations
- User accounts or saved protocol state
- Claiming certification or regulatory sign-off
- Replacing primary sources (Lopez de Prado, Bailey, etc.) — we link and summarize

---

## How to suggest work

Use **Suggest an edit** in the app (opens a GitHub issue with section context) or open an issue on the repo directly. For content changes, prefer editing `src/data/*` and following [docs/CONTENT.md](./docs/CONTENT.md).

---

## Related project

**[AI Stack Map](https://github.com/darrenadixonpi/AI-stack-map)** — separate product (AI tooling landscape). UX inspired by this guide; validation content stays here.
