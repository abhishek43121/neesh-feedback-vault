export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      pilot_feedback: {
        Row: {
          ai_score: number
          brutal_feedback: string
          clarity_score: number
          confusing_part: string
          discovery_answer: string
          discovery_detail: string
          frustrating_part: string
          id: string
          improvement: string
          missing_feature: string
          onboarding_score: number
          overall_score: number
          pitch_score: number
          pitch_url: string
          profile_id: string
          project_stage: string
          project_url: string
          recommendation: string
          reuse_intent: string
          spotlight_score: number
          spotlight_url: string
          submitted_at: string
          usability_score: number
          valuable_part: string
          website_url: string
          what_tested: string[]
        }
        Insert: {
          ai_score: number
          brutal_feedback?: string
          clarity_score: number
          confusing_part?: string
          discovery_answer: string
          discovery_detail?: string
          frustrating_part?: string
          id?: string
          improvement?: string
          missing_feature?: string
          onboarding_score: number
          overall_score: number
          pitch_score: number
          pitch_url?: string
          profile_id: string
          project_stage?: string
          project_url?: string
          recommendation?: string
          reuse_intent?: string
          spotlight_score: number
          spotlight_url?: string
          submitted_at?: string
          usability_score: number
          valuable_part: string
          website_url?: string
          what_tested?: string[]
        }
        Update: {
          ai_score?: number
          brutal_feedback?: string
          clarity_score?: number
          confusing_part?: string
          discovery_answer?: string
          discovery_detail?: string
          frustrating_part?: string
          id?: string
          improvement?: string
          missing_feature?: string
          onboarding_score?: number
          overall_score?: number
          pitch_score?: number
          pitch_url?: string
          profile_id?: string
          project_stage?: string
          project_url?: string
          recommendation?: string
          reuse_intent?: string
          spotlight_score?: number
          spotlight_url?: string
          submitted_at?: string
          usability_score?: number
          valuable_part?: string
          website_url?: string
          what_tested?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "pilot_feedback_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "pilot_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pilot_profiles: {
        Row: {
          company: string
          created_at: string
          email: string
          expectations: string
          experience: string
          full_name: string
          id: string
          linkedin_url: string
          location: string
          pilot_role: string
          profession: string
          startup_name: string
          updated_at: string
          whatsapp: string
          why_joined: string
        }
        Insert: {
          company?: string
          created_at?: string
          email: string
          expectations?: string
          experience?: string
          full_name: string
          id?: string
          linkedin_url?: string
          location?: string
          pilot_role?: string
          profession?: string
          startup_name?: string
          updated_at?: string
          whatsapp?: string
          why_joined?: string
        }
        Update: {
          company?: string
          created_at?: string
          email?: string
          expectations?: string
          experience?: string
          full_name?: string
          id?: string
          linkedin_url?: string
          location?: string
          pilot_role?: string
          profession?: string
          startup_name?: string
          updated_at?: string
          whatsapp?: string
          why_joined?: string
        }
        Relationships: []
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
