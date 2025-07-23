
// Database types that match the actual Supabase structure
export interface AdvisoryClientDB {
  id: string;
  client_id: string;
  client_name: string;
  contact_info: string;
  email: string | null;
  occupation: string;
  financial_stage: string;
  risk_tolerance: string;
  investment_preference: string;
  knowledge_level: string;
  total_sessions: number;
  last_session_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AdvisorySessionDB {
  id: string;
  client_id: string | null;
  advisory_type: string;
  advisor_name: string;
  session_date: string;
  advice_given: string | null;
  action_plan: string | null;
  supporting_materials: string | null;
  notes: string | null;
  follow_up_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  advisory_clients: AdvisoryClientDB | null;
}

export interface FinancialGoalDB {
  id: string;
  client_id: string | null;
  goal_type: string;
  goal_amount: number;
  target_date: string;
  progress: number;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface FollowUpRecordDB {
  id: string;
  client_id: string | null;
  follow_up_date: string;
  purpose: string;
  status: string;
  outcome_notes: string | null;
  created_at: string;
  updated_at: string;
  advisory_clients: AdvisoryClientDB | null;
}

// Frontend types with proper type casting
export interface AdvisoryClient {
  id: string;
  client_id: string;
  client_name: string;
  contact_info: string;
  email: string | null;
  occupation: string;
  financial_stage: string;
  risk_tolerance: "low" | "moderate" | "high";
  investment_preference: string;
  knowledge_level: string;
  total_sessions: number;
  last_session_date: string | null;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface AdvisorySession {
  id: string;
  client_id: string | null;
  client_name: string;
  advisory_type: string;
  advisor_name: string;
  session_date: string;
  advice_given: string | null;
  action_plan: string | null;
  supporting_materials: string | null;
  notes: string | null;
  follow_up_date: string | null;
  status: "completed" | "scheduled" | "cancelled";
  created_at: string;
  updated_at: string;
}

export interface FinancialGoal {
  id: string;
  client_id: string | null;
  goal_type: string;
  goal_amount: number;
  target_date: string;
  progress: number;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

export interface FollowUpRecord {
  id: string;
  client_id: string | null;
  client_name: string;
  follow_up_date: string;
  purpose: string;
  status: "pending" | "completed" | "cancelled";
  outcome_notes: string | null;
  created_at: string;
  updated_at: string;
}

// Type casting utilities
export const castAdvisoryClient = (client: AdvisoryClientDB): AdvisoryClient => ({
  ...client,
  risk_tolerance: client.risk_tolerance as "low" | "moderate" | "high",
  status: client.status as "active" | "inactive"
});

export const castAdvisorySession = (session: AdvisorySessionDB): AdvisorySession => ({
  ...session,
  client_name: session.advisory_clients?.client_name || "Unknown Client",
  status: session.status as "completed" | "scheduled" | "cancelled"
});

export const castFinancialGoal = (goal: FinancialGoalDB): FinancialGoal => ({
  ...goal,
  status: goal.status as "active" | "inactive"
});

export const castFollowUpRecord = (record: FollowUpRecordDB): FollowUpRecord => ({
  ...record,
  client_name: record.advisory_clients?.client_name || "Unknown Client",
  status: record.status as "pending" | "completed" | "cancelled"
});
