# Backtest Validation Guide

Interactive reference for financial time-series validation: walk-forward analysis, purged cross-validation, block bootstrap, and multiplicity corrections (DSR, PBO, SPA).

**Live site:** [backtest-validation-guide.vercel.app](https://backtest-validation-guide.vercel.app/)  
**Repository:** [github.com/darrenadixonpi/backtest-validation-guide](https://github.com/darrenadixonpi/backtest-validation-guide)

**Planning & authoring:** [ROADMAP.md](./ROADMAP.md) · [docs/CONTENT.md](./docs/CONTENT.md)

---

## Run locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

```bash
npm run build    # production build → dist/
npm run preview  # preview dist/
```

---

## Tabs

| Tab | Purpose |
|-----|---------|
| **Overview** | Quick answers, protocol builder snapshot, scenarios, validation pipeline |
| **Use cases** | Scenario playbooks with glossary links |
| **Protocol builder** | Interactive recommendation (strategy type, window, trials, horizon, refit) |
| **Methods** | Eight validation methodologies, comparison table, explorer, charts |
| **Glossary** | 67 terms × beginner / professional / math; searchable; category accordion |
| **Math framework** | Estimands, purge rules, Sharpe inference, bias decomposition |
| **Statistics** | Hypothesis tests, assumptions checklist, limits of inference, panel methods |
| **Tools & stack** | OSS-first tooling by validation step, catalog, languages, use-case stacks |

---

## Content layout

| Path | Contents |
|------|----------|
| `src/data/terms.ts` | Glossary |
| `src/data/statistician.ts` | Statistics appendix + shared math blocks |
| `src/data/methods.ts` | Methods explorer |
| `src/data/scenarios.ts` | Use-case playbooks |
| `src/data/tools.ts` | Tools & stack |
| `src/components/MathDisplay.tsx` | KaTeX: `MathDisplay`, `MathMixed`, `MathNote`, `MathBlock` |

Editing copy or formulas: read **[docs/CONTENT.md](./docs/CONTENT.md)** (`$...$` conventions, which component to use).

---

## Feedback

**Suggest an edit** (toolbar and glossary term detail) opens a pre-filled GitHub issue with section context. Config: `src/utils/feedback.ts`.

---

## Deploy

Static SPA — deploy the `dist/` folder to Vercel or any static host (current production: Vercel, linked to this repo).

---

## References

- Lopez de Prado — purged CV, CPCV, embargo
- Bailey & Lopez de Prado — Deflated Sharpe Ratio; Bailey et al. — PBO
- White (2000) — Reality Check; Hansen (2005) — SPA
- Künsch (1989) — moving block bootstrap; Politis & Romano (1994) — stationary bootstrap; Lo (2002) — Sharpe inference
- Fama–MacBeth; Newey–West — panel / HAC inference

---

## Related project

**[AI Stack Map](https://github.com/darrenadixonpi/AI-stack-map)** — practitioner map of the AI tooling ecosystem (layers, agents, harnesses). UX inspire