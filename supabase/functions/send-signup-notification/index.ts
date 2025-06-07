
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

    const emailResponse = await resend.emails.send({
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: ["garrisonfinancialnexus01@gmail.com"],
      subject: "New Client Signup Notification",
      html: `
        <h2>New Client Account Created</h2>
        <p>A new client has successfully signed up and created an account:</p>
        
        <h3>Client Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${userDetails.name}</li>
          <li><strong>Email:</strong> ${userDetails.email}</li>
          <li><strong>Phone:</strong> ${userDetails.phone}</li>
          <li><strong>NIN:</strong> ${userDetails.nin}</li>
          <li><strong>Account Number:</strong> ${accountNumber}</li>
          <li><strong>Signup Date:</strong> ${new Date(userDetails.signupDate).toLocaleString()}</li>
        </ul>
        
        <p>The client's account has been activated and they can now access their dashboard.</p>
        
        <p>Best regards,<br>Garrison Financial Nexus System</p>
      `,
    });

    console.log("Signup notification email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-signup-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
