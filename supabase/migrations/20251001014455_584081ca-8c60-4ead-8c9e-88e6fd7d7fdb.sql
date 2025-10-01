-- Add additional client information columns to loan_applications table
ALTER TABLE public.loan_applications 
ADD COLUMN IF NOT EXISTS gender text,
ADD COLUMN IF NOT EXISTS whatsapp_number text,
ADD COLUMN IF NOT EXISTS education_degree text,
ADD COLUMN IF NOT EXISTS work_status text,
ADD COLUMN IF NOT EXISTS monthly_income text,
ADD COLUMN IF NOT EXISTS marital_status text,
ADD COLUMN IF NOT EXISTS emergency_contact_name text,
ADD COLUMN IF NOT EXISTS emergency_contact_phone text,
ADD COLUMN IF NOT EXISTS emergency_contact_relation text;