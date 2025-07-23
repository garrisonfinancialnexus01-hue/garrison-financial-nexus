
-- Create advisory_sessions table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS advisory_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES advisory_clients(id),
  advisory_type TEXT NOT NULL,
  advisor_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  advice_given TEXT,
  action_plan TEXT,
  supporting_materials TEXT,
  notes TEXT,
  follow_up_date DATE,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create financial_goals table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS financial_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES advisory_clients(id),
  goal_type TEXT NOT NULL,
  goal_amount NUMERIC NOT NULL,
  target_date DATE NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create follow_up_records table if it doesn't exist with proper structure
CREATE TABLE IF NOT EXISTS follow_up_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES advisory_clients(id),
  follow_up_date DATE NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  outcome_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for advisory_sessions
ALTER TABLE advisory_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on advisory sessions" ON advisory_sessions FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for financial_goals
ALTER TABLE financial_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on financial goals" ON financial_goals FOR ALL USING (true) WITH CHECK (true);

-- Add RLS policies for follow_up_records
ALTER TABLE follow_up_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow all operations on follow up records" ON follow_up_records FOR ALL USING (true) WITH CHECK (true);

-- Update advisory_clients table structure if needed
ALTER TABLE advisory_clients 
ADD COLUMN IF NOT EXISTS credit_behavior_notes TEXT,
ADD COLUMN IF NOT EXISTS last_risk_assessment_date DATE;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_advisory_sessions_client_id ON advisory_sessions(client_id);
CREATE INDEX IF NOT EXISTS idx_financial_goals_client_id ON financial_goals(client_id);
CREATE INDEX IF NOT EXISTS idx_follow_up_records_client_id ON follow_up_records(client_id);
CREATE INDEX IF NOT EXISTS idx_advisory_sessions_date ON advisory_sessions(session_date);
CREATE INDEX IF NOT EXISTS idx_follow_up_records_date ON follow_up_records(follow_up_date);
