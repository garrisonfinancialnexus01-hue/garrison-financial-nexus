
-- Create a table for daily transaction tracking records
CREATE TABLE public.daily_transaction_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  record_number INTEGER NOT NULL,
  account_number VARCHAR NOT NULL,
  amount_deposited NUMERIC DEFAULT 0,
  amount_withdrawn NUMERIC DEFAULT 0,
  account_balance NUMERIC NOT NULL,
  transaction_date DATE NOT NULL,
  transaction_time TIMESTAMPTZ NOT NULL DEFAULT (NOW() AT TIME ZONE 'Africa/Kampala'),
  receipt_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create a sequence for record numbers
CREATE SEQUENCE public.daily_transaction_record_number_seq START 1;

-- Enable RLS
ALTER TABLE public.daily_transaction_records ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (since this is admin-only functionality)
CREATE POLICY "Allow all operations on daily transaction records" 
  ON public.daily_transaction_records 
  FOR ALL 
  USING (true) 
  WITH CHECK (true);

-- Create an index for faster lookups by account number
CREATE INDEX idx_daily_transaction_records_account_number ON public.daily_transaction_records(account_number);

-- Update the client_accounts table to support inactive status
-- First check if we need to add new status values to the enum
DO $$ 
BEGIN
    -- Add 'inactive' to the account_status enum if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_enum WHERE enumlabel = 'inactive' AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'account_status')) THEN
        ALTER TYPE account_status ADD VALUE 'inactive';
    END IF;
END $$;
