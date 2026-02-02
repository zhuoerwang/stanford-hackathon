export interface UserProfile {
  name?: string;
  cancerType?: string;
  stage?: string;
  priorTreatments?: string[];
  biomarkers?: string[];
  location?: string;
}

export interface ReferralLetter {
  patient_name: string;
  trial_name: string;
  nct_id: string;
  location?: string;
  sponsor?: string;
  criteria_met?: string[];
  letter_html: string;
}

export interface Trial {
  nct_id: string;
  title: string;
  phase: string;
  status: string;
  locations: string[];
}

export interface TrialDetail extends Trial {
  summary?: string;
  eligibility?: string[];
  description?: string;
  sponsor?: string;
  contact?: {
    name?: string;
    phone?: string;
    email?: string;
  };
  start_date?: string;
  completion_date?: string;
}

export interface Criteria {
  key: string;
  value: string;
}

export interface AgentAction {
  action: string;
  payload?: Record<string, unknown>;
  key?: string;
  value?: string;
  trials?: Trial[];
  trial_detail?: TrialDetail;
  nct_id?: string;
}

export const CANCER_TYPES = [
  'Lung',
  'Breast',
  'Colon',
  'Prostate',
  'Pancreatic',
  'Melanoma',
  'Other',
] as const;

export const STAGES = ['1', '2', '3', '4', 'Unknown'] as const;

export const PRIOR_TREATMENTS = [
  'Chemotherapy',
  'Radiation',
  'Surgery',
  'Immunotherapy',
  'None',
] as const;

export const BIOMARKERS = [
  'EGFR+',
  'BRCA',
  'ALK',
  'PD-L1',
  'Unknown',
] as const;
