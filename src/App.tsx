import { useState } from 'react';
import { GlossaryPanel } from './components/GlossaryPanel';
import { MathFramework } from './components/MathFramework';
import { MethodComparisonTable, MethodExplorer } from './components/MethodExplorer';
import { ProtocolRecommender } from './components/ProtocolRecommender';
import { ScenarioPlaybook } from './components/ScenarioPlaybook';
import { StatisticianAppendix } from './components/StatisticianAppendix';
import { ValidationCharts } from './components/ValidationCharts';
import { PIPELINE_ROWS } from './data/methods';
import { TERMS } from './data/terms';
import type { Level } from './data/types';
import type { StrategyMode, WindowMode } from './components/ProtocolRecommender';
import './App.css';

type Section = 'overview' | 'playbook' | 'protocol' | 'methods' | 'glossary' | 'math' | 'statistics';

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
            Backtesting validation from practitioner workflows through formal statistical inference:
            walk-forward analysis, purged CV, block bootstrap, multiplicity corrections, estimands,
            and explicit hypothesis statements.
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
              ['statistics', 'Statistics'],
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
              <p className="muted">
                For model-review rigor, use the Statistics tab: hypothesis table, assumptions
                checklist, and limits of inference.
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

        {section === 'math' && <MathFramework />}

        {section === 'statistics' && <StatisticianAppendix onSelectTerm={jumpToTerm} />}
      </main>

      <footer>
        <p>
          References: Lopez de Prado; Bailey et al.; White; Hansen; Politis & Romano; Lo (2002);
          Fama–MacBeth; Newey–West.
        </p>
      </footer>
    </div>
  );
}
