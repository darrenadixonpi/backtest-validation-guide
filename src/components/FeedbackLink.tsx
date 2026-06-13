import { useState } from 'react';
import { suggestEditUrl, type FeedbackContext } from '../utils/feedback';

type Props = FeedbackContext & {
  className?: string;
  label?: string;
};

type State = 'idle' | 'open' | 'submitting' | 'done' | 'error';

export function FeedbackLink({ className = 'feedback-link', label = 'Suggest an edit', ...ctx }: Props) {
  const [state, setState] = useState<State>('idle');
  const [text, setText] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const fallbackUrl = suggestEditUrl(ctx);

  async function submit() {
    if (!text.trim()) return;
    setState('submitting');

    const title = `[Suggestion] ${ctx.section}${ctx.termName ? `: ${ctx.termName}` : ''}`;
    const body = [
      '## Section',
      ctx.section,
      ctx.detail ? `\n## Page context\n${ctx.detail}` : '',
      ctx.termName ? `\n## Term / topic\n${ctx.termName}${ctx.termId ? ` (\`${ctx.termId}\`)` : ''}` : '',
      '\n## Suggestion',
      text.trim(),
      '\n---',
      '_Submitted from the [Backtest Validation Guide](https://backtest-validation-guide.vercel.app/)._',
    ].filter(Boolean).join('\n');

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, body }),
      });
      if (res.status === 503) {
        // Not configured — fall back to GitHub URL
        window.open(fallbackUrl, '_blank', 'noopener');
        setState('idle');
        setText('');
        return;
      }
      if (!res.ok) throw new Error(await res.text());
      const { url } = await res.json();
      setResultUrl(url);
      setState('done');
      setText('');
    } catch {
      setState('error');
    }
  }

  if (state === 'done') {
    return (
      <span className="feedback-done">
        ✓ Thanks — <a href={resultUrl} target="_blank" rel="noopener noreferrer">view issue</a>
        {' · '}
        <button type="button" className="feedback-reset" onClick={() => setState('idle')}>close</button>
      </span>
    );
  }

  if (state === 'idle') {
    return (
      <button
        type="button"
        className={className}
        onClick={() => setState('open')}
      >
        {label}
      </button>
    );
  }

  return (
    <div className="feedback-form">
      <textarea
        className="feedback-textarea"
        placeholder="Describe what should change — definition, formula, tool, missing content…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        autoFocus
        disabled={state === 'submitting'}
      />
      <div className="feedback-actions">
        <button
          type="button"
          className="feedback-submit"
          disabled={state === 'submitting' || !text.trim()}
          onClick={submit}
        >
          {state === 'submitting' ? 'Sending…' : 'Submit'}
        </button>
        <button
          type="button"
          className="feedback-cancel"
          onClick={() => { setState('idle'); setText(''); }}
          disabled={state === 'submitting'}
        >
          Cancel
        </button>
        {state === 'error' && (
          <span className="feedback-error">
            Failed — <a href={fallbackUrl} target="_blank" rel="noopener noreferrer">use GitHub</a>
          </span>
        )}
        <a className="feedback-github" href={fallbackUrl} target="_blank" rel="noopener noreferrer">
          Open in GitHub instead
        </a>
      </div>
    </div>
  );
}
