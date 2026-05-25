import katex from 'katex';
import 'katex/dist/katex.min.css';

function protectScoreSemicolons(input: string) {
  return input.replace(/Score\(([^)]*?);([^)]*?)\)/g, (_, a, b) => `Score(${a}@@SCORE_SEMI@@${b})`);
}

function restoreScoreSemicolons(input: string) {
  return input.replace(/@@SCORE_SEMI@@/g, ';');
}

function splitClauses(input: string) {
  const protectedInput = protectScoreSemicolons(input);
  return protectedInput.split('; ').map((part) => restoreScoreSemicolons(part.trim())).filter(Boolean);
}

function looksLikeFormula(clause: string) {
  return /[=^_\\∑ΣβεμσθΘργΦ√Δλωτ]|\\frac|\\sum|\\max|\\min|\\arg|\\widehat|\\hat|\\bar|\\emptyset|\\cap|\\in|\\leq|\\geq|\\neq/.test(
    clause,
  );
}

function normalizeLatex(clause: string) {
  let s = clause
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
    .replace(/√/g, '\\sqrt')
    .replace(/·/g, '\\cdot')
    .replace(/−/g, '-')
    .replace(/≤/g, '\\leq')
    .replace(/≥/g, '\\geq')
    .replace(/≠/g, '\\neq')
    .replace(/≈/g, '\\approx')
    .replace(/∅/g, '\\emptyset')
    .replace(/∩/g, '\\cap')
    .replace(/∈/g, '\\in')
    .replace(/⊂/g, '\\subset')
    .replace(/∀/g, '\\forall')
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
    .replace(/w\.r\.t\./g, '\\text{w.r.t.}')
    .replace(/P&L/g, '\\text{P\\&L}');

  return wrapGlossaryProse(s);
}

const MATH_IDENTIFIERS = new Set([
  'Corr',
  'Score',
  'Sign',
  'Cov',
  'Var',
  'max',
  'min',
  'argmax',
  'rank',
  'Err',
  'IS',
  'OOS',
  'ORB',
  'WFA',
  'DSR',
  'PBO',
  'SPA',
  'MBB',
  'CPCV',
  'FWER',
  'FDR',
  'NW',
  'HAC',
  'Geometric',
  'Bootstrap',
  'Parametric',
  'Slippage',
  'Leaderboard',
  'DoF',
]);

const ENGLISH_WORDS = new Set([
  'and',
  'or',
  'if',
  'on',
  'at',
  'in',
  'of',
  'to',
  'for',
  'vs',
  'not',
  'no',
  'as',
  'by',
  'is',
  'are',
  'the',
  'a',
  'an',
  'with',
  'when',
  'where',
  'only',
  'leak',
  'bias',
  'purge',
  'valid',
  'fit',
  'using',
  'estimated',
  'evaluate',
  'requires',
  'require',
  'forbid',
  'exclude',
  'resample',
  'simulate',
  'allows',
  'around',
  'strictly',
  'before',
  'after',
  'often',
  'given',
  'independent',
  'invalid',
  'unless',
  'matches',
  'deployment',
  'hidden',
  'metric',
  'score',
  'blocks',
  'block',
  'indices',
  'taken',
  'series',
  'bootstrap',
  'recentered',
  'model',
  'beats',
  'benchmark',
  'regime',
  'objective',
  'feature',
  'features',
  'must',
  'use',
  'data',
  'release',
  'time',
  'forbid',
  'revised',
  'values',
  'depends',
  'varies',
  'annualize',
  'sample',
  'periods',
  'per',
  'year',
  'under',
  'mixing',
  'weak',
  'stationarity',
  'information',
  'train',
  'test',
  'that',
  'each',
  'step',
  'concatenate',
  'outer',
  'inner',
  'rank',
  'across',
  'splits',
  'holdout',
  'timeline',
  'replacement',
  'length',
  'constant',
  'signal',
  'session',
  'filter',
  'reset',
  'state',
  'simulator',
  'maps',
  'fills',
  'timestamps',
  'explicitly',
  'over',
  'high',
  'low',
  'from',
  'require',
  'claims',
  'estimate',
  'optimism',
  'paths',
  'folds',
  'minimizes',
  'cumulative',
  'loss',
  'refitting',
  'arbitrary',
  'corr',
  'within',
  'estimated',
  'evaluate',
  'training',
  'index',
  'training',
  'exclude',
  'fold',
  'design',
  'split',
  'panel',
  'row',
  'rows',
  'date',
  'fixed',
  'policy',
  'resample',
  'replicate',
  'replicates',
  'validate',
  'path',
  'measurable',
  'depending',
  'algebra',
  'deflated',
  'uses',
  'expected',
  'fraction',
  'paths',
  'rank',
  'likely',
  'overfit',
  'supports',
  'robustness',
  'prove',
  'alpha',
  'positive',
  'honest',
  'generalization',
  'path-dependent',
  'historical',
  'draw',
]);

