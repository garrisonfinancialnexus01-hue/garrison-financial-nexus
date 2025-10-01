-- Drop the restrictive SELECT policy
DROP POLICY IF EXISTS "Only authenticated admins can view loan applications" ON loan_applications;

-- Create a new policy that allows anyone to search loan applications
-- This is needed for the regular client search functionality
CREATE POLICY "Anyone can search loan applications"
ON loan_applications
FOR SELECT
USING (true);

-- Keep the existing INSERT policy
-- The policy "Anyone can insert loan applications" already exists