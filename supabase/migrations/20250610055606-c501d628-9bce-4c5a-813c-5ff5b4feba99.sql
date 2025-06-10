
-- Create 200 pre-allocated client accounts for the manager to distribute
-- These will be in 'suspended' status with 'System Reserved' name until activated by users

INSERT INTO public.client_accounts (
  account_number,
  name,
  email,
  phone,
  nin,
  password_hash,
  account_balance,
  status
)
SELECT 
  (9999999 + generate_series(2, 201))::text as account_number,
  'System Reserved' as name,
  'reserved@system.local' as email,
  '000000000' as phone,
  'CMSYSTEM000000' as nin,
  'temp_password' as password_hash,
  0.00 as account_balance,
  'suspended'::account_status as status
WHERE NOT EXISTS (
  SELECT 1 FROM public.client_accounts 
  WHERE account_number BETWEEN '10000001' AND '10000200'
);
