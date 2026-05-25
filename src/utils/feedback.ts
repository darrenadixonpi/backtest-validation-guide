export const GITHUB_REPO = 'darrenadixonpi/backtest-validation-guide';

export type FeedbackContext = {
  section: string;
  detail?: string;
  termName?: string;
  termId?: string;
};

export function suggestEditUrl({ section, detail, termName, termId }: FeedbackContext) {
  const title = `[Suggestion] ${section}${termName ? `: ${termName}` : ''}`;
  const body = [
    '## Section',
    section,
    detail ? `\n## Page context\n${detail}` : '',
    termName ? `\n## Term / topic\n${termName}${termId ? ` (\`${termId}\`)` : ''}` : '',
    '\n## Suggestion',
    '_Describe what should change — definition, formula, tool recommendation, missing content, etc._',
    '\n---',
    '_Submitted from the [Backtest Validation Guide](https://backtest-validation-guide.vercel.app/)._',
  ]
    .filter(Boolean)
    .join('\n');

  const params = new URLSearchParams({ title, body });
  return `https://github.com/${GITHUB_REPO}/issues/new?${params.toString()}`;
}

export const SECTION_LABELS: Record<string, string> = {
  overview: 'Overview',
  playbook: 'Use cases',
  protocol: 'Protocol builder',
  methods: 'Methods',
  glossary: 'Glossary',
  math: 'Math framework',
  statistics: 'Statistics',
  tools: 'Tools & stack',
};
