
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

  console.log('=== PASSWORD RESET FUNCTION STARTED ===');
  console.log('Request method:', req.method);
  console.log('Request URL:', req.url);
  
  try {
    // Check environment variables
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY");
    
    console.log('Environment check:', {
      hasResendKey: !!resendApiKey,
      hasSupabaseUrl: !!supabaseUrl,
      hasSupabaseKey: !!supabaseKey,
      resendKeyLength: resendApiKey?.length || 0
    });
    
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

    // Parse request body with better error handling
    let requestBody;
    const contentType = req.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    try {
      const rawBody = await req.text();
      console.log('Raw request body length:', rawBody.length);
      console.log('Raw request body preview:', rawBody.substring(0, 200));
      
      requestBody = JSON.parse(rawBody);
      console.log('Parsed request body:', {
        hasEmail: !!requestBody.email,
        emailLength: requestBody.email?.length || 0,
        hasName: !!requestBody.name,
        nameLength: requestBody.name?.length || 0
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
      console.error('Missing required fields:', { 
        email: !!email, 
        name: !!name,
        emailValue: email,
        nameValue: name
      });
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

    // More lenient email validation
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

    console.log('Validation passed for:', { email: trimmedEmail, name });

    // Initialize Resend with detailed error handling
    let resend;
    try {
      console.log('Initializing Resend client...');
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

    // Attempt to send email with detailed logging
    console.log('Preparing to send email...');
    console.log('Email details:', {
      from: 'noreply@garrisonfinancialnexus.com',
      to: trimmedEmail,
      subject: '🔐 Password Reset Code - Garrison Financial Nexus'
    });
    
    try {
      console.log('Calling Resend API...');
      
      const emailResponse = await resend.emails.send({
        from: "Garrison Financial Nexus <noreply@garrisonfinancialnexus.com>",
        to: [trimmedEmail],
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
                  We received a request to reset your password for your Garrison Financial Nexus account. Use the verification code below to proceed:
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

      console.log("Resend API call completed");
      console.log("Email response structure:", {
        hasData: !!emailResponse.data,
        hasError: !!emailResponse.error,
        dataKeys: emailResponse.data ? Object.keys(emailResponse.data) : [],
        errorKeys: emailResponse.error ? Object.keys(emailResponse.error) : []
      });

      if (emailResponse.error) {
        console.error("Resend API returned an error:", {
          message: emailResponse.error.message,
          name: emailResponse.error.name,
          fullError: emailResponse.error
        });
        
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
        console.error("No data returned from Resend API");
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

      console.log("SUCCESS: Email sent successfully");
      console.log("Email ID:", emailResponse.data.id);

      return new Response(JSON.stringify({ 
        success: true, 
        emailId: emailResponse.data.id,
        message: 'Verification code sent successfully',
        code: verificationCode,
        timestamp: Date.now(),
        debugInfo: {
          emailSent: true,
          codeGenerated: true,
          recipientEmail: trimmedEmail
        }
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      });

    } catch (emailSendError: any) {
      console.error("Email sending network/runtime error:", {
        message: emailSendError.message,
        name: emailSendError.name,
        stack: emailSendError.stack,
        fullError: emailSendError
      });
      
      return new Response(JSON.stringify({ 
        error: 'Email service network error',
        success: false,
        message: `Failed to send email: ${emailSendError.message}`,
        errorCode: 'NETWORK_ERROR',
        details: {
          errorType: emailSendError.name,
          errorMessage: emailSendError.message
        }
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

  } catch (criticalError: any) {
    console.error("CRITICAL ERROR in send-password-reset-code function:", {
      message: criticalError.message,
      name: criticalError.name,
      stack: criticalError.stack,
      fullError: criticalError
    });
    
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
