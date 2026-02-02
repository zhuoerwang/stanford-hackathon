import type { TrialDetail } from '../types';

interface TrialDetailPanelProps {
  trial: TrialDetail;
  onClose: () => void;
}

export function TrialDetailPanel({ trial, onClose }: TrialDetailPanelProps) {
  return (
    <div className="trial-detail-overlay" onClick={onClose}>
      <div className="trial-detail-panel" onClick={(e) => e.stopPropagation()}>
        <button className="trial-detail-close" onClick={onClose}>
          ✕
        </button>

        <div className="trial-detail-header">
          <span className="trial-nct">{trial.nct_id}</span>
          <span className={`trial-status ${trial.status.toLowerCase().replace(/\s+/g, '-')}`}>
            {trial.status}
          </span>
        </div>

        <h3 className="trial-detail-title">{trial.title}</h3>

        <div className="trial-detail-meta">
          <span className="trial-phase">{trial.phase}</span>
          {trial.sponsor && <span className="trial-sponsor">Sponsor: {trial.sponsor}</span>}
        </div>

        {trial.summary && (
          <div className="trial-detail-section">
            <h4>Summary</h4>
            <p>{trial.summary}</p>
          </div>
        )}

        {trial.description && (
          <div className="trial-detail-section">
            <h4>Description</h4>
            <p>{trial.description}</p>
          </div>
        )}

        {trial.eligibility && trial.eligibility.length > 0 && (
          <div className="trial-detail-section">
            <h4>Eligibility Criteria</h4>
            <ul>
              {trial.eligibility.map((criteria, index) => (
                <li key={index}>{criteria}</li>
              ))}
            </ul>
          </div>
        )}

        {trial.locations.length > 0 && (
          <div className="trial-detail-section">
            <h4>Locations</h4>
            <ul>
              {trial.locations.map((location, index) => (
                <li key={index}>📍 {location}</li>
              ))}
            </ul>
          </div>
        )}

        {trial.contact && (trial.contact.name || trial.contact.phone || trial.contact.email) && (
          <div className="trial-detail-section">
            <h4>Contact</h4>
            {trial.contact.name && <p><strong>{trial.contact.name}</strong></p>}
            {trial.contact.phone && <p>📞 {trial.contact.phone}</p>}
            {trial.contact.email && <p>✉️ {trial.contact.email}</p>}
          </div>
        )}

        {(trial.start_date || trial.completion_date) && (
          <div className="trial-detail-section">
            <h4>Timeline</h4>
            {trial.start_date && <p>Start: {trial.start_date}</p>}
            {trial.completion_date && <p>Est. Completion: {trial.completion_date}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
