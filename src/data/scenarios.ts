export type Scenario = {
  id: string;
  title: string;
  context: string;
  validation: string[];
  watchouts: string[];
  relatedTerms: string[];
};

export const SCENARIOS: Scenario[] = [
  {
    id: 'orb-bars',
    title: 'Intraday ORB on aggregated bar data (indicator-only)',
    context:
      'Fixed opening-range-breakout rules with no parameter fitting — fast screening on OHLCV bars before microstructure refinement.',
    validation: [
      'Expanding walk-forward when history length supports it: train on past sessions, test forward.',
      'H = 0 if signals use only same-session open range; still split by calendar day/session.',
      'Block bootstrap on concatenated OOS returns for CI — not i.i.d. shuffle.',
      'Stress costs/slippage 2–3×; stratify by vol regime and year.',
      'Optional final holdout month/quarter; forward paper trade before size.',
    ],
    watchouts: [
      'Bar data hides open auction and intrabar stop logic.',
      'Do not tune ORB window on full sample then report IS as OOS.',
      'Document exchange calendar and opening-range window definition reproducibly.',
    ],
    relatedTerms: ['opening-range-breakout', 'rule-based-strategy', 'expanding-wfa', 'bar-data'],
  },
  {
    id: 'add-tuning',
    title: 'Adding hyperparameter grids',
    context: 'Grid search over window length, stops, time exits — same historical sample.',
    validation: [
      'Switch to nested walk-forward: inner CV on outer-train only.',
      'Track trial count M for DSR if many combos.',
      'Parameter stability heatmap around chosen settings.',
    ],
    watchouts: [
      'Informal manual tries still count toward M — log every variant.',
      'CPCV/PBO if the grid explodes.',
    ],
    relatedTerms: ['hyperparameters', 'nested-cv', 'pbo', 'parameter-stability'],
  },
  {
    id: 'gbt-upgrade',
    title: 'Moving to gradient boosted trees / ML',
    context: 'Supervised models on strategy features — crosses into financial ML validation.',
    validation: [
      'Purged K-fold + embargo (H = label horizon).',
      'Nested tuning for tree depth, learning rate, feature subsets.',
      'PBO or DSR when many experiments run.',
    ],
    watchouts: [
      'Feature leakage from global normalization or future bars.',
      'Indicator-only WFA protocol is not enough once you fit θ.',
    ],
    relatedTerms: ['financial-ml', 'purged-cv', 'label-leakage', 'embargo'],
  },
  {
    id: 'factor-track',
    title: 'Factor models / econometrics / competition background',
    context:
      'Cross-sectional factor work, portfolio optimization, Monte Carlo, or competition-style backtests — different defaults than single-series intraday rules.',
    validation: [
      'Cross-sectional work: split by time, cluster by date; avoid random row CV.',
      'Competition scores ≠ production OOS — re-validate with walk-forward on deploy horizon.',
      'Monte Carlo: distinguish bootstrap (historical paths) vs parametric sim (model risk).',
    ],
    watchouts: [
      'Volatility forecasting metrics from competitions do not transfer to intraday P&L without a cost model.',
      'Portfolio-opt in-sample Sharpe is not OOS.',
    ],
    relatedTerms: ['factor-model', 'competition-backtesting', 'monte-carlo-simulation', 'oos'],
  },
];
