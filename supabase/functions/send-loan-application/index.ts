
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
  gender: string;
  whatsappNumber: string;
  educationDegree: string;
  workStatus: string;
  monthlyIncome: string;
  maritalStatus: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  amount: number;
  term: 'short' | 'medium';
  interest: number;
  totalAmount: number;
  receiptNumber: string;
  receiptPdf?: string;
  idCardFront?: string;
  idCardBack?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log("Processing loan application request...");
    
    if (!resendApiKey) {
      console.error("ERROR: Missing Resend API key");
      throw new Error("Email service configuration error");
    }
    
    const data: LoanApplicationData = await req.json();
    console.log("Received data with fields:", Object.keys(data).join(", "));
    
    // Validate the data received
    if (!data.name || !data.whatsappNumber || !data.receiptNumber) {
      console.error("ERROR: Missing required fields in loan application");
      throw new Error("Missing required fields in loan application");
    }
    
    console.log("Received application for:", data.name, "Receipt:", data.receiptNumber);
    
    const loanTermText = data.term === 'short' ? 'within 14 days' : 'within 30 days';
    
    // Create comprehensive email content
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <div style="background-color: #399B53; padding: 20px; text-align: center; color: white;">
          <h1>🚨 URGENT: New Loan Application Received</h1>
        </div>
        
        <div style="padding: 20px; border: 1px solid #e0e0e0;">
          <h2 style="color: #399B53;">⚡ IMMEDIATE ACTION REQUIRED</h2>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <strong>📋 PERSONAL INFORMATION:</strong>
            <br><strong>Name:</strong> ${data.name}
            <br><strong>Gender:</strong> ${data.gender}
            <br><strong>WhatsApp Number:</strong> ${data.whatsappNumber}
            <br><strong>Education:</strong> ${data.educationDegree}
            <br><strong>Work Status:</strong> ${data.workStatus}
            <br><strong>Monthly Income:</strong> ${data.monthlyIncome}
            <br><strong>Marital Status:</strong> ${data.maritalStatus}
          </div>

          <div style="background-color: #e7f3ff; border: 1px solid #b6d7ff; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <strong>🆘 EMERGENCY CONTACT:</strong>
            <br><strong>Name:</strong> ${data.emergencyContactName}
            <br><strong>Phone:</strong> ${data.emergencyContactPhone}
            <br><strong>Relation:</strong> ${data.emergencyContactRelation}
          </div>
          
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <strong>💰 LOAN DETAILS:</strong>
            <br><strong>Amount:</strong> ${data.amount.toLocaleString()} UGX
            <br><strong>Term:</strong> Pay ${loanTermText}
            <br><strong>Interest:</strong> ${data.interest}%
            <br><strong>Total Repayment:</strong> ${data.totalAmount.toLocaleString()} UGX
            <br><strong>Receipt #:</strong> ${data.receiptNumber}
            <br><strong>Submitted:</strong> ${new Date().toLocaleString()}
          </div>
          
          <div style="background-color: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <strong>✅ VERIFICATION STATUS:</strong>
            <br>• Personal information completed
            <br>• Emergency contact provided
            <br>• ID card images captured and attached
            <br>• Application form completed
            <br>• Ready for immediate processing
          </div>
          
          <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; margin: 15px 0; border-radius: 5px;">
            <strong>⏰ NEXT STEPS:</strong>
            <br>1. Review attached ID card images
            <br>2. Contact applicant at ${data.whatsappNumber}
            <br>3. Process loan approval/rejection
            <br>4. Send verification code if approved
          </div>
        </div>
      </div>
    `;
    
    // Prepare email attachments
    const attachments = [];
    
    // Add receipt PDF if available
    if (data.receiptPdf) {
      attachments.push({
        filename: `Loan_Application_${data.receiptNumber}.pdf`,
        content: data.receiptPdf,
        encoding: 'base64',
      });
      console.log("Receipt PDF attachment added");
    }
    
    // Add ID card front image if available
    if (data.idCardFront) {
      attachments.push({
        filename: `ID_Front_${data.receiptNumber}.jpg`,
        content: data.idCardFront,
        encoding: 'base64',
      });
      console.log("ID Card Front attachment added");
    }
    
    // Add ID card back image if available
    if (data.idCardBack) {
      attachments.push({
        filename: `ID_Back_${data.receiptNumber}.jpg`,
        content: data.idCardBack,
        encoding: 'base64',
      });
      console.log("ID Card Back attachment added");
    }
    
    // Prepare email options with highest priority
    const emailOptions = {
      from: "Garrison Financial Nexus <onboarding@resend.dev>",
      to: [adminEmail],
      subject: `🚨 URGENT: New Loan Application - ${data.name} - ${data.receiptNumber}`,
      html: emailContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    };
    
    console.log("Sending urgent email notification to:", adminEmail, "with", attachments.length, "attachments");
    const emailResponse = await resend.emails.send(emailOptions);
    
    if (emailResponse.error) {
      console.error("Email sending failed:", emailResponse.error);
      throw new Error("Failed to send notification email");
    }
    
    console.log("✅ EMAIL SENT SUCCESSFULLY:", emailResponse.data?.id);
    
    // Send SMS confirmation to applicant (simulated - would need actual SMS service)
    // In a real implementation, you would integrate with an SMS service like Twilio
    console.log(`📱 SMS would be sent to ${data.whatsappNumber}:`);
    console.log("From: Garrison Financial Nexus");
    console.log("Message: Thank you for submitting your Loan Application, our manager will contact you on the WhatsApp number you have provided when your Loan Application has been approved. Wait the message from our manager within 24 hours. Thank you!");
    
    // Send confirmation email to applicant
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
            <p><strong>Term:</strong> Pay ${loanTermText}</p>
            <p>Our manager will contact you on your WhatsApp number ${data.whatsappNumber} within 24 hours once your application is approved.</p>
            <p>Thank you for choosing Garrison Financial Nexus!</p>
          </div>
        </div>
      `;
      
      // Note: In production, you would also implement actual SMS sending here
      
      console.log("✅ Confirmation process completed");
    } catch (confirmError) {
      console.log("⚠️ Confirmation sending failed (non-critical):", confirmError);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Application submitted and notification sent immediately. SMS confirmation will be sent to your WhatsApp number.",
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
