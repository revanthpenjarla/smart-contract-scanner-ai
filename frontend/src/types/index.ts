export interface User {
  id: string;
  email: string;
  role: 'USER' | 'ADMIN';
}

export interface AuthState {
  user: User | null;
  token: string | null;
}

export interface VerifiedVulnerability {
  finding_id: string;
  is_vulnerable: boolean;
  type: string;
  title: string;
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Informational';
  confidence: number;
  function: string;
  line: number;
  description: string;
  staticEvidence: string;
  attackScenario: string;
  recommendation: string;
  fallback_used: boolean;
  fallback_reason?: string;
  verification_status?: 'CONFIRMED' | 'REJECTED' | 'UNVERIFIED';
  verifier_source?: string;
  model_used?: string;
  swcId: string;
  cweId: string;
  codeSnippet: string;
  fixed_code?: string;
  static_confidence?: number;
  rag_similarity_score?: number;
  rag_explanation?: string;
}

export interface VulnerabilityReport {
  analysis_id: string;
  contract_name: string;
  timestamp: string;
  total_findings: number;
  is_vulnerable: boolean;
  severity_counts: Record<string, number>;
  findings: VerifiedVulnerability[];
  suppressed_findings?: VerifiedVulnerability[];
  raw_findings_count?: number;
  ai_confirmed_count?: number;
  ai_rejected_count?: number;
  summary: string;
  mode?: string;
  analysis_mode?: string;
  model_used?: string;
  security_score?: number;
  risk_level?: string;
  source_hash?: string;
  report_hash?: string;
}

export interface AnalysisHistoryItem {
  id: string;
  contract_name: string;
  status: string;
  created_at: string;
  total_findings: number;
  is_vulnerable: boolean;
  severity_counts: Record<string, number>;
}

export interface AdminUser {
  id: string;
  email: string;
  role: string;
  created_at: string;
  scan_count: number;
}

export interface AdminAnalysis {
  id: string;
  user_email: string;
  contract_name: string;
  status: string;
  created_at: string;
  total_findings: number;
  is_vulnerable: boolean;
  severity_counts: Record<string, number>;
}

export interface AdminAnalytics {
  total_users: number;
  total_analyses: number;
  total_vulnerabilities: number;
  severity_distribution: Record<string, number>;
  category_distribution: Record<string, number>;
  vulnerable_contracts_ratio: number;
}
