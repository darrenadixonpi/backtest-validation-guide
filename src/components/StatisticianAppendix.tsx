import { useMemo, useState } from 'react';
import { PrintChecklistButton } from './PrintChecklist';
import { useTabList } from '../hooks/useTabList';
import { MathBlock, MathMixed, MathNote } from './MathDisplay';
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
  checked: Record<string, boolean>;
  onChecked: (v: Record<string, boolean>) => void;
};

type SubSection = 'hypotheses' | 'assumptions' | 'limits' | 'panel';
const SUB_TABS: readonly SubSection[] = ['hypotheses', 'assumptions', 'limits', 'panel'];

export function StatisticianAppendix({ onSelectTerm, checked, onChecked }: Props) {
  const [sub, setSub] = useState<SubSection>('hypotheses');
  const { listRef, getTabProps, getPanelProps } = useTabList(SUB_TABS, sub, setSub);

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

      <div className="sub-tabs" role="tablist" aria-label="Statistics sections" ref={listRef}>
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
            className={sub === id ? 'sub-tab active' : 'sub-tab'}
            onClick={() => setSub(id)}
            {...getTabProps(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {sub === 'hypotheses' && (
        <div {...getPanelProps('hypotheses')}>
          <div className="table-wrap">
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Null hypothesis <MathMixed text="$H_0$" /></th>
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
                    <td><MathMixed text={row.nullHypothesis} /></td>
                    <td><MathMixed text={row.statistic} /></td>
                    <td><MathMixed text={row.bootstrapOrNull} /></td>
                    <td><MathMixed text={row.rejectionMeans} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {sub === 'assumptions' && (
        <div {...getPanelProps('assumptions')}>
          <div className="assumption-progress">
            <span>Documented checks: <strong>{checkedCount}</strong> / {ASSUMPTIONS.length}</span>
            <PrintChecklistButton checked={checked} />
          </div>
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
                        onChange={(e) => onChecked({ ...checked, [a.id]: e.target.checked })}
                      />
                      <span className="assumption-text">
                        <strong>
                          <MathMixed text={a.assumption} />
                        </strong>
                        <span className="muted">
                          <MathMixed text={a.whyItMatters} />
                        </span>
                        <span className="check-hint">
                          Check: <MathMixed text={a.howToCheck} />
                        </span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {sub === 'limits' && (
        <div {...getPanelProps('limits')}>
          <ul className="limits-list">
            {NOT_PROVE.map((item) => (
              <li key={item.claim}>
                <strong>
                  <MathMixed text={item.claim} />
                </strong>
                <MathNote text={item.why} />
              </li>
            ))}
          </ul>
        </div>
      )}

      {sub === 'panel' && (
        <div {...getPanelProps('panel')} className="panel-stats">
          <p className="muted">{PANEL_STATS.title}</p>
          {PANEL_STATS.blocks.map((b) => (
            <article key={b.heading} className="panel-stat-block">
              <h3>{b.heading}</h3>
              <MathBlock compact lines={b.latex} />
            </article>
          ))}
          <h3>Notes</h3>
          <ul>
            {PANEL_STATS.notes.map((n) => (
              <li key={n}>
                <MathNote text={n} className="math-note panel-stat-note" />
              </li>
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
