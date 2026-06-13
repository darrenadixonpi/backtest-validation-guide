import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { TERMS } from '../data/terms';
import { METHODS } from '../data/methods';
import { SCENARIOS } from '../data/scenarios';
import { TOOLS } from '../data/tools';
import type { Section } from '../utils/hash';

type ResultKind = 'term' | 'method' | 'scenario' | 'tool';

type SearchResult = {
  id: string;
  kind: ResultKind;
  label: string;
  sub: string;
  section: Section;
  detail?: string;
};

const KIND_LABEL: Record<ResultKind, string> = {
  term: 'Glossary',
  method: 'Methods',
  scenario: 'Use Cases',
  tool: 'Tools',
};

function score(text: string, q: string): number {
  const t = text.toLowerCase();
  if (t.startsWith(q)) return 3;
  if (t.includes(q)) return 2;
  return 0;
}

function search(q: string): SearchResult[] {
  if (!q) return [];
  const lq = q.toLowerCase();
  const results: (SearchResult & { score: number })[] = [];

  for (const t of TERMS) {
    const s = Math.max(
      score(t.name, lq),
      score(t.category, lq),
      ...(t.aliases ?? []).map((a) => score(a, lq)),
      score(t.beginner, lq),
      score(t.professional, lq),
    );
    if (s > 0)
      results.push({ id: t.id, kind: 'term', label: t.name, sub: t.category, section: 'glossary', detail: t.id, score: s });
  }

  for (const m of METHODS) {
    const s = Math.max(score(m.name, lq), score(m.category, lq), score(m.whenToUse, lq));
    if (s > 0)
      results.push({ id: m.id, kind: 'method', label: m.name, sub: m.category, section: 'methods', detail: m.id, score: s });
  }

  for (const sc of SCENARIOS) {
    const s = Math.max(score(sc.title, lq), score(sc.context, lq));
    if (s > 0)
      results.push({ id: sc.id, kind: 'scenario', label: sc.title, sub: 'Use case', section: 'playbook', score: s });
  }

  for (const tool of TOOLS) {
    const s = Math.max(score(tool.name, lq), score(tool.summary, lq));
    if (s > 0)
      results.push({ id: tool.id, kind: 'tool', label: tool.name, sub: tool.summary.slice(0, 60) + '…', section: 'tools', score: s });
  }

  results.sort((a, b) => b.score - a.score || a.label.localeCompare(b.label));
  return results.slice(0, 24);
}

type Props = {
  onNavigate?: (section: Section, detail?: string) => void;
};

function defaultNavigate(s: Section, detail?: string) {
  const url = detail ? `/${s}/${detail}/` : s === 'overview' ? '/' : `/${s}/`;
  window.location.href = url;
}

export function GlobalSearch({ onNavigate = defaultNavigate }: Props) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [cursor, setCursor] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const results = search(q);

  // Cmd/Ctrl+K to open
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Reset state when opening (derived-state pattern avoids setState-in-effect lint rule)
  const [prevOpen, setPrevOpen] = useState(open);
  if (prevOpen !== open) {
    setPrevOpen(open);
    if (open) { setQ(''); setCursor(0); }
  }

  // Focus input on open (effect is fine here — no setState, just DOM interaction)
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 10);
  }, [open]);

  // Scroll active item into view
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLLIElement>('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' });
  }, [cursor]);

  function close() {
    setOpen(false);
    setQ('');
  }

  function pick(r: SearchResult) {
    onNavigate(r.section, r.detail);
    close();
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor((c) => Math.min(c + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
    if (e.key === 'Enter' && results[cursor]) pick(results[cursor]);
  }

  // Group results by kind
  const groups: [ResultKind, SearchResult[]][] = [];
  const seen = new Set<ResultKind>();
  for (const r of results) {
    if (!seen.has(r.kind)) { seen.add(r.kind); groups.push([r.kind, []]); }
    groups[groups.length - 1][1].push(r);
  }

  let itemIndex = -1;

  if (!open) {
    return (
      <button
        type="button"
        className="search-trigger"
        aria-label="Search (Cmd+K)"
        onClick={() => setOpen(true)}
      >
        <span className="search-icon" aria-hidden>⌕</span>
        <span className="search-hint">Search</span>
        <kbd>⌘K</kbd>
      </button>
    );
  }

  return (
    <div className="search-overlay" role="dialog" aria-label="Global search" aria-modal>
      <div className="search-backdrop" onClick={close} />
      <div className="search-modal">
        <input
          ref={inputRef}
          className="search-input"
          type="search"
          placeholder="Search glossary, methods, tools…"
          value={q}
          onChange={(e) => { setQ(e.target.value); setCursor(0); }}
          onKeyDown={onKeyDown}
          aria-label="Search"
          autoComplete="off"
        />
        {q && (
          <ul className="search-results" ref={listRef} role="listbox">
            {results.length === 0 && (
              <li className="search-empty">No results for "{q}"</li>
            )}
            {groups.map(([kind, items]) => (
              <li key={kind} className="search-group">
                <span className="search-group-label">{KIND_LABEL[kind]}</span>
                <ul>
                  {items.map((r) => {
                    itemIndex++;
                    const idx = itemIndex;
                    return (
                      <li
                        key={r.id}
                        data-active={cursor === idx ? 'true' : undefined}
                        className={cursor === idx ? 'search-item active' : 'search-item'}
                        role="option"
                        aria-selected={cursor === idx}
                        onMouseEnter={() => setCursor(idx)}
                        onClick={() => pick(r)}
                      >
                        <span className="search-item-label">{r.label}</span>
                        <span className="search-item-sub">{r.sub}</span>
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ul>
        )}
        {!q && (
          <p className="search-prompt">Type to search across all sections</p>
        )}
      </div>
    </div>
  );
}
