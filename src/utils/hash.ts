/**
 * Minimal hash-based deep linking.
 *
 * Format:  #section[/detail]
 *   #glossary/dsr      → section=glossary, selectedTerm=dsr
 *   #methods/wfa       → section=methods,  selectedMethod=wfa
 *   #overview          → section=overview  (no detail)
 */

export type Section =
  | 'overview'
  | 'playbook'
  | 'protocol'
  | 'methods'
  | 'glossary'
  | 'math'
  | 'statistics'
  | 'tools';

const VALID_SECTIONS: Section[] = [
  'overview',
  'playbook',
  'protocol',
  'methods',
  'glossary',
  'math',
  'statistics',
  'tools',
];

export type ParsedHash = {
  section: Section;
  detail: string | null;
};

export function parseHash(hash: string): ParsedHash {
  const raw = hash.startsWith('#') ? hash.slice(1) : hash;
  const [seg, detail = null] = raw.split('/');
  const section = VALID_SECTIONS.includes(seg as Section) ? (seg as Section) : 'overview';
  return { section, detail };
}

export function buildHash(section: Section, detail?: string | null): string {
  return detail ? `#${section}/${detail}` : `#${section}`;
}

export function pushHash(section: Section, detail?: string | null): void {
  const next = buildHash(section, detail);
  if (window.location.hash !== next) {
    window.history.pushState(null, '', next);
  }
}
