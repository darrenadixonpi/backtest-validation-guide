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
    .replace(/θ̂/g, '\\hat{\\theta}')
    .replace(/SR̂/g, '\\widehat{SR}')
    .replace(/s̄/g, '\\bar{s}')
    .replace(/σ̂/g, '\\hat{\\sigma}')
    .replace(/d̄/g, '\\bar{d}')
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
    .replace(/∅/g, '\\emptyset')
    .replace(/∩/g, '\\cap')
    .replace(/∈/g, '\\in')
    .replace(/∀/g, '\\forall')
    .replace(/∃/g, '\\exists')
    .replace(/…/g, '\\ldots')
    .replace(/←/g, '\\leftarrow')
    .replace(/↦/g, '\\mapsto')
    .replace(/⌊/g, '\\lfloor')
    .replace(/⌋/g, '\\rfloor')
    .replace(/H₀/g, 'H_0')
    .replace(/T_train/g, 'T_{\\text{train}}')
    .replace(/T_test/g, 'T_{\\text{test}}')
    .replace(/T_inner/g, 'T_{\\text{inner}}')
    .replace(/V_test/g, 'V_{\\text{test}}');

  return s;
}

function renderLatex(latex: string) {
  return katex.renderToString(normalizeLatex(latex), {
    displayMode: true,
    throwOnError: false,
    strict: 'ignore',
    trust: false,
  });
}

type Props = {
  text: string;
  className?: string;
};

export function MathDisplay({ text, className = 'math-display' }: Props) {
  const clauses = splitClauses(text);

  return (
    <div className={className}>
      {clauses.map((clause) =>
        looksLikeFormula(clause) ? (
          <div
            key={clause}
            className="math-formula"
            dangerouslySetInnerHTML={{ __html: renderLatex(clause) }}
          />
        ) : (
          <p key={clause} className="math-note">
            {clause}
          </p>
        ),
      )}
    </div>
  );
}

export function MathBlock({ lines }: { lines: string[] }) {
  return (
    <div className="math-display math-block">
      {lines.map((line) => (
        <div
          key={line}
          className="math-formula math-formula-compact"
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
