
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
  code?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  console.log('=== PASSWORD RESET FUNCTION STARTED ===');
  
  try {
    // Check environment variables first
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error('CRITICAL: RESEND_API_KEY is missing');
      return new Response(JSON.stringify({ 
        error: 'Email service not configured',
        success: false,
        message: 'Email service configuration error'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Parse request body
    const requestBody = await req.json();
    const { email, name, code }: PasswordResetRequest = requestBody;

    // Generate 6-digit OTP if not provided
    const verificationCode = code || Math.floor(100000 + Math.random() * 900000).toString();

    // Validate required fields
    if (!email || !name) {
      console.error('Missing required fields:', { email: !!email, name: !!name });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        success: false,
        message: 'Email and name are required'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      console.error('Invalid email format:', email);
      return new Response(JSON.stringify({ 
        error: 'Invalid email format',
        success: false,
        message: 'Please provide a valid email address'
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Generating and sending 6-digit OTP to:', email);
    console.log('Generated OTP:', verificationCode);

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Send email with the 6-digit OTP
    const emailResponse = await resend.emails.send({
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: [email.trim().toLowerCase()],
      subject: "🔐 Your 6-Digit Password Reset Code - Garrison Financial Nexus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d5016; margin: 0; font-size: 24px;">🏦 Garrison Financial Nexus</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Secure Password Reset</p>
            </div>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Your 6-Digit Verification Code</h2>
            
            <p style="color: #333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your Garrison Financial Nexus account. 
              Use the 6-digit verification code below to continue:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #2d5016, #4a7c23); color: white; padding: 25px; border-radius: 15px; font-size: 36px; font-weight: bold; letter-spacing: 12px; display: inline-block; font-family: 'Courier New', monospace;">
                ${verificationCode}
              </div>
            </div>
            
            <div style="background-color: #fff3cd; border: 2px solid #ffeaa7; padding: 20px; border-radius: 10px; margin: 25px 0;">
              <p style="color: #856404; margin: 0; font-weight: bold; font-size: 16px;">⚠️ Important Security Information:</p>
              <ul style="color: #856404; margin: 15px 0 0 0; padding-left: 20px; font-size: 14px;">
                <li><strong>This code expires in exactly 3 minutes</strong></li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Contact us immediately if you suspect unauthorized access</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Need help? Contact us at <strong>+256 761 281 222</strong>
              </p>
              <p style="color: #666; font-size: 14px; margin: 15px 0 0 0;">
                Best regards,<br>
                <strong style="color: #2d5016;">The Garrison Financial Nexus Team</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      
      // Check if it's the domain verification error
      if (emailResponse.error.message && emailResponse.error.message.includes('verify a domain')) {
        return new Response(JSON.stringify({ 
          error: 'Domain not verified',
          success: false,
          message: 'Please verify your domain at resend.com/domains to send emails to all recipients.',
          details: 'Currently in testing mode - can only send to verified email address'
        }), {
          status: 403,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        });
      }
      
      return new Response(JSON.stringify({ 
        error: 'Email delivery failed',
        success: false,
        message: 'Failed to send verification code. Please try again.',
        details: emailResponse.error.message
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    if (!emailResponse.data) {
      console.error('No data returned from Resend API');
      return new Response(JSON.stringify({ 
        error: 'Email service error',
        success: false,
        message: 'Email service did not return confirmation'
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('✅ 6-digit OTP email sent successfully with ID:', emailResponse.data.id);
    console.log('✅ OTP Code:', verificationCode, 'sent to:', email);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data.id,
      message: '6-digit verification code sent successfully to your email',
      code: verificationCode,
      timestamp: Date.now(),
      expiresIn: '3 minutes'
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Critical error in password reset function:', error);
    
    return new Response(JSON.stringify({ 
      error: 'Internal server error',
      success: false,
      message: 'System error occurred. Please try again.',
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
};

serve(handler);
