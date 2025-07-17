export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      advisory_operations: {
        Row: {
          advisor_name: string
          client_email: string | null
          client_name: string
          client_nin: string | null
          client_phone: string
          consultation_fee: number
          created_at: string
          follow_up_date: string | null
          id: string
          notes: string | null
          priority_level: string
          recommendations: string | null
          service_type: string
          session_date: string
          session_duration: string | null
          status: string
          topics_discussed: string | null
          updated_at: string
        }
        Insert: {
          advisor_name: string
          client_email?: string | null
          client_name: string
          client_nin?: string | null
          client_phone: string
          consultation_fee?: number
          created_at?: string
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          priority_level?: string
          recommendations?: string | null
          service_type: string
          session_date: string
          session_duration?: string | null
          status?: string
          topics_discussed?: string | null
          updated_at?: string
        }
        Update: {
          advisor_name?: string
          client_email?: string | null
          client_name?: string
          client_nin?: string | null
          client_phone?: string
          consultation_fee?: number
          created_at?: string
          follow_up_date?: string | null
          id?: string
          notes?: string | null
          priority_level?: string
          recommendations?: string | null
          service_type?: string
          session_date?: string
          session_duration?: string | null
          status?: string
          topics_discussed?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      central_dashboard_overview: {
        Row: {
          id: string
          last_updated: string
          metric_description: string | null
          metric_name: string
          metric_value: number
          updated_by: string
        }
        Insert: {
          id?: string
          last_updated?: string
          metric_description?: string | null
          metric_name: string
          metric_value?: number
          updated_by: string
        }
        Update: {
          id?: string
          last_updated?: string
          metric_description?: string | null
          metric_name?: string
          metric_value?: number
          updated_by?: string
        }
        Relationships: []
      }
      central_dashboard_sessions: {
        Row: {
          admin_name: string
          created_at: string
          expires_at: string
          id: string
          is_active: boolean
          session_token: string
        }
        Insert: {
          admin_name: string
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          session_token: string
        }
        Update: {
          admin_name?: string
          created_at?: string
          expires_at?: string
          id?: string
          is_active?: boolean
          session_token?: string
        }
        Relationships: []
      }
      client_accounts: {
        Row: {
          account_balance: number
          account_number: string
          created_at: string
          email: string
          id: string
          name: string
          nin: string
          password_hash: string
          phone: string
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
        }
        Insert: {
          account_balance?: number
          account_number: string
          created_at?: string
          email: string
          id?: string
          name: string
          nin: string
          password_hash: string
          phone: string
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Update: {
          account_balance?: number
          account_number?: string
          created_at?: string
          email?: string
          id?: string
          name?: string
          nin?: string
          password_hash?: string
          phone?: string
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
        }
        Relationships: []
      }
      communication_log: {
        Row: {
          client_name: string
          client_phone: string
          client_response: string | null
          communication_type: string
          created_at: string
          delivery_status: string | null
          follow_up_date: string | null
          follow_up_required: boolean | null
          id: string
          message_content: string
          notes: string | null
          purpose: string | null
          response_received: boolean | null
          sent_by: string
          sent_date: string
          sent_time: string
          updated_at: string
        }
        Insert: {
          client_name: string
          client_phone: string
          client_response?: string | null
          communication_type: string
          created_at?: string
          delivery_status?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          message_content: string
          notes?: string | null
          purpose?: string | null
          response_received?: boolean | null
          sent_by: string
          sent_date?: string
          sent_time?: string
          updated_at?: string
        }
        Update: {
          client_name?: string
          client_phone?: string
          client_response?: string | null
          communication_type?: string
          created_at?: string
          delivery_status?: string | null
          follow_up_date?: string | null
          follow_up_required?: boolean | null
          id?: string
          message_content?: string
          notes?: string | null
          purpose?: string | null
          response_received?: boolean | null
          sent_by?: string
          sent_date?: string
          sent_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_transaction_records: {
        Row: {
          account_balance: number
          account_number: string
          amount_deposited: number | null
          amount_withdrawn: number | null
          created_at: string
          id: string
          receipt_data: Json | null
          record_number: number
          transaction_date: string
          transaction_time: string
          updated_at: string
        }
        Insert: {
          account_balance: number
          account_number: string
          amount_deposited?: number | null
          amount_withdrawn?: number | null
          created_at?: string
          id?: string
          receipt_data?: Json | null
          record_number: number
          transaction_date: string
          transaction_time?: string
          updated_at?: string
        }
        Update: {
          account_balance?: number
          account_number?: string
          amount_deposited?: number | null
          amount_withdrawn?: number | null
          created_at?: string
          id?: string
          receipt_data?: Json | null
          record_number?: number
          transaction_date?: string
          transaction_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      lending_operations: {
        Row: {
          client_email: string | null
          client_name: string
          client_nin: string | null
          client_phone: string
          collateral_type: string | null
          collateral_value: number | null
          created_at: string
          disbursement_date: string | null
          due_date: string | null
          guarantor_name: string | null
          guarantor_phone: string | null
          id: string
          interest_rate: number
          loan_amount: number
          loan_term: string
          notes: string | null
          status: string
          total_repayment: number
          updated_at: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          client_nin?: string | null
          client_phone: string
          collateral_type?: string | null
          collateral_value?: number | null
          created_at?: string
          disbursement_date?: string | null
          due_date?: string | null
          guarantor_name?: string | null
          guarantor_phone?: string | null
          id?: string
          interest_rate: number
          loan_amount: number
          loan_term: string
          notes?: string | null
          status?: string
          total_repayment: number
          updated_at?: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          client_nin?: string | null
          client_phone?: string
          collateral_type?: string | null
          collateral_value?: number | null
          created_at?: string
          disbursement_date?: string | null
          due_date?: string | null
          guarantor_name?: string | null
          guarantor_phone?: string | null
          id?: string
          interest_rate?: number
          loan_amount?: number
          loan_term?: string
          notes?: string | null
          status?: string
          total_repayment?: number
          updated_at?: string
        }
        Relationships: []
      }
      loan_applications: {
        Row: {
          amount: number
          created_at: string
          email: string
          id: string
          interest: number
          name: string
          nin: string
          phone: string
          receipt_number: string
          term: string
          total_amount: number
        }
        Insert: {
          amount: number
          created_at?: string
          email: string
          id?: string
          interest: number
          name: string
          nin: string
          phone: string
          receipt_number: string
          term: string
          total_amount: number
        }
        Update: {
          amount?: number
          created_at?: string
          email?: string
          id?: string
          interest?: number
          name?: string
          nin?: string
          phone?: string
          receipt_number?: string
          term?: string
          total_amount?: number
        }
        Relationships: []
      }
      mobile_money_transactions: {
        Row: {
          amount: number
          client_id: string
          client_phone: string
          company_phone: string
          completed_at: string | null
          created_at: string
          external_transaction_id: string | null
          failure_reason: string | null
          id: string
          provider: string
          status: string
          transaction_reference: string | null
          transaction_type: string
          updated_at: string
        }
        Insert: {
          amount: number
          client_id: string
          client_phone: string
          company_phone?: string
          completed_at?: string | null
          created_at?: string
          external_transaction_id?: string | null
          failure_reason?: string | null
          id?: string
          provider: string
          status?: string
          transaction_reference?: string | null
          transaction_type: string
          updated_at?: string
        }
        Update: {
          amount?: number
          client_id?: string
          client_phone?: string
          company_phone?: string
          completed_at?: string | null
          created_at?: string
          external_transaction_id?: string | null
          failure_reason?: string | null
          id?: string
          provider?: string
          status?: string
          transaction_reference?: string | null
          transaction_type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "mobile_money_transactions_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "client_accounts"
            referencedColumns: ["id"]
          },
        ]
      }
      saving_operations: {
        Row: {
          account_type: string
          client_email: string | null
          client_name: string
          client_nin: string | null
          client_phone: string
          created_at: string
          current_balance: number
          id: string
          initial_deposit: number
          interest_rate: number
          maturity_date: string | null
          notes: string | null
          status: string
          target_amount: number | null
          target_date: string | null
          updated_at: string
          withdrawal_frequency: string | null
        }
        Insert: {
          account_type: string
          client_email?: string | null
          client_name: string
          client_nin?: string | null
          client_phone: string
          created_at?: string
          current_balance?: number
          id?: string
          initial_deposit?: number
          interest_rate?: number
          maturity_date?: string | null
          notes?: string | null
          status?: string
          target_amount?: number | null
          target_date?: string | null
          updated_at?: string
          withdrawal_frequency?: string | null
        }
        Update: {
          account_type?: string
          client_email?: string | null
          client_name?: string
          client_nin?: string | null
          client_phone?: string
          created_at?: string
          current_balance?: number
          id?: string
          initial_deposit?: number
          interest_rate?: number
          maturity_date?: string | null
          notes?: string | null
          status?: string
          target_amount?: number | null
          target_date?: string | null
          updated_at?: string
          withdrawal_frequency?: string | null
        }
        Relationships: []
      }
      staff_performance: {
        Row: {
          advisory_sessions: number | null
          client_satisfaction: number | null
          created_at: string
          department: string
          employee_id: string
          id: string
          loans_processed: number | null
          notes: string | null
          performance_period: string
          performance_rating: string | null
          position: string
          recorded_by: string
          revenue_generated: number | null
          savings_opened: number | null
          staff_name: string
          targets_met: number | null
          total_targets: number | null
          updated_at: string
        }
        Insert: {
          advisory_sessions?: number | null
          client_satisfaction?: number | null
          created_at?: string
          department: string
          employee_id: string
          id?: string
          loans_processed?: number | null
          notes?: string | null
          performance_period: string
          performance_rating?: string | null
          position: string
          recorded_by: string
          revenue_generated?: number | null
          savings_opened?: number | null
          staff_name: string
          targets_met?: number | null
          total_targets?: number | null
          updated_at?: string
        }
        Update: {
          advisory_sessions?: number | null
          client_satisfaction?: number | null
          created_at?: string
          department?: string
          employee_id?: string
          id?: string
          loans_processed?: number | null
          notes?: string | null
          performance_period?: string
          performance_rating?: string | null
          position?: string
          recorded_by?: string
          revenue_generated?: number | null
          savings_opened?: number | null
          staff_name?: string
          targets_met?: number | null
          total_targets?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      transaction_records: {
        Row: {
          account_balance: number
          account_number: string
          amount_deposited: number | null
          amount_withdrawn: number | null
          created_at: string
          id: string
          receipt_number: string
          transaction_date: string
          transaction_time: string
        }
        Insert: {
          account_balance: number
          account_number: string
          amount_deposited?: number | null
          amount_withdrawn?: number | null
          created_at?: string
          id?: string
          receipt_number?: string
          transaction_date: string
          transaction_time: string
        }
        Update: {
          account_balance?: number
          account_number?: string
          amount_deposited?: number | null
          amount_withdrawn?: number | null
          created_at?: string
          id?: string
          receipt_number?: string
          transaction_date?: string
          transaction_time?: string
        }
        Relationships: []
      }
      wealth_management_operations: {
        Row: {
          client_email: string | null
          client_name: string
          client_nin: string | null
          client_phone: string
          created_at: string
          id: string
          investment_goals: string | null
          last_review_date: string | null
          management_fee: number
          next_review_date: string | null
          notes: string | null
          performance_target: number | null
          portfolio_manager: string
          portfolio_type: string
          review_frequency: string
          risk_tolerance: string
          status: string
          total_assets: number
          updated_at: string
        }
        Insert: {
          client_email?: string | null
          client_name: string
          client_nin?: string | null
          client_phone: string
          created_at?: string
          id?: string
          investment_goals?: string | null
          last_review_date?: string | null
          management_fee?: number
          next_review_date?: string | null
          notes?: string | null
          performance_target?: number | null
          portfolio_manager: string
          portfolio_type: string
          review_frequency?: string
          risk_tolerance?: string
          status?: string
          total_assets?: number
          updated_at?: string
        }
        Update: {
          client_email?: string | null
          client_name?: string
          client_nin?: string | null
          client_phone?: string
          created_at?: string
          id?: string
          investment_goals?: string | null
          last_review_date?: string | null
          management_fee?: number
          next_review_date?: string | null
          notes?: string | null
          performance_target?: number | null
          portfolio_manager?: string
          portfolio_type?: string
          review_frequency?: string
          risk_tolerance?: string
          status?: string
          total_assets?: number
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_receipt_number: {
        Args: Record<PropertyKey, never>
        Returns: string
      }
      validate_nin: {
        Args: { nin_input: string }
        Returns: boolean
      }
      validate_password: {
        Args: { password_input: string }
        Returns: boolean
      }
      validate_ugandan_phone: {
        Args: { phone_input: string }
        Returns: boolean
      }
    }
    Enums: {
      account_status: "pending" | "active" | "suspended" | "inactive"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["pending", "active", "suspended", "inactive"],
    },
  },
} as const
