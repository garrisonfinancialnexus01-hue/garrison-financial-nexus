
-- Create table for daily transaction records
CREATE TABLE public.transaction_records (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  account_number VARCHAR(255) NOT NULL,
  amount_deposited NUMERIC DEFAULT 0,
  amount_withdrawn NUMERIC DEFAULT 0,
  account_balance NUMERIC NOT NULL,
  transaction_date DATE NOT NULL,
  transaction_time TIME WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  receipt_number VARCHAR(255) UNIQUE NOT NULL DEFAULT 'TR-' || LPAD(nextval('receipt_number_seq')::TEXT, 6, '0')
);

-- Enable Row Level Security
ALTER TABLE public.transaction_records ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing transaction records
CREATE POLICY "Anyone can view transaction records" 
  ON public.transaction_records 
  FOR SELECT 
  USING (true);

-- Create policy for inserting transaction records
CREATE POLICY "Anyone can insert transaction records" 
  ON public.transaction_records 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for updating transaction records
CREATE POLICY "Anyone can update transaction records" 
  ON public.transaction_records 
  FOR UPDATE 
  USING (true);

-- Create policy for deleting transaction records
CREATE POLICY "Anyone can delete transaction records" 
  ON public.transaction_records 
  FOR DELETE 
  USING (true);

-- Create index for faster queries
CREATE INDEX idx_transaction_records_account_number ON public.transaction_records(account_number);
CREATE INDEX idx_transaction_records_date ON public.transaction_records(transaction_date);
