
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
const adminEmail = "garrisonfinancialnexus01@gmail.com";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface LoanApplicationData {
  name: string;
  phone: string;
  email: string;
  nin: string;
  amount: number;
  term: 'short' | 'medium';
  interest: number;
  totalAmount: number;
  receiptNumber: string;
  receiptPdf?: string; // Base64 encoded PDF
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Processing loan application request...");
    const data: LoanApplicationData = await req.json();
    
    // Create email content
    const loanTermText = data.term === 'short' ? '14 days' : '30 days';
    
    let emailContent = `
      <h1>New Loan Application</h1>
      <h2>Applicant Information</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Phone:</strong> ${data.phone}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>NIN:</strong> ${data.nin}</p>
      
      <h2>Loan Details</h2>
      <p><strong>Amount:</strong> ${data.amount.toLocaleString()} UGX</p>
      <p><strong>Term:</strong> ${loanTermText}</p>
      <p><strong>Interest Rate:</strong> ${data.interest}%</p>
      <p><strong>Total Repayment:</strong> ${data.totalAmount.toLocaleString()} UGX</p>
      <p><strong>Receipt Number:</strong> ${data.receiptNumber}</p>
    `;
    
    // Create email options
    const emailOptions = {
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: adminEmail,
      subject: `New Loan Application: ${data.name} - ${data.receiptNumber}`,
      html: emailContent,
      attachments: [],
    };
    
    // Add PDF attachment if available
    if (data.receiptPdf) {
      emailOptions.attachments = [
        {
          filename: `Garrison_Financial_Receipt_${data.receiptNumber}.pdf`,
          content: data.receiptPdf,
          encoding: 'base64',
        },
      ];
      console.log("PDF attachment added to email");
    }
    
    // Send email
    console.log("Sending email to:", adminEmail);
    const emailResponse = await resend.emails.send(emailOptions);
    
    console.log("Email sent successfully:", emailResponse);
    
    return new Response(
      JSON.stringify({ success: true, message: "Application email sent successfully" }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in send-loan-application function:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
