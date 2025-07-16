
import jsPDF from 'jspdf';

interface TransactionDetails {
  record_number: number;
  account_number: string;
  amount_deposited: number;
  amount_withdrawn: number;
  account_balance: number;
  transaction_date: string;
  transaction_time: string;
}

interface ReceiptData {
  company_name: string;
  motto: string;
  transaction_details: TransactionDetails;
  generated_at: string;
}

export const generatePDFReceipt = (receiptData: ReceiptData): void => {
  const doc = new jsPDF({
    unit: 'mm',
    format: [80, 200], // Thermal receipt size (80mm width)
    orientation: 'portrait'
  });

  const { transaction_details } = receiptData;
  
  // Set font
  doc.setFont('helvetica', 'normal');
  
  let yPosition = 10;
  const lineHeight = 4;
  const centerX = 40; // Center of 80mm width

  // Company name (centered, bold)
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  const companyNameWidth = doc.getTextWidth(receiptData.company_name);
  doc.text(receiptData.company_name, centerX - (companyNameWidth / 2), yPosition);
  yPosition += lineHeight + 2;

  // Motto (centered, italic)
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  const mottoWidth = doc.getTextWidth(`"${receiptData.motto}"`);
  doc.text(`"${receiptData.motto}"`, centerX - (mottoWidth / 2), yPosition);
  yPosition += lineHeight + 2;

  // Separator line
  doc.setFont('helvetica', 'normal');
  doc.text('========================================', 2, yPosition);
  yPosition += lineHeight + 2;

  // Receipt title (centered, bold)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  const titleWidth = doc.getTextWidth('TRANSACTION RECEIPT');
  doc.text('TRANSACTION RECEIPT', centerX - (titleWidth / 2), yPosition);
  yPosition += lineHeight + 2;

  // Record number
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(`Record No: ${transaction_details.record_number}`, 2, yPosition);
  yPosition += lineHeight + 2;

  yPosition += lineHeight;

  // Account details
  doc.text(`Account Number: ${transaction_details.account_number}`, 2, yPosition);
  yPosition += lineHeight;

  const date = new Date(transaction_details.transaction_date).toLocaleDateString('en-GB');
  doc.text(`Date: ${date}`, 2, yPosition);
  yPosition += lineHeight;

  const time = new Date(transaction_details.transaction_time).toLocaleString('en-UG', {
    timeZone: 'Africa/Kampala',
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  doc.text(`Time: ${time}`, 2, yPosition);
  yPosition += lineHeight + 2;

  // Separator
  doc.text('----------------------------------------', 2, yPosition);
  yPosition += lineHeight;

  // Transaction details header
  doc.setFont('helvetica', 'bold');
  doc.text('TRANSACTION DETAILS:', 2, yPosition);
  yPosition += lineHeight;

  doc.setFont('helvetica', 'normal');
  doc.text(`Amount Deposited: ${transaction_details.amount_deposited.toLocaleString()} UGX`, 2, yPosition);
  yPosition += lineHeight;

  doc.text(`Amount Withdrawn: ${transaction_details.amount_withdrawn.toLocaleString()} UGX`, 2, yPosition);
  yPosition += lineHeight;

  doc.text(`Account Balance: ${transaction_details.account_balance.toLocaleString()} UGX`, 2, yPosition);
  yPosition += lineHeight;

  // Separator
  doc.text('----------------------------------------', 2, yPosition);
  yPosition += lineHeight + 2;

  // Generated timestamp
  const generatedTime = new Date(receiptData.generated_at).toLocaleString('en-UG', {
    timeZone: 'Africa/Kampala'
  });
  doc.text(`Generated: ${generatedTime}`, 2, yPosition);
  yPosition += lineHeight + 2;

  // Thank you message (centered)
  const thankYouText = 'Thank you for banking with us!';
  const thankYouWidth = doc.getTextWidth(thankYouText);
  doc.text(thankYouText, centerX - (thankYouWidth / 2), yPosition);
  yPosition += lineHeight;

  // Final separator
  doc.text('========================================', 2, yPosition);

  // Download the PDF
  const fileName = `receipt-${transaction_details.record_number}-${transaction_details.account_number}.pdf`;
  doc.save(fileName);
};
