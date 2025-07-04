
import { supabase } from '@/integrations/supabase/client';

export const generateNextAccountNumber = async (): Promise<string> => {
  try {
    // Get the highest account number
    const { data: latestAccount } = await supabase
      .from('client_accounts')
      .select('account_number')
      .order('account_number', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (latestAccount && latestAccount.account_number) {
      const latestNumber = parseInt(latestAccount.account_number);
      if (!isNaN(latestNumber)) {
        return (latestNumber + 1).toString();
      }
    }
    
    // Start from 10000001 if no valid accounts exist
    return '10000001';
  } catch (error) {
    console.error('Error generating account number:', error);
    // Fallback to a base number if there's an error
    return '10000001';
  }
};

export const validateAccountNumber = (accountNumber: string): boolean => {
  // Account numbers should be 8 digits starting from 10000001
  const num = parseInt(accountNumber);
  return !isNaN(num) && num >= 10000001 && num <= 99999999;
};
