
-- Update existing phone numbers in client_accounts table from 0XXXXXXXXX to +2567XXXXXXXXX format
UPDATE client_accounts 
SET phone = CONCAT('+256', SUBSTRING(phone FROM 2))
WHERE phone ~ '^0[0-9]{9}$' AND LENGTH(phone) = 10;

-- Update existing phone numbers in advisory_clients table
UPDATE advisory_clients 
SET contact_info = CONCAT('+256', SUBSTRING(contact_info FROM 2))
WHERE contact_info ~ '^0[0-9]{9}$' AND LENGTH(contact_info) = 10;

-- Update existing phone numbers in lending_operations table
UPDATE lending_operations 
SET client_phone = CONCAT('+256', SUBSTRING(client_phone FROM 2))
WHERE client_phone ~ '^0[0-9]{9}$' AND LENGTH(client_phone) = 10;

UPDATE lending_operations 
SET guarantor_phone = CONCAT('+256', SUBSTRING(guarantor_phone FROM 2))
WHERE guarantor_phone ~ '^0[0-9]{9}$' AND LENGTH(guarantor_phone) = 10 AND guarantor_phone IS NOT NULL;

-- Update existing phone numbers in savings_accounts table
UPDATE savings_accounts 
SET contact_details = CONCAT('+256', SUBSTRING(contact_details FROM 2))
WHERE contact_details ~ '^0[0-9]{9}$' AND LENGTH(contact_details) = 10;

-- Update existing phone numbers in saving_operations table
UPDATE saving_operations 
SET client_phone = CONCAT('+256', SUBSTRING(client_phone FROM 2))
WHERE client_phone ~ '^0[0-9]{9}$' AND LENGTH(client_phone) = 10;

-- Update existing phone numbers in advisory_operations table
UPDATE advisory_operations 
SET client_phone = CONCAT('+256', SUBSTRING(client_phone FROM 2))
WHERE client_phone ~ '^0[0-9]{9}$' AND LENGTH(client_phone) = 10;

-- Update existing phone numbers in wealth_management_operations table
UPDATE wealth_management_operations 
SET client_phone = CONCAT('+256', SUBSTRING(client_phone FROM 2))
WHERE client_phone ~ '^0[0-9]{9}$' AND LENGTH(client_phone) = 10;

-- Update existing phone numbers in communication_log table
UPDATE communication_log 
SET client_phone = CONCAT('+256', SUBSTRING(client_phone FROM 2))
WHERE client_phone ~ '^0[0-9]{9}$' AND LENGTH(client_phone) = 10;

-- Update existing phone numbers in mobile_money_transactions table
UPDATE mobile_money_transactions 
SET client_phone = CONCAT('+256', SUBSTRING(client_phone FROM 2))
WHERE client_phone ~ '^0[0-9]{9}$' AND LENGTH(client_phone) = 10;
