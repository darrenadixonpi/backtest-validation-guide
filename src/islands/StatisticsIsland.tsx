import { lazy, Suspense, useState } from 'react';

const StatisticianAppendix = lazy(() =>
  import('../components/StatisticianAppendix').then((m) => ({ default: m.StatisticianAppendix })),
);

export function StatisticsIsland() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  function jumpToTerm(id: string) {
    window.location.href = `/glossary/${id}/`;
  }

  return (
    <Suspense fallback={<div className="loading">Loading…</div>}>
      <StatisticianAppendix
        onSelectTerm={jumpToTerm}
        checked={checked}
        onChecked={setChecked}
      />
    </Suspense>
  );
}
