
-- First, let's check if the table exists and handle the enum properly
-- If the table exists, we need to drop it first to remove the dependency
DROP TABLE IF EXISTS public.client_accounts CASCADE;

-- Now we can safely drop and recreate the enum
DROP TYPE IF EXISTS public.account_status CASCADE;

-- Create the enum type for account status
CREATE TYPE public.account_status AS ENUM ('pending', 'active', 'suspended');

-- Create the client_accounts table with proper structure
CREATE TABLE public.client_accounts (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    account_number VARCHAR(8) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    nin VARCHAR(14) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    account_balance NUMERIC(12,2) NOT NULL DEFAULT 0.00,
    status public.account_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert 200 pre-allocated client accounts using a sequential generator to ensure uniqueness
INSERT INTO public.client_accounts (
  account_number,
  name,
  email,
  phone,
  nin,
  password_hash,
  status
)
SELECT
  (10000000 + generate_series(1, 200))::text as account_number,
  'System Reserved' as name,
  'reserved' || generate_series(1, 200) || '@system.local' as email,
  '0000000' || lpad(generate_series(1, 200)::text, 3, '0') as phone,
  'CMSYS' || lpad(generate_series(1, 200)::text, 9, '0') as nin,
  'temp_password' as password_hash,
  'suspended'::public.account_status as status;

-- Create indexes for better performance
CREATE INDEX idx_client_accounts_account_number ON public.client_accounts(account_number);
CREATE INDEX idx_client_accounts_email ON public.client_accounts(email);
CREATE INDEX idx_client_accounts_nin ON public.client_accounts(nin);
CREATE INDEX idx_client_accounts_status ON public.client_accounts(status);

-- Enable Row Level Security
ALTER TABLE public.client_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a client system)
CREATE POLICY "Anyone can view client accounts" ON public.client_accounts FOR SELECT USING (true);
CREATE POLICY "Anyone can insert client accounts" ON public.client_accounts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update client accounts" ON public.client_accounts FOR UPDATE USING (true);
