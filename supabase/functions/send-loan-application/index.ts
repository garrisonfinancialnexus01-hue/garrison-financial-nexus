
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

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
  receiptPdf?: string;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Processing loan application request immediately...");
    
    if (!resendApiKey) {
      console.error("ERROR: Missing Resend API key");
      throw new Error("Email service configuration error");
    }
    
    const data: LoanApplicationData = await req.json();
    console.log("Received application for:", data.name, "Receipt:", data.receiptNumber);
    
    const loanTermText = data.term === 'short' ? '14 days' : '30 days';
    
    // Create streamlined email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #399B53; padding: 20px; text-align: center; color: white;">
          <h1>🚨 URGENT: New Loan Application Received</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #399B53;">⚡ IMMEDIATE ACTION REQUIRED</h2>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <strong>📋 APPLICATION DETAILS:</strong>
            <br><strong>Name:</strong> ${data.name}
            <br><strong>Phone:</strong> ${data.phone}
            <br><strong>Email:</strong> ${data.email}
            <br><strong>Amount:</strong> ${data.amount.toLocaleString()} UGX
            <br><strong>Term:</strong> ${loanTermText}
            <br><strong>Interest:</strong> ${data.interest}%
            <br><strong>Total Repayment:</strong> ${data.totalAmount.toLocaleString()} UGX
            <br><strong>Receipt #:</strong> ${data.receiptNumber}
            <br><strong>Submitted:</strong> ${new Date().toLocaleString()}
          </div>
          
          <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <strong>✅ VERIFICATION STATUS:</strong>
            <br>• ID card images captured and attached
            <br>• Application form completed
            <br>• Ready for immediate processing
          </div>
          
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <strong>⏰ NEXT STEPS:</strong>
            <br>1. Review attached receipt and ID documents
            <br>2. Contact applicant at ${data.phone}
            <br>3. Process loan approval/rejection
            <br>4. Send verification code if approved
          </div>
        </div>
      </div>
    `;
    
    // Send email immediately with high priority
    const emailOptions = {
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🚨 URGENT: New Loan Application - ${data.name} - ${data.receiptNumber}`,
      html: emailContent,
      ...(data.receiptPdf && {
        attachments: [
          {
            filename: `Loan_Application_${data.receiptNumber}.pdf`,
            content: data.receiptPdf,
            encoding: 'base64',
          },
        ],
      }),
    };
    
    console.log("Sending urgent email notification to:", adminEmail);
    const emailResponse = await resend.emails.send(emailOptions);
    
    if (emailResponse.error) {
      console.error("Email sending failed:", emailResponse.error);
      throw new Error("Failed to send notification email");
    }
    
    console.log("✅ EMAIL SENT SUCCESSFULLY:", emailResponse.data?.id);
    
    // Send confirmation to applicant (non-blocking)
    try {
      const applicantConfirmation = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #399B53; padding: 20px; text-align: center; color: white;">
            <h1>✅ Application Received Successfully!</h1>
          </div>
          <div style="padding: 20px;">
            <p>Dear ${data.name},</p>
            <p><strong>Your loan application has been received and is being processed immediately.</strong></p>
            <p><strong>Receipt Number:</strong> ${data.receiptNumber}</p>
            <p><strong>Amount:</strong> ${data.amount.toLocaleString()} UGX</p>
            <p><strong>Term:</strong> ${loanTermText}</p>
            <p>Our team will contact you shortly at ${data.phone}.</p>
            <p>Thank you for choosing Garrison Financial Nexus!</p>
          </div>
        </div>
      `;
      
      await resend.emails.send({
        from: "Garrison Financial Nexus <onboarding@resend.dev>",
        to: [data.email],
        subject: `Application Received - ${data.receiptNumber}`,
        html: applicantConfirmation,
      });
      
      console.log("✅ Confirmation email sent to applicant");
    } catch (confirmError) {
      console.log("⚠️ Applicant confirmation failed (non-critical):", confirmError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Application submitted and notification sent immediately",
        receiptNumber: data.receiptNumber,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
    
  } catch (error) {
    console.error("❌ CRITICAL ERROR in loan application:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
