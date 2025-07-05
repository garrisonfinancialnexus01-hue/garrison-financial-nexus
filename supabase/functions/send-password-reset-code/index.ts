
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

  try {
    console.log('Password reset function called');
    
    // Check if Resend API key is available
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error('CRITICAL: RESEND_API_KEY environment variable is not set');
      return new Response(JSON.stringify({ 
        error: 'Email service configuration missing',
        success: false,
        message: 'Email service is not configured. Please contact support.',
        errorCode: 'MISSING_API_KEY'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Resend API key found, length:', resendApiKey.length);

    // Validate request body
    let requestBody;
    try {
      requestBody = await req.json();
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        error: 'Invalid request format',
        success: false,
        message: 'Request data is malformed'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Request body received:', { email: requestBody.email, name: requestBody.name });

    const { email, name }: PasswordResetRequest = requestBody;

    // Validate required fields
    if (!email || !name) {
      console.error('Missing required fields:', { email: !!email, name: !!name });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields (email or name)',
        success: false,
        errorCode: 'MISSING_FIELDS'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return new Response(JSON.stringify({ 
        error: 'Invalid email format',
        success: false,
        errorCode: 'INVALID_EMAIL'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Initialize Resend with enhanced error handling
    let resend;
    try {
      resend = new Resend(resendApiKey);
      console.log('Resend client initialized successfully');
    } catch (resendInitError) {
      console.error('Failed to initialize Resend client:', resendInitError);
      return new Response(JSON.stringify({ 
        error: 'Email service initialization failed',
        success: false,
        message: 'Unable to connect to email service',
        errorCode: 'RESEND_INIT_ERROR'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate verification code
    const verificationCode = generateVerificationCode();
    console.log('Generated verification code for', email);

    // Send email with comprehensive error handling
    try {
      console.log('Attempting to send email via Resend...');
      
      const emailResponse = await resend.emails.send({
        from: "Garrison Financial Nexus <onboarding@resend.dev>",
        to: [email],
        subject: "🔐 Password Reset Verification Code - Garrison Financial Nexus",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background-color: #2563eb; width: 60px; height: 60px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 24px;">🔐</span>
                </div>
                <h1 style="color: #1e293b; margin: 0; font-size: 28px; font-weight: 700;">Password Reset Request</h1>
                <p style="color: #64748b; margin: 10px 0 0; font-size: 16px;">Garrison Financial Nexus</p>
              </div>
              
              <div style="margin-bottom: 30px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 15px;">Hello <strong>${name}</strong>,</p>
                <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
                  We received a request to reset your password. Use the verification code below to proceed:
                </p>
                
                <div style="text-align: center; margin: 30px 0;">
                  <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; font-size: 36px; font-weight: bold; padding: 25px; border-radius: 12px; letter-spacing: 8px; display: inline-block; box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);">
                    ${verificationCode}
                  </div>
                </div>
              </div>
              
              <div style="background-color: #fef3cd; border: 1px solid #fbbf24; border-radius: 8px; padding: 20px; margin: 25px 0;">
                <div style="display: flex; align-items: flex-start;">
                  <span style="color: #f59e0b; font-size: 20px; margin-right: 10px;">⚠️</span>
                  <div>
                    <p style="color: #92400e; font-size: 14px; font-weight: 600; margin: 0 0 5px;">Security Alert:</p>
                    <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 15px;">
                      <li>This code expires in <strong>2 minutes</strong></li>
                      <li>Never share this code with anyone</li>
                      <li>If you didn't request this, ignore this email</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              <div style="border-top: 1px solid #e5e7eb; padding-top: 25px; text-align: center;">
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 15px;">
                  <strong>Need Help?</strong>
                </p>
                <div style="margin-bottom: 15px;">
                  <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">📱 WhatsApp: +256 761 281 222</p>
                  <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">📞 Phone: +256 761 281 222</p>
                </div>
                <p style="color: #9ca3af; font-size: 12px; line-height: 1.4;">
                  This is an automated security message from Garrison Financial Nexus.<br>
                  Please do not reply to this email.
                </p>
              </div>
            </div>
          </div>
        `,
      });

      console.log("Email send response received:", { 
        hasError: !!emailResponse.error, 
        emailId: emailResponse.data?.id,
        errorType: emailResponse.error?.name || 'none'
      });

      if (emailResponse.error) {
        console.error("Resend API error details:", {
          name: emailResponse.error.name,
          message: emailResponse.error.message,
          stack: emailResponse.error.stack
        });

        // Provide specific error messages based on error type
        let userMessage = 'Failed to send verification code';
        let errorCode = 'EMAIL_SEND_ERROR';

        if (emailResponse.error.message?.includes('domain')) {
          userMessage = 'Email domain not configured. Please contact support.';
          errorCode = 'DOMAIN_NOT_VERIFIED';
        } else if (emailResponse.error.message?.includes('rate')) {
          userMessage = 'Email rate limit exceeded. Please try again in a few minutes.';
          errorCode = 'RATE_LIMIT';
        } else if (emailResponse.error.message?.includes('authentication')) {
          userMessage = 'Email service authentication failed. Please contact support.';
          errorCode = 'AUTH_ERROR';
        }

        return new Response(JSON.stringify({ 
          error: 'Email delivery failed',
          success: false,
          message: userMessage,
          errorCode: errorCode,
          details: {
            type: emailResponse.error.name,
            message: emailResponse.error.message
          }
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.log("Password reset email sent successfully:", emailResponse.data?.id);

      return new Response(JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        message: 'Verification code sent successfully',
        code: verificationCode // Include code for verification (in production, store in database)
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (emailError: any) {
      console.error("Email sending error:", {
        name: emailError.name,
        message: emailError.message,
        stack: emailError.stack,
        cause: emailError.cause
      });

      // Determine if this is a network issue or API issue
      let userMessage = 'Email service is temporarily unavailable. Please try again in a few minutes.';
      let errorCode = 'NETWORK_ERROR';

      if (emailError.message?.includes('fetch')) {
        userMessage = 'Unable to connect to email service. Please check your internet connection.';
        errorCode = 'CONNECTION_ERROR';
      } else if (emailError.message?.includes('timeout')) {
        userMessage = 'Email service request timed out. Please try again.';
        errorCode = 'TIMEOUT_ERROR';
      }

      return new Response(JSON.stringify({ 
        error: 'Email service error',
        success: false,
        message: userMessage,
        errorCode: errorCode,
        details: {
          type: emailError.name,
          message: emailError.message
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error: any) {
    console.error("Critical error in send-password-reset-code function:", {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false,
        message: 'A system error occurred while processing your request. Please contact support.',
        errorCode: 'INTERNAL_ERROR',
        details: {
          type: error.name,
          message: error.message
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
