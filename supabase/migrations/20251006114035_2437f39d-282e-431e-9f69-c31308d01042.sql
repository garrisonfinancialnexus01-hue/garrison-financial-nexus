-- Fix security definer functions by adding fixed search_path

-- Fix cleanup_expired_otps function
CREATE OR REPLACE FUNCTION public.cleanup_expired_otps()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM public.password_reset_otps 
  WHERE expires_at < now() OR (is_used = true AND created_at < now() - INTERVAL '24 hours');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$function$;

-- Fix check_otp_rate_limit function
CREATE OR REPLACE FUNCTION public.check_otp_rate_limit(user_email text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  request_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO request_count
  FROM public.password_reset_otps
  WHERE email = user_email 
    AND created_at > now() - INTERVAL '1 hour';
  
  RETURN request_count < 3;
END;
$function$;

-- Fix verify_password_reset_otp function
CREATE OR REPLACE FUNCTION public.verify_password_reset_otp(user_email text, submitted_otp text)
RETURNS TABLE(valid boolean, message text, attempts_remaining integer)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
$function$;

-- Fix generate_password_reset_otp function
CREATE OR REPLACE FUNCTION public.generate_password_reset_otp(user_email text, client_ip text DEFAULT NULL::text)
RETURNS TABLE(otp_code text, expires_at timestamp with time zone, success boolean, message text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
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
  
  -- Generate 4-digit OTP (changed from 6-digit)
  new_otp := LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
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
$function$;