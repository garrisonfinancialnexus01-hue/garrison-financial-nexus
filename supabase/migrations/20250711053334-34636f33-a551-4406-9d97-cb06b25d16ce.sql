
-- Create mobile money transactions table
CREATE TABLE public.mobile_money_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES public.client_accounts(id),
  transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('deposit', 'withdraw')),
  provider VARCHAR(10) NOT NULL CHECK (provider IN ('MTN', 'AIRTEL')),
  amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
  client_phone VARCHAR(15) NOT NULL,
  company_phone VARCHAR(15) NOT NULL DEFAULT '+256761281222',
  transaction_reference VARCHAR(100),
  external_transaction_id VARCHAR(100),
  status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')),
  failure_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes for better performance
CREATE INDEX idx_mobile_money_transactions_client_id ON public.mobile_money_transactions(client_id);
CREATE INDEX idx_mobile_money_transactions_status ON public.mobile_money_transactions(status);
CREATE INDEX idx_mobile_money_transactions_created_at ON public.mobile_money_transactions(created_at);
CREATE INDEX idx_mobile_money_transactions_provider ON public.mobile_money_transactions(provider);

-- Enable RLS
ALTER TABLE public.mobile_money_transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for mobile money transactions
CREATE POLICY "Clients can view their own transactions" 
  ON public.mobile_money_transactions 
  FOR SELECT 
  USING (client_id IN (SELECT id FROM public.client_accounts WHERE account_number = current_setting('app.current_account_number', true)));

CREATE POLICY "Allow insert for authenticated requests" 
  ON public.mobile_money_transactions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow update for system operations" 
  ON public.mobile_money_transactions 
  FOR UPDATE 
  USING (true);

-- Create function to update account balance after successful transaction
CREATE OR REPLACE FUNCTION update_account_balance_after_transaction()
RETURNS TRIGGER AS $$
BEGIN
  -- Only update balance when transaction status changes to 'completed'
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    IF NEW.transaction_type = 'deposit' THEN
      UPDATE public.client_accounts 
      SET account_balance = account_balance + NEW.amount,
          updated_at = now()
      WHERE id = NEW.client_id;
    ELSIF NEW.transaction_type = 'withdraw' THEN
      UPDATE public.client_accounts 
      SET account_balance = account_balance - NEW.amount,
          updated_at = now()
      WHERE id = NEW.client_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically update account balance
CREATE TRIGGER trigger_update_account_balance
  AFTER UPDATE ON public.mobile_money_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_account_balance_after_transaction();

-- Create function to validate Ugandan phone numbers
CREATE OR REPLACE FUNCTION validate_ugandan_phone(phone_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Remove spaces, hyphens, and plus signs
  phone_input := REGEXP_REPLACE(phone_input, '[\\s\\-\\+]', '', 'g');
  
  -- Check if it's a valid Ugandan number
  -- Format: 256XXXXXXXXX (country code + 9 digits)
  -- Or: 07XXXXXXXX, 075XXXXXXX, 070XXXXXXX (local format)
  RETURN (
    phone_input ~ '^256[0-9]{9}$' OR
    phone_input ~ '^07[0-9]{8}$' OR
    phone_input ~ '^075[0-9]{7}$' OR
    phone_input ~ '^070[0-9]{7}$'
  );
END;
$$ LANGUAGE plpgsql;

-- Add constraint to validate phone numbers in transactions table
ALTER TABLE public.mobile_money_transactions 
ADD CONSTRAINT check_valid_ugandan_phone 
CHECK (validate_ugandan_phone(client_phone));
