
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

// Predefined verification codes (using the same set for consistency)
const verificationCodes = [
  "123456", "234567", "345678", "456789", "567890", 
  "135790", "246801", "357912", "468023", "579134",
  "102938", "293847", "384756", "475665", "566574",
  "657483", "748392", "839201", "920110", "011029",
  "112233", "223344", "334455", "445566", "556677"
];

const getRandomVerificationCode = (): string => {
  const randomIndex = Math.floor(Math.random() * verificationCodes.length);
  return verificationCodes[randomIndex];
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, name }: PasswordResetRequest = await req.json();

    console.log('Received password reset request for:', { email, name });

    // Generate a random verification code
    const verificationCode = getRandomVerificationCode();

    const emailResponse = await resend.emails.send({
      from: "Garrison Financial Nexus <garrisonfinancialnexus01@gmail.com>",
      to: [email],
      subject: "Password Reset Verification Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin-bottom: 10px;">Garrison Financial Nexus</h1>
            <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Password Reset Request</h2>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p style="color: #333; font-size: 16px; margin-bottom: 15px;">Hello ${name},</p>
            <p style="color: #333; font-size: 16px; margin-bottom: 15px;">
              We received a request to reset the password for your account. Please use the verification code below to proceed with your password reset:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <div style="background-color: #2563eb; color: white; font-size: 32px; font-weight: bold; padding: 20px; border-radius: 8px; letter-spacing: 4px; display: inline-block;">
                ${verificationCode}
              </div>
            </div>
            
            <div style="background-color: #fef3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="color: #92400e; font-size: 14px; margin: 0;">
                <strong>Important:</strong> This code will expire in 2 minutes for security reasons.
              </p>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; font-size: 18px; margin-bottom: 10px;">Security Notice:</h3>
            <ul style="color: #666; font-size: 14px; line-height: 1.6;">
              <li>If you did not request a password reset, please ignore this email</li>
              <li>Never share your verification code with anyone</li>
              <li>This code is only valid for 2 minutes</li>
              <li>For security, you may need to contact us if the code expires</li>
            </ul>
          </div>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
            <p style="color: #666; font-size: 14px; margin-bottom: 10px;">
              <strong>Need Help?</strong>
            </p>
            <p style="color: #666; font-size: 14px; margin-bottom: 5px;">
              WhatsApp: +256 761 281 222
            </p>
            <p style="color: #666; font-size: 14px; margin-bottom: 15px;">
              Phone: +256 761 281 222
            </p>
            <p style="color: #888; font-size: 12px;">
              This is an automated message from Garrison Financial Nexus.<br>
              Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    });

    console.log("Password reset code email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id,
      code: verificationCode // In production, don't return this
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-password-reset-code function:", error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
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
