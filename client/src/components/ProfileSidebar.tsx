import type { UserProfile, Criteria } from '../types';

// Convert camelCase or snake_case keys to human-readable labels
function formatLabel(key: string): string {
  const labelMap: Record<string, string> = {
    cancerType: 'Cancer Type',
    cancer_type: 'Cancer Type',
    stage: 'Stage',
    priorTreatments: 'Prior Treatments',
    prior_treatments: 'Prior Treatments',
    biomarkers: 'Biomarkers',
    location: 'Location',
    age: 'Age',
    gender: 'Gender',
    diagnosis: 'Diagnosis',
    treatment_history: 'Treatment History',
    current_medications: 'Current Medications',
    allergies: 'Allergies',
    ecog_status: 'ECOG Status',
    genetic_markers: 'Genetic Markers',
  };

  if (labelMap[key]) {
    return labelMap[key];
  }

  // Fallback: convert camelCase/snake_case to Title Case
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}

interface ProfileSidebarProps {
  profile: UserProfile;
  additionalCriteria: Criteria[];
  matchingTrialsCount?: number;
}

export function ProfileSidebar({
  profile,
  additionalCriteria,
  matchingTrialsCount,
}: ProfileSidebarProps) {
  const hasProfile =
    profile.location ||
    profile.cancerType ||
    profile.stage ||
    (profile.priorTreatments && profile.priorTreatments.length > 0) ||
    (profile.biomarkers && profile.biomarkers.length > 0);

  const hasAdditionalCriteria = additionalCriteria.length > 0;

  if (!hasProfile && !hasAdditionalCriteria) {
    return (
      <div className="profile-sidebar">
        <h3>Your Profile</h3>
        <p className="empty-profile">No information collected yet</p>
      </div>
    );
  }

  return (
    <div className="profile-sidebar">
      <h3>Your Profile</h3>

      <div className="profile-items">
        {profile.location && (
          <div className="profile-item">
            <span className="profile-icon">📍</span>
            <span className="profile-value">{profile.location}</span>
          </div>
        )}

        {profile.cancerType && (
          <div className="profile-item">
            <span className="profile-icon">🫁</span>
            <span className="profile-label">Cancer:</span>
            <span className="profile-value">{profile.cancerType}</span>
          </div>
        )}

        {profile.stage && (
          <div className="profile-item">
            <span className="profile-icon">📊</span>
            <span className="profile-label">Stage:</span>
            <span className="profile-value">{profile.stage}</span>
          </div>
        )}

        {profile.priorTreatments && profile.priorTreatments.length > 0 && (
          <div className="profile-item">
            <span className="profile-icon">💊</span>
            <span className="profile-label">Prior:</span>
            <span className="profile-value">
              {profile.priorTreatments.join(', ')}
            </span>
          </div>
        )}

        {profile.biomarkers && profile.biomarkers.length > 0 && (
          <div className="profile-item">
            <span className="profile-icon">🧬</span>
            <span className="profile-label">Biomarkers:</span>
            <span className="profile-value">{profile.biomarkers.join(', ')}</span>
          </div>
        )}

        {additionalCriteria.map((criteria, index) => (
          <div key={index} className="profile-item additional">
            <span className="profile-icon">✓</span>
            <span className="profile-label">{formatLabel(criteria.key)}:</span>
            <span className="profile-value">{criteria.value}</span>
          </div>
        ))}
      </div>

      {matchingTrialsCount !== undefined && (
        <div className="matching-count">
          <span className="matching-label">Matching:</span>
          <span className="matching-value">~{matchingTrialsCount} trials</span>
        </div>
      )}
    </div>
  );
}
