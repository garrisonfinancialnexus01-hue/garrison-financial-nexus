
import { supabase } from '@/integrations/supabase/client';

export type MobileMoneyProvider = 'airtel' | 'mtn';
export type TransactionType = 'deposit' | 'withdraw';

export interface MobileMoneyTransaction {
  id: string;
  client_id: string;
  amount: number;
  transaction_type: TransactionType;
  provider: MobileMoneyProvider;
  client_phone: string;
  company_phone: string;
  status: 'pending' | 'completed' | 'failed';
  transaction_reference?: string;
  external_transaction_id?: string;
  failure_reason?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

class MobileMoneyService {
  private readonly COMPANY_PHONE = '+256761281222';

  async initiateDeposit(
    clientId: string,
    amount: number,
    clientPhone: string,
    provider: MobileMoneyProvider
  ): Promise<{ success: boolean; transaction?: MobileMoneyTransaction; error?: string }> {
    try {
      // Create transaction record
      const { data: transaction, error } = await supabase
        .from('mobile_money_transactions')
        .insert({
          client_id: clientId,
          amount,
          transaction_type: 'deposit',
          provider,
          client_phone: clientPhone,
          company_phone: this.COMPANY_PHONE,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating deposit transaction:', error);
        return { success: false, error: 'Failed to create transaction record' };
      }

      // Simulate API call to mobile money provider
      const apiResult = await this.callProviderAPI(provider, 'deposit', {
        amount,
        clientPhone,
        transactionId: transaction.id
      });

      if (apiResult.success) {
        // Update transaction with external reference
        await supabase
          .from('mobile_money_transactions')
          .update({
            external_transaction_id: apiResult.externalId,
            transaction_reference: apiResult.reference,
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.id);

        return { success: true, transaction };
      } else {
        // Mark transaction as failed
        await supabase
          .from('mobile_money_transactions')
          .update({
            status: 'failed',
            failure_reason: apiResult.error,
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.id);

        return { success: false, error: apiResult.error };
      }
    } catch (error) {
      console.error('Error initiating deposit:', error);
      return { success: false, error: 'Failed to initiate deposit' };
    }
  }

  async initiateWithdrawal(
    clientId: string,
    amount: number,
    clientPhone: string,
    provider: MobileMoneyProvider
  ): Promise<{ success: boolean; transaction?: MobileMoneyTransaction; error?: string }> {
    try {
      // Check if client has sufficient balance
      const { data: clientAccount, error: balanceError } = await supabase
        .from('client_accounts')
        .select('account_balance')
        .eq('id', clientId)
        .single();

      if (balanceError || !clientAccount) {
        return { success: false, error: 'Unable to verify account balance' };
      }

      if (clientAccount.account_balance < amount) {
        return { success: false, error: 'Insufficient account balance' };
      }

      // Create transaction record
      const { data: transaction, error } = await supabase
        .from('mobile_money_transactions')
        .insert({
          client_id: clientId,
          amount,
          transaction_type: 'withdraw',
          provider,
          client_phone: clientPhone,
          company_phone: this.COMPANY_PHONE,
          status: 'pending'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating withdrawal transaction:', error);
        return { success: false, error: 'Failed to create transaction record' };
      }

      // Simulate API call to mobile money provider
      const apiResult = await this.callProviderAPI(provider, 'withdraw', {
        amount,
        clientPhone,
        transactionId: transaction.id
      });

      if (apiResult.success) {
        // Update transaction with external reference
        await supabase
          .from('mobile_money_transactions')
          .update({
            external_transaction_id: apiResult.externalId,
            transaction_reference: apiResult.reference,
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.id);

        return { success: true, transaction };
      } else {
        // Mark transaction as failed
        await supabase
          .from('mobile_money_transactions')
          .update({
            status: 'failed',
            failure_reason: apiResult.error,
            updated_at: new Date().toISOString()
          })
          .eq('id', transaction.id);

        return { success: false, error: apiResult.error };
      }
    } catch (error) {
      console.error('Error initiating withdrawal:', error);
      return { success: false, error: 'Failed to initiate withdrawal' };
    }
  }

  async checkTransactionStatus(transactionId: string): Promise<{
    success: boolean;
    status?: 'pending' | 'completed' | 'failed';
    error?: string;
  }> {
    try {
      const { data: transaction, error } = await supabase
        .from('mobile_money_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error || !transaction) {
        return { success: false, error: 'Transaction not found' };
      }

      // If already completed or failed, return current status
      if (transaction.status !== 'pending') {
        return { success: true, status: transaction.status };
      }

      // Check with provider API for status update
      const statusResult = await this.checkProviderStatus(
        transaction.provider,
        transaction.external_transaction_id
      );

      if (statusResult.status === 'completed') {
        await this.completeTransaction(transactionId);
      } else if (statusResult.status === 'failed') {
        await supabase
          .from('mobile_money_transactions')
          .update({
            status: 'failed',
            failure_reason: statusResult.error || 'Transaction failed',
            updated_at: new Date().toISOString()
          })
          .eq('id', transactionId);
      }

      return { success: true, status: statusResult.status };
    } catch (error) {
      console.error('Error checking transaction status:', error);
      return { success: false, error: 'Failed to check transaction status' };
    }
  }

  async completeTransaction(transactionId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: transaction, error } = await supabase
        .from('mobile_money_transactions')
        .select('*')
        .eq('id', transactionId)
        .single();

      if (error || !transaction) {
        return { success: false, error: 'Transaction not found' };
      }

      if (transaction.status === 'completed') {
        return { success: true }; // Already completed
      }

      // Update transaction status
      await supabase
        .from('mobile_money_transactions')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', transactionId);

      // Update client account balance and create transaction record
      const { data: clientAccount, error: accountError } = await supabase
        .from('client_accounts')
        .select('account_balance, account_number')
        .eq('id', transaction.client_id)
        .single();

      if (accountError || !clientAccount) {
        return { success: false, error: 'Unable to update account balance' };
      }

      const newBalance = transaction.transaction_type === 'deposit'
        ? clientAccount.account_balance + transaction.amount
        : clientAccount.account_balance - transaction.amount;

      // Update account balance
      await supabase
        .from('client_accounts')
        .update({
          account_balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', transaction.client_id);

      // Create transaction record
      const now = new Date();
      await supabase
        .from('transaction_records')
        .insert({
          account_number: clientAccount.account_number,
          amount_deposited: transaction.transaction_type === 'deposit' ? transaction.amount : null,
          amount_withdrawn: transaction.transaction_type === 'withdraw' ? transaction.amount : null,
          account_balance: newBalance,
          transaction_date: now.toISOString().split('T')[0],
          transaction_time: now.toISOString()
        });

      return { success: true };
    } catch (error) {
      console.error('Error completing transaction:', error);
      return { success: false, error: 'Failed to complete transaction' };
    }
  }

  async getTransactionHistory(clientId: string): Promise<{
    success: boolean;
    transactions?: MobileMoneyTransaction[];
    error?: string;
  }> {
    try {
      const { data: transactions, error } = await supabase
        .from('mobile_money_transactions')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching transaction history:', error);
        return { success: false, error: 'Failed to fetch transaction history' };
      }

      return { success: true, transactions: transactions || [] };
    } catch (error) {
      console.error('Error getting transaction history:', error);
      return { success: false, error: 'Failed to get transaction history' };
    }
  }

  private async callProviderAPI(
    provider: MobileMoneyProvider,
    type: TransactionType,
    data: { amount: number; clientPhone: string; transactionId: string }
  ): Promise<{ success: boolean; externalId?: string; reference?: string; error?: string }> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate success/failure (90% success rate)
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return {
        success: true,
        externalId: `${provider.toUpperCase()}_${Date.now()}`,
        reference: `REF_${Math.random().toString(36).substr(2, 9).toUpperCase()}`
      };
    } else {
      return {
        success: false,
        error: 'Provider API error: Transaction rejected'
      };
    }
  }

  private async checkProviderStatus(
    provider: MobileMoneyProvider,
    externalId?: string
  ): Promise<{ status: 'pending' | 'completed' | 'failed'; error?: string }> {
    if (!externalId) {
      return { status: 'failed', error: 'No external ID' };
    }

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Simulate status check (80% completion rate for pending transactions)
    const random = Math.random();
    if (random > 0.8) {
      return { status: 'completed' };
    } else if (random < 0.1) {
      return { status: 'failed', error: 'Transaction timed out' };
    } else {
      return { status: 'pending' };
    }
  }
}

export const mobileMoneyService = new MobileMoneyService();
