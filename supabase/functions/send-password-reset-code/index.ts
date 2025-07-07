
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
  
  try {
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    
    if (!resendApiKey) {
      console.error('RESEND_API_KEY is missing');
      return new Response(JSON.stringify({ 
        error: 'Email service not configured',
        success: false
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const { email, name }: PasswordResetRequest = await req.json();

    if (!email || !name) {
      return new Response(JSON.stringify({ 
        error: 'Missing required fields',
        success: false
      }), {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    const resend = new Resend(resendApiKey);
    const verificationCode = generateVerificationCode();
    
    console.log('Sending email to:', email);
    console.log('Generated code:', verificationCode);

    const emailResponse = await resend.emails.send({
      from: "Garrison Financial Nexus <garrisonfinancialnexus01@gmail.com>",
      to: [email.trim().toLowerCase()],
      subject: "🔐 Password Reset Code - Garrison Financial Nexus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Garrison Financial Nexus</h1>
            <p style="color: #666; margin: 10px 0;">Secure Financial Services</p>
          </div>
          
          <h2 style="color: #333; text-align: center;">Password Reset Request</h2>
          <p>Hello <strong>${name}</strong>,</p>
          
          <p>We received a request to reset your password for your Garrison Financial Nexus account.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 25px; border-radius: 12px; display: inline-block;">
              <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">Your verification code:</p>
              <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; font-family: 'Courier New', monospace;">
                ${verificationCode}
              </div>
            </div>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #dc3545; margin: 0 0 15px 0;">⚠️ Important Security Notice:</h3>
            <ul style="margin: 0; padding-left: 20px; color: #555;">
              <li><strong>This code expires in exactly 3 minutes</strong></li>
              <li>Never share this code with anyone</li>
              <li>Our staff will never ask for this code</li>
              <li>If you didn't request this reset, please ignore this email</li>
            </ul>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">Need help? Contact us:</p>
            <p style="color: #2563eb; font-weight: bold;">📞 +256 761 281 222</p>
            <p style="color: #2563eb; font-weight: bold;">✉️ support@garrisonfinancial.com</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <div style="text-align: center; color: #999; font-size: 12px;">
            <p>© 2024 Garrison Financial Nexus. All rights reserved.</p>
            <p>This is an automated security message. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    });

    if (emailResponse.error) {
      console.error('Resend API error:', emailResponse.error);
      return new Response(JSON.stringify({ 
        error: 'Failed to send email',
        success: false
      }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    console.log('Email sent successfully:', emailResponse.data?.id);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      code: verificationCode, // Include for local verification
      timestamp: Date.now(),
      expiresIn: 180000 // 3 minutes in milliseconds
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });

  } catch (error: any) {
    console.error('Critical error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        success: false
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
