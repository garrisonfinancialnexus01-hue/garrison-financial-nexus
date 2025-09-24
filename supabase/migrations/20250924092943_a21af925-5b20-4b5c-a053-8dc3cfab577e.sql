-- Update the existing password reset OTP generation function to generate 4-digit codes
CREATE OR REPLACE FUNCTION public.generate_password_reset_otp(user_email text, client_ip text DEFAULT NULL::text)
 RETURNS TABLE(otp_code text, expires_at timestamp with time zone, success boolean, message text)
 LANGUAGE plpgsql
 SECURITY DEFINER
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
$function$