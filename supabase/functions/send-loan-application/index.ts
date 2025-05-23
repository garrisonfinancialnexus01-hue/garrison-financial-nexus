
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

// Make sure to use the API key properly
const resendApiKey = Deno.env.get("RESEND_API_KEY");
const resend = new Resend(resendApiKey);
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
    
    if (!resendApiKey) {
      console.error("ERROR: Missing Resend API key. Please add RESEND_API_KEY to Supabase Edge Function secrets.");
      throw new Error("Email service configuration error. Contact administrator.");
    }
    
    const data: LoanApplicationData = await req.json();
    console.log("Received data for receipt number:", data.receiptNumber);
    
    if (!data.receiptPdf) {
      console.error("No PDF attachment provided");
      throw new Error("PDF receipt is required");
    }
    
    // Create email content with improved formatting
    const loanTermText = data.term === 'short' ? '14 days' : '30 days';
    
    let emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #399B53; padding: 20px; text-align: center; color: white;">
          <h1>New Loan Application</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
          <h2 style="color: #399B53; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px;">Applicant Information</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold;">Name:</td>
              <td style="padding: 8px;">${data.name}</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Phone:</td>
              <td style="padding: 8px;">${data.phone}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Email:</td>
              <td style="padding: 8px;">${data.email}</td>
            </tr>
          </table>
          
          <h2 style="color: #399B53; border-bottom: 1px solid #e0e0e0; padding-bottom: 10px; margin-top: 20px;">Loan Details</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px; font-weight: bold;">Amount:</td>
              <td style="padding: 8px;">${data.amount.toLocaleString()} UGX</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Term:</td>
              <td style="padding: 8px;">${loanTermText}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Interest Rate:</td>
              <td style="padding: 8px;">${data.interest}%</td>
            </tr>
            <tr style="background-color: #f9f9f9;">
              <td style="padding: 8px; font-weight: bold;">Total Repayment:</td>
              <td style="padding: 8px; font-weight: bold;">${data.totalAmount.toLocaleString()} UGX</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Receipt Number:</td>
              <td style="padding: 8px;">${data.receiptNumber}</td>
            </tr>
          </table>
          
          <div style="background-color: #f8f9fa; padding: 15px; border-left: 4px solid #399B53; margin-top: 20px;">
            <strong>Note:</strong> The receipt is attached as a PDF file to this email. ID verification was completed using Uganda National ID card scanning.
          </div>
        </div>
        
        <div style="background-color: #f5f5f5; padding: 15px; text-align: center; color: #666; font-size: 12px;">
          <p>Garrison Financial Nexus - Loan Application System</p>
        </div>
      </div>
    `;
    
    // Prepare email options with proper formatting and attachment
    const emailOptions = {
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `New Loan Application: ${data.name} - ${data.receiptNumber}`,
      html: emailContent,
      attachments: [
        {
          filename: `Garrison_Financial_Receipt_${data.receiptNumber}.pdf`,
          content: data.receiptPdf,
          encoding: 'base64',
        },
      ],
    };
    
    // Send email with enhanced retry mechanism
    let emailResponse = null;
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts && !emailResponse) {
      try {
        attempts++;
        console.log(`Attempt ${attempts} to send admin email to: ${adminEmail}`);
        
        emailResponse = await resend.emails.send(emailOptions);
        console.log("Admin email sent successfully:", JSON.stringify(emailResponse));
      } catch (emailError) {
        console.error(`Email attempt ${attempts} failed:`, emailError);
        
        // Add more detailed error logging
        if (emailError.response) {
          console.error("Error response data:", emailError.response.data);
          console.error("Error response status:", emailError.response.status);
        }
        
        if (attempts === maxAttempts) throw emailError;
        // Add a delay before retry (increase delay with each attempt)
        await new Promise(resolve => setTimeout(resolve, attempts * 1000));
      }
    }
    
    // Also send a confirmation email to the applicant with receipt
    try {
      console.log(`Sending confirmation email to applicant: ${data.email}`);
      
      const applicantEmailContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #399B53; padding: 20px; text-align: center; color: white;">
            <h1>Thank you for your application!</h1>
          </div>
          
          <div style="padding: 20px; border: 1px solid #e0e0e0; border-top: none;">
            <p>Dear ${data.name},</p>
            
            <p>We have received your loan application with the following details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold;">Loan Amount:</td>
                <td style="padding: 8px;">${data.amount.toLocaleString()} UGX</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Term:</td>
                <td style="padding: 8px;">${loanTermText}</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold;">Interest Rate:</td>
                <td style="padding: 8px;">${data.interest}%</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold;">Total Repayment:</td>
                <td style="padding: 8px;">${data.totalAmount.toLocaleString()} UGX</td>
              </tr>
              <tr style="background-color: #f9f9f9;">
                <td style="padding: 8px; font-weight: bold;">Receipt Number:</td>
                <td style="padding: 8px;">${data.receiptNumber}</td>
              </tr>
            </table>
            
            <p>Your identity has been verified using your Uganda National ID card.</p>
            <p>Our team will review your application and contact you shortly.</p>
            
            <p>Best regards,<br>Garrison Financial Nexus Team</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; text-align: center; color: #666; font-size: 12px;">
            <p>Garrison Financial Nexus - Your Financial Partner</p>
          </div>
        </div>
      `;
      
      await resend.emails.send({
        from: "Garrison Financial Nexus <onboarding@resend.dev>",
        to: [data.email],
        subject: `Your Loan Application - ${data.receiptNumber}`,
        html: applicantEmailContent,
        attachments: [
          {
            filename: `Your_Receipt_${data.receiptNumber}.pdf`,
            content: data.receiptPdf,
            encoding: 'base64',
          }
        ],
      });
      console.log("Client confirmation email sent successfully");
    } catch (clientEmailError) {
      console.error("Error sending client email:", clientEmailError);
      // Continue execution even if client email fails
    }
    
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
