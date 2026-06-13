import { useState } from 'react';
import { GlossaryPanel } from '../components/GlossaryPanel';
import type { Level } from '../data/types';

type Props = {
  initialTermId?: string;
};

export function GlossaryIsland({ initialTermId = 'backtesting' }: Props) {
  const [search, setSearch] = useState('');
  const [selectedTerm, setSelectedTerm] = useState(initialTermId);
  const [level, setLevel] = useState<Level>('beginner');

  return (
    <GlossaryPanel
      search={search}
      onSearch={setSearch}
      selectedTermId={selectedTerm}
      onSelectTerm={setSelectedTerm}
      level={level}
      onLevel={setLevel}
    />
  );
}
