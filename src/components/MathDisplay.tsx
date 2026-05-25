import katex from 'katex';
import 'katex/dist/katex.min.css';

function protectScoreSemicolons(input: string) {
  return input.replace(/Score(?:_\w+)?\(([^)]*?);([^)]*?)\)/g, (_, a, b) => `Score(${a}@@SCORE_SEMI@@${b})`);
}

function restoreScoreSemicolons(input: string) {
  return input.replace(/@@SCORE_SEMI@@/g, ';');
}

function splitClauses(input: string) {
  const protectedInput = protectScoreSemicolons(input);
  return protectedInput.split('; ').map((part) => restoreScoreSemicolons(part.trim())).filter(Boolean);
}

function braceMultiLetterScripts(input: string) {
  return input.replace(/([_^])([A-Za-z][A-Za-z0-9]*)/g, '$1{$2}');
}

function fixGluedLatexCommands(input: string) {
  // Do not rewrite "rank" inside LaTeX command arguments (e.g. \text{rank}, \operatorname{rank}).
  const rankPrefix = '(?<![A-Za-z\\\\{])';
  return input
    .replace(/\\leq(?=[A-Za-z0-9|])/g, '\\leq ')
    .replace(/\\geq(?=[A-Za-z0-9|])/g, '\\geq ')
    .replace(/\\neq(?=[A-Za-z0-9|])/g, '\\neq ')
    .replace(/\\in(?=[A-Za-z0-9|{])/g, '\\in ')
    .replace(/\\forall(?=[A-Za-z0-9|])/g, '\\forall ')
    .replace(/\\sqrt([A-Za-z0-9_])/g, '\\sqrt{$1}')
    .replace(/\\Delta(?=[A-Za-z_])/g, '\\Delta ')
    .replace(/\bmax\b/g, '\\max')
    .replace(new RegExp(`${rankPrefix}rank_`, 'g'), '\\operatorname{rank}_')
    .replace(new RegExp(`${rankPrefix}rank\\b`, 'g'), '\\operatorname{rank} ');
}

/** Unicode + symbol fixes for math segments only — never wraps English prose. */
export function normalizeMathSegment(latex: string) {
  let s = latex
    .replace(/Score\(([^;]+); ([^)]+)\)/g, 'Score($1 \\mid $2)')
    .replace(/\bargmax\b/g, '\\arg\\max')
    .replace(/θ̂/g, '\\hat{\\theta}')
    .replace(/SR̂/g, '\\widehat{SR}')
    .replace(/s̄/g, '\\bar{s}')
    .replace(/σ̂/g, '\\hat{\\sigma}')
    .replace(/d̄/g, '\\bar{d}')
    .replace(/Err̂/g, '\\widehat{\\mathrm{Err}}')
    .replace(/L̄/g, '\\bar{L}')
    .replace(/ŷ/g, '\\hat{y}')
    .replace(/θ/g, '\\theta')
    .replace(/Θ/g, '\\Theta')
    .replace(/β/g, '\\beta')
    .replace(/ε/g, '\\varepsilon')
    .replace(/μ/g, '\\mu')
    .replace(/σ/g, '\\sigma')
    .replace(/ρ/g, '\\rho')
    .replace(/γ/g, '\\gamma')
    .replace(/Φ/g, '\\Phi')
    .replace(/Δ/g, '\\Delta')
    .replace(/λ/g, '\\lambda')
    .replace(/ω/g, '\\omega')
    .replace(/τ/g, '\\tau')
    .replace(/ℓ/g, '\\ell')
    .replace(/Σ_/g, '\\sum_')
    .replace(/Σ/g, '\\sum')
    .replace(/√([A-Za-z0-9_])/g, '\\sqrt{$1}')
    .replace(/√/g, '\\sqrt')
    .replace(/·/g, '\\cdot')
    .replace(/−/g, '-')
    .replace(/≤/g, '\\leq ')
    .replace(/≥/g, '\\geq ')
    .replace(/≠/g, '\\neq ')
    .replace(/≈/g, '\\approx')
    .replace(/∅/g, '\\emptyset')
    .replace(/∩/g, '\\cap')
    .replace(/∈/g, '\\in ')
    .replace(/⊂/g, '\\subset')
    .replace(/∀/g, '\\forall ')
    .replace(/∃/g, '\\exists')
    .replace(/…/g, '\\ldots')
    .replace(/←/g, '\\leftarrow')
    .replace(/↦/g, '\\mapsto')
    .replace(/⌊/g, '\\lfloor')
    .replace(/⌋/g, '\\rfloor')
    .replace(/H₀/g, 'H_0')
    .replace(/T_train/g, 'T_{\\mathrm{train}}')
    .replace(/T_test/g, 'T_{\\mathrm{test}}')
    .replace(/T_inner/g, 'T_{\\mathrm{inner}}')
    .replace(/V_test/g, 'V_{\\mathrm{test}}')
    .replace(/Score_inner/g, 'Score_{\\mathrm{inner}}')
    .replace(/i\.i\.d\./g, '\\text{i.i.d.}')
    .replace(/P&L/g, '\\text{P\\&L}');

  s = braceMultiLetterScripts(s);
  s = fixGluedLatexCommands(s);
  return s;
}

