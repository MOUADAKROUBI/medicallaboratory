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
      administration: {
        Row: {
          id: string
          utilisateur_id: string
        }
        Insert: {
          id?: string
          utilisateur_id: string
        }
        Update: {
          id?: string
          utilisateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "administration_utilisateur_id_fkey1"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      contacts: {
        Row: {
          id: string
          message: string | null
          nom: string | null
          tele: number | null
        }
        Insert: {
          id?: string
          message?: string | null
          nom?: string | null
          tele?: number | null
        }
        Update: {
          id?: string
          message?: string | null
          nom?: string | null
          tele?: number | null
        }
        Relationships: []
      }
      feedbacks: {
        Row: {
          date_feedback: string | null
          id: string
          message: string | null
          nome: string | null
        }
        Insert: {
          date_feedback?: string | null
          id?: string
          message?: string | null
          nome?: string | null
        }
        Update: {
          date_feedback?: string | null
          id?: string
          message?: string | null
          nome?: string | null
        }
        Relationships: []
      }
      parametres_du_site: {
        Row: {
          default_currency: string | null
          id: string
          lang: string | null
          notifications: boolean | null
          theme: string | null
          timezone: string | null
          utilisateur_id: string | null
        }
        Insert: {
          utilisateur_id?: string | null
        }
        Update: {
          default_currency?: string | null
          lang?: string | null
          notifications?: boolean | null
          theme?: string | null
          timezone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "parametres_du_site_utilisateur_id_fkey1"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      patient: {
        Row: {
          address: string | null
          adomicile: boolean
          code: string
          id: string
          utilisateur_id: string
        }
        Insert: {
          address?: string | null
          adomicile?: boolean
          code: string
          id?: string
          utilisateur_id: string
        }
        Update: {
          address?: string | null
          adomicile?: boolean
          code?: string
          id?: string
          utilisateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "patient_utilisateur_id_fkey1"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      profile: {
        Row: {
          email: string | null
          id: string
          nom: string | null
          telephone: string | null
          email_verified: boolean
        }
        Insert: {
          email?: string | null
          nom?: string | null
          telephone?: string | null
        }
        Update: {
          email?: string | null
          nom?: string | null
          telephone?: string | null
        }
        Relationships: []
      }
      reception: {
        Row: {
          id: string
          utilisateur_id: string
        }
        Insert: {
          id?: string
          utilisateur_id: string
        }
        Update: {
          id?: string
          utilisateur_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reception_utilisateur_id_fkey1"
            columns: ["utilisateur_id"]
            isOneToOne: false
            referencedRelation: "profile"
            referencedColumns: ["id"]
          },
        ]
      }
      rendez_vous: {
        Row: {
          date_rendez_vous: string
          id: string
          patient_id: string | null
          service_id: string | null
          status: Database["public"]["Enums"]["status_enum"] | null
        }
        Insert: {
          date_rendez_vous: string
          id?: string
          patient_id?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["status_enum"] | null
        }
        Update: {
          date_rendez_vous?: string
          id?: string
          patient_id?: string | null
          service_id?: string | null
          status?: Database["public"]["Enums"]["status_enum"] | null
        }
        Relationships: [
          {
            foreignKeyName: "rendez_vous_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rendez_vous_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      resultats_analyse: {
        Row: {
          id: string
          patient_id: string | null
          resultat_test: string | null
          service_id: string | null
          telecharger_date: string | null
        }
        Insert: {
          id?: string
          patient_id?: string | null
          resultat_test?: string | null
          service_id?: string | null
          telecharger_date?: string | null
        }
        Update: {
          id?: string
          patient_id?: string | null
          resultat_test?: string | null
          service_id?: string | null
          telecharger_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "resultats_analyse_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "resultats_analyse_type_test_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      services: {
        Row: {
          description: string | null
          id: string
          image: string | null
          nom_service: string
          prix: number
        }
        Insert: {
          description?: string | null
          id?: string
          image?: string | null
          nom_service: string
          prix: number
        }
        Update: {
          description?: string | null
          id?: string
          image?: string | null
          nom_service?: string
          prix?: number
        }
        Relationships: []
      }
      stock: {
        Row: {
          id: string
          nom_article: string | null
          quantity: number | null
          seuil_reapprovisionnement: number | null
        }
        Insert: {
          id?: string
          nom_article?: string | null
          quantity?: number | null
          seuil_reapprovisionnement?: number | null
        }
        Update: {
          id?: string
          nom_article?: string | null
          quantity?: number | null
          seuil_reapprovisionnement?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      monthly_appointments: {
        Row: {
          countapp: number | null
          month: string | null
          month_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_low_stock_items: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          nom_article: string | null
          quantity: number | null
          seuil_reapprovisionnement: number | null
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "security" | "stock_manager"
      status_enum: "confirmer" | "enAttente" | "annuler"
      test_status: "pending" | "in_progress" | "completed" | "cancelled"
      test_type: "blood" | "urine" | "tissue" | "genetic"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
