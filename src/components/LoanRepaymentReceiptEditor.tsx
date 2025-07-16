import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, FileText, LogOut, User } from 'lucide-react';
import { useReceiptEditorAuth } from '@/context/ReceiptEditorAuthContext';
import { useToast } from '@/hooks/use-toast';
import LoanRepaymentReceipt from './LoanRepaymentReceipt';
import { useReactToPrint } from 'react-to-print';

export const LoanRepaymentReceiptEditor: React.FC = () => {
  const { adminName, signOut } = useReceiptEditorAuth();
  const { toast } = useToast();
  const receiptRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState({
    receiptNo: `LRR-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', { hour12: false }),
    paymentMethod: '',
    otherPaymentMethod: '',
    paymentRefNo: '',
    borrowerName: '',
    loanAccountNo: '',
    idNo: '',
    phone: '',
    email: '',
    amountPaid: 0,
    amountInWords: '',
    principal: 0,
    interest: 0,
    penalty: 0,
    otherCharges: 0,
    balanceAfterPayment: 0,
    nextDueDate: '',
    loanAmount: 0,
    disbursementDate: '',
    interestRate: 0,
    tenure: 0,
    repaymentFrequency: '',
    previousBalance: 0,
    receivedByStaff: adminName || '',
    staffSignatureDate: new Date().toISOString().split('T')[0],
    borrowerSignatureDate: '',
    notes: ''
  });

  const [showPreview, setShowPreview] = useState(false);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generateReceipt = () => {
    // Validate required fields
    const requiredFields = ['borrowerName', 'loanAccountNo', 'amountPaid', 'paymentMethod'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before generating the receipt.",
        variant: "destructive",
      });
      return;
    }

    setShowPreview(true);
    toast({
      title: "Receipt Generated",
      description: "Your loan repayment receipt has been generated successfully.",
    });
  };

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Loan_Repayment_Receipt_${formData.receiptNo}`,
  });

  const downloadReceipt = () => {
    handlePrint();
  };

  const handleSignOut = () => {
    signOut();
    toast({
      title: "Signed Out",
      description: "You have been successfully signed out.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/fd715cbb-c401-4f16-989c-400d699b5baf.png" 
                alt="Logo" 
                className="h-8 w-8 mr-3" 
              />
              <h1 className="text-xl font-bold text-garrison-green">
                Loan Repayment Receipt Editor
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-sm text-gray-600">
                <User className="h-4 w-4 mr-2" />
                <span className="font-medium">{adminName}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-garrison-green">Receipt Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receiptNo">Receipt No. *</Label>
                    <Input
                      id="receiptNo"
                      value={formData.receiptNo}
                      onChange={(e) => handleInputChange('receiptNo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="date">Date *</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="paymentRefNo">Payment Reference No.</Label>
                    <Input
                      id="paymentRefNo"
                      value={formData.paymentRefNo}
                      onChange={(e) => handleInputChange('paymentRefNo', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="paymentMethod">Payment Method *</Label>
                  <Select value={formData.paymentMethod} onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select payment method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Cash">Cash</SelectItem>
                      <SelectItem value="Bank">Bank</SelectItem>
                      <SelectItem value="Mobile Money">Mobile Money</SelectItem>
                      <SelectItem value="Cheque">Cheque</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.paymentMethod === 'Other' && (
                  <div>
                    <Label htmlFor="otherPaymentMethod">Specify Other Payment Method</Label>
                    <Input
                      id="otherPaymentMethod"
                      value={formData.otherPaymentMethod}
                      onChange={(e) => handleInputChange('otherPaymentMethod', e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-garrison-green">Borrower Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="borrowerName">Borrower Name *</Label>
                  <Input
                    id="borrowerName"
                    value={formData.borrowerName}
                    onChange={(e) => handleInputChange('borrowerName', e.target.value)}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanAccountNo">Loan Account No. *</Label>
                    <Input
                      id="loanAccountNo"
                      value={formData.loanAccountNo}
                      onChange={(e) => handleInputChange('loanAccountNo', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="idNo">ID Number</Label>
                    <Input
                      id="idNo"
                      value={formData.idNo}
                      onChange={(e) => handleInputChange('idNo', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-garrison-green">Payment Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="amountPaid">Amount Paid (UGX) *</Label>
                  <Input
                    id="amountPaid"
                    type="number"
                    value={formData.amountPaid || ''}
                    onChange={(e) => handleInputChange('amountPaid', parseFloat(e.target.value) || 0)}
                  />
                </div>

                <div>
                  <Label htmlFor="amountInWords">Amount in Words</Label>
                  <Input
                    id="amountInWords"
                    value={formData.amountInWords}
                    onChange={(e) => handleInputChange('amountInWords', e.target.value)}
                    placeholder="e.g., Five Hundred Thousand Uganda Shillings Only"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="principal">Principal (UGX)</Label>
                    <Input
                      id="principal"
                      type="number"
                      value={formData.principal || ''}
                      onChange={(e) => handleInputChange('principal', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="interest">Interest (UGX)</Label>
                    <Input
                      id="interest"
                      type="number"
                      value={formData.interest || ''}
                      onChange={(e) => handleInputChange('interest', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="penalty">Penalty (UGX)</Label>
                    <Input
                      id="penalty"
                      type="number"
                      value={formData.penalty || ''}
                      onChange={(e) => handleInputChange('penalty', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="otherCharges">Other Charges (UGX)</Label>
                    <Input
                      id="otherCharges"
                      type="number"
                      value={formData.otherCharges || ''}
                      onChange={(e) => handleInputChange('otherCharges', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="balanceAfterPayment">Balance After Payment (UGX)</Label>
                    <Input
                      id="balanceAfterPayment"
                      type="number"
                      value={formData.balanceAfterPayment || ''}
                      onChange={(e) => handleInputChange('balanceAfterPayment', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="nextDueDate">Next Due Date</Label>
                    <Input
                      id="nextDueDate"
                      type="date"
                      value={formData.nextDueDate}
                      onChange={(e) => handleInputChange('nextDueDate', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-garrison-green">Loan Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="loanAmount">Loan Amount (UGX)</Label>
                    <Input
                      id="loanAmount"
                      type="number"
                      value={formData.loanAmount || ''}
                      onChange={(e) => handleInputChange('loanAmount', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="disbursementDate">Disbursement Date</Label>
                    <Input
                      id="disbursementDate"
                      type="date"
                      value={formData.disbursementDate}
                      onChange={(e) => handleInputChange('disbursementDate', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (% p.a.)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      value={formData.interestRate || ''}
                      onChange={(e) => handleInputChange('interestRate', parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="tenure">Tenure (Days)</Label>
                    <Input
                      id="tenure"
                      type="number"
                      value={formData.tenure || ''}
                      onChange={(e) => handleInputChange('tenure', parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="repaymentFrequency">Repayment Frequency</Label>
                    <Select value={formData.repaymentFrequency} onValueChange={(value) => handleInputChange('repaymentFrequency', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="previousBalance">Previous Balance (UGX)</Label>
                  <Input
                    id="previousBalance"
                    type="number"
                    value={formData.previousBalance || ''}
                    onChange={(e) => handleInputChange('previousBalance', parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-garrison-green">Authorization & Notes</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="receivedByStaff">Received By (Staff)</Label>
                    <Input
                      id="receivedByStaff"
                      value={formData.receivedByStaff}
                      onChange={(e) => handleInputChange('receivedByStaff', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="staffSignatureDate">Staff Signature Date</Label>
                    <Input
                      id="staffSignatureDate"
                      type="date"
                      value={formData.staffSignatureDate}
                      onChange={(e) => handleInputChange('staffSignatureDate', e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="borrowerSignatureDate">Borrower Signature Date</Label>
                  <Input
                    id="borrowerSignatureDate"
                    type="date"
                    value={formData.borrowerSignatureDate}
                    onChange={(e) => handleInputChange('borrowerSignatureDate', e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Additional Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Any additional notes or comments..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                onClick={generateReceipt}
                className="flex-1 bg-garrison-green hover:bg-garrison-green/90"
              >
                <FileText className="h-4 w-4 mr-2" />
                Generate Receipt
              </Button>
              
              {showPreview && (
                <Button
                  onClick={downloadReceipt}
                  variant="outline"
                  className="flex-1"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Receipt
                </Button>
              )}
            </div>
          </div>

          {/* Preview Section */}
          <div className="lg:sticky lg:top-6">
            {showPreview ? (
              <Card>
                <CardHeader>
                  <CardTitle className="text-garrison-green">Receipt Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-auto max-h-screen">
                    <LoanRepaymentReceipt ref={receiptRef} data={formData} />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Receipt preview will appear here</p>
                  <p className="text-sm">Fill the form and click "Generate Receipt"</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
