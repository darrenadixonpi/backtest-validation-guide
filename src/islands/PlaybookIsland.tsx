import { ScenarioPlaybook } from '../components/ScenarioPlaybook';

export function PlaybookIsland() {
  return (
    <ScenarioPlaybook
      onSelectTerm={(id) => { window.location.href = `/glossary/${id}/`; }}
    />
  );
}
