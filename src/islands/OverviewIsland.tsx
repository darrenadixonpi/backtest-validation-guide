import { lazy, Suspense, useState } from 'react';
import { ProtocolIsland } from './ProtocolIsland';
import { ScenarioPlaybook } from '../components/ScenarioPlaybook';
import { PIPELINE_ROWS } from '../data/methods';

const ValidationCharts = lazy(() =>
  import('../components/ValidationCharts').then((m) => ({ default: m.ValidationCharts })),
);

export function OverviewIsland() {
  function jumpToTerm(id: string) {
    window.location.href = `/glossary/${id}/`;
  }

  return (
    <Suspense fallback={<div className="loading">Loading…</div>}>
      <section className="panel callout">
        <h2>Quick answer: is walk-forward enough without forward testing?</h2>
        <p>
          For reasonable OOS metrics before live trading — yes, if splits are chronological,
          costs are conservative, and you control parameter search. Forward/paper trading
          still validates microstructure (fills, latency) that bar backtests cannot.
          Indicator-only intraday rules with expanding walk-forward fit the lighter protocol;
          add purged nested CV when ML models or large parameter grids enter the pipeline.
        </p>
        <p className="muted">
          For model-review rigor, use the <a href="/statistics/">Statistics</a> tab: hypothesis table,
          assumptions checklist, and limits of inference.
        </p>
      </section>

      <ProtocolIsland />
      <ScenarioPlaybook onSelectTerm={jumpToTerm} />
      <ValidationCharts />

      <section className="panel">
        <div className="panel-head">
          <h2>Validation pipeline</h2>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Step</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {PIPELINE_ROWS.map(([step, role]) => (
                <tr key={step}>
                  <td>{step}</td>
                  <td>{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Suspense>
  );
}
