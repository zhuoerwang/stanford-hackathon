import { useEffect, useState, useCallback } from 'react';
import { ChipSelector } from './ChipSelector';
import { getCurrentLocation } from '../services/location';
import type { UserProfile } from '../types';
import {
  CANCER_TYPES,
  STAGES,
  PRIOR_TREATMENTS,
  BIOMARKERS,
} from '../types';

interface IntakeFormProps {
  onStartChat: (profile: UserProfile) => void;
  isConnecting: boolean;
}

export function IntakeForm({ onStartChat, isConnecting }: IntakeFormProps) {
  const [name, setName] = useState<string>('');
  const [cancerType, setCancerType] = useState<string>('');
  const [stage, setStage] = useState<string>('');
  const [priorTreatments, setPriorTreatments] = useState<string[]>([]);
  const [biomarkers, setBiomarkers] = useState<string[]>([]);
  const [location, setLocation] = useState<string>('');
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    getCurrentLocation()
      .then((loc) => {
        setLocation(loc);
        setLocationError(null);
      })
      .catch((err) => {
        setLocationError(err.message);
      })
      .finally(() => {
        setLocationLoading(false);
      });
  }, []);

  const handleStartChat = useCallback(() => {
    const profile: UserProfile = {
      location: location || undefined,
    };

    if (name) profile.name = name;
    if (cancerType) profile.cancerType = cancerType;
    if (stage) profile.stage = stage;
    if (priorTreatments.length > 0) profile.priorTreatments = priorTreatments;
    if (biomarkers.length > 0) profile.biomarkers = biomarkers;

    onStartChat(profile);
  }, [name, cancerType, stage, priorTreatments, biomarkers, location, onStartChat]);

  return (
    <div className="intake-form">
      <div className="data-source-badge">
        <span className="gov-icon">🏛️</span>
        <span>Data from <strong>ClinicalTrials.gov</strong></span>
      </div>

      <div className="location-display">
        {locationLoading ? (
          <span className="location-loading">
            <span className="location-icon">📍</span>
            Detecting location...
          </span>
        ) : locationError ? (
          <span className="location-error">
            <span className="location-icon">📍</span>
            {locationError}
          </span>
        ) : (
          <span className="location-detected">
            <span className="location-icon">📍</span>
            {location}
          </span>
        )}
      </div>

      <div className="name-input-container">
        <label htmlFor="name-input" className="name-label">Your Name</label>
        <input
          id="name-input"
          type="text"
          className="name-input"
          placeholder="e.g., John"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className={`quick-start-section ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <button
          className="quick-start-header"
          onClick={() => setIsExpanded(!isExpanded)}
          type="button"
        >
          <div className="quick-start-header-content">
            <span className="quick-start-icon">{isExpanded ? '▼' : '▶'}</span>
            <span className="quick-start-title">Pre-fill Medical Profile (Optional)</span>
          </div>
          <span className="quick-start-badge">Faster matching</span>
        </button>
        <p className="quick-start-hint">
          Enter your diagnosis details to skip intake questions and get matched faster
        </p>

        {isExpanded && (
          <div className="quick-start-content">
            <ChipSelector
              label="Cancer Type"
              options={CANCER_TYPES}
              selected={cancerType}
              onChange={(value) => setCancerType(value as string)}
            />

            <ChipSelector
              label="Stage"
              options={STAGES}
              selected={stage}
              onChange={(value) => setStage(value as string)}
            />

            <ChipSelector
              label="Prior Treatment"
              options={PRIOR_TREATMENTS}
              selected={priorTreatments}
              onChange={(value) => setPriorTreatments(value as string[])}
              multiSelect
            />

            <ChipSelector
              label="Biomarkers"
              options={BIOMARKERS}
              selected={biomarkers}
              onChange={(value) => setBiomarkers(value as string[])}
              multiSelect
            />
          </div>
        )}
      </div>

      <button
        className="connect-button start-chat-button"
        onClick={handleStartChat}
        disabled={isConnecting}
      >
        {isConnecting ? 'Connecting...' : '🎙️ Speak with a Trial Specialist'}
      </button>

      <div className="disclaimer">
        <span className="disclaimer-icon">⚠️</span>
        This tool helps find trials but does not provide medical advice.
        Always consult your oncologist before making treatment decisions.
      </div>
    </div>
  );
}
