
-- Create a table for dashboard authentication
CREATE TABLE public.central_dashboard_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_name TEXT NOT NULL,
  session_token TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '8 hours'),
  is_active BOOLEAN NOT NULL DEFAULT true
);

-- Create tables for the central dashboard operations
CREATE TABLE public.lending_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_nin TEXT,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  loan_amount NUMERIC NOT NULL,
  interest_rate NUMERIC NOT NULL,
  loan_term TEXT NOT NULL,
  total_repayment NUMERIC NOT NULL,
  disbursement_date DATE,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'pending',
  collateral_type TEXT,
  collateral_value NUMERIC,
  guarantor_name TEXT,
  guarantor_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.saving_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_nin TEXT,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  account_type TEXT NOT NULL,
  initial_deposit NUMERIC NOT NULL DEFAULT 0,
  current_balance NUMERIC NOT NULL DEFAULT 0,
  target_amount NUMERIC,
  target_date DATE,
  interest_rate NUMERIC NOT NULL DEFAULT 0,
  maturity_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  withdrawal_frequency TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.advisory_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_nin TEXT,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  service_type TEXT NOT NULL,
  session_date DATE NOT NULL,
  session_duration TEXT,
  advisor_name TEXT NOT NULL,
  consultation_fee NUMERIC NOT NULL DEFAULT 0,
  topics_discussed TEXT,
  recommendations TEXT,
  follow_up_date DATE,
  status TEXT NOT NULL DEFAULT 'scheduled',
  priority_level TEXT NOT NULL DEFAULT 'medium',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.wealth_management_operations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_nin TEXT,
  client_phone TEXT NOT NULL,
  client_email TEXT,
  portfolio_type TEXT NOT NULL,
  total_assets NUMERIC NOT NULL DEFAULT 0,
  investment_goals TEXT,
  risk_tolerance TEXT NOT NULL DEFAULT 'moderate',
  portfolio_manager TEXT NOT NULL,
  management_fee NUMERIC NOT NULL DEFAULT 0,
  performance_target NUMERIC,
  review_frequency TEXT NOT NULL DEFAULT 'quarterly',
  last_review_date DATE,
  next_review_date DATE,
  status TEXT NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.staff_performance (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  staff_name TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  position TEXT NOT NULL,
  department TEXT NOT NULL,
  performance_period TEXT NOT NULL,
  loans_processed INTEGER DEFAULT 0,
  savings_opened INTEGER DEFAULT 0,
  advisory_sessions INTEGER DEFAULT 0,
  client_satisfaction NUMERIC DEFAULT 0,
  revenue_generated NUMERIC DEFAULT 0,
  performance_rating TEXT DEFAULT 'satisfactory',
  targets_met INTEGER DEFAULT 0,
  total_targets INTEGER DEFAULT 0,
  notes TEXT,
  recorded_by TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.communication_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_phone TEXT NOT NULL,
  communication_type TEXT NOT NULL,
  message_content TEXT NOT NULL,
  sent_by TEXT NOT NULL,
  sent_date DATE NOT NULL DEFAULT CURRENT_DATE,
  sent_time TIME NOT NULL DEFAULT CURRENT_TIME,
  purpose TEXT,
  follow_up_required BOOLEAN DEFAULT false,
  follow_up_date DATE,
  delivery_status TEXT DEFAULT 'sent',
  response_received BOOLEAN DEFAULT false,
  client_response TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE TABLE public.central_dashboard_overview (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL UNIQUE,
  metric_value NUMERIC NOT NULL DEFAULT 0,
  metric_description TEXT,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by TEXT NOT NULL
);

-- Insert default overview metrics
INSERT INTO public.central_dashboard_overview (metric_name, metric_value, metric_description, updated_by) VALUES
('total_loans_disbursed', 0, 'Total amount of loans disbursed', 'system'),
('total_active_loans', 0, 'Number of active loans', 'system'),
('total_savings_collected', 0, 'Total savings amount collected', 'system'),
('total_active_savers', 0, 'Number of active savers', 'system'),
('total_advisory_sessions', 0, 'Total advisory sessions conducted', 'system'),
('total_wealth_portfolios', 0, 'Total wealth management portfolios', 'system'),
('total_assets_under_management', 0, 'Total assets under management', 'system'),
('overdue_loans_count', 0, 'Number of overdue loans', 'system'),
('monthly_revenue', 0, 'Monthly revenue generated', 'system'),
('total_clients', 0, 'Total number of clients', 'system');

-- Enable RLS on all tables
ALTER TABLE public.central_dashboard_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lending_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saving_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.advisory_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wealth_management_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.communication_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.central_dashboard_overview ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations (since this is an internal admin dashboard)
CREATE POLICY "Allow all operations on central dashboard sessions" ON public.central_dashboard_sessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on lending operations" ON public.lending_operations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on saving operations" ON public.saving_operations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on advisory operations" ON public.advisory_operations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on wealth management operations" ON public.wealth_management_operations FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on staff performance" ON public.staff_performance FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on communication log" ON public.communication_log FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on central dashboard overview" ON public.central_dashboard_overview FOR ALL USING (true) WITH CHECK (true);
