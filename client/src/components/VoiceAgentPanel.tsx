import { useEffect, useRef, useState, useCallback } from 'react';
import { useVoiceAgent } from '../hooks/useVoiceAgent';
import { IntakeForm } from './IntakeForm';
import { ProfileSidebar } from './ProfileSidebar';
import { TrialList } from './TrialList';
import { TrialDetailPanel } from './TrialDetailPanel';
import { ReferralLetterModal } from './ReferralLetterModal';
import type { UserProfile, Criteria, Trial, TrialDetail, AgentAction, ReferralLetter } from '../types';

export function VoiceAgentPanel() {
  const [userProfile, setUserProfile] = useState<UserProfile>({});
  const [additionalCriteria, setAdditionalCriteria] = useState<Criteria[]>([]);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [matchingTrialsCount, setMatchingTrialsCount] = useState<number | undefined>(
    undefined
  );
  const [selectedTrialDetail, setSelectedTrialDetail] = useState<TrialDetail | null>(null);
  const [referralLetter, setReferralLetter] = useState<ReferralLetter | null>(null);

  const handleAgentAction = useCallback((action: AgentAction) => {
    console.log('[VoiceAgentPanel] handleAgentAction called:', action);

    switch (action.action) {
      case 'add_criteria':
        console.log('[VoiceAgentPanel] Adding criteria:', action.key, action.value);
        if (action.key && action.value) {
          setAdditionalCriteria((prev) => {
            // Update existing or add new
            const existing = prev.findIndex((c) => c.key === action.key);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = { key: action.key!, value: action.value! };
              return updated;
            }
            return [...prev, { key: action.key!, value: action.value! }];
          });
        }
        break;

      case 'show_trials':
        console.log('[VoiceAgentPanel] Showing trials:', action.trials);
        if (action.trials) {
          setTrials(action.trials);
        }
        break;

      case 'update_match_count':
        if (action.payload?.count !== undefined) {
          setMatchingTrialsCount(action.payload.count as number);
        }
        break;

      case 'clear_trials':
        setTrials([]);
        break;

      case 'show_trial_details':
        // After Vocal Bridge format conversion, payload fields are spread onto action
        console.log('[VoiceAgentPanel] Showing trial details:', action);
        if (action.nct_id) {
          // Cast action directly since payload is spread onto it
          setSelectedTrialDetail(action as unknown as TrialDetail);
        }
        break;

      case 'show_referral_letter':
        console.log('[VoiceAgentPanel] Showing referral letter:', action);
        if (action.payload || action.letter_html) {
          const letterData = action.payload as ReferralLetter || action as unknown as ReferralLetter;
          setReferralLetter(letterData);
        }
        break;

      default:
        console.log('[VoiceAgentPanel] Unknown agent action:', action);
    }
  }, []);

  const {
    isConnected,
    isConnecting,
    isMicEnabled,
    error,
    connect,
    disconnect,
    toggleMic,
    setAudioContainer,
    sendActionToAgent,
  } = useVoiceAgent({ onAgentAction: handleAgentAction });

  const audioContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setAudioContainer(audioContainerRef.current);
  }, [setAudioContainer]);

  const handleStartChat = useCallback(
    (profile: UserProfile) => {
      setUserProfile(profile);
      connect(profile);
    },
    [connect]
  );

  const handleSelectTrial = useCallback(
    (nctId: string) => {
      sendActionToAgent('trial_selected', { nct_id: nctId });
    },
    [sendActionToAgent]
  );

  return (
    <div className={`voice-agent-container ${isConnected ? 'connected' : ''}`}>
      <div className="main-panel">
        <div className="voice-agent-panel">
          <div className="panel-header">
            <div className="panel-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="url(#panelGrad)" strokeWidth="1.5">
                <defs>
                  <linearGradient id="panelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6"/>
                    <stop offset="100%" stopColor="#8b5cf6"/>
                  </linearGradient>
                </defs>
                <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                <line x1="12" x2="12" y1="19" y2="22"/>
              </svg>
            </div>
            <h2>Start Your Search</h2>
          </div>
          <p className="description">
            {isConnected
              ? 'Speak with Sarah, our specialist, to find clinical trials that match your profile.'
              : 'Connect with Sarah, our AI specialist who searches ClinicalTrials.gov to find trials for you.'}
          </p>

          {/* Connection status indicator */}
          <div
            className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`}
          >
            <span className="status-dot"></span>
            <span className="status-text">
              {isConnecting
                ? 'Connecting...'
                : isConnected
                  ? 'Connected'
                  : 'Disconnected'}
            </span>
          </div>

          {/* Error message */}
          {error && <div className="error-message">{error}</div>}

          {/* Pre-connect: IntakeForm */}
          {!isConnected && !isConnecting && (
            <IntakeForm onStartChat={handleStartChat} isConnecting={isConnecting} />
          )}

          {/* Connected: Controls */}
          {isConnected && (
            <div className="call-controls">
              <button
                className={`call-button mic-button ${isMicEnabled ? 'enabled' : 'muted'}`}
                onClick={toggleMic}
                title={isMicEnabled ? 'Mute' : 'Unmute'}
              >
                <span className="call-button-icon">
                  {isMicEnabled ? (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                      <line x1="12" x2="12" y1="19" y2="22"/>
                    </svg>
                  ) : (
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="2" x2="22" y1="2" y2="22"/>
                      <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/>
                      <path d="M5 10v2a7 7 0 0 0 12 5"/>
                      <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/>
                      <path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>
                      <line x1="12" x2="12" y1="19" y2="22"/>
                    </svg>
                  )}
                </span>
                <span className="call-button-label">{isMicEnabled ? 'Mute' : 'Unmute'}</span>
              </button>
              <button
                className="call-button end-call-button"
                onClick={disconnect}
                title="End Call"
              >
                <span className="call-button-icon">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </span>
                <span className="call-button-label">End</span>
              </button>
            </div>
          )}

          {/* Connecting state */}
          {isConnecting && (
            <div className="connecting-state">
              <div className="connecting-spinner"></div>
              <p>Connecting to assistant...</p>
            </div>
          )}

          {/* Trial Results */}
          {isConnected && trials.length > 0 && (
            <TrialList trials={trials} onSelectTrial={handleSelectTrial} />
          )}

          {/* Hidden audio container for agent playback */}
          <div ref={audioContainerRef} className="audio-container" />
        </div>
      </div>

      {/* Profile Sidebar - visible when connected */}
      {isConnected && (
        <ProfileSidebar
          profile={userProfile}
          additionalCriteria={additionalCriteria}
          matchingTrialsCount={matchingTrialsCount}
        />
      )}

      {/* Trial Detail Panel - modal */}
      {selectedTrialDetail && (
        <TrialDetailPanel
          trial={selectedTrialDetail}
          onClose={() => setSelectedTrialDetail(null)}
        />
      )}

      {/* Referral Letter Modal */}
      {referralLetter && (
        <ReferralLetterModal
          letter={referralLetter}
          onClose={() => setReferralLetter(null)}
        />
      )}
    </div>
  );
}