function shouldWrapWord(word: string) {
  const trimmed = word.replace(/[.,:;!?]+$/, '');
  const trailing = word.slice(trimmed.length);
  if (!trimmed) return { wrap: false, trailing };

  if (MATH_IDENTIFIERS.has(trimmed)) return { wrap: false, trailing };
  if (/^[A-Za-z]$/.test(trimmed)) return { wrap: false, trailing };
  if (/^[A-Z]{2,4}$/.test(trimmed) && !ENGLISH_WORDS.has(trimmed.toLowerCase())) {
    return { wrap: false, trailing };
  }
  if (ENGLISH_WORDS.has(trimmed.toLowerCase())) return { wrap: true, trailing };
  if (trimmed.includes(' ')) return { wrap: true, trailing };
  if (trimmed.length >= 5) return { wrap: true, trailing };

  return { wrap: false, trailing };
}

function readScriptTail(input: string, startIndex: number) {
  if (startIndex >= input.length) return { token: '', nextIndex: startIndex };

  if (input[startIndex] === '{') {
    let depth = 1;
    let j = startIndex + 1;
    while (j < input.length && depth > 0) {
      if (input[j] === '{') depth += 1;
      if (input[j] === '}') depth -= 1;
      j += 1;
    }
    return { token: input.slice(startIndex, j), nextIndex: j };
  }

  if (input[startIndex] === '\\') {
    const cmdMatch = input.slice(startIndex).match(/^\\[a-zA-Z]+(\*\d?)?(\{[^{}]*\})*/);
    if (cmdMatch) {
      return { token: cmdMatch[0], nextIndex: startIndex + cmdMatch[0].length };
    }
  }

  return { token: input[startIndex] ?? '', nextIndex: startIndex + 1 };
}

function wrapGlossaryProse(input: string) {
  let out = '';
  let i = 0;

  while (i < input.length) {
    const ch = input[i];

    if (ch === '\\') {
      const cmdMatch = input.slice(i).match(/^\\[a-zA-Z]+(\*\d?)?(\{[^{}]*\})*/);
      if (cmdMatch) {
        out += cmdMatch[0];
        i += cmdMatch[0].length;
        continue;
      }
    }

    if (ch === '{') {
      let depth = 1;
      let j = i + 1;
      while (j < input.length && depth > 0) {
        if (input[j] === '{') depth += 1;
        if (input[j] === '}') depth -= 1;
        j += 1;
      }
      out += input.slice(i, j);
      i = j;
      continue;
    }

    if (ch === '_' || ch === '^') {
      out += ch;
      i += 1;
      const { token, nextIndex } = readScriptTail(input, i);
      out += token;
      i = nextIndex;
      continue;
    }

    if (/[A-Za-z]/.test(ch)) {
      let j = i;
      while (j < input.length && /[A-Za-z0-9' \-]/.test(input[j])) j += 1;
      const run = input.slice(i, j);
      const trimmedRun = run.trim();
      const leading = run.match(/^\s*/)?.[0] ?? '';
      const trailingSpace = run.match(/\s*$/)?.[0] ?? '';
      const { wrap, trailing } = shouldWrapWord(trimmedRun);

      out += leading;
      if (wrap) {
        out += `\\text{${trimmedRun}${trailing}}`;
      } else {
        out += trimmedRun + trailing;
      }
      out += trailingSpace;
      i = j;
      continue;
    }

    out += ch;
    i += 1;
  }

  return out;
}

function renderLatex(latex: string, displayMode = true) {
  const prepared = normalizeLatex(latex);
  const hasProse = /\\text\{/.test(prepared);

  return katex.renderToString(prepared, {
    displayMode: displayMode && !hasProse,
    throwOnError: false,
    strict: 'ignore',
    trust: false,
  });
}

function splitMixedText(text: string) {
  return text.split(/(\$[^$]+\$)/g).filter((part) => part.length > 0);
}

export function MathMixed({ text }: { text: string }) {
  const parts = splitMixedText(text);

  return (
    <span className="math-mixed">
      {parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          const latex = part.slice(1, -1);
          return (
            <span
              key={`${index}-${latex}`}
              className="math-inline"
              dangerouslySetInnerHTML={{ __html: renderLatex(latex, false) }}
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

        const prepared = normalizeLatex(clause);
        const hasProse = /\\text\{/.test(prepared);

        return (
          <div
            key={clause}
            className={hasProse ? 'math-formula math-formula-prose' : 'math-formula'}
            dangerouslySetInnerHTML={{
              __html: katex.renderToString(prepared, {
                displayMode: !hasProse,
                throwOnError: false,
                strict: 'ignore',
                trust: false,
              }),
            }}
          />
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
            __html: katex.renderToString(normalizeLatex(line), {
              displayMode: true,
              throwOnError: false,
              strict: 'ignore',
            }),
          }}
        />
      ))}
    </div>
  );
}
