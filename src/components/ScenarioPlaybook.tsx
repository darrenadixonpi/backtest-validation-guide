import { SCENARIOS } from '../data/scenarios';
import { termById } from '../data/terms';

type Props = {
  onSelectTerm: (id: string) => void;
};

export function ScenarioPlaybook({ onSelectTerm }: Props) {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Scenario playbook</h2>
        <p className="muted">
          Common validation paths by research stage — indicator rules, parameter grids, ML pipelines,
          and cross-sectional work.
        </p>
      </div>

      <div className="scenario-grid">
        {SCENARIOS.map((s) => (
          <article key={s.id} className="scenario-card">
            <h3>{s.title}</h3>
            <p className="scenario-context">{s.context}</p>
            <h4>Validation</h4>
            <ul>
              {s.validation.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
            <h4>Watchouts</h4>
            <ul className="watchouts">
              {s.watchouts.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <div className="related">
              <span className="muted">Terms:</span>
              {s.relatedTerms.map((id) => {
                const t = termById(id);
                return t ? (
                  <button key={id} type="button" className="chip" onClick={() => onSelectTerm(id)}>
                    {t.name}
                  </button>
                ) : null;
              })}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
