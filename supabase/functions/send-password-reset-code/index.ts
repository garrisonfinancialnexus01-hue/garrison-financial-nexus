
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
  code: string;
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

    // Validate required fields
    if (!email || !name || !code) {
      console.error('Missing required fields:', { email: !!email, name: !!name, code: !!code });
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        success: false,
        message: 'Email, name, and code are required'
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

    console.log('Sending email to:', email);

    // Initialize Resend
    const resend = new Resend(resendApiKey);

    // Send email with comprehensive error handling
    const emailResponse = await resend.emails.send({
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: [email.trim().toLowerCase()],
      subject: "🔐 Password Reset Code - Garrison Financial Nexus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f8f9fa;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #2d5016; margin: 0; font-size: 24px;">Garrison Financial Nexus</h1>
              <p style="color: #666; margin: 5px 0 0 0;">Secure Password Reset</p>
            </div>
            
            <h2 style="color: #333; text-align: center; margin-bottom: 20px;">Password Reset Request</h2>
            
            <p style="color: #333; font-size: 16px;">Hello <strong>${name}</strong>,</p>
            
            <p style="color: #333; font-size: 16px; line-height: 1.6;">
              We received a request to reset your password for your Garrison Financial Nexus account. 
              Use the verification code below to continue with your password reset:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #2d5016, #4a7c23); color: white; padding: 20px; border-radius: 10px; font-size: 32px; font-weight: bold; letter-spacing: 8px; display: inline-block;">
                ${code}
              </div>
            </div>
            
            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #856404; margin: 0; font-weight: bold;">⚠️ Important Security Information:</p>
              <ul style="color: #856404; margin: 10px 0 0 0; padding-left: 20px;">
                <li>This code expires in exactly <strong>3 minutes</strong></li>
                <li>Never share this code with anyone</li>
                <li>If you didn't request this reset, please ignore this email</li>
                <li>Contact us immediately if you suspect unauthorized access</li>
              </ul>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Need help? Contact us at <strong>+256 761 281 222</strong>
              </p>
              <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
                Best regards,<br>
                <strong>Garrison Financial Nexus Team</strong>
              </p>
            </div>
          </div>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
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

    console.log('Email sent successfully with ID:', emailResponse.data.id);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data.id,
      message: 'Verification code sent successfully',
      code: code,
      timestamp: Date.now()
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
