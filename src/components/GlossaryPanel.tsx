import { useMemo } from 'react';
import type { Level, Term } from '../data/types';
import { CATEGORIES } from '../data/types';
import { TERMS, termById } from '../data/terms';
import { MathDisplay } from './MathDisplay';

type Props = {
  level: Level;
  search: string;
  onSearch: (v: string) => void;
  selectedTermId: string;
  onSelectTerm: (id: string) => void;
};

function displayLevel(term: Term, level: Level): Level {
  if (level === 'math' && !term.math) return 'professional';
  return level;
}

function termText(term: Term, level: Level) {
  if (level === 'beginner') return term.beginner;
  if (level === 'math') return term.math ?? term.professional;
  return term.professional;
}

export function GlossaryPanel({ level, search, onSearch, selectedTermId, onSelectTerm }: Props) {
  const q = search.trim().toLowerCase();

  const filtered = useMemo(() => {
    return TERMS.filter(
      (t) =>
        !q ||
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.aliases?.some((a) => a.toLowerCase().includes(q)) ||
        t.beginner.toLowerCase().includes(q) ||
        t.professional.toLowerCase().includes(q),
    );
  }, [q]);

  const active = termById(selectedTermId) ?? TERMS[0];
  const badgeLevel = displayLevel(active, level);

  const byCategory = CATEGORIES.map((cat) => ({
    cat,
    items: filtered.filter((t) => t.category === cat),
  })).filter((g) => g.items.length > 0);

  return (
    <section className="panel glossary">
      <div className="panel-head">
        <h2>Glossary</h2>
        <p className="muted">{filtered.length} of {TERMS.length} terms</p>
      </div>

      <input
        className="search"
        type="search"
        placeholder="Search terms, aliases, categories…"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <div className="glossary-grid">
        <div className="term-list">
          {byCategory.map(({ cat, items }) => (
            <details key={cat} open={!!q || cat === 'Foundations' || cat === 'Strategy & Data'}>
              <summary>
                {cat} <span className="count">{items.length}</span>
              </summary>
              <ul>
                {items.map((t) => (
                  <li key={t.id}>
                    <button
                      type="button"
                      className={selectedTermId === t.id ? 'term-btn active' : 'term-btn'}
                      onClick={() => onSelectTerm(t.id)}
                    >
                      {t.name}
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        <article className="term-detail">
          <header>
            <h3>{active.name}</h3>
            <span className="badge">{badgeLevel}</span>
          </header>
          {active.aliases && active.aliases.length > 0 && (
            <p className="aliases">Also called: {active.aliases.join(', ')}</p>
          )}
          {level === 'math' && !active.math && (
            <p className="hint">
              No closed-form estimand — scenario/diagnostic family. Showing professional definition.
            </p>
          )}
          {level === 'math' && active.math ? (
            <MathDisplay text={active.math} />
          ) : (
            <p className="term-body">{termText(active, level)}</p>
          )}
          {level !== 'math' && active.math && (
            <p className="hint">Switch to Math detail level (or open Math framework tab) for notation.</p>
          )}
          {active.related.length > 0 && (
            <div className="related">
              <span className="muted">Related:</span>
              {active.related.map((id) => {
                const r = termById(id);
                return r ? (
                  <button key={id} type="button" className="chip" onClick={() => onSelectTerm(id)}>
                    {r.name}
                  </button>
                ) : null;
              })}
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
