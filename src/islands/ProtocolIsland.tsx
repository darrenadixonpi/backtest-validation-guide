import { useState } from 'react';
import {
  ProtocolRecommender,
  type StrategyMode,
  type WindowMode,
} from '../components/ProtocolRecommender';

export function ProtocolIsland() {
  const [strategyMode, setStrategyMode] = useState<StrategyMode>('indicator');
  const [windowMode, setWindowMode] = useState<WindowMode>('expanding');
  const [trials, setTrials] = useState<'few' | 'many'>('few');
  const [horizon, setHorizon] = useState<'zero' | 'positive'>('zero');
  const [refit, setRefit] = useState(true);

  return (
    <ProtocolRecommender
      strategyMode={strategyMode}
      windowMode={windowMode}
      trials={trials}
      horizon={horizon}
      refit={refit}
      onStrategyMode={setStrategyMode}
      onWindowMode={setWindowMode}
      onTrials={setTrials}
      onHorizon={setHorizon}
      onRefit={setRefit}
    />
  );
}
