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
      account_status: "pending" | "active" | "suspended"
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
      account_status: ["pending", "active", "suspended"],
    },
  },
} as const
