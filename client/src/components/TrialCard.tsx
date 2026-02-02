import type { Trial } from '../types';

interface TrialCardProps {
  trial: Trial;
  onSelect: (nctId: string) => void;
}

export function TrialCard({ trial, onSelect }: TrialCardProps) {
  return (
    <div className="trial-card" onClick={() => onSelect(trial.nct_id)}>
      <div className="trial-header">
        <span className="trial-nct">{trial.nct_id}</span>
        <span className={`trial-status ${trial.status.toLowerCase().replace(/\s+/g, '-')}`}>
          {trial.status}
        </span>
      </div>

      <h4 className="trial-title">{trial.title}</h4>

      <div className="trial-meta">
        <span className="trial-phase">{trial.phase}</span>
        {trial.locations.length > 0 && (
          <span className="trial-location">
            📍 {trial.locations[0]}
            {trial.locations.length > 1 && ` +${trial.locations.length - 1} more`}
          </span>
        )}
      </div>
    </div>
  );
}
