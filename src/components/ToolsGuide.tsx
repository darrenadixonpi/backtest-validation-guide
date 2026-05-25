import { useMemo, useState } from 'react';
import {
  LANGUAGE_GUIDES,
  STEP_GUIDES,
  TOOL_PRINCIPLES,
  TOOLS,
  USE_CASE_STACKS,
  type ToolLicense,
} from '../data/tools';
import { SCENARIOS } from '../data/scenarios';

type SubSection = 'steps' | 'catalog' | 'languages' | 'use-cases';

function licenseBadge(license: ToolLicense) {
  const labels: Record<ToolLicense, string> = {
    'open-source': 'OSS',
    commercial: 'Commercial',
    mixed: 'Mixed',
  };
  return <span className={`tool-license tool-license-${license}`}>{labels[license]}</span>;
}

export function ToolsGuide() {
  const [sub, setSub] = useState<SubSection>('steps');
  const [stepFilter, setStepFilter] = useState<string>('all');
  const [licenseFilter, setLicenseFilter] = useState<'all' | ToolLicense>('all');

  const filteredTools = useMemo(() => {
    return TOOLS.filter((t) => {
      if (licenseFilter !== 'all' && t.license !== licenseFilter) return false;
      if (stepFilter !== 'all' && !t.steps.includes(stepFilter)) return false;
      return true;
    });
  }, [licenseFilter, stepFilter]);

  return (
    <section className="panel tools-panel">
      <div className="panel-head">
        <h2>Tools &amp; frameworks</h2>
        <p className="muted">
          Neutral map of software, languages, and stacks to validation steps. Open-source defaults first;
          commercial options noted with caveats. No tool replaces correct splits, trial logging, or holdout
          discipline.
        </p>
      </div>

      <ul className="tool-principles">
        {TOOL_PRINCIPLES.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>

      <div className="sub-tabs" role="tablist" aria-label="Tools sections">
        {(
          [
            ['steps', 'By validation step'],
            ['catalog', 'Tool catalog'],
            ['languages', 'Languages & ecosystems'],
            ['use-cases', 'By use case'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={sub === id}
            className={sub === id ? 'sub-tab active' : 'sub-tab'}
            onClick={() => setSub(id)}
          >
            {label}
          </button>
        ))}
      </div>

      {sub === 'steps' && (
        <div className="step-tools-grid">
          {STEP_GUIDES.map((s) => (
            <article key={s.id} className="step-tool-card">
              <header>
                <h3>{s.step}</h3>
                <p className="muted step-role">{s.role}</p>
              </header>
              <p>{s.synopsis}</p>
              <div className="tool-stack-block">
                <h4>Open-source default</h4>
                <ul>
                  {s.openSourceDefault.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              {s.alternatives.length > 0 && (
                <div className="tool-stack-block">
                  <h4>Alternatives &amp; commercial</h4>
                  <ul className="tool-alt-list">
                    {s.alternatives.map((a) => (
                      <li key={a.name}>
                        <strong>{a.name}</strong> {licenseBadge(a.license)}
                        <span className="muted"> — {a.note}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="implementation-note">
                <strong>Implementation:</strong> {s.implementationNote}
              </p>
            </article>
          ))}
        </div>
      )}

      {sub === 'catalog' && (
        <>
          <div className="tool-filters">
            <label>
              Validation step
              <select value={stepFilter} onChange={(e) => setStepFilter(e.target.value)}>
                <option value="all">All steps</option>
                {STEP_GUIDES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.step}
                  </option>
                ))}
              </select>
            </label>
            <label>
              License
              <select
                value={licenseFilter}
                onChange={(e) => setLicenseFilter(e.target.value as 'all' | ToolLicense)}
              >
                <option value="all">All</option>
                <option value="open-source">Open-source</option>
                <option value="commercial">Commercial</option>
                <option value="mixed">Mixed</option>
              </select>
            </label>
          </div>
          <div className="tool-catalog-grid">
            {filteredTools.map((t) => (
              <article key={t.id} className="tool-card">
                <div className="tool-card-head">
                  <h3>{t.name}</h3>
                  {licenseBadge(t.license)}
                </div>
                <p className="tool-langs">{t.languages.join(' · ')}</p>
                <p>{t.summary}</p>
                <div className="tool-tags">
                  {t.steps.map((stepId) => {
                    const step = STEP_GUIDES.find((s) => s.id === stepId);
                    return step ? (
                      <span key={stepId} className="tag">
                        {step.step}
                      </span>
                    ) : null;
                  })}
                </div>
                <h4>Good for</h4>
                <ul>
                  {t.goodFor.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
                <h4>Limitations</h4>
                <ul className="watchouts">
                  {t.limitations.map((l) => (
                    <li key={l}>{l}</li>
                  ))}
                </ul>
                {t.caveats && <p className="tool-caveat">{t.caveats}</p>}
              </article>
            ))}
          </div>
        </>
      )}

      {sub === 'languages' && (
        <div className="language-grid">
          {LANGUAGE_GUIDES.map((lang) => (
            <article key={lang.id} className="language-card">
              <h3>{lang.language}</h3>
              <p>
                <strong>Best when:</strong> {lang.bestWhen}
              </p>
              <div className="lang-columns">
                <div>
                  <h4>Strengths</h4>
                  <ul>
                    {lang.strengths.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Gaps</h4>
                  <ul className="watchouts">
                    {lang.gaps.map((g) => (
                      <li key={g}>{g}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <h4>Common libraries by area</h4>
              <dl className="lang-libs">
                {lang.libraries.map((lib) => (
                  <div key={lib.area}>
                    <dt>{lib.area}</dt>
                    <dd>{lib.picks.join(', ')}</dd>
                  </div>
                ))}
              </dl>
              {lang.commercialNote && <p className="tool-caveat">{lang.commercialNote}</p>}
            </article>
          ))}
        </div>
      )}

      {sub === 'use-cases' && (
        <div className="use-case-stack-grid">
          {USE_CASE_STACKS.map((uc) => {
            const scenario = uc.scenarioId ? SCENARIOS.find((s) => s.id === uc.scenarioId) : undefined;
            return (
              <article key={uc.id} className="use-case-stack-card">
                <h3>{uc.title}</h3>
                {scenario && <p className="muted">{scenario.context}</p>}
                <h4>Validation focus</h4>
                <ul>
                  {uc.validationFocus.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
                <h4>Suggested stack</h4>
                <div className="stack-layers">
                  {uc.suggestedStack.map((layer) => (
                    <div key={layer.layer} className="stack-layer">
                      <span className="stack-layer-name">{layer.layer}</span>
                      <span className="stack-layer-tools">{layer.tools.join(' · ')}</span>
                      <span className="muted stack-layer-note">{layer.note}</span>
                    </div>
                  ))}
                </div>
                <h4>Avoid</h4>
                <ul className="watchouts">
                  {uc.avoid.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
