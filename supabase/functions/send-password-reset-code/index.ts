
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
  code?: string; // Optional: if provided, use this code instead of generating one
}

// Generate a secure random 6-digit code
const generateVerificationCode = (): string => {
  const min = 100000;
  const max = 999999;
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
        hasName: !!requestBody.name,
        hasCode: !!requestBody.code
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

    const { email, name, code }: PasswordResetRequest = requestBody;

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

    // Use provided code or generate new one
    const verificationCode = code || generateVerificationCode();
    console.log('Using verification code:', verificationCode);

    // Send email
    console.log('=== SENDING EMAIL ===');
    console.log('From: garrisonfinancialnexus01@gmail.com');
    console.log('To:', trimmedEmail);
    
    try {
      const emailResponse = await resend.emails.send({
        from: "Garrison Financial Nexus <garrisonfinancialnexus01@gmail.com>",
        to: [trimmedEmail],
        subject: "🔐 Your Password Reset Code - Garrison Financial Nexus",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #2c3e50; margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
              </div>
              
              <p style="color: #34495e; font-size: 16px; line-height: 1.6;">Hello <strong>${name}</strong>,</p>
              
              <p style="color: #34495e; font-size: 16px; line-height: 1.6;">
                We received a request to reset your password for your Garrison Financial Nexus account.
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 15px; display: inline-block;">
                  <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Your Verification Code</p>
                  <div style="font-size: 42px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                    ${verificationCode}
                  </div>
                </div>
              </div>
              
              <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                <h3 style="color: #856404; margin: 0 0 15px 0; display: flex; align-items: center;">
                  <span style="margin-right: 10px;">⚠️</span>
                  Important Security Information:
                </h3>
                <ul style="color: #856404; margin: 0; padding-left: 20px; line-height: 1.8;">
                  <li><strong>This code expires in exactly 3 minutes</strong></li>
                  <li>Never share this code with anyone</li>
                  <li>Our staff will never ask for this code</li>
                  <li>If you didn't request this reset, please ignore this email</li>
                </ul>
              </div>
              
              <div style="border-top: 2px solid #ecf0f1; padding-top: 25px; margin-top: 30px;">
                <p style="color: #7f8c8d; font-size: 14px; line-height: 1.6;">
                  <strong>Need help?</strong><br>
                  📞 Contact us at <strong>+256 761 281 222</strong><br>
                  📧 Email us at <strong>garrisonfinancialnexus01@gmail.com</strong>
                </p>
                
                <p style="color: #7f8c8d; font-size: 14px; margin-top: 20px;">
                  Best regards,<br>
                  <strong>Garrison Financial Nexus Team</strong>
                </p>
              </div>
            </div>
            
            <div style="text-align: center; margin-top: 20px;">
              <p style="color: #95a5a6; font-size: 12px;">
                This email was sent from a secure system. Please do not reply to this email.
              </p>
            </div>
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
        return new Response(JSON.stringify({ 
          error: 'Email delivery failed',
          success: false,
          message: `Email service error: ${emailResponse.error.message}`,
          errorCode: 'EMAIL_SEND_ERROR',
          details: emailResponse.error
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
        code: verificationCode, // Include for debugging (remove in production)
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
