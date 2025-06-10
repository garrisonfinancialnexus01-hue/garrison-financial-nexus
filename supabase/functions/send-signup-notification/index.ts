
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
      subject: "New Client Account Activated",
      html: `
        <h2>New Client Account Successfully Activated</h2>
        <p>A client has completed the signup process and their account has been activated:</p>
        
        <h3>Client Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${userDetails.name}</li>
          <li><strong>Email:</strong> ${userDetails.email}</li>
          <li><strong>Phone:</strong> ${userDetails.phone}</li>
          <li><strong>NIN:</strong> ${userDetails.nin}</li>
          <li><strong>Account Number:</strong> ${accountNumber}</li>
          <li><strong>Signup Date:</strong> ${new Date(userDetails.signupDate).toLocaleString()}</li>
          <li><strong>Account Status:</strong> Active</li>
          <li><strong>Initial Balance:</strong> 0 UGX</li>
        </ul>
        
        <p>The client can now access their dashboard and request transactions through WhatsApp (+256761281222).</p>
        
        <p><strong>Next Steps:</strong></p>
        <ul>
          <li>Client can log in using their account number and password</li>
          <li>Client can view their account details on the dashboard</li>
          <li>Client can request deposits/withdrawals through WhatsApp</li>
        </ul>
        
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
