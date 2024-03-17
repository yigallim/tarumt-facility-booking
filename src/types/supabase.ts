export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          _id: string
          created_at: string
          name: string
          password: string
          session_token: string | null
          student_id: string
          user_id: string
        }
        Insert: {
          _id?: string
          created_at?: string
          name: string
          password: string
          session_token?: string | null
          student_id: string
          user_id?: string
        }
        Update: {
          _id?: string
          created_at?: string
          name?: string
          password?: string
          session_token?: string | null
          student_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      bookings: {
        Row: {
          _id: string
          account_id: string
          book_date: string
          created_at: string
          end_time: number
          facility_id: string
          response_msg: string | null
          start_time: number
          status: string
          user_id: string
        }
        Insert: {
          _id?: string
          account_id: string
          book_date: string
          created_at?: string
          end_time: number
          facility_id: string
          response_msg?: string | null
          start_time: number
          status?: string
          user_id?: string
        }
        Update: {
          _id?: string
          account_id?: string
          book_date?: string
          created_at?: string
          end_time?: number
          facility_id?: string
          response_msg?: string | null
          start_time?: number
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_bookings_account_id_fkey"
            columns: ["account_id"]
            isOneToOne: false
            referencedRelation: "accounts"
            referencedColumns: ["_id"]
          },
          {
            foreignKeyName: "public_bookings_facility_id_fkey"
            columns: ["facility_id"]
            isOneToOne: false
            referencedRelation: "facilities"
            referencedColumns: ["_id"]
          },
          {
            foreignKeyName: "public_bookings_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      error_logs: {
        Row: {
          created_at: string
          id: string
          message: string
          stage: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          stage: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          stage?: string
        }
        Relationships: []
      }
      facilities: {
        Row: {
          _id: string
          created_at: string
          name: string
          payload_id: string
        }
        Insert: {
          _id?: string
          created_at?: string
          name: string
          payload_id: string
        }
        Update: {
          _id?: string
          created_at?: string
          name?: string
          payload_id?: string
        }
        Relationships: []
      }
      success_logs: {
        Row: {
          created_at: string
          id: string
          message: string
          stage: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          stage: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          stage?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      update_session_tokens: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
