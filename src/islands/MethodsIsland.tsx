import { lazy, Suspense, useState } from 'react';

const MethodComparisonTable = lazy(() =>
  import('../components/MethodExplorer').then((m) => ({ default: m.MethodComparisonTable })),
);
const MethodExplorer = lazy(() =>
  import('../components/MethodExplorer').then((m) => ({ default: m.MethodExplorer })),
);
const ValidationCharts = lazy(() =>
  import('../components/ValidationCharts').then((m) => ({ default: m.ValidationCharts })),
);

type Props = {
  initialMethodId?: string;
};

export function MethodsIsland({ initialMethodId = 'wfa' }: Props) {
  const [selectedMethod, setSelectedMethod] = useState(initialMethodId);

  function jumpToTerm(id: string) {
    window.location.href = `/glossary/${id}/`;
  }

  return (
    <Suspense fallback={<div className="loading">Loading…</div>}>
      <MethodComparisonTable />
      <MethodExplorer
        selectedMethodId={selectedMethod}
        onSelectMethod={setSelectedMethod}
        onSelectTerm={jumpToTerm}
      />
      <ValidationCharts />
    </Suspense>
  );
}
