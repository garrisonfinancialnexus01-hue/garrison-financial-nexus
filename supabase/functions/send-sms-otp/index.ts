
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SmsOtpRequest {
  mobile: string;
  name: string;
  otpCode: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== SMS OTP FUNCTION STARTED ===');
  console.log('Request method:', req.method);
  
  try {
    // Check environment variables first
    const clientId = Deno.env.get("NOTIFICATIONAPI_CLIENT_ID");
    const clientSecret = Deno.env.get("NOTIFICATIONAPI_CLIENT_SECRET");
    
    console.log('=== ENVIRONMENT CHECK ===');
    console.log('NOTIFICATIONAPI_CLIENT_ID exists:', !!clientId);
    console.log('NOTIFICATIONAPI_CLIENT_SECRET exists:', !!clientSecret);
    
    if (!clientId || !clientSecret) {
      console.error('CRITICAL: NotificationAPI credentials are missing');
      return new Response(JSON.stringify({ 
        error: 'SMS service not configured',
        success: false,
        message: 'NotificationAPI credentials are missing',
        errorCode: 'MISSING_API_KEYS'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Parse request body
    let requestBody;
    try {
      const rawBody = await req.text();
      console.log('Raw request body length:', rawBody.length);
      requestBody = JSON.parse(rawBody);
      console.log('Request body parsed successfully:', {
        hasMobile: !!requestBody.mobile,
        hasName: !!requestBody.name,
        hasOtpCode: !!requestBody.otpCode
      });
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid JSON in request body',
        success: false,
        message: 'Request body is not valid JSON',
        errorCode: 'INVALID_JSON'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { mobile, name, otpCode }: SmsOtpRequest = requestBody;

    // Validate required fields
    if (!mobile || !name || !otpCode) {
      console.error('Missing required fields:', { mobile: !!mobile, name: !!name, otpCode: !!otpCode });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        success: false,
        message: 'Mobile, name, and otpCode are required',
        errorCode: 'MISSING_FIELDS'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Mobile validation (Ugandan format)
    const trimmedMobile = mobile.trim();
    const mobileRegex = /^\+256[0-9]{9}$/;
    
    if (!mobileRegex.test(trimmedMobile)) {
      console.error('Invalid mobile format:', trimmedMobile);
      return new Response(JSON.stringify({ 
        error: 'Invalid mobile format',
        success: false,
        message: 'Please provide a valid Ugandan mobile number (+256XXXXXXXXX)',
        errorCode: 'INVALID_MOBILE'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('=== VALIDATION PASSED ===');
    console.log('Mobile:', trimmedMobile);
    console.log('Name:', name);
    console.log('OTP Code:', otpCode);

    // Send SMS via NotificationAPI with correct authentication
    console.log('=== SENDING SMS VIA NOTIFICATIONAPI ===');
    
    try {
      const notificationResponse = await fetch('https://api.notificationapi.com/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'clientId': clientId,
          'clientSecret': clientSecret
        },
        body: JSON.stringify({
          notificationId: 'password_reset_sms',
          user: {
            id: trimmedMobile,
            number: trimmedMobile
          },
          mergeTags: {
            name: name,
            otp_code: otpCode,
            company_name: 'Garrison Financial Nexus'
          }
        })
      });

      console.log('=== NOTIFICATIONAPI RESPONSE ===');
      console.log('Response status:', notificationResponse.status);
      console.log('Response ok:', notificationResponse.ok);

      if (!notificationResponse.ok) {
        const errorText = await notificationResponse.text();
        console.error('NotificationAPI error response:', errorText);
        
        return new Response(JSON.stringify({ 
          error: 'SMS delivery failed',
          success: false,
          message: `SMS service error: ${errorText}`,
          errorCode: 'SMS_SEND_ERROR',
          details: {
            status: notificationResponse.status,
            response: errorText
          }
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      const responseData = await notificationResponse.json();
      console.log('NotificationAPI success response:', responseData);

      console.log('=== SUCCESS ===');
      console.log('SMS sent successfully via NotificationAPI');

      return new Response(JSON.stringify({ 
        success: true, 
        message: 'SMS OTP sent successfully',
        mobile: trimmedMobile,
        timestamp: Date.now()
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (smsError: any) {
      console.error('=== SMS SENDING ERROR ===');
      console.error('Error message:', smsError.message);
      console.error('Error name:', smsError.name);
      console.error('Error stack:', smsError.stack);
      
      return new Response(JSON.stringify({ 
        error: 'SMS service network error',
        success: false,
        message: `Failed to send SMS: ${smsError.message}`,
        errorCode: 'NETWORK_ERROR',
        details: {
          errorType: smsError.name,
          errorMessage: smsError.message
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (criticalError: any) {
    console.error('=== CRITICAL ERROR ===');
    console.error('Critical error message:', criticalError.message);
    console.error('Critical error name:', criticalError.name);
    console.error('Critical error stack:', criticalError.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false,
        message: `System error: ${criticalError.message}`,
        errorCode: 'INTERNAL_ERROR',
        details: {
          errorType: criticalError.name,
          errorMessage: criticalError.message
        }
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
