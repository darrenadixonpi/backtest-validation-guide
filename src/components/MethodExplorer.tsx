import { METHODS } from '../data/methods';
import { termById } from '../data/terms';

type Props = {
  selectedMethodId: string;
  onSelectMethod: (id: string) => void;
  onSelectTerm: (id: string) => void;
};

export function MethodExplorer({ selectedMethodId, onSelectMethod, onSelectTerm }: Props) {
  const method = METHODS.find((m) => m.id === selectedMethodId) ?? METHODS[1];

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Method explorer</h2>
      </div>
      <div className="segmented method-picker" role="group" aria-label="Select methodology">
        {METHODS.map((m) => (
          <button
            key={m.id}
            type="button"
            className={selectedMethodId === m.id ? 'segment active' : 'segment'}
            onClick={() => onSelectMethod(m.id)}
          >
            {m.name}
          </button>
        ))}
      </div>

      <div className="method-card">
        <div className="method-meta">
          <span className="badge">{method.category}</span>
          <p>{method.whenToUse}</p>
          <p className="muted">Assumptions: {method.assumptions}</p>
        </div>
        <div className="tag-row">
          {method.pros.map((p) => (
            <span key={p} className="tag good">
              + {p}
            </span>
          ))}
          {method.cons.map((c) => (
            <span key={c} className="tag warn">
              − {c}
            </span>
          ))}
        </div>
        <div className="related">
          <span className="muted">Key terms:</span>
          {method.relatedTerms.map((id) => {
            const t = termById(id);
            return t ? (
              <button key={id} type="button" className="chip" onClick={() => onSelectTerm(id)}>
                {t.name}
              </button>
            ) : null;
          })}
        </div>
      </div>
    </section>
  );
}

export function MethodComparisonTable() {
  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Methodology comparison</h2>
        <p className="muted">What each approach estimates and how it handles leakage.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Method</th>
              <th>Primary estimand</th>
              <th>Leakage control</th>
              <th>Many params?</th>
              <th>Output</th>
            </tr>
          </thead>
          <tbody>
            {METHODS.map((m) => (
              <tr key={m.id}>
                <td>{m.name}</td>
                <td>{m.estimand}</td>
                <td>{m.leakageControl}</td>
                <td>{m.handlesManyParams}</td>
                <td>{m.outputType}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
