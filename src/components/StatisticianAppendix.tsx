import { useMemo, useState } from 'react';
import { MathBlock } from './MathDisplay';
import {
  ASSUMPTIONS,
  HYPOTHESIS_TESTS,
  NOT_PROVE,
  PANEL_STATS,
  REFERENCES_EXTENDED,
} from '../data/statistician';
import { termById } from '../data/terms';

type Props = {
  onSelectTerm: (id: string) => void;
};

type SubSection = 'hypotheses' | 'assumptions' | 'limits' | 'panel';

export function StatisticianAppendix({ onSelectTerm }: Props) {
  const [sub, setSub] = useState<SubSection>('hypotheses');
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const assumptionGroups = useMemo(() => {
    const groups = new Map<string, typeof ASSUMPTIONS>();
    for (const a of ASSUMPTIONS) {
      const list = groups.get(a.category) ?? [];
      list.push(a);
      groups.set(a.category, list);
    }
    return [...groups.entries()];
  }, []);

  const checkedCount = Object.values(checked).filter(Boolean).length;

  return (
    <section className="panel stats-panel">
      <div className="panel-head">
        <h2>Statistical appendix</h2>
        <p className="muted">
          Formal estimands, hypotheses, assumptions, and limits of inference — for serious validation
          work and model-review documentation.
        </p>
      </div>

      <div className="sub-tabs" role="tablist" aria-label="Statistics sections">
        {(
          [
            ['hypotheses', 'Hypothesis tests'],
            ['assumptions', 'Assumptions checklist'],
            ['limits', 'What this does NOT prove'],
            ['panel', 'Panel / factor methods'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={sub === id}
            className={sub === id ? 'sub-tab active' : 'sub-tab'}
            onClick={() => setSub(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {sub === 'hypotheses' && (
        <div className="table-wrap">
          <table className="stats-table">
            <thead>
              <tr>
                <th>Method</th>
                <th>Null hypothesis H₀</th>
                <th>Test statistic</th>
                <th>Bootstrap / null mechanism</th>
                <th>If rejected / significant, means…</th>
              </tr>
            </thead>
            <tbody>
              {HYPOTHESIS_TESTS.map((row) => (
                <tr key={row.method}>
                  <td>
                    {row.relatedTermId ? (
                      <button type="button" className="linkish" onClick={() => onSelectTerm(row.relatedTermId!)}>
                        {row.method}
                      </button>
                    ) : (
                      row.method
                    )}
                  </td>
                  <td>{row.nullHypothesis}</td>
                  <td>{row.statistic}</td>
                  <td>{row.bootstrapOrNull}</td>
                  <td>{row.rejectionMeans}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {sub === 'assumptions' && (
        <>
          <p className="assumption-progress">
            Documented checks: <strong>{checkedCount}</strong> / {ASSUMPTIONS.length}
          </p>
          {assumptionGroups.map(([category, items]) => (
            <div key={category} className="assumption-group">
              <h3>{category}</h3>
              <ul className="assumption-list">
                {items.map((a) => (
                  <li key={a.id}>
                    <label>
                      <input
                        type="checkbox"
                        checked={!!checked[a.id]}
                        onChange={(e) => setChecked((prev) => ({ ...prev, [a.id]: e.target.checked }))}
                      />
                      <span className="assumption-text">
                        <strong>{a.assumption}</strong>
                        <span className="muted">{a.whyItMatters}</span>
                        <span className="check-hint">Check: {a.howToCheck}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </>
      )}

      {sub === 'limits' && (
        <ul className="limits-list">
          {NOT_PROVE.map((item) => (
            <li key={item.claim}>
              <strong>{item.claim}</strong>
              <p>{item.why}</p>
            </li>
          ))}
        </ul>
      )}

      {sub === 'panel' && (
        <div className="panel-stats">
          <p className="muted">{PANEL_STATS.title}</p>
          {PANEL_STATS.blocks.map((b) => (
            <article key={b.heading} className="panel-stat-block">
              <h3>{b.heading}</h3>
              <MathBlock lines={b.latex} />
            </article>
          ))}
          <h3>Notes</h3>
          <ul>
            {PANEL_STATS.notes.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <div className="related">
            <span className="muted">Glossary:</span>
            {['factor-model', 'monte-carlo-simulation', 'purged-cv'].map((id) => {
              const t = termById(id);
              return t ? (
                <button key={id} type="button" className="chip" onClick={() => onSelectTerm(id)}>
                  {t.name}
                </button>
              ) : null;
            })}
          </div>
        </div>
      )}

      <footer className="stats-references">
        <h3>Extended references</h3>
        <ul>
          {REFERENCES_EXTENDED.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </footer>
    </section>
  );
}
