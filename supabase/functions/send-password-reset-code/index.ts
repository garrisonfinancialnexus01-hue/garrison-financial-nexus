
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

    console.log('Resend API key found');

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

    // Initialize Resend
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

    // Send email with your company branding
    try {
      console.log('Attempting to send email via Resend...');
      
      const emailResponse = await resend.emails.send({
        from: "Garrison Financial Nexus <garrisonfinancialnexus01@gmail.com>",
        to: [email],
        subject: "🔐 Password Reset Code - Garrison Financial Nexus",
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8fafc;">
            <div style="background-color: white; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
                  <span style="color: white; font-size: 36px;">🏛️</span>
                </div>
                <h1 style="color: #1e293b; margin: 0; font-size: 32px; font-weight: 700;">Password Reset Request</h1>
                <p style="color: #64748b; margin: 10px 0 0; font-size: 18px; font-weight: 600;">Garrison Financial Nexus</p>
              </div>
              
              <div style="margin-bottom: 30px;">
                <p style="color: #374151; font-size: 18px; line-height: 1.6; margin-bottom: 15px;">Hello <strong>${name}</strong>,</p>
                <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-bottom: 25px;">
                  We received a request to reset your password for your Garrison Financial Nexus account. Use the verification code below to proceed with resetting your password:
                </p>
                
                <div style="text-align: center; margin: 40px 0;">
                  <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; font-size: 48px; font-weight: bold; padding: 30px; border-radius: 16px; letter-spacing: 12px; display: inline-block; box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4); border: 3px solid #065f46;">
                    ${verificationCode}
                  </div>
                </div>
                
                <div style="background-color: #fef3cd; border: 2px solid #f59e0b; border-radius: 12px; padding: 20px; margin: 30px 0;">
                  <div style="display: flex; align-items: flex-start;">
                    <span style="color: #f59e0b; font-size: 24px; margin-right: 12px;">⚠️</span>
                    <div>
                      <p style="color: #92400e; font-size: 16px; font-weight: 700; margin: 0 0 8px;">Important Security Information:</p>
                      <ul style="color: #92400e; font-size: 14px; margin: 0; padding-left: 15px; line-height: 1.5;">
                        <li><strong>This code expires in exactly 3 minutes</strong></li>
                        <li>Never share this code with anyone</li>
                        <li>If you didn't request this reset, please ignore this email</li>
                        <li>Contact us immediately if you suspect unauthorized access</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style="border-top: 2px solid #e5e7eb; padding-top: 25px; text-align: center;">
                <p style="color: #6b7280; font-size: 16px; margin-bottom: 15px; font-weight: 600;">
                  <strong>Need Assistance?</strong>
                </p>
                <div style="margin-bottom: 20px;">
                  <p style="color: #374151; font-size: 15px; margin: 8px 0; font-weight: 500;">📱 WhatsApp: +256 761 281 222</p>
                  <p style="color: #374151; font-size: 15px; margin: 8px 0; font-weight: 500;">📞 Phone: +256 761 281 222</p>
                  <p style="color: #374151; font-size: 15px; margin: 8px 0; font-weight: 500;">✉️ Email Support Available 24/7</p>
                </div>
                <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-top: 20px;">
                  <p style="color: #6b7280; font-size: 13px; line-height: 1.5; margin: 0;">
                    This is an automated security message from <strong>Garrison Financial Nexus</strong>.<br>
                    Our team is committed to keeping your financial information secure.<br>
                    Please do not reply to this email.
                  </p>
                </div>
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
        console.error("Resend API error details:", emailResponse.error);
        
        return new Response(JSON.stringify({ 
          error: 'Email delivery failed',
          success: false,
          message: 'Failed to send verification code. Please try again.',
          errorCode: 'EMAIL_SEND_ERROR'
        }), {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }

      console.log("Password reset email sent successfully:", emailResponse.data?.id);

      return new Response(JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data?.id,
        message: 'Verification code sent successfully from Garrison Financial Nexus',
        code: verificationCode // Include code for verification
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (emailError: any) {
      console.error("Email sending error:", emailError);
      
      return new Response(JSON.stringify({ 
        error: 'Email service error',
        success: false,
        message: 'Email service is temporarily unavailable. Please try again in a few minutes.',
        errorCode: 'NETWORK_ERROR'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (error: any) {
    console.error("Critical error in send-password-reset-code function:", error);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false,
        message: 'A system error occurred. Please contact support.',
        errorCode: 'INTERNAL_ERROR'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
