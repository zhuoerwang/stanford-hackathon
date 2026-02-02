import type { Trial } from '../types';
import { TrialCard } from './TrialCard';

interface TrialListProps {
  trials: Trial[];
  onSelectTrial: (nctId: string) => void;
}

export function TrialList({ trials, onSelectTrial }: TrialListProps) {
  if (trials.length === 0) {
    return null;
  }

  return (
    <div className="trial-list">
      <h3>Matching Trials</h3>
      <div className="trial-grid">
        {trials.map((trial) => (
          <TrialCard key={trial.nct_id} trial={trial} onSelect={onSelectTrial} />
        ))}
      </div>
    </div>
  );
}
