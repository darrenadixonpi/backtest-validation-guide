import { useCallback, useEffect, useState } from 'react';
import { GlossaryPanel } from './components/GlossaryPanel';
import { MathFramework } from './components/MathFramework';
import { MethodComparisonTable, MethodExplorer } from './components/MethodExplorer';
import { ProtocolRecommender } from './components/ProtocolRecommender';
import { ScenarioPlaybook } from './components/ScenarioPlaybook';
import { StatisticianAppendix } from './components/StatisticianAppendix';
import { ToolsGuide } from './components/ToolsGuide';
import { FeedbackLink } from './components/FeedbackLink';
import { SECTION_LABELS } from './utils/feedback';
import { ValidationCharts } from './components/ValidationCharts';
import { PIPELINE_ROWS } from './data/methods';
import { TERMS } from './data/terms';
import type { StrategyMode, WindowMode } from './components/ProtocolRecommender';
import type { Level } from './data/types';
import { parseHash, pushHash, type Section } from './utils/hash';
import './App.css';

export default function App() {
  const initial = parseHash(window.location.hash);
  const [section, setSection] = useState<Section>(initial.section);
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(
    initial.section === 'glossary' && initial.detail ? initial.detail : 'backtesting',
  );
  const [selectedMethod, setSelectedMethod] = useState(
    initial.section === 'methods' && initial.detail ? initial.detail : 'wfa',
  );
  const [strategyMode, setStrategyMode] = useState<StrategyMode>('indicator');
  const [windowMode, setWindowMode] = useState<WindowMode>('expanding');
  const [trials, setTrials] = useState<'few' | 'many'>('few');
  const [horizon, setHorizon] = useState<'zero' | 'positive'>('zero');
  const [refit, setRefit] = useState(true);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [glossaryLevel, setGlossaryLevel] = useState<Level>('beginner');

  // Keep URL hash in sync with navigation state
  useEffect(() => {
    const detail = section === 'glossary' ? selectedTerm : section === 'methods' ? selectedMethod : null;
    pushHash(section, detail);
  }, [section, selectedTerm, selectedMethod]);

  // Back/forward button support
  useEffect(() => {
    const onPop = () => {
      const { section: s, detail } = parseHash(window.location.hash);
      setSection(s);
      if (s === 'glossary' && detail) setSelectedTerm(detail);
      if (s === 'methods' && detail) setSelectedMethod(detail);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const jumpToTerm = useCallback((id: string) => {
    setSelectedTerm(id);
    setSection('glossary');
  }, []);

  const navigate = useCallback((s: Section) => {
    setSection(s);
  }, []);

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
              ['tools', 'Tools & stack'],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={section === id ? 'tab active' : 'tab'}
              onClick={() => navigate(id)}
            >
              {label}
            </button>
          ))}
        </nav>
        <FeedbackLink section={SECTION_LABELS[section]} detail={`Current tab: ${section}`} />
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
            search={search}
            onSearch={setSearch}
            selectedTermId={selectedTerm}
            onSelectTerm={jumpToTerm}
            level={glossaryLevel}
            onLevel={setGlossaryLevel}
          />
        )}

        {section === 'math' && <MathFramework />}

        {section === 'statistics' && (
          <StatisticianAppendix
            onSelectTerm={jumpToTerm}
            checked={checked}
            onChecked={setChecked}
          />
        )}

        {section === 'tools' && <ToolsGuide />}
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
