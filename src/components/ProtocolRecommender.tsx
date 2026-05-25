export type StrategyMode = 'indicator' | 'tuned' | 'ml';
export type WindowMode = 'expanding' | 'rolling';

type Props = {
  strategyMode: StrategyMode;
  windowMode: WindowMode;
  trials: 'few' | 'many';
  horizon: 'zero' | 'positive';
  refit: boolean;
  onStrategyMode: (v: StrategyMode) => void;
  onWindowMode: (v: WindowMode) => void;
  onTrials: (v: 'few' | 'many') => void;
  onHorizon: (v: 'zero' | 'positive') => void;
  onRefit: (v: boolean) => void;
};

export function ProtocolRecommender({
  strategyMode,
  windowMode,
  trials,
  horizon,
  refit,
  onStrategyMode,
  onWindowMode,
  onTrials,
  onHorizon,
  onRefit,
}: Props) {
  const windowNote =
    windowMode === 'expanding'
      ? 'Use expanding walk-forward (growing train window) — good default when history is moderate and regimes drift slowly.'
      : 'Use rolling walk-forward (fixed train length L) — adapts faster to recent regimes; needs L large enough to avoid noise.';

  const strategySteps: Record<StrategyMode, string[]> = {
    indicator: [
      'Fixed rules — no nested hyperparameter CV required (low |Θ|).',
      'Still use chronological OOS; never report full-sample IS as final.',
      'Block-bootstrap OOS returns for confidence bands.',
    ],
    tuned: [
      'Nested walk-forward: tune only on outer-train windows.',
      'Log every parameter variant tried (counts toward M for DSR).',
      'Parameter stability plot around chosen settings.',
    ],
    ml: [
      'Purged K-fold + embargo on label horizon H.',
      'Nested tuning for model + feature pipeline.',
      'CPCV/PBO or DSR when experiment count is large.',
    ],
  };

  const steps = [
    'Reserve final holdout (never touch during research).',
    windowNote,
    horizon === 'positive'
      ? 'Use purged splits with horizon H; add embargo E for autocorrelation.'
      : 'Chronological splits only (walk-forward or purged K-fold) — no random shuffle.',
    ...strategySteps[strategyMode],
    refit && strategyMode !== 'indicator'
      ? 'Outer walk-forward with refit each step.'
      : refit
        ? 'Expanding/rolling walk-forward with fixed rules each step (refit = re-evaluate, not re-tune).'
        : 'Single pass walk-forward with fixed parameters/rules.',
    trials === 'many' || strategyMode === 'ml'
      ? 'Run CPCV + report PBO; apply DSR or Hansen SPA vs benchmark.'
      : 'Block-bootstrap OOS returns for confidence intervals.',
    'Regime-stratify OOS returns; stress-test costs (critical for intraday ORB).',
    'One evaluation on final holdout; then forward/paper trade when ready.',
  ];

  return (
    <section className="panel highlight">
      <div className="panel-head">
        <h2>Recommended validation protocol</h2>
        <p className="muted">Adjust inputs — steps update to match your research setup.</p>
      </div>

      <div className="proto-controls">
        <div className="control-field">
          <span className="control-label">Strategy type</span>
          <div className="segmented" role="group" aria-label="Strategy type">
            <button
              type="button"
              className={strategyMode === 'indicator' ? 'segment active' : 'segment'}
              onClick={() => onStrategyMode('indicator')}
            >
              Indicator / fixed
            </button>
            <button
              type="button"
              className={strategyMode === 'tuned' ? 'segment active' : 'segment'}
              onClick={() => onStrategyMode('tuned')}
            >
              Tuned params
            </button>
            <button
              type="button"
              className={strategyMode === 'ml' ? 'segment active' : 'segment'}
              onClick={() => onStrategyMode('ml')}
            >
              ML (GBT, etc.)
            </button>
          </div>
        </div>
        <div className="control-field">
          <span className="control-label">Walk-forward window</span>
          <div className="segmented" role="group" aria-label="Walk-forward window">
            <button
              type="button"
              className={windowMode === 'expanding' ? 'segment active' : 'segment'}
              onClick={() => onWindowMode('expanding')}
            >
              Expanding
            </button>
            <button
              type="button"
              className={windowMode === 'rolling' ? 'segment active' : 'segment'}
              onClick={() => onWindowMode('rolling')}
            >
              Rolling (fixed L)
            </button>
          </div>
        </div>
        <div className="control-field">
          <span className="control-label">Hyperparameter trials</span>
          <div className="segmented" role="group" aria-label="Hyperparameter trials">
            <button
              type="button"
              className={trials === 'few' ? 'segment active' : 'segment'}
              onClick={() => onTrials('few')}
              disabled={strategyMode === 'indicator'}
            >
              Few (&lt; 20)
            </button>
            <button
              type="button"
              className={trials === 'many' ? 'segment active' : 'segment'}
              onClick={() => onTrials('many')}
              disabled={strategyMode === 'indicator'}
            >
              Many (grid)
            </button>
          </div>
        </div>
        <div className="control-field">
          <span className="control-label">Label horizon H</span>
          <div className="segmented" role="group" aria-label="Label horizon">
            <button
              type="button"
              className={horizon === 'zero' ? 'segment active' : 'segment'}
              onClick={() => onHorizon('zero')}
            >
              H = 0
            </button>
            <button
              type="button"
              className={horizon === 'positive' ? 'segment active' : 'segment'}
              onClick={() => onHorizon('positive')}
            >
              H &gt; 0
            </button>
          </div>
        </div>
        <div className="control-field toggle-field">
          <span className="control-label">Refit each step</span>
          <div className="segmented" role="group" aria-label="Refit schedule">
            <button
              type="button"
              className={!refit ? 'segment active' : 'segment'}
              onClick={() => onRefit(false)}
            >
              Fixed
            </button>
            <button
              type="button"
              className={refit ? 'segment active' : 'segment'}
              onClick={() => onRefit(true)}
            >
              Refit
            </button>
          </div>
        </div>
      </div>

      <ol className="proto-steps">
        {steps.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>
    </section>
  );
}
