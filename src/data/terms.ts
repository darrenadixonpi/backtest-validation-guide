import type { Term } from './types';

export const TERMS: Term[] = [
  {
    id: 'backtesting',
    name: 'Backtesting',
    category: 'Foundations',
    beginner:
      'Pretending you traveled back in time and traded using only information that existed then. You apply your rules to old market data and see what profit or loss you would have made.',
    professional:
      'Historical simulation of a strategy under an explicit information set: features must be point-in-time, positions must lag signals realistically, and costs must be modeled. A backtest is only as honest as its data pipeline and simulator — it estimates historical plausibility, not guaranteed future performance. Always pair with out-of-sample splits before capital allocation.',
    math: 's_t(θ) = w_{t-1}(θ) r_t − c_t; aggregate S_T(θ) = Σ_{t=1}^T s_t(θ).',
    related: ['forward-testing', 'oos', 'is', 'lookahead-bias'],
  },
  {
    id: 'is',
    name: 'In-Sample (IS)',
    aliases: ['IS'],
    category: 'Foundations',
    beginner:
      'The part of history you used to build or tune your strategy. Like studying with the answer key open — scores look better than on a real test.',
    professional:
      'Any observation used for fitting, feature selection, or hyperparameter tuning. IS Sharpe and drawdown statistics are descriptive of the research process, not defensible forecasts. Reporting IS performance after extensive search is one of the most common sources of inflated backtests in industry and academia.',
    math: 'θ̂ = argmax_{θ∈Θ} Score(θ; T_train); IS metric = Score(θ̂; T_train).',
    related: ['oos', 'overfitting', 'selection-bias'],
  },
  {
    id: 'oos',
    name: 'Out-of-Sample (OOS)',
    aliases: ['OOS'],
    category: 'Foundations',
    beginner:
      'Data your strategy never saw while being built. This is the honest test — like exam questions you did not practice on.',
    professional:
      'Held-out time periods excluded from parameter estimation and model selection. OOS is the primary estimand for generalization in time-series work because it mimics deploying a model trained on past data into an unseen future. Quality depends entirely on split design — random K-fold on overlapping labels is not valid OOS in finance.',
    math: 'Evaluate {s_t(θ̂)} on V where V ∩ T_train = ∅ and θ̂ estimated using T_train only.',
    related: ['is', 'walk-forward', 'holdout', 'forward-testing'],
  },
  {
    id: 'forward-testing',
    name: 'Forward Testing',
    aliases: ['Paper trading', 'Live validation'],
    category: 'Live Trading',
    beginner:
      'Running your strategy in the real market now (or with fake money) instead of on old data. Catches problems backtests miss, like slow fills.',
    professional:
      'Operational validation under live microstructure: latency, queue position, partial fills, borrow/locate constraints, and real slippage. Closes the gap between bar-based backtests and deployable P&L. Recommended after statistical OOS passes; duration should cover multiple liquidity regimes.',
    math: 's_t^live = w_{t-1}^live · r_t^live − c_t^live; E[s_t^live] ≠ E[s_t^OOS] when microstructure differs.',
    related: ['backtesting', 'oos', 'slippage', 'transaction-costs'],
  },
  {
    id: 'sharpe-ratio',
    name: 'Sharpe Ratio',
    category: 'Foundations',
    beginner:
      'Reward per unit of risk — how much return you earn for enduring ups and downs. Higher can mean better, but short samples and many trials can fool you.',
    professional:
      'Mean excess return divided by volatility — useful for comparing strategies at similar frequency and leverage, but fragile under non-normal returns, autocorrelation, and regime change. When you have run many trials, raw Sharpe overstates significance; use deflated Sharpe or SPA/Reality Check. Report alongside turnover, max drawdown, and OOS path.',
    math: 'SR = μ/σ; sample SR̂ = s̄/σ̂; annualize with √A for A periods per year.',
    related: ['dsr', 'returns', 'volatility'],
  },
  {
    id: 'returns',
    name: 'Strategy Returns',
    category: 'Foundations',
    beginner: 'How much your strategy made or lost each period after deciding what to hold.',
    professional:
      'Per-period P&L from portfolio weights applied to asset returns, net of transaction costs. Must respect timing: the return at t should use the position decided with information available before t. Corporate actions, splits, and total-return vs price-return conventions must be consistent across train and test.',
    math: 's_t(θ) = w_{t-1}(θ) r_t − c_t(w_{t-1}, w_t).',
    related: ['sharpe-ratio', 'transaction-costs', 'position'],
  },
  {
    id: 'hyperparameters',
    name: 'Hyperparameters',
    aliases: ['Params', 'θ'],
    category: 'Foundations',
    beginner:
      'Knobs you set before trading — lookback length, thresholds, etc. Trying many knobs on the same history makes lucky fits likely.',
    professional:
      'Configuration choices fixed before fitting each model instance: lookback windows, entry thresholds, regularization strength, universe filters. Unlike model weights, hyperparameters are chosen by comparing trials — which introduces selection bias proportional to how many configurations you explore. Use nested out-of-sample validation when the search space is large.',
    math: 'θ ∈ Θ; θ̂ = argmax_{θ∈Θ} Score(θ; T_inner).',
    related: ['overfitting', 'nested-cv', 'pbo', 'dsr'],
  },
  {
    id: 'overfitting',
    name: 'Overfitting',
    category: 'Leakage & Dependence',
    beginner:
      'Memorizing old noise instead of learning a rule that works tomorrow. Great on past data, weak on new data.',
    professional:
      'When in-sample performance systematically exceeds out-of-sample performance because the strategy encodes sample-specific noise. More likely with larger parameter grids, more features, manual researcher tweaks, and longer research cycles on the same dataset. Parameter stability plots and PBO help diagnose; nested validation helps prevent.',
    math: 'E[SR̂_IS(θ̂)] − E[SR*_OOS(θ̂)] > 0; gap increases with |Θ| and researcher DoF.',
    related: ['pbo', 'selection-bias', 'parameter-stability'],
  },
  {
    id: 'selection-bias',
    name: 'Selection Bias',
    category: 'Multiple Testing',
    beginner:
      'Showing only the best of many tries. Even random strategies look amazing if you pick the top one.',
    professional:
      'Inflation from reporting the best-performing trial among many alternatives tested on the same history — including “implicit” trials from informal parameter tweaking. The expected maximum Sharpe under a null of no skill is strictly positive when M is large. Document trial count M and apply DSR, Reality Check, SPA, or PBO before claiming edge.',
    math: 'SR̂_max = max_{m≤M} SR̂_m; under H₀, E[SR̂_max] > 0.',
    related: ['dsr', 'reality-check', 'spa', 'pbo'],
  },
  {
    id: 'leakage',
    name: 'Information Leakage',
    category: 'Leakage & Dependence',
    beginner: 'Accidentally using future information when making past decisions.',
    professional:
      'Any violation of the causal information flow: training uses data that would not have been available at decision time, or overlaps statistically with the test period. Common sources include overlapping labels, revised fundamentals, survivorship-biased universes, and peeking at test folds during tuning. Leakage makes OOS metrics meaningless even when code “looks” correct.',
    math: 'Leak if ∃ information in train at t that is not in σ-algebra F_τ for test time τ ≤ t+H.',
    related: ['label-leakage', 'feature-leakage', 'purged-cv', 'embargo'],
  },
  {
    id: 'label-leakage',
    name: 'Label Leakage',
    category: 'Leakage & Dependence',
    beginner:
      'Training answers for Monday use Tuesday prices, but you test on Tuesday — the model already saw the answer.',
    professional:
      'Occurs when supervised labels at training time t incorporate returns from periods that overlap the test fold — typical with forward-return labels (“did price rise over the next H days?”). Standard K-fold cross-validation fails here. Fix by purging any training sample whose label window intersects the test interval (Lopez de Prado).',
    math: 'y_t = h(r_{t+1},…,r_{t+H}); leak if ∃ t∈T_train, τ∈T_test with t < τ ≤ t+H.',
    related: ['leakage', 'purged-cv', 'horizon-h'],
  },
  {
    id: 'feature-leakage',
    name: 'Feature Leakage',
    category: 'Leakage & Dependence',
    beginner:
      'Inputs secretly contain future data — e.g. a rolling average that includes test-period bars.',
    professional:
      'Predictors built with post-decision information or windows that span into the test fold — e.g. global normalization using full-sample mean, fundamentals as-revised rather than as-reported, or overlapping rolling statistics. Requires point-in-time databases and embargo gaps between train and test when features have memory.',
    math: 'Require X_t to be F_t-measurable; forbid X_t depending on {r_s : s > t}.',
    related: ['leakage', 'embargo', 'point-in-time'],
  },
  {
    id: 'horizon-h',
    name: 'Label Horizon (H)',
    category: 'Leakage & Dependence',
    beginner:
      'How far into the future your label looks. If H = 5, anything within 5 days of a test day can leak.',
    professional:
      'The forward window used to define a supervised target — e.g. H-day forward return or H-bar triple-barrier exit. Sets the minimum purge distance between training labels and test folds. Underestimating H is a frequent silent bug in financial ML pipelines.',
    math: 'Purge training index t when [t, t+H] ∩ V_test ≠ ∅.',
    related: ['label-leakage', 'purged-cv', 'embargo'],
  },
  {
    id: 'autocorrelation',
    name: 'Autocorrelation',
    category: 'Leakage & Dependence',
    beginner: 'Today relates to yesterday. Random shuffles break that and create fake confidence.',
    professional:
      'Serial correlation in strategy returns or features violates the independence assumption behind naive bootstrap and random K-fold. Even without label overlap, nearby bars share information — motivating embargo periods after test folds and block (not i.i.d.) bootstrap for confidence intervals.',
    math: 'ρ_k = Corr(s_t, s_{t+k}); i.i.d. resampling invalid when ρ_k ≠ 0.',
    related: ['block-bootstrap', 'embargo', 'stationarity'],
  },
  {
    id: 'stationarity',
    name: 'Stationarity',
    category: 'Leakage & Dependence',
    beginner: 'Market rules stay roughly stable. If regimes shift, old data may not predict tomorrow.',
    professional:
      'Assumption that statistical properties of returns are stable over the evaluation window. Markets violate this structurally (crises, policy shifts, liquidity cycles). Rolling walk-forward down-weights distant history; regime-stratified evaluation tests whether performance is concentrated in one era.',
    math: 'Weak stationarity: E[s_t], Var(s_t), Cov(s_t,s_{t+k}) independent of t.',
    related: ['regime', 'rolling-wfa', 'expanding-wfa', 'ergodicity'],
  },
  {
    id: 'walk-forward',
    name: 'Walk-Forward Analysis (WFA)',
    category: 'Split Methods',
    beginner:
      'Train on past chunk, test on next chunk, slide forward — practice tests before each new week.',
    professional:
      'Chronological train-test cycling that mimics periodic refitting in production. Each step fits on past data and scores on a strictly future window. Produces one OOS equity curve — informative but path-dependent (start/end dates matter). Combine with nested inner CV when tuning hyperparameters within each train window.',
    math: 'Fit θ̂_k on T_k; evaluate on V_k with max(T_k) < min(V_k); concatenate OOS {s_t(θ̂_k)}.',
    related: ['rolling-wfa', 'expanding-wfa', 'nested-cv', 'oos'],
  },
  {
    id: 'rolling-wfa',
    name: 'Rolling Walk-Forward',
    category: 'Split Methods',
    beginner: 'Always train on the last L days, test the next days. Forgets distant history.',
    professional:
      'Fixed-length training window that slides forward — appropriate when you believe distant past is less relevant (structural change, adaptive markets). Tradeoff: smaller L adapts faster but increases variance of parameter estimates; very small L can overfit recent noise.',
    math: 'T_k = {b_k − L + 1, …, b_k}; |T_k| = L constant.',
    related: ['walk-forward', 'expanding-wfa', 'stationarity'],
  },
  {
    id: 'expanding-wfa',
    name: 'Expanding Walk-Forward',
    category: 'Split Methods',
    beginner: 'Grow training set over time; never discard old data.',
    professional:
      'Monotonically growing training set — uses all available history at each step. Lower variance late in sample but may dilute recent regime signals with obsolete data. Common when sample size is limited or when you believe the DGP is approximately stable over decades.',
    math: 'T_k = {1,…,b_k}; V_k = {b_k+1,…,b_{k+1}}.',
    related: ['walk-forward', 'rolling-wfa'],
  },
  {
    id: 'purged-cv',
    name: 'Purged K-Fold CV',
    category: 'Split Methods',
    beginner: 'Split time into test chunks; remove training days whose future answers touch the test chunk.',
    professional:
      'Contiguous temporal folds with training samples removed when their label or feature windows overlap the test period — the standard cross-validation approach in financial ML (Lopez de Prado). Prefer over random K-fold whenever labels use forward horizons or features have rolling memory. Pair with embargo for autocorrelation.',
    math: 'T_k^purged = { t : [t, t+H] ∩ V_k = ∅ }.',
    related: ['embargo', 'cpcv', 'label-leakage'],
  },
  {
    id: 'embargo',
    name: 'Embargo',
    category: 'Split Methods',
    beginner: 'A gap between train and test so nearby days cannot leak information.',
    professional:
      'Additional buffer of E bars excluded from training after (and sometimes before) each test fold to attenuate serial correlation leakage when labels do not overlap but features or returns are autocorrelated. Typical E is a small multiple of the feature lookback or label horizon. Cheap insurance against subtle contamination.',
    math: 'Exclude training t where a_k − E < t ≤ b_k + E around test fold V_k = [a_k, b_k].',
    related: ['purged-cv', 'autocorrelation'],
  },
  {
    id: 'cpcv',
    name: 'Combinatorial Purged CV (CPCV)',
    category: 'Split Methods',
    beginner: 'Many clean train/test combos; see a distribution of scores, not one lucky path.',
    professional:
      'Generates many purged train/test combinations from chronological partitions — yielding a distribution of OOS outcomes rather than a single walk-forward path. Enables probability of backtest overfitting (PBO) and quantifies sensitivity to split choice. Computationally heavier but essential when comparing many parameter sets.',
    math: '{SR^OOS(s)}_{s∈S}; rank IS vs OOS across splits s ∈ S.',
    related: ['purged-cv', 'pbo', 'walk-forward'],
  },
  {
    id: 'nested-cv',
    name: 'Nested Cross-Validation',
    category: 'Split Methods',
    beginner: 'Tune only inside training; grade on separate test — never tune on the test set.',
    professional:
      'Outer loop produces honest OOS scores; inner loop on outer-train data only selects hyperparameters. Without nesting, every grid search contaminates the test fold you report. Required whenever |Θ| > 1 and you refit — which is nearly always in systematic trading research.',
    math: 'θ̂_k = argmax Score_inner(θ; T_k); evaluate θ̂_k on outer test V_k.',
    related: ['hyperparameters', 'walk-forward', 'purged-cv'],
  },
  {
    id: 'holdout',
    name: 'Final Holdout Set',
    category: 'Split Methods',
    beginner: 'One final exam at the end that you never peek at until done.',
    professional:
      'A terminal time slice reserved until all modeling decisions are frozen — touched once for confirmation. Unbiased toward that slice if discipline holds, but high variance because it is a single regime draw. Best used as a capstone after development-set nested CV/WFA, not as the only OOS check.',
    math: 'Holdout H ⊂ timeline; θ̂ fit on data strictly before min(H).',
    related: ['oos', 'nested-cv'],
  },
  {
    id: 'block-bootstrap',
    name: 'Block Bootstrap',
    category: 'Bootstrap & Uncertainty',
    beginner: 'Resample consecutive day-chunks so fake histories still feel like real markets.',
    professional:
      'Resampling method that preserves local time dependence by drawing contiguous blocks of observations. Used to build confidence intervals for Sharpe, mean return, or drawdown when returns are autocorrelated. Complements OOS splits — bootstrap quantifies sampling noise; it does not replace forward generalization testing.',
    math: 'Blocks B_i = (s_i,…,s_{i+L−1}); resample blocks with replacement to length T.',
    related: ['mbb', 'stationary-bootstrap', 'walk-forward'],
  },
  {
    id: 'mbb',
    name: 'Moving Block Bootstrap (MBB)',
    category: 'Bootstrap & Uncertainty',
    beginner: 'Equal-length strips randomly stitched into fake histories.',
    professional:
      'Fixed block length L; standard choice for dependent time series (Politis & Romano, 1994). Block length trades bias (too short → destroys dependence) vs variance (too long → few blocks). Rule of thumb: L on order of the autocorrelation decay of the statistic you care about.',
    math: 'Valid if L → ∞ and L/T → 0 as T → ∞.',
    related: ['block-bootstrap', 'cbb', 'stationary-bootstrap'],
  },
  {
    id: 'cbb',
    name: 'Circular Block Bootstrap',
    category: 'Bootstrap & Uncertainty',
    beginner: 'Block bootstrap that wraps around the series ends.',
    professional:
      'Variant of MBB where blocks wrap modulo sample length — reduces edge effects when T is small and every observation should appear equally often as a block start. Useful for short histories common in niche assets or young strategies.',
    math: 'Block indices (i,…,i+L−1) taken mod T.',
    related: ['mbb', 'block-bootstrap'],
  },
  {
    id: 'stationary-bootstrap',
    name: 'Stationary Bootstrap',
    category: 'Bootstrap & Uncertainty',
    beginner: 'Random-length chunks with controlled average size.',
    professional:
      'Block lengths drawn randomly (often geometric) so the bootstrap series is strictly stationary — addresses a technical limitation of fixed-length MBB. Preferred in some econometric tests of predictability when average block length is tuned to match dependence structure.',
    math: 'L_b ~ Geometric(p); E[L_b] = 1/p; bootstrap series is stationary.',
    related: ['mbb', 'block-bootstrap'],
  },
  {
    id: 'permutation-test',
    name: 'Permutation Test',
    category: 'Bootstrap & Uncertainty',
    beginner: 'Scramble data to ask if good performance could happen by luck alone.',
    professional:
      'Randomization test that destroys the signal while preserving marginal distribution structure — e.g. sign flips of returns or circular shifts breaking feature-target alignment. Answers “is this Sharpe unusual under a null of no skill?” for a fixed strategy. Does not account for hyperparameter search unless embedded in the permutation loop.',
    math: 'p = (1 + Σ_{b=1}^B 1{SR*^b ≥ SR_obs}) / (B+1).',
    related: ['sharpe-ratio', 'selection-bias'],
  },
  {
    id: 'dsr',
    name: 'Deflated Sharpe Ratio (DSR)',
    category: 'Multiple Testing',
    beginner: 'Deflates Sharpe when you tried many ideas so “great” numbers after searching look honest.',
    professional:
      'Bailey & Lopez de Prado adjustment asking whether observed Sharpe exceeds what you would expect from the best of M random trials under null, accounting for skew and kurtosis. Report alongside trial count M and sample length. A high raw Sharpe with low DSR is a red flag for data snooping.',
    math: 'DSR = Φ(z_deflated); z uses SR̂, M, T, γ_3, γ_4 vs E[max SR̂_m | H₀].',
    related: ['sharpe-ratio', 'selection-bias', 'pbo'],
  },
  {
    id: 'pbo',
    name: 'Probability of Backtest Overfitting (PBO)',
    category: 'Multiple Testing',
    beginner: 'How often your best in-sample settings are mediocre out-of-sample.',
    professional:
      'Bailey et al. metric from CPCV: fraction of splits where the in-sample optimal configuration ranks below median out-of-sample among all candidates. PBO near 0.5 suggests IS winner is no better than random selection; low PBO supports (but does not prove) robustness. Requires enumerating candidate parameter sets honestly.',
    math: 'PBO = (1/|S|) Σ_{s∈S} 1{ rank_OOS(IS-best θ) > ⌊|Θ|/2⌋ }.',
    related: ['cpcv', 'overfitting', 'dsr'],
  },
  {
    id: 'reality-check',
    name: "White's Reality Check",
    category: 'Multiple Testing',
    beginner: 'Tests if the best of many strategies truly beats a benchmark, not just wins a lottery.',
    professional:
      'White (2000) bootstrap test of whether any strategy in a universe beats a benchmark after accounting for selecting the maximum. Controls family-wise error but can be conservative when many strategies are clearly inferior. Use when running formal strategy tournaments against a passive benchmark.',
    math: 'T_M = max_m √T d̄_m; p-value from stationary bootstrap under H₀: E[d_{m,t}] ≤ 0 ∀m.',
    related: ['spa', 'selection-bias', 'dsr'],
  },
  {
    id: 'spa',
    name: "Hansen's SPA Test",
    category: 'Multiple Testing',
    beginner: 'Like Reality Check but ignores clearly bad strategies for better power.',
    professional:
      'Hansen (2005) Superior Predictive Ability test — same max-statistic framework as Reality Check but with data-dependent recentering in the bootstrap, improving power when a subset of models is genuinely useless. Preferred in recent econometric practice for comparing forecasting/trading rules at equal frequency.',
    math: 'Recentered bootstrap of max_m √T(d̄_m − d̄_m^+); H₀: no model beats benchmark.',
    related: ['reality-check', 'selection-bias'],
  },
  {
    id: 'regime',
    name: 'Regime-Stratified Evaluation',
    category: 'Diagnostics',
    beginner: 'Check bull, bear, and high-vol periods separately — not just overall average.',
    professional:
      'Decompose OOS performance by market state (volatility quintile, trend, macro indicator). A positive overall Sharpe can mask losses in high-vol or crisis regimes where you care most. Related to Simpson’s paradox — always inspect conditional tables before sizing risk.',
    math: 'SR_j = μ_j/σ_j for regime j; objective L(θ) = Σ_j ω_j ℓ(SR_j(θ)).',
    related: ['stationarity', 'stress-test', 'simpson-paradox'],
  },
  {
    id: 'parameter-stability',
    name: 'Parameter Stability',
    category: 'Diagnostics',
    beginner: 'Tiny knob changes should not flip performance from hero to zero.',
    professional:
      'Diagnostic that plots performance over a grid around the chosen hyperparameters. Sharp isolated peaks suggest fitting noise; broad plateaus suggest robust signal (or weak identification). Cheap to run and often more informative than a single IS optimum. Report alongside OOS, not instead of it.',
    math: 'Δ(ε) = SR(θ̂) − min_{||θ−θ̂||≤ε} SR(θ); Stab_δ = |{θ : SR(θ) ≥ (1−δ)SR(θ̂)}|/|Θ|.',
    related: ['overfitting', 'hyperparameters'],
  },
  {
    id: 'stress-test',
    name: 'Stress Testing',
    category: 'Diagnostics',
    beginner: 'Pretend costs are higher or markets crazier; see if the strategy survives.',
    professional:
      'Scenario analysis on OOS or forward paths: multiply transaction costs, inject latency, drop random bars, or restrict evaluation to crisis subsamples (2008, COVID, etc.). Unlike a single estimand, stress testing is a family of counterfactual performance maps — pass/fail is judged against desk risk limits, not a closed-form test statistic. Standard in buy-side risk committees.',
    math: 'SR_stress(λ_c, C) = SR({s_t}) under c_t ← λ_c c_t and t ∈ C; map (λ_c, C) ↦ metrics.',
    related: ['regime', 'transaction-costs'],
  },
  {
    id: 'transaction-costs',
    name: 'Transaction Costs',
    category: 'Live Trading',
    beginner: 'Fees and spread. High-turnover strategies often die after costs.',
    professional:
      'All frictions from trading: commissions, exchange fees, bid-ask spread, and market impact. Must scale with turnover and liquidity; constant per-trade costs favor low-frequency strategies artificially. Stress-test at 2–3× base-case assumptions in OOS before live deployment.',
    math: 's_t = w_{t-1} r_t − c_t; c_t = f(|Δw_t|, liquidity_t, fees).',
    related: ['slippage', 'returns', 'forward-testing', 'stress-test'],
  },
  {
    id: 'slippage',
    name: 'Slippage',
    category: 'Live Trading',
    beginner: 'Price moves between decision and fill — you pay more than the backtest assumed.',
    professional:
      'Implementation shortfall between decision price and fill price — dominates backtest vs live gap for intraday, large orders, and illiquid names. Model as function of participation rate and volatility; validate in forward testing. Bar-close backtests often assume unrealistic zero slippage.',
    math: 'Slippage_t = p_fill − p_decision; c_t includes slippage_t · |Δw_t|.',
    related: ['transaction-costs', 'forward-testing'],
  },
  {
    id: 'point-in-time',
    name: 'Point-in-Time Data',
    category: 'Leakage & Dependence',
    beginner: 'Only use numbers known that day — not restated or future-fixed databases.',
    professional:
      'Datasets with explicit as-of timestamps so each feature reflects what was knowable at decision time — critical for fundamentals, index membership, and analyst estimates. Using “current” fundamental databases backtests with lookahead. Survivorship-free universes are a related requirement.',
    math: 'Feature X_t must use data with release time τ ≤ t; forbid revised values with τ′ > t.',
    related: ['feature-leakage', 'backtesting', 'lookahead-bias'],
  },
  {
    id: 'position',
    name: 'Position / Signal',
    category: 'Foundations',
    beginner: 'How much you hold long or short at each moment.',
    professional:
      'Portfolio weight or signal derived from the model at each bar. Must be implementable: if you trade at the close using features known at close, P&L attribution must use next-bar returns. Leverage, gross exposure caps, and position limits belong in the simulator, not as afterthoughts.',
    math: 'w_t = g(f_θ(X_t)); P&L at t uses w_{t−1} against r_t.',
    related: ['returns', 'hyperparameters'],
  },
  {
    id: 'volatility',
    name: 'Volatility',
    category: 'Foundations',
    beginner: 'How bumpy returns are.',
    professional:
      'Standard deviation of returns — enters Sharpe denominator and position sizing. Volatility clusters in financial series (GARCH effects), violating i.i.d. assumptions. Risk targeting and vol-scaling change the effective strategy; document whether vol is estimated in-sample or with rolling OOS windows.',
    math: 'σ = √Var(s_t); often σ_t varies (stochastic volatility).',
    related: ['sharpe-ratio', 'regime'],
  },
  {
    id: 'lookahead-bias',
    name: 'Lookahead Bias',
    category: 'Leakage & Dependence',
    beginner: 'Using tomorrow’s news for today’s simulated trade.',
    professional:
      'Specific simulator bug: decision at t uses information from s > t. Distinct from statistical leakage in CV — often arises from off-by-one indexing, using close-to-close returns with same-bar signals, or corporate-action adjustments applied with future knowledge. Code review and point-in-time data are the fixes.',
    math: 'Bias if w_t depends on {X_s, r_s : s > t}.',
    related: ['leakage', 'point-in-time', 'backtesting'],
  },
  {
    id: 'ergodicity',
    name: 'Ergodicity',
    category: 'Leakage & Dependence',
    beginner: 'Average over time behaves like average over many parallel worlds — needed for “history teaches the future.”',
    professional:
      'Property that time averages converge to population expectations — underpinning the hope that long backtests estimate future performance. Broken by structural breaks, regime shifts, and evolving market structure. Rolling validation and regime diagnostics test ergodicity empirically; never assume it from a single long IS run.',
    math: '(1/T)Σ_{t=1}^T s_t → E[s_t] a.s. as T → ∞ under ergodic conditions.',
    related: ['stationarity', 'regime'],
  },
  {
    id: 'simpson-paradox',
    name: "Simpson's Paradox",
    category: 'Diagnostics',
    beginner: 'Strategy wins overall but loses in every type of market you care about.',
    professional:
      'Aggregate performance metric reverses sign when conditioning on subgroups — e.g. positive overall Sharpe with negative Sharpe in every volatility quintile due to composition effects. Motivates mandatory regime-stratified OOS tables, not optional extras.',
    math: 'Sign(Σ_j w_j μ_j) ≠ sign(μ_j) for some regimes j with Σ w_j = 1.',
    related: ['regime', 'sharpe-ratio'],
  },
  {
    id: 'rule-based-strategy',
    name: 'Rule-Based / Indicator Strategy',
    aliases: ['Indicator-only', 'Fixed rules'],
    category: 'Strategy & Data',
    beginner:
      'A strategy with fixed rules and no knobs to tune — e.g. “buy if price breaks the opening range.” You still need honest out-of-sample testing, but you skip hyperparameter nesting.',
    professional:
      'Strategy with predetermined logic and no (or minimal) estimated parameters — typical for TA rules like ORB. Selection bias from parameter search is low, but researcher bias remains (rule design, universe choice, cost assumptions). Walk-forward OOS + block bootstrap is usually sufficient before forward testing; upgrade to nested/purged CV when you add tuning or ML.',
    math: '|Θ| ≈ 0 or fixed θ; validate with WFA OOS path + block bootstrap on {s_t(θ)}.',
    related: ['opening-range-breakout', 'walk-forward', 'block-bootstrap', 'hyperparameters'],
  },
  {
    id: 'opening-range-breakout',
    name: 'Opening Range Breakout (ORB)',
    category: 'Strategy & Data',
    beginner:
      'Trade when price breaks above or below the high/low of the first few minutes after the market opens.',
    professional:
      'Intraday rule keyed to the opening range window (e.g. first 5–30 minutes). Validation must respect session boundaries (no overnight label leakage), realistic open auction/spread costs, and timezone/exchange calendar. Expanding walk-forward is common when history length is moderate; stress-test cost and slippage heavily. Coarse aggregated bars are acceptable for early screening — flag microstructure gaps before live deployment.',
    math: 'Signal at t uses OR high/low over [t_open, t_open + Δ]; P&L from w_t on r_{t+1} with session filter.',
    related: ['rule-based-strategy', 'session-boundaries', 'bar-data', 'slippage'],
  },
  {
    id: 'session-boundaries',
    name: 'Session / Market-Open Boundaries',
    category: 'Strategy & Data',
    beginner:
      'The market open is a special moment — rules about “the first 30 minutes” must reset each day and not mix yesterday’s open with today’s.',
    professional:
      'Intraday strategies must anchor features to exchange session open/close, halts, and timezone. Walk-forward splits should respect session boundaries (split by day, not arbitrary bar count). ORB and open-drive patterns fail if the simulator uses stale ranges or crosses sessions incorrectly.',
    math: 'Features X_t measurable w.r.t. F_{t,session}; reset state at each t_open.',
    related: ['opening-range-breakout', 'lookahead-bias', 'bar-data'],
  },
  {
    id: 'bar-data',
    name: 'Bar / OHLCV Data',
    aliases: ['Aggregated bars', 'OHLCV bars'],
    category: 'Strategy & Data',
    beginner:
      'Price summarized into time chunks (open, high, low, close, volume) instead of every single trade.',
    professional:
      'Aggregated OHLCV bars enable fast strategy screening but hide intrabar path, queue priority, and open auction dynamics. Acceptable for intraday rule prototyping if costs/slippage are conservative and forward tests follow. Document bar size, symbology, adjustment policy, and session calendar.',
    math: 'Bar b = (O,H,L,C,V) over [τ_i, τ_{i+1}); simulator maps fills to bar timestamps explicitly.',
    related: ['opening-range-breakout', 'slippage', 'forward-testing'],
  },
  {
    id: 'financial-ml',
    name: 'Financial ML Pipeline',
    aliases: ['GBT', 'Gradient boosting', 'Supervised ML'],
    category: 'Strategy & Data',
    beginner:
      'Using machine learning (like gradient boosted trees) to predict returns or signals — needs stricter validation than fixed indicators.',
    professional:
      'When moving from indicator-only rules to fitted models (GBTs, neural nets, etc.), you inherit label horizon H, feature leakage, and hyperparameter search bias. Minimum: purged K-fold with embargo, nested tuning, and PBO/DSR if many trials. Factor-model and cross-sectional ML share overlap but need panel-aware splits — not identical to single-asset time-series WFA.',
    math: 'y_t = h(r_{t+1},…,r_{t+H}); fit f_θ(X_t); require purged nested CV before OOS claims.',
    related: ['purged-cv', 'nested-cv', 'pbo', 'label-leakage'],
  },
  {
    id: 'monte-carlo-simulation',
    name: 'Monte Carlo Simulation',
    category: 'Bootstrap & Uncertainty',
    beginner:
      'Run many random “what if” scenarios — e.g. shuffle returns or simulate fake price paths — to see how unstable your results might be.',
    professional:
      'Broad family: (1) block bootstrap resamples actual history preserving dependence; (2) parametric MC simulates from fitted models (GBM, GARCH); (3) strategy MC perturbs fills/costs. Not interchangeable — bootstrap tests sampling uncertainty on realized paths; parametric MC tests model assumptions. Kaggle competition backtests often use simplified MC — fine for ranking, not for capital deployment without OOS discipline.',
    math: 'Bootstrap: resample {s_t}; Parametric: simulate r_t ~ F_θ; MC estimate = (1/B)Σ statistic_b.',
    related: ['block-bootstrap', 'permutation-test', 'competition-backtesting'],
  },
  {
    id: 'competition-backtesting',
    name: 'Competition Backtesting (Kaggle-style)',
    category: 'Strategy & Data',
    beginner:
      'Backtests built for scoring on a leaderboard — often simpler rules and less strict leakage controls than production quant work.',
    professional:
      'Competition setups (e.g. Kaggle volatility challenges) emphasize reproducible public scores, not deployable OOS generalization. Common gaps: hidden test set you cannot peek at (good), but also simplified costs, fixed horizons, and less scrutiny on multiple unofficial trials. Useful for learning and feature ideas — transplant methods to production validation (walk-forward, purged CV) before trading.',
    math: 'Leaderboard score = metric on hidden H; ≠ SR*_OOS unless split design matches deployment.',
    related: ['oos', 'monte-carlo-simulation', 'selection-bias'],
  },
  {
    id: 'factor-model',
    name: 'Factor Model / Cross-Sectional Research',
    category: 'Strategy & Data',
    beginner:
      'Explaining returns with things like “value” or “momentum” across many stocks at once — different shape than one-strategy one-asset backtests.',
    professional:
      'Portfolio optimization and factor regressions are often cross-sectional (many names per date) with panel structure. Validation needs clustered or panel-aware splits — not just single-series walk-forward. Correlation with ORB/intraday work is limited unless you merge alpha signals into a portfolio framework. Monte Carlo here often means factor return simulation or resampled panels.',
    math: 'r_{i,t} = Σ_k β_{i,k} f_{k,t} + ε_{i,t}; panel split by date t, not i.i.d. by row.',
    related: ['regime', 'monte-carlo-simulation', 'financial-ml', 'panel-clustering'],
  },
  {
    id: 'policy-estimand',
    name: 'Policy Estimand (post-selection)',
    category: 'Statistical Inference',
    beginner:
      'When you refit and pick settings over time, the thing you care about is how the whole decision rule performs — not one frozen set of knobs.',
    professional:
      'After walk-forward or nested CV, the deployable object is a policy π that maps past data to θ̂_k and positions. The estimand is E[s_t(θ̂_{k(t)})], not SR*(θ) for a single pre-fixed θ. Report OOS policy returns; bootstrap must state whether it is conditional on final θ̂ or includes selection.',
    math: 'R_OOS = (1/|V|) Σ_k Σ_{t∈V_k} s_t(θ̂_k); SR*_policy = E[s_t(θ̂_{k(t)})]/σ(s_t(θ̂_{k(t)})).',
    related: ['walk-forward', 'nested-cv', 'post-selection-inference', 'oos'],
  },
  {
    id: 'post-selection-inference',
    name: 'Post-Selection Inference',
    category: 'Statistical Inference',
    beginner:
      'After you pick the “best” model, uncertainty shrinks on paper but not in reality — special care is needed.',
    professional:
      'Standard CIs and bootstrap intervals are conditional on the selected θ̂ unless selection is embedded in the resampling (nested bootstrap). DSR/PBO/SPA address multiplicity at the strategy level but do not replace documenting the selection pipeline.',
    math: 'CI_fixed: given θ̂; CI_policy: resample splits with inner argmax each replicate.',
    related: ['policy-estimand', 'dsr', 'pbo', 'nested-cv'],
  },
  {
    id: 'effective-sample-size',
    name: 'Effective Sample Size (Lo)',
    aliases: ['Lo adjustment'],
    category: 'Statistical Inference',
    beginner:
      'Autocorrelated returns make it look like you have more independent data than you really do.',
    professional:
      'Lo (2002): positive autocorrelation reduces effective T for Sharpe inference. Use T* (or block bootstrap) before treating √T Sharpe ratios as normal. Especially important for daily/strategy returns with serial correlation.',
    math: 'T* ≈ T(1-ρ₁)/(1+ρ₁); SE(SR̂) ≈ √((1+0.5SR̂²)/T*).',
    related: ['sharpe-ratio', 'autocorrelation', 'block-bootstrap', 'dsr'],
  },
  {
    id: 'fwer-fdr',
    name: 'FWER vs FDR',
    category: 'Statistical Inference',
    beginner:
      'When testing many strategies, you can control how often any false alarm slips through (FWER) or the fraction of false discoveries (FDR).',
    professional:
      "Reality Check and SPA target family-wise error rate (FWER) for max-statistic tests. Benjamini–Hochberg FDR is looser but useful for screening many signals. Document which error rate your pipeline targets when running strategy tournaments.",
    math: 'FWER = P(V ≥ 1); FDR = E[V/R | R>0] under multiple hypotheses.',
    related: ['reality-check', 'spa', 'selection-bias'],
  },
  {
    id: 'cv-generalization-bias',
    name: 'CV Generalization Bias',
    category: 'Statistical Inference',
    beginner:
      'Even honest cross-validation still estimates future error with noise and some built-in optimism.',
    professional:
      'Cross-validation estimates expected out-of-sample error but is not unbiased with zero variance. Nested CV reduces tuning contamination; CPCV reports a distribution. Do not treat mean CV score as exact future performance.',
    math: 'E[Err̂_CV] ≈ Err + optimism; Var(Err̂_CV) > 0 across folds/paths.',
    related: ['nested-cv', 'cpcv', 'purged-cv'],
  },
  {
    id: 'prequential-risk',
    name: 'Prequential Risk',
    category: 'Statistical Inference',
    beginner:
      'Score your forecasts one step at a time using only past data — same spirit as walk-forward.',
    professional:
      'Prequential (predictive sequential) evaluation averages per-step forecast loss. Walk-forward OOS is the trading analogue: each step uses an information set available at deployment time. Connects validation to online forecasting literature.',
    math: 'L̄_T = (1/T) Σ_{t=1}^T ℓ(y_t, ŷ_t); WFA minimizes cumulative loss under refitting.',
    related: ['walk-forward', 'oos', 'policy-estimand'],
  },
  {
    id: 'feature-lookback-lf',
    name: 'Feature Lookback (L_f)',
    category: 'Statistical Inference',
    beginner:
      'Rolling indicators use past days — purge must account for that window, not just label horizon H.',
    professional:
      'If features at t depend on returns over [t−L_f, t], purge distance must use P_k = max(H, L_f). Underestimating L_f causes feature leakage into test folds even when labels are purged correctly.',
    math: 'P_k = max(H, L_f); purge t if [t-P_k, t+P_k] ∩ V_k ≠ ∅.',
    related: ['purged-cv', 'feature-leakage', 'horizon-h'],
  },
  {
    id: 'mixing-conditions',
    name: 'Mixing / Ergodicity Conditions',
    category: 'Statistical Inference',
    beginner:
      'For time averages to mean something, past must eventually “forget” — breaks after big regime shifts.',
    professional:
      'Ergodicity and α-mixing (or similar) underpin LLN/CLT for dependent series and bootstrap validity. Structural breaks violate these; use rolling WFA, regime splits, and stress tests rather than assuming one long sample is one DGP.',
    math: '(1/T)Σ s_t → E[s_t] a.s.; mixing: α(m) → 0 as m → ∞.',
    related: ['ergodicity', 'stationarity', 'regime'],
  },
  {
    id: 'panel-clustering',
    name: 'Panel Clustering / HAC Inference',
    category: 'Statistical Inference',
    beginner:
      'With many stocks on the same day, rows on one date are related — cluster by date when testing.',
    professional:
      'Cross-sectional factor and portfolio regressions require cluster-robust SEs (by date) or two-way clustering (date × firm). Fama–MacBeth runs cross-sections per t then time-series inference on coefficients with Newey–West. Never shuffle panel rows for CV.',
    math: 'SE_cluster-date allows arbitrary corr within t; NW SE on {γ̂_t} for Fama–MacBeth.',
    related: ['factor-model', 'purged-cv', 'monte-carlo-simulation'],
  },
];

export function termById(id: string) {
  return TERMS.find((t) => t.id === id);
}
