
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PasswordResetRequest {
  email: string;
  name: string;
}

// Enhanced verification codes with better randomization
const generateVerificationCode = (): string => {
  // Generate a truly random 6-digit code
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
    const { email, name }: PasswordResetRequest = await req.json();

    console.log('Processing password reset request for:', { email, name });

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.error('Invalid email format:', email);
      return new Response(JSON.stringify({ 
        error: 'Invalid email format',
        success: false 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Generate a secure random verification code
    const verificationCode = generateVerificationCode();
    console.log('Generated verification code:', verificationCode);

    // Send email with enhanced configuration
    const emailResponse = await resend.emails.send({
      from: "Garrison Financial Nexus <onboarding@resend.dev>", // Using verified Resend domain
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
            
            <div style="margin: 30px 0;">
              <h3 style="color: #374151; font-size: 16px; margin-bottom: 15px; font-weight: 600;">Password Requirements:</h3>
              <div style="background-color: #f1f5f9; border-radius: 8px; padding: 15px;">
                <p style="color: #475569; font-size: 14px; margin: 0 0 10px;">Your new password must contain:</p>
                <ul style="color: #475569; font-size: 14px; margin: 0; padding-left: 20px; line-height: 1.6;">
                  <li>6-10 characters in length</li>
                  <li>At least one uppercase letter (A-Z)</li>
                  <li>At least one number (0-9)</li>
                  <li>At least one special character (!@#$%^&*)</li>
                </ul>
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

    console.log("Password reset email sent successfully:", emailResponse);

    // Enhanced response with better error handling
    if (emailResponse.error) {
      console.error("Resend API error:", emailResponse.error);
      return new Response(JSON.stringify({ 
        error: 'Failed to send email',
        success: false,
        details: emailResponse.error
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: 'Verification code sent successfully',
      // Don't return the actual code in production for security
      debug: process.env.NODE_ENV === 'development' ? { code: verificationCode } : undefined
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Critical error in send-password-reset-code function:", error);
    console.error("Error stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false,
        message: 'Failed to process password reset request'
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
