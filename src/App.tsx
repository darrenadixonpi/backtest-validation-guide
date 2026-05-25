import { useState } from 'react';
import { GlossaryPanel } from './components/GlossaryPanel';
import { MethodComparisonTable, MethodExplorer } from './components/MethodExplorer';
import { ProtocolRecommender } from './components/ProtocolRecommender';
import { ScenarioPlaybook } from './components/ScenarioPlaybook';
import { ValidationCharts } from './components/ValidationCharts';
import { PIPELINE_ROWS } from './data/methods';
import { TERMS } from './data/terms';
import type { Level } from './data/types';
import type { StrategyMode, WindowMode } from './components/ProtocolRecommender';
import './App.css';

type Section = 'overview' | 'playbook' | 'protocol' | 'methods' | 'glossary' | 'math';

const LEVELS: Level[] = ['beginner', 'professional', 'math'];

export default function App() {
  const [section, setSection] = useState<Section>('overview');
  const [level, setLevel] = useState<Level>('beginner');
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState('backtesting');
  const [selectedMethod, setSelectedMethod] = useState('wfa');
  const [strategyMode, setStrategyMode] = useState<StrategyMode>('indicator');
  const [windowMode, setWindowMode] = useState<WindowMode>('expanding');
  const [trials, setTrials] = useState<'few' | 'many'>('few');
  const [horizon, setHorizon] = useState<'zero' | 'positive'>('zero');
  const [refit, setRefit] = useState(true);

  const jumpToTerm = (id: string) => {
    setSelectedTerm(id);
    setSection('glossary');
  };

  const protocolProps = {
    strategyMode,
    windowMode,
    trials,
    horizon,
    refit,
    onStrategyMode: setStrategyMode,
    onWindowMode: setWindowMode,
    onTrials: setTrials,
    onHorizon: setHorizon,
    onRefit: setRefit,
  };

  return (
    <div className="app">
      <header className="hero">
        <div>
          <p className="eyebrow">Interactive reference</p>
          <h1>Financial Time-Series Validation Guide</h1>
          <p className="lede">
            Backtesting validation from first principles through professional practice: walk-forward
            analysis, purged CV, block bootstrap, and multiplicity corrections. Use Beginner /
            Professional / Math detail levels; the Math framework tab covers unified notation.
          </p>
        </div>
        <div className="stats">
          <div>
            <strong>{TERMS.length}</strong>
            <span>terms</span>
          </div>
          <div>
            <strong>8</strong>
            <span>methodologies</span>
          </div>
          <div>
            <strong>3</strong>
            <span>detail levels</span>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <nav className="tabs" aria-label="Sections">
          {(
            [
              ['overview', 'Overview'],
              ['playbook', 'Use cases'],
              ['protocol', 'Protocol builder'],
              ['methods', 'Methods'],
              ['glossary', 'Glossary'],
              ['math', 'Math framework'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={section === id ? 'tab active' : 'tab'}
              onClick={() => setSection(id)}
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="level-bar">
          <span>Detail:</span>
          {LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              className={level === l ? 'level active' : 'level'}
              onClick={() => setLevel(l)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>

      <main>
        {section === 'overview' && (
          <>
            <section className="panel callout">
              <h2>Quick answer: is walk-forward enough without forward testing?</h2>
              <p>
                For reasonable OOS metrics before live trading — yes, if splits are chronological,
                costs are conservative, and you control parameter search. Forward/paper trading
                still validates microstructure (fills, latency) that bar backtests cannot.
                Indicator-only intraday rules with expanding walk-forward fit the lighter protocol;
                add purged nested CV when ML models or large parameter grids enter the pipeline.
              </p>
            </section>

            <ProtocolRecommender {...protocolProps} />
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
          </>
        )}

        {section === 'playbook' && <ScenarioPlaybook onSelectTerm={jumpToTerm} />}

        {section === 'protocol' && <ProtocolRecommender {...protocolProps} />}

        {section === 'methods' && (
          <>
            <MethodComparisonTable />
            <MethodExplorer
              selectedMethodId={selectedMethod}
              onSelectMethod={setSelectedMethod}
              onSelectTerm={jumpToTerm}
            />
            <ValidationCharts />
          </>
        )}

        {section === 'glossary' && (
          <GlossaryPanel
            level={level}
            search={search}
            onSearch={setSearch}
            selectedTermId={selectedTerm}
            onSelectTerm={setSelectedTerm}
          />
        )}

        {section === 'math' && (
          <section className="panel math-panel">
            <div className="panel-head">
              <h2>Unified mathematical framework</h2>
              <p className="muted">
                Condensed notation — use Glossary → Math level for term-by-term definitions.
              </p>
            </div>

            <div className="math-blocks">
              <article>
                <h3>Setup</h3>
                <pre>{`s_t(θ) = w_{t-1}(θ) r_t − c_t
SR(θ) = μ(θ) / σ(θ)
θ̂ = argmax_{θ∈Θ} Score(θ; T_train)`}</pre>
              </article>

              <article>
                <h3>Leakage condition (labels)</h3>
                <pre>{`y_t = h(r_{t+1}, …, r_{t+H})
Leak if ∃ t ∈ T_train, τ ∈ T_test : t < τ ≤ t+H`}</pre>
              </article>

              <article>
                <h3>Purged training set</h3>
                <pre>{`T_k^purged = { t : [t, t+H] ∩ V_k = ∅ }
+ embargo E around test fold`}</pre>
              </article>

              <article>
                <h3>Walk-forward</h3>
                <pre>{`θ̂_k fit on T_k ; evaluate on V_k
max(T_k) < min(V_k)
Rolling: |T_k| = L fixed
Expanding: T_k = {1,…,b_k}`}</pre>
              </article>

              <article>
                <h3>Bias decomposition</h3>
                <pre>{`SR̂_IS(θ̂) − SR*(θ̂) =
  [SR̂_IS − SR̂_OOS] + [SR̂_OOS − SR*]
   leakage/overfit      estimation error`}</pre>
              </article>

              <article>
                <h3>Multiplicity</h3>
                <pre>{`PBO = P(IS-best θ ranks below median OOS)
DSR: deflated SR after M trials
SPA / Reality Check: max_m √T d̄_m bootstrap`}</pre>
              </article>
            </div>

            <p className="hint">
              The Formulas toggle was removed — Math level (toolbar) and this tab cover notation.
            </p>
          </section>
        )}
      </main>

      <footer>
        <p>
          References: Lopez de Prado (purged CV, CPCV); Bailey et al. (PBO, DSR); White (Reality
          Check); Hansen (SPA); Politis & Romano (block bootstrap).
        </p>
      </footer>
    </div>
  );
}
