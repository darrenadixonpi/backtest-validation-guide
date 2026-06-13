import { useEffect, useRef, useState } from 'react';
import { suggestEditUrl, type FeedbackContext } from '../utils/feedback';

type Props = FeedbackContext & {
  className?: string;
  label?: string;
};

type State = 'idle' | 'open' | 'submitting' | 'done' | 'error';

// Cloudflare Turnstile site key (public — safe to ship to the client).
// When unset (e.g. local dev), the widget is skipped and the server skips
// verification too, so the box still works end-to-end.
const SITE_KEY =
  ((import.meta.env as Record<string, string | undefined>).PUBLIC_TURNSTILE_SITE_KEY ?? '').trim();

// --- Turnstile script loader (explicit render mode) ---------------------------
type TurnstileOptions = {
  sitekey: string;
  callback?: (token: string) => void;
  'expired-callback'?: () => void;
  'error-callback'?: () => void;
  theme?: 'auto' | 'light' | 'dark';
  size?: 'normal' | 'flexible' | 'compact';
};

type Turnstile = {
  render: (el: HTMLElement, opts: TurnstileOptions) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
  getResponse: (id?: string) => string | undefined;
};

declare global {
  interface Window {
    turnstile?: Turnstile;
  }
}

let turnstilePromise: Promise<Turnstile> | null = null;

function loadTurnstile(): Promise<Turnstile> {
  if (typeof window === 'undefined') return Promise.reject(new Error('no window'));
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (turnstilePromise) return turnstilePromise;

  turnstilePromise = new Promise<Turnstile>((resolve, reject) => {
    const src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
    const onReady = () =>
      window.turnstile ? resolve(window.turnstile) : reject(new Error('turnstile unavailable'));

    if (existing) {
      existing.addEventListener('load', onReady);
      existing.addEventListener('error', () => reject(new Error('turnstile failed to load')));
      if (window.turnstile) onReady();
      return;
    }

    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.defer = true;
    s.addEventListener('load', onReady);
    s.addEventListener('error', () => reject(new Error('turnstile failed to load')));
    document.head.appendChild(s);
  });

  return turnstilePromise;
}

export function FeedbackLink({ className = 'feedback-link', label = 'Suggest an edit', ...ctx }: Props) {
  const [state, setState] = useState<State>('idle');
  const [text, setText] = useState('');
  const [resultUrl, setResultUrl] = useState('');
  const [token, setToken] = useState(''); // Turnstile token

  const hpRef = useRef<HTMLInputElement>(null);          // honeypot (must stay empty)
  const openedAtRef = useRef<number>(0);                 // form-open time (time-trap)
  const turnstileBoxRef = useRef<HTMLDivElement>(null);  // widget mount point
  const widgetIdRef = useRef<string | null>(null);       // rendered widget id

  const fallbackUrl = suggestEditUrl(ctx);
  const needsTurnstile = SITE_KEY.length > 0;
  const formOpen = state !== 'idle' && state !== 'done';

  function open() {
    openedAtRef.current = Date.now();
    setToken('');
    setState('open');
  }

  function close() {
    setState('idle');
    setText('');
    setToken('');
  }

  // Render / tear down the Turnstile widget alongside the form.
  useEffect(() => {
    if (!needsTurnstile || !formOpen) return;
    let cancelled = false;

    loadTurnstile()
      .then((ts) => {
        if (cancelled || !turnstileBoxRef.current || widgetIdRef.current) return;
        widgetIdRef.current = ts.render(turnstileBoxRef.current, {
          sitekey: SITE_KEY,
          callback: (t) => setToken(t),
          'expired-callback': () => setToken(''),
          'error-callback': () => setToken(''),
          theme: 'auto',
          size: 'flexible',
        });
      })
      .catch(() => {
        /* Network/adblock: widget won't appear; user can use the GitHub fallback link. */
      });

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
        widgetIdRef.current = null;
      }
    };
  }, [needsTurnstile, formOpen]);

  function resetTurnstile() {
    setToken('');
    if (widgetIdRef.current && window.turnstile) window.turnstile.reset(widgetIdRef.current);
  }

  async function submit() {
    if (!text.trim()) return;
    if (needsTurnstile && !token) return; // wait for the check

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
        body: JSON.stringify({
          title,
          body,
          hp: hpRef.current?.value ?? '',
          elapsedMs: Date.now() - openedAtRef.current,
          turnstileToken: token,
        }),
      });

      if (res.status === 503) {
        // Not configured — fall back to GitHub URL
        window.open(fallbackUrl, '_blank', 'noopener');
        close();
        return;
      }
      if (!res.ok) throw new Error(await res.text());

      const { url } = await res.json();
      setResultUrl(url);
      setState('done');
      setText('');
    } catch {
      // Turnstile tokens are single-use; get a fresh one before any retry.
      resetTurnstile();
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
      <button type="button" className={className} onClick={open}>
        {label}
      </button>
    );
  }

  const canSubmit = state !== 'submitting' && text.trim().length > 0 && (!needsTurnstile || token.length > 0);

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

      {/* Honeypot: hidden from humans, tempting to bots. Real users never fill this. */}
      <input
        ref={hpRef}
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        defaultValue=""
        style={{
          position: 'absolute',
          left: '-9999px',
          top: 0,
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      {needsTurnstile && <div ref={turnstileBoxRef} className="feedback-turnstile" />}

      <div className="feedback-actions">
        <button
          type="button"
          className="feedback-submit"
          disabled={!canSubmit}
          onClick={submit}
        >
          {state === 'submitting' ? 'Sending…' : 'Submit'}
        </button>
        <button
          type="button"
          className="feedback-cancel"
          onClick={close}
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