const MATH_ABBREVS = [
  'Score_inner',
  'Score',
  'SR',
  'OOS',
  'IS',
  'ORB',
  'WFA',
  'DSR',
  'PBO',
  'SPA',
  'FWER',
  'FDR',
  'HAC',
  'MBB',
  'CBB',
  'Corr',
  'Cov',
  'Var',
  'Sign',
  'Err',
];

const ENGLISH_WORDS = new Set([
  'features',
  'feature',
  'measurable',
  'reset',
  'state',
  'each',
  'require',
  'forbid',
  'must',
  'use',
  'for',
  'and',
  'the',
  'with',
  'when',
  'where',
  'under',
  'over',
  'from',
  'that',
  'not',
  'are',
  'has',
  'have',
  'depend',
  'depending',
  'leak',
  'purge',
  'valid',
  'if',
  'sample',
  'weak',
  'block',
  'blocks',
  'resample',
  'taken',
  'around',
  'exclude',
  'training',
  'simulate',
  'estimate',
  'leaderboard',
  'score',
  'hidden',
  'unless',
  'split',
  'design',
  'matches',
  'deployment',
  'panel',
  'row',
  'date',
  'fixed',
  'given',
  'policy',
  'across',
  'folds',
  'paths',
  'optimism',
  'multiple',
  'hypotheses',
  'minimizes',
  'cumulative',
  'loss',
  'refitting',
  'stationary',
  'series',
  'moving',
  'circular',
  'permutation',
  'recentered',
  'bootstrap',
  'parametric',
  'regime',
  'objective',
  'stress',
  'includes',
  'slippage',
  'liquidity',
  'fees',
  'fill',
  'decision',
  'release',
  'time',
  'revised',
  'values',
  'signal',
  'high',
  'low',
  'session',
  'filter',
  'simulator',
  'maps',
  'fills',
  'timestamps',
  'explicitly',
  'fit',
  'claims',
  'allows',
  'arbitrary',
  'corr',
  'within',
  'rank',
  'holdout',
  'timeline',
  'evaluate',
  'concatenate',
  'outer',
  'test',
  'inner',
  'on',
  'at',
  'to',
  'be',
  'in',
  'of',
  'or',
  'an',
  'a',
  'is',
  'as',
  'it',
  'no',
  'all',
  'any',
  'some',
  'only',
  'also',
  'can',
  'data',
  'index',
  'indices',
  'length',
  'constant',
  'independent',
  'ergodic',
  'conditions',
  'mixing',
  'often',
  'varies',
  'stochastic',
  'volatility',
  'bias',
  'depends',
  'gap',
  'increases',
  'researcher',
  'information',
  'algebra',
  'strictly',
  'before',
  'after',
  'open',
  'boundaries',
  'bar',
  'fold',
  'metric',
  'periods',
  'year',
  'annualize',
  'aggregate',
  'exists',
  'there',
  'into',
  'by',
  'vs',
  'given',
  'using',
  'estimated',
  'against',
  'maps',
  'value',
  'p',
]);

function isEnglishWord(word: string) {
  return ENGLISH_WORDS.has(word.toLowerCase());
}

function tryMatchMathToken(source: string, index: number): { token: string; len: number } | null {
  if (source[index] === '\\') {
    const match = source.slice(index).match(/^\\[a-zA-Z]+(\*\d?)?(\{[^{}]*\})*/);
    if (match) return { token: match[0], len: match[0].length };
  }

  if (/[μσθΘβερλωτΔΣ√∈≤≥≠∅∩∀∃…←↦⌊⌋]/.test(source[index])) {
    return { token: source[index], len: 1 };
  }

  const scoreMatch = source.slice(index).match(/^Score(?:_\w+)?\([^)]*\)/);
  if (scoreMatch) return { token: scoreMatch[0], len: scoreMatch[0].length };

  for (const abbrev of MATH_ABBREVS) {
    if (source.startsWith(abbrev, index)) {
      const next = source[index + abbrev.length];
      if (!next || !/[A-Za-z0-9_]/.test(next)) {
        return { token: abbrev, len: abbrev.length };
      }
    }
  }

  const scriptMatch = source.slice(index).match(
    /^[A-Za-z][A-Za-z0-9]*(?:_(?:\{[^{}]*\}|[A-Za-z0-9]+)|\^(?:\{[^{}]*\}|[A-Za-z0-9]+))+/,
  );
  if (scriptMatch) return { token: scriptMatch[0], len: scriptMatch[0].length };

  const wordMatch = source.slice(index).match(/^[A-Za-z]+/);
  if (wordMatch && !isEnglishWord(wordMatch[0])) {
    const next = source[index + wordMatch[0].length];
    if (!next || !/[A-Za-z0-9_]/.test(next)) {
      return { token: wordMatch[0], len: wordMatch[0].length };
    }
  }

  const single = source[index];
  if (/[A-Za-z]/.test(single)) {
    const next = source[index + 1];
    if (!next || !/[A-Za-z0-9_]/.test(next)) {
      if (!isEnglishWord(single)) return { token: single, len: 1 };
    }
  }

  return null;
}

