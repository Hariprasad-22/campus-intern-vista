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
      email_notifications: {
        Row: {
          application_id: string
          company_name: string
          created_at: string
          email: string
          id: string
          is_sent: boolean | null
          sent_at: string | null
          student_name: string
        }
        Insert: {
          application_id: string
          company_name: string
          created_at?: string
          email: string
          id?: string
          is_sent?: boolean | null
          sent_at?: string | null
          student_name: string
        }
        Update: {
          application_id?: string
          company_name?: string
          created_at?: string
          email?: string
          id?: string
          is_sent?: boolean | null
          sent_at?: string | null
          student_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_notifications_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "internship_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      internship_applications: {
        Row: {
          academic_year: string
          branch: string
          company_name: string
          course: string
          created_at: string
          duration: string
          email: string
          end_date: string | null
          full_name: string
          hr_email: string
          hr_mobile: string
          hr_name: string
          id: string
          internship_year: string
          mobile_number: string
          noc_by_hod_path: string | null
          offer_letter_path: string | null
          role_offered: string
          roll_number: string
          semester: string
          start_date: string | null
          status: string
          stipend: string
          student_id: string
          student_letter_to_hod_path: string | null
          year: string
        }
        Insert: {
          academic_year: string
          branch: string
          company_name: string
          course: string
          created_at?: string
          duration: string
          email: string
          end_date?: string | null
          full_name: string
          hr_email: string
          hr_mobile: string
          hr_name: string
          id?: string
          internship_year: string
          mobile_number: string
          noc_by_hod_path?: string | null
          offer_letter_path?: string | null
          role_offered: string
          roll_number: string
          semester: string
          start_date?: string | null
          status?: string
          stipend: string
          student_id: string
          student_letter_to_hod_path?: string | null
          year: string
        }
        Update: {
          academic_year?: string
          branch?: string
          company_name?: string
          course?: string
          created_at?: string
          duration?: string
          email?: string
          end_date?: string | null
          full_name?: string
          hr_email?: string
          hr_mobile?: string
          hr_name?: string
          id?: string
          internship_year?: string
          mobile_number?: string
          noc_by_hod_path?: string | null
          offer_letter_path?: string | null
          role_offered?: string
          roll_number?: string
          semester?: string
          start_date?: string | null
          status?: string
          stipend?: string
          student_id?: string
          student_letter_to_hod_path?: string | null
          year?: string
        }
        Relationships: []
      }
      internship_feedback: {
        Row: {
          academic_year: string
          application_id: string
          company_name: string
          created_at: string
          experience: string
          feedback: string
          id: string
          mobile_number: string
          rating: number | null
          role: string
          roll_number: string
          skills: string
          student_name: string
          suggestions: string | null
        }
        Insert: {
          academic_year: string
          application_id: string
          company_name: string
          created_at?: string
          experience: string
          feedback: string
          id?: string
          mobile_number: string
          rating?: number | null
          role: string
          roll_number: string
          skills: string
          student_name: string
          suggestions?: string | null
        }
        Update: {
          academic_year?: string
          application_id?: string
          company_name?: string
          created_at?: string
          experience?: string
          feedback?: string
          id?: string
          mobile_number?: string
          rating?: number | null
          role?: string
          roll_number?: string
          skills?: string
          student_name?: string
          suggestions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "internship_feedback_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "internship_applications"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
