
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface SignupNotificationRequest {
  userDetails: {
    name: string;
    email: string;
    phone: string;
    nin: string;
    signupDate: string;
  };
  accountNumber: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userDetails, accountNumber }: SignupNotificationRequest = await req.json();

    console.log('Received signup notification request:', { userDetails, accountNumber });

    const emailResponse = await resend.emails.send({
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: ["garrisonfinancialnexus01@gmail.com"],
      subject: "New Client Account Registration",
      html: `
        <h2>New Client Account Registration</h2>
        <p>A new client has registered for an account and is waiting for activation:</p>
        
        <h3>Client Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${userDetails.name}</li>
          <li><strong>Email:</strong> ${userDetails.email}</li>
          <li><strong>Phone:</strong> ${userDetails.phone}</li>
          <li><strong>NIN:</strong> ${userDetails.nin}</li>
          <li><strong>Account Number:</strong> ${accountNumber}</li>
          <li><strong>Registration Date:</strong> ${new Date(userDetails.signupDate).toLocaleString()}</li>
          <li><strong>Account Status:</strong> Pending Activation</li>
          <li><strong>Initial Balance:</strong> 0 UGX</li>
        </ul>
        
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Client will contact you for a verification code</li>
          <li>Provide a 6-digit verification code from the system</li>
          <li>Client will use the code to activate their account</li>
          <li>Once activated, client can access their dashboard</li>
        </ul>
        
        <p><strong>Contact Information:</strong></p>
        <ul>
          <li>WhatsApp: +256 761 281 222</li>
          <li>Phone: +256 761 281 222</li>
        </ul>
        
        <p>The client may reach out via WhatsApp or phone to request their verification code.</p>
        
        <p>Best regards,<br>Garrison Financial Nexus System</p>
      `,
    });

    console.log("Signup notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      emailId: emailResponse.data?.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-signup-notification function:", error);
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
