# Content authoring guide

How to write and edit copy so glossary math, statistics tables, and footnotes render correctly. Implementation lives in `src/components/MathDisplay.tsx`.

---

## Components (pick the right one)

| Component | Use for |
|-----------|---------|
| **`MathDisplay`** | Glossary `math` field — may contain multiple clauses separated by `; ` |
| **`MathMixed`** | Inline mixed prose + math (table cells, `<strong>` claims, assumption lines) |
| **`MathNote`** | Paragraph footnotes (`<p class="math-note">` + `MathMixed` inside) |
| **`MathBlock`** | Full display equations (Math framework, panel LaTeX arrays) — one line = one KaTeX block |

Plain React text (no component) is fine for beginner/professional glossary levels and static UI labels.

---

## Golden rule: `$...$` delimiters

**English stays outside. Math goes inside `$...$`.**

```text
Require $X_t$ to be $F_t$-measurable; forbid $X_t$ depending on $\{r_s : s > t\}$.
```

Why: KaTeX collapses whitespace inside math mode. Splitting prose and math at render time preserves normal spacing and avoids subscripts eating words (`X_t` + `measurable` → `X_tmeasurable`).

### Do

- Wrap symbols, formulas, and subscripts: `$H_0$`, `$\widehat{SR}$`, `$L \to \infty$`
- Use `$R_{\mathrm{OOS}}$` when OOS is part of a **symbol**
- Use plain text for acronyms in prose: `OOS returns`, `FWER controlled`, `PBO`, `SR` (not `$OOS$` in sentences)
- Use Unicode arrows in prose: `→` (not `$\rightarrow$` in table copy)
- Use `$...$` inside glossary `math` fields and statistician strings consumed by `MathMixed` / `MathNote`

### Don’t

- Wrap whole paragraphs in one `$...$` block
- Wrap acronyms alone in `$...$` unless they are variables in a formula
- Rely on auto-segmentation for new content (legacy fallback only)
- Use `\text{...}` for long English sentences when `$...$` + prose spans is clearer

---

## Glossary `math` field

- File: `src/data/terms.ts`
- Clauses separated by **`; `** (semicolon + space) → separate formula blocks
- Each clause: mix `$...$` segments with plain English, or a single `$...$` formula
- Semicolons inside `Score(...; ...)` are protected by the renderer — prefer `\mid` in pure LaTeX: `Score(\theta \mid T_{\mathrm{train}})`

**Example:**

```typescript
math: 'Features $X_t$ measurable w.r.t. $F_{t,\\mathrm{session}}$; reset state at each $t_{\\mathrm{open}}$.',
```

---

## Statistics appendix (`src/data/statistician.ts`)

| Field | Component | Notes |
|-------|-----------|--------|
| `HYPOTHESIS_TESTS.*` | `MathMixed` | Null / statistic / bootstrap / rejection columns |
| `ASSUMPTIONS.*` | `MathMixed` | assumption, whyItMatters, howToCheck |
| `NOT_PROVE.*` | `MathMixed` + `MathNote` | claim inline; why as footnote paragraph |
| `PANEL_STATS.notes` | `MathNote` | |
| `*.latex` arrays | `MathBlock` | Pure LaTeX lines; `\text{...}` OK inside one display line |
| `ESTIMAND_BLOCKS.*.description`, `*.note` | `MathNote` | |

**Table rows with no math at all** should be plain strings (no `$`, no `\`) — they render as UI text automatically.

---

## Math framework display lines

`MathBlock` lines in `statistician.ts` and inline lines in `MathFramework.tsx` are **full LaTeX** (display mode). Use:

- `\operatorname{rank}_{\mathrm{OOS}}` not `\text{rank}_{OOS}` (subscript on `\text` breaks easily)
- `\infty` is safe (normalizer skips `\in` inside `\infty`)

---

## Normalizer quirks (avoid fighting the pipeline)

`normalizeMathSegment()` runs on every `$...$` segment. Be aware:

- Unicode `θ`, `σ`, `μ`, etc. are converted to LaTeX commands
- `\in` must not corrupt `\infty` (handled in code)
- Bare word `rank` outside `{...}` may become `\operatorname{rank}` — use `\operatorname{rank}` explicitly in formulas
- Trading acronyms in **plain prose** are not auto-math; do not add them to fragile heuristics

---

## Feedback links

- Repo slug: `src/utils/feedback.ts` → `GITHUB_REPO`
- Section labels: `SECTION_LABELS` (must match tab ids in `App.tsx`)
- Glossary term edits pass `termName` + `termId`

Optional: add a `suggestion` label in GitHub and append `&labels=suggestion` to the issue URL template if desired.

---

## Checklist before merging content PRs

- [ ] New glossary `math` strings use `$...$` for all math tokens
- [ ] Statistics strings: acronyms in prose are **not** wrapped in `$...$`
- [ ] `npm run build` passes (TypeScript + Vite)
- [ ] Spot-check in browser: Glossary (math level), Statistics → Hypothesis tests, Math framework → Multiplicity (PBO line)
- [ ] Glossary link from Statistics opens correct category (accordion)

---

## File map (quick reference)

```
src/data/terms.ts          → glossary
src/data/statistician.ts   → statistics + math framework data
src/data/tools.ts          → tools & stack
src/data/methods.ts        → methods explorer
src/data/scenarios.ts      → use cases
src/components/MathDisplay.tsx → rendering
src/components/GlossaryPanel.tsx → term UI + category accordion
```
