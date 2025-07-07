
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

  console.log('=== PASSWORD RESET CODE REQUEST ===');
  
  try {
    // Validate environment
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is missing');
      return new Response(JSON.stringify({ 
        error: 'Email service not configured',
        success: false,
        errorCode: 'MISSING_API_KEY'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Parse and validate request
    const { email, name }: PasswordResetRequest = await req.json();
    
    if (!email || !name) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        success: false,
        errorCode: 'MISSING_FIELDS'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const trimmedEmail = email.trim().toLowerCase();
    
    if (!emailRegex.test(trimmedEmail)) {
      return new Response(JSON.stringify({ 
        error: 'Invalid email format',
        success: false,
        errorCode: 'INVALID_EMAIL'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Processing password reset for:', trimmedEmail);

    // Initialize Resend and generate code
    const resend = new Resend(resendApiKey);
    const verificationCode = generateVerificationCode();
    
    console.log('Generated verification code:', verificationCode);

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: [trimmedEmail],
      subject: "🔐 Your Password Reset Code - Garrison Financial Nexus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Password Reset Request</h1>
            </div>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 20px;">Hello <strong>${name}</strong>,</p>
            
            <p style="font-size: 16px; color: #333; margin-bottom: 30px;">
              We received a request to reset your password for your Garrison Financial Nexus account. 
              Use the verification code below to proceed with resetting your password.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 25px; border-radius: 12px; font-size: 36px; font-weight: bold; letter-spacing: 8px; display: inline-block; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);">
                ${verificationCode}
              </div>
            </div>
            
            <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; padding: 20px; margin: 30px 0;">
              <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">⚠️ Important Security Information:</h3>
              <ul style="color: #92400e; margin: 0; padding-left: 20px;">
                <li>This code expires in exactly <strong>3 minutes</strong></li>
                <li>You have <strong>3 attempts</strong> to enter the correct code</li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this reset, please ignore this email</li>
              </ul>
            </div>
            
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin-bottom: 10px;">
                Need help? Contact us at <strong>+256 761 281 222</strong>
              </p>
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br>
                <strong>Garrison Financial Nexus Team</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Email sending failed:', emailResponse.error);
      return new Response(JSON.stringify({ 
        error: 'Failed to send verification email',
        success: false,
        errorCode: 'EMAIL_SEND_ERROR',
        details: emailResponse.error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Email sent successfully:', emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      message: 'Verification code sent successfully',
      code: verificationCode, // Include code for frontend storage
      timestamp: Date.now()
    }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });

  } catch (error: any) {
    console.error('Password reset error:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      success: false,
      message: error.message || 'An unexpected error occurred',
      errorCode: 'INTERNAL_ERROR'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
