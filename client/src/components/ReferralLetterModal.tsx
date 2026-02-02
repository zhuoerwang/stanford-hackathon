import type { ReferralLetter } from '../types';

interface ReferralLetterModalProps {
  letter: ReferralLetter;
  onClose: () => void;
}

export function ReferralLetterModal({ letter, onClose }: ReferralLetterModalProps) {
  return (
    <div className="referral-letter-overlay" onClick={onClose}>
      <div className="referral-letter-modal" onClick={(e) => e.stopPropagation()}>
        <button className="referral-letter-close" onClick={onClose}>
          &times;
        </button>

        <div className="referral-letter-header">
          <div className="referral-letter-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#letterGrad)" strokeWidth="1.5">
              <defs>
                <linearGradient id="letterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#10b981"/>
                  <stop offset="100%" stopColor="#059669"/>
                </linearGradient>
              </defs>
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
              <polyline points="10 9 9 9 8 9"/>
            </svg>
          </div>
          <div>
            <h2>Referral Letter Generated</h2>
            <p className="referral-letter-subtitle">Ready to share with your oncologist</p>
          </div>
        </div>

        <div className="referral-letter-meta">
          <div className="meta-item">
            <span className="meta-label">Patient</span>
            <span className="meta-value">{letter.patient_name || 'Patient'}</span>
          </div>
          <div className="meta-item">
            <span className="meta-label">Trial</span>
            <span className="meta-value">{letter.nct_id}</span>
          </div>
          {letter.location && (
            <div className="meta-item">
              <span className="meta-label">Location</span>
              <span className="meta-value">{letter.location}</span>
            </div>
          )}
        </div>

        <div className="referral-letter-content">
          <div
            className="letter-body"
            dangerouslySetInnerHTML={{ __html: letter.letter_html }}
          />
        </div>

        <div className="referral-letter-actions">
          <button className="referral-action-button copy-button" onClick={() => {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = letter.letter_html;
            navigator.clipboard.writeText(tempDiv.textContent || '');
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
            Copy to Clipboard
          </button>
          <button className="referral-action-button print-button" onClick={() => window.print()}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Print
          </button>
        </div>

        <div className="referral-letter-disclaimer">
          <strong>Next Steps:</strong> Share this letter with your oncologist to discuss whether this trial is right for you.
        </div>
      </div>
    </div>
  );
}
