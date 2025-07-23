
-- Create tables for advisory clients and sessions
CREATE TABLE public.advisory_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id TEXT NOT NULL UNIQUE,
  client_name TEXT NOT NULL,
  contact_info TEXT NOT NULL,
  email TEXT,
  occupation TEXT NOT NULL,
  financial_stage TEXT NOT NULL,
  risk_tolerance TEXT NOT NULL DEFAULT 'moderate',
  investment_preference TEXT NOT NULL DEFAULT 'balanced',
  knowledge_level TEXT NOT NULL DEFAULT 'intermediate',
  total_sessions INTEGER DEFAULT 0,
  last_session_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.advisory_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.advisory_clients(id),
  advisory_type TEXT NOT NULL,
  advisor_name TEXT NOT NULL,
  session_date DATE NOT NULL,
  advice_given TEXT,
  action_plan TEXT,
  supporting_materials TEXT,
  notes TEXT,
  follow_up_date DATE,
  status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.financial_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.advisory_clients(id),
  goal_type TEXT NOT NULL,
  goal_amount NUMERIC NOT NULL,
  target_date DATE NOT NULL,
  progress INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.follow_up_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.advisory_clients(id),
  follow_up_date DATE NOT NULL,
  purpose TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  outcome_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert sample data
INSERT INTO public.advisory_clients (client_id, client_name, contact_info, email, occupation, financial_stage, risk_tolerance, investment_preference, knowledge_level, total_sessions, last_session_date, status) VALUES
('CLI001', 'John Doe', '+256701234567', 'john.doe@email.com', 'Teacher', 'Working Adult', 'moderate', 'balanced', 'intermediate', 2, '2024-01-15', 'active'),
('CLI002', 'Jane Smith', '+256702345678', 'jane.smith@email.com', 'Doctor', 'Mid-Career', 'high', 'aggressive', 'advanced', 5, '2024-01-20', 'active'),
('CLI003', 'Robert Kamau', '+256703456789', 'robert.kamau@email.com', 'Engineer', 'Working Adult', 'moderate', 'balanced', 'intermediate', 3, '2024-01-10', 'active');

INSERT INTO public.advisory_sessions (client_id, advisory_type, advisor_name, session_date, advice_given, action_plan, supporting_materials, notes, follow_up_date, status) VALUES
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI001'), 'Investment Strategy', 'Sarah Wanjiku', '2024-01-15', 'Diversify investment portfolio', 'Allocate 60% stocks, 30% bonds, 10% real estate', 'Investment Portfolio Template', 'Client shows good understanding', '2024-02-15', 'completed'),
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI002'), 'Retirement Planning', 'Michael Ochieng', '2024-01-20', 'Start retirement savings early', 'Open retirement account and contribute 15% monthly', 'Retirement Planning Guide', 'Highly motivated client', '2024-02-20', 'completed'),
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI003'), 'Budgeting Help', 'Grace Nakato', '2024-01-10', 'Create monthly budget plan', 'Track expenses and reduce unnecessary spending', 'Budget Template', 'Needs follow-up on spending habits', '2024-02-10', 'completed');

INSERT INTO public.financial_goals (client_id, goal_type, goal_amount, target_date, progress, status) VALUES
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI001'), 'Emergency Fund', 5000000, '2024-12-31', 60, 'active'),
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI001'), 'House Purchase', 200000000, '2026-12-31', 15, 'active'),
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI002'), 'Retirement Fund', 500000000, '2029-12-31', 25, 'active'),
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI003'), 'Education Fund', 50000000, '2025-12-31', 40, 'active');

INSERT INTO public.follow_up_records (client_id, follow_up_date, purpose, status, outcome_notes) VALUES
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI001'), '2024-02-15', 'Review Investment Strategy', 'pending', NULL),
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI002'), '2024-02-20', 'Check Retirement Planning Progress', 'pending', NULL),
((SELECT id FROM public.advisory_clients WHERE client_id = 'CLI003'), '2024-02-10', 'Budget Review', 'completed', 'Client improved spending habits significantly');

-- Enable RLS on all new tables
ALTER TABLE public.advisory_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follow_up_records ENABLE ROW LEVEL SECURITY;

-- Create policies for all tables
CREATE POLICY "Allow all operations on advisory clients" ON public.advisory_clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on advisory sessions" ON public.advisory_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on financial goals" ON public.financial_goals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on follow up records" ON public.follow_up_records FOR ALL USING (true) WITH CHECK (true);
