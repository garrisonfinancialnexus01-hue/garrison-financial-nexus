
-- Create table for storing password reset OTPs
CREATE TABLE public.password_reset_otps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp_code VARCHAR(6) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '3 minutes'),
  is_used BOOLEAN NOT NULL DEFAULT false,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  user_ip VARCHAR(45), -- For additional security tracking
  created_by_function VARCHAR(100) DEFAULT 'password_reset'
);

-- Create index for faster lookups
CREATE INDEX idx_password_reset_otps_email ON public.password_reset_otps(email);
CREATE INDEX idx_password_reset_otps_email_active ON public.password_reset_otps(email, is_used, expires_at);

-- Enable Row Level Security
ALTER TABLE public.password_reset_otps ENABLE ROW LEVEL SECURITY;

-- Create policy for OTP operations (allow all for now, can be restricted later)
CREATE POLICY "Allow OTP operations" ON public.password_reset_otps FOR ALL USING (true);

-- Create function to clean up expired OTPs (housekeeping)
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.password_reset_otps 
  WHERE expires_at < now() OR (is_used = true AND created_at < now() - INTERVAL '24 hours');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

-- Create function to check rate limiting (max 3 OTP requests per hour per email)
CREATE OR REPLACE FUNCTION public.check_otp_rate_limit(user_email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM public.password_reset_otps
  WHERE email = user_email 
    AND created_at > now() - INTERVAL '1 hour';
  
  RETURN request_count < 3;
END;
$$;

-- Create function to generate and store OTP
CREATE OR REPLACE FUNCTION public.generate_password_reset_otp(
  user_email TEXT,
  client_ip TEXT DEFAULT NULL
)
RETURNS TABLE (
  otp_code TEXT,
  expires_at TIMESTAMP WITH TIME ZONE,
  success BOOLEAN,
  message TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_otp TEXT;
  expiry_time TIMESTAMP WITH TIME ZONE;
  rate_limit_ok BOOLEAN;
BEGIN
  -- Check rate limiting
  SELECT public.check_otp_rate_limit(user_email) INTO rate_limit_ok;
  
  IF NOT rate_limit_ok THEN
    RETURN QUERY SELECT NULL::TEXT, NULL::TIMESTAMP WITH TIME ZONE, false, 'Rate limit exceeded. Please try again later.'::TEXT;
    RETURN;
  END IF;
  
  -- Generate 6-digit OTP
  new_otp := LPAD(FLOOR(RANDOM() * 1000000)::TEXT, 6, '0');
  expiry_time := now() + INTERVAL '3 minutes';
  
  -- Invalidate any existing active OTPs for this email
  UPDATE public.password_reset_otps 
  SET is_used = true 
  WHERE email = user_email AND is_used = false AND expires_at > now();
  
  -- Insert new OTP
  INSERT INTO public.password_reset_otps (
    email, otp_code, expires_at, user_ip
  ) VALUES (
    user_email, new_otp, expiry_time, client_ip
  );
  
  RETURN QUERY SELECT new_otp, expiry_time, true, 'OTP generated successfully'::TEXT;
END;
$$;

-- Create function to verify OTP
CREATE OR REPLACE FUNCTION public.verify_password_reset_otp(
  user_email TEXT,
  submitted_otp TEXT
)
RETURNS TABLE (
  valid BOOLEAN,
  message TEXT,
  attempts_remaining INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  otp_record RECORD;
  remaining_attempts INTEGER;
BEGIN
  -- Find the most recent active OTP for this email
  SELECT * INTO otp_record
  FROM public.password_reset_otps
  WHERE email = user_email 
    AND is_used = false 
    AND expires_at > now()
    AND attempts < max_attempts
  ORDER BY created_at DESC
  LIMIT 1;
  
  -- Check if OTP exists
  IF otp_record IS NULL THEN
    RETURN QUERY SELECT false, 'No valid OTP found or OTP has expired'::TEXT, 0;
    RETURN;
  END IF;
  
  -- Increment attempt counter
  UPDATE public.password_reset_otps 
  SET attempts = attempts + 1
  WHERE id = otp_record.id;
  
  remaining_attempts := otp_record.max_attempts - (otp_record.attempts + 1);
  
  -- Check if OTP matches
  IF otp_record.otp_code = submitted_otp THEN
    -- Mark OTP as used
    UPDATE public.password_reset_otps 
    SET is_used = true 
    WHERE id = otp_record.id;
    
    RETURN QUERY SELECT true, 'OTP verified successfully'::TEXT, 0;
  ELSE
    -- Check if max attempts reached
    IF remaining_attempts <= 0 THEN
      UPDATE public.password_reset_otps 
      SET is_used = true 
      WHERE id = otp_record.id;
      
      RETURN QUERY SELECT false, 'Maximum attempts exceeded. Please request a new OTP.'::TEXT, 0;
    ELSE
      RETURN QUERY SELECT false, 'Invalid OTP. ' || remaining_attempts || ' attempts remaining.'::TEXT, remaining_attempts;
    END IF;
  END IF;
END;
$$;
