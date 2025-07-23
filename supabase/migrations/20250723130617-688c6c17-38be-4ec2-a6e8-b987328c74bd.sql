
-- Create savings_accounts table for managing client savings accounts
CREATE TABLE public.savings_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_id TEXT NOT NULL,
  account_number TEXT NOT NULL UNIQUE,
  contact_details TEXT NOT NULL,
  account_type TEXT NOT NULL,
  start_date DATE NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dormant', 'closed')),
  current_balance NUMERIC DEFAULT 0,
  initial_deposit NUMERIC DEFAULT 0,
  total_deposited NUMERIC DEFAULT 0,
  total_withdrawn NUMERIC DEFAULT 0,
  interest_earned NUMERIC DEFAULT 0,
  savings_goal NUMERIC,
  maturity_date DATE,
  saving_frequency TEXT NOT NULL,
  interest_rate NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create savings_transactions table for tracking all savings transactions
CREATE TABLE public.savings_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.savings_accounts(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal')),
  amount NUMERIC NOT NULL,
  balance_after NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create savings_plans table for managing savings plans and advisory notes
CREATE TABLE public.savings_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.savings_accounts(id) ON DELETE CASCADE,
  next_deposit_date DATE,
  advisory_suggestions TEXT,
  missed_contributions INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create savings_interest_settings table for interest calculation settings
CREATE TABLE public.savings_interest_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_id UUID NOT NULL REFERENCES public.savings_accounts(id) ON DELETE CASCADE,
  calculation_method TEXT NOT NULL DEFAULT 'simple' CHECK (calculation_method IN ('simple', 'compound')),
  interest_period TEXT NOT NULL DEFAULT 'monthly' CHECK (interest_period IN ('monthly', 'quarterly', 'annually')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.savings_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_interest_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for all operations (admin access)
CREATE POLICY "Allow all operations on savings accounts" 
  ON public.savings_accounts 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on savings transactions" 
  ON public.savings_transactions 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on savings plans" 
  ON public.savings_plans 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

CREATE POLICY "Allow all operations on savings interest settings" 
  ON public.savings_interest_settings 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_savings_accounts_client_id ON public.savings_accounts(client_id);
CREATE INDEX idx_savings_accounts_account_number ON public.savings_accounts(account_number);
CREATE INDEX idx_savings_transactions_account_id ON public.savings_transactions(account_id);
CREATE INDEX idx_savings_transactions_date ON public.savings_transactions(transaction_date);
CREATE INDEX idx_savings_plans_account_id ON public.savings_plans(account_id);
CREATE INDEX idx_savings_interest_settings_account_id ON public.savings_interest_settings(account_id);

-- Create sequence for generating account numbers
CREATE SEQUENCE public.savings_account_number_seq START 1000;

-- Create function to generate savings account numbers
CREATE OR REPLACE FUNCTION public.generate_savings_account_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  next_num INTEGER;
BEGIN
  SELECT nextval('public.savings_account_number_seq') INTO next_num;
  RETURN 'SAV' || LPAD(next_num::TEXT, 6, '0');
END;
$$;