type Segment = { type: 'text' | 'math'; content: string };

function autoSegmentClause(clause: string): Segment[] {
  const segments: Segment[] = [];
  let i = 0;

  while (i < clause.length) {
    const math = tryMatchMathToken(clause, i);
    if (math) {
      segments.push({ type: 'math', content: math.token });
      i += math.len;
      continue;
    }

    let j = i + 1;
    while (j < clause.length && !tryMatchMathToken(clause, j)) j += 1;
    segments.push({ type: 'text', content: clause.slice(i, j) });
    i = j;
  }

  return segments.filter((s) => s.content.length > 0);
}

function splitDelimitedText(text: string) {
  return text.split(/(\$[^$]+\$)/g).filter((part) => part.length > 0);
}

function renderKatexHtml(latex: string, displayMode: boolean) {
  return katex.renderToString(normalizeMathSegment(latex), {
    displayMode,
    throwOnError: false,
    strict: 'ignore',
    trust: false,
  });
}

function isExplicitLatexClause(clause: string) {
  return /\\(text|frac|hat|widehat|operatorname|sum|max|min|arg|mid|mathrm|mathbf|lfloor|rfloor)\b/.test(
    clause,
  );
}

function looksLikeFormula(clause: string) {
  return /[=^_$\\∑ΣβεμσθΘργΦ√Δλωτ]|\\frac|\\sum|\\max|\\min|\\arg|\\widehat|\\hat|\\bar|\\emptyset|\\cap|\\in|\\leq|\\geq|\\neq/.test(
    clause,
  );
}

function ClauseContent({ clause }: { clause: string }) {
  if (clause.includes('$')) {
    const parts = splitDelimitedText(clause);
    return (
      <span className="math-mixed">
        {parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
            const latex = part.slice(1, -1);
            return (
              <span
                key={`${index}-${latex}`}
                className="math-inline"
                dangerouslySetInnerHTML={{ __html: renderKatexHtml(latex, false) }}
              />
            );
          }
          return (
            <span key={`${index}-${part}`} className="math-prose">
              {part}
            </span>
          );
        })}
      </span>
    );
  }

  if (isExplicitLatexClause(clause)) {
    const hasProse = /\\text\{/.test(clause);
    return (
      <span
        className="math-mixed"
        dangerouslySetInnerHTML={{
          __html: renderKatexHtml(clause, !hasProse),
        }}
      />
    );
  }

  const segments = autoSegmentClause(clause);
  return (
    <span className="math-mixed">
      {segments.map((seg, index) => {
        if (seg.type === 'text') {
          return (
            <span key={`${index}-t`} className="math-prose">
              {seg.content}
            </span>
          );
        }
        return (
          <span
            key={`${index}-m-${seg.content}`}
            className="math-inline"
            dangerouslySetInnerHTML={{ __html: renderKatexHtml(seg.content, false) }}
          />
        );
      })}
    </span>
  );
}

export function MathMixed({ text }: { text: string }) {
  return <ClauseContent clause={text} />;
}

/** Prose footnote with inline $...$ math — use for descriptions, notes, and limits copy. */
export function MathNote({ text, className = 'math-note' }: { text: string; className?: string }) {
  return (
    <p className={className}>
      <MathMixed text={text} />
    </p>
  );
}

type Props = {
  text: string;
  className?: string;
};

export function MathDisplay({ text, className = 'math-display' }: Props) {
  const clauses = splitClauses(text);

  return (
    <div className={className}>
      {clauses.map((clause) => {
        if (!looksLikeFormula(clause)) {
          return (
            <p key={clause} className="math-note">
              {clause}
            </p>
          );
        }

        const isProse =
          clause.includes('$') ||
          isExplicitLatexClause(clause) ||
          autoSegmentClause(clause).some((s) => s.type === 'text');

        return (
          <div key={clause} className={isProse ? 'math-formula math-formula-prose' : 'math-formula'}>
            <ClauseContent clause={clause} />
          </div>
        );
      })}
    </div>
  );
}

export function MathBlock({ lines, compact = false }: { lines: string[]; compact?: boolean }) {
  return (
    <div className={compact ? 'math-display math-block math-block-compact' : 'math-display math-block'}>
      {lines.map((line) => (
        <div
          key={line}
          className={compact ? 'math-formula math-formula-compact' : 'math-formula'}
          dangerouslySetInnerHTML={{
            __html: renderKatexHtml(line, true),
          }}
        />
      ))}
    </div>
  );
}
