
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  name: string;
}

// Generate a secure random 4-digit code
const generateVerificationCode = (): string => {
  const min = 1000;
  const max = 9999;
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== PASSWORD RESET FUNCTION STARTED ===');
  console.log('Request method:', req.method);
  
  try {
    // Check environment variables first
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    console.log('=== ENVIRONMENT CHECK ===');
    console.log('RESEND_API_KEY exists:', !!resendApiKey);
    console.log('RESEND_API_KEY length:', resendApiKey?.length || 0);
    console.log('RESEND_API_KEY starts with re_:', resendApiKey?.startsWith('re_') || false);
    
    if (!resendApiKey) {
      console.error('CRITICAL: RESEND_API_KEY is missing');
      return new Response(JSON.stringify({ 
        error: 'Email service not configured',
        success: false,
        message: 'RESEND_API_KEY environment variable is missing',
        errorCode: 'MISSING_API_KEY'
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
        hasEmail: !!requestBody.email,
        hasName: !!requestBody.name
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

    const { email, name }: PasswordResetRequest = requestBody;

    // Validate required fields
    if (!email || !name) {
      console.error('Missing required fields:', { email: !!email, name: !!name });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        success: false,
        message: 'Both email and name are required',
        errorCode: 'MISSING_FIELDS'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!emailRegex.test(trimmedEmail)) {
      console.error('Invalid email format:', trimmedEmail);
      return new Response(JSON.stringify({ 
        error: 'Invalid email format',
        success: false,
        message: 'Please provide a valid email address',
        errorCode: 'INVALID_EMAIL'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('=== VALIDATION PASSED ===');
    console.log('Email:', trimmedEmail);
    console.log('Name:', name);

    // Initialize Resend
    console.log('=== INITIALIZING RESEND ===');
    let resend;
    try {
      resend = new Resend(resendApiKey);
      console.log('Resend client initialized successfully');
    } catch (resendInitError) {
      console.error('Resend initialization failed:', resendInitError);
      return new Response(JSON.stringify({ 
        error: 'Email service initialization failed',
        success: false,
        message: 'Could not connect to email service',
        errorCode: 'RESEND_INIT_ERROR',
        details: resendInitError.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    console.log('Generated verification code:', verificationCode);

    // Send email
    console.log('=== SENDING EMAIL ===');
    console.log('From: onboarding@resend.dev');
    console.log('To:', trimmedEmail);
    
    try {
      const emailResponse = await resend.emails.send({
        from: "Garrison Financial Nexus <onboarding@resend.dev>",
        to: [trimmedEmail],
        subject: "🔐 Password Reset Code - Garrison Financial Nexus",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #333; text-align: center;">Password Reset Request</h1>
            <p>Hello <strong>${name}</strong>,</p>
            <p>We received a request to reset your password for your Garrison Financial Nexus account.</p>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: #f0f0f0; padding: 20px; border-radius: 8px; font-size: 32px; font-weight: bold; letter-spacing: 8px;">
                ${verificationCode}
              </div>
            </div>
            <p><strong>Important:</strong></p>
            <ul>
              <li>This code expires in exactly 3 minutes</li>
              <li>Never share this code with anyone</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
            <p>Need help? Contact us at +256 761 281 222</p>
            <p>Best regards,<br>Garrison Financial Nexus Team</p>
          </div>
        `,
      });

      console.log('=== EMAIL SEND RESULT ===');
      console.log('Email response:', {
        hasData: !!emailResponse.data,
        hasError: !!emailResponse.error,
        dataId: emailResponse.data?.id,
        errorMessage: emailResponse.error?.message
      });

      if (emailResponse.error) {
        console.error('Resend API error:', emailResponse.error);
        
        // Check for domain verification error
        if (emailResponse.error.message?.includes('verify a domain') || 
            emailResponse.error.message?.includes('testing emails')) {
          console.error('Domain verification required for Resend');
          return new Response(JSON.stringify({ 
            error: 'Email configuration required',
            success: false,
            message: 'Email service needs domain verification. Please contact support or try again later.',
            errorCode: 'DOMAIN_VERIFICATION_REQUIRED',
            userMessage: 'Could not send verification code. Please try again.'
          }), {
            status: 503, // Service Unavailable 
            headers: { "Content-Type": "application/json", ...corsHeaders },
          });
        }
        
        return new Response(JSON.stringify({ 
          error: 'Email delivery failed',
          success: false,
          message: 'Could not send verification code. Please try again.',
          errorCode: 'EMAIL_SEND_ERROR',
          userMessage: 'Could not send verification code. Please try again.'
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      if (!emailResponse.data) {
        console.error('No data returned from Resend API');
        return new Response(JSON.stringify({ 
          error: 'Email service returned no data',
          success: false,
          message: 'Email service did not return confirmation',
          errorCode: 'NO_EMAIL_DATA'
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.log('=== SUCCESS ===');
      console.log('Email sent successfully with ID:', emailResponse.data.id);

      return new Response(JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data.id,
        message: 'Verification code sent successfully',
        code: verificationCode,
        timestamp: Date.now()
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (emailError: any) {
      console.error('=== EMAIL SENDING ERROR ===');
      console.error('Error message:', emailError.message);
      console.error('Error name:', emailError.name);
      console.error('Error stack:', emailError.stack);
      console.error('Full error:', JSON.stringify(emailError, null, 2));
      
      return new Response(JSON.stringify({ 
        error: 'Email service network error',
        success: false,
        message: `Failed to send email: ${emailError.message}`,
        errorCode: 'NETWORK_ERROR',
        details: {
          errorType: emailError.name,
          errorMessage: emailError.message
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
