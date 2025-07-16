
import React from 'react';
import { ReceiptEditorAuthProvider, useReceiptEditorAuth } from '@/context/ReceiptEditorAuthContext';
import { ReceiptEditorLogin } from '@/components/ReceiptEditorLogin';
import { LoanRepaymentReceiptEditor } from '@/components/LoanRepaymentReceiptEditor';

const PortalContent: React.FC = () => {
  const { isAuthenticated } = useReceiptEditorAuth();

  return isAuthenticated ? <LoanRepaymentReceiptEditor /> : <ReceiptEditorLogin />;
};

const LoanRepaymentReceiptPortal: React.FC = () => {
  return (
    <ReceiptEditorAuthProvider>
      <PortalContent />
    </ReceiptEditorAuthProvider>
  );
};

export default LoanRepaymentReceiptPortal;
