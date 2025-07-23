
-- First, let's add some missing columns to the saving_operations table to support all the functionality
ALTER TABLE saving_operations 
ADD COLUMN IF NOT EXISTS account_number TEXT,
ADD COLUMN IF NOT EXISTS last_deposit_date DATE,
ADD COLUMN IF NOT EXISTS saving_frequency TEXT DEFAULT 'Monthly',
ADD COLUMN IF NOT EXISTS total_deposited NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_withdrawn NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS interest_earned NUMERIC DEFAULT 0,
ADD COLUMN IF NOT EXISTS missed_contributions INTEGER DEFAULT 0;

-- Create a table for savings transactions
CREATE TABLE IF NOT EXISTS savings_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  savings_account_id UUID REFERENCES saving_operations(id) ON DELETE CASCADE,
  transaction_date DATE NOT NULL,
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('deposit', 'withdrawal')),
  amount NUMERIC NOT NULL,
  balance_after NUMERIC NOT NULL,
  payment_method TEXT NOT NULL,
  reference TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for the savings transactions table
ALTER TABLE savings_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on savings transactions" 
ON savings_transactions 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Update the existing saving_operations table to include account numbers if they don't exist
UPDATE saving_operations 
SET account_number = 'SAV' || LPAD(ROW_NUMBER() OVER (ORDER BY created_at)::TEXT, 3, '0')
WHERE account_number IS NULL;

-- Add some sample transaction data
INSERT INTO savings_transactions (savings_account_id, transaction_date, transaction_type, amount, balance_after, payment_method, reference, notes)
SELECT 
  id,
  created_at::DATE,
  'deposit',
  initial_deposit,
  current_balance,
  'Cash',
  'INIT-' || SUBSTRING(id::TEXT, 1, 8),
  'Initial deposit'
FROM saving_operations
WHERE NOT EXISTS (
  SELECT 1 FROM savings_transactions WHERE savings_account_id = saving_operations.id
);
