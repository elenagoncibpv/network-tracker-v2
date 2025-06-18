import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables (matching our schema)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          google_id: string
          email: string
          name: string
          avatar_url: string | null
          google_sheet_id: string | null
          sync_enabled: boolean
          last_sync_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          google_id: string
          email: string
          name: string
          avatar_url?: string | null
          google_sheet_id?: string | null
          sync_enabled?: boolean
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          google_id?: string
          email?: string
          name?: string
          avatar_url?: string | null
          google_sheet_id?: string | null
          sync_enabled?: boolean
          last_sync_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_lists: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          color: string
          icon: string
          is_favorite: boolean
          sheet_tab_name: string | null
          position: number
          tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          color?: string
          icon?: string
          is_favorite?: boolean
          sheet_tab_name?: string | null
          position?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          color?: string
          icon?: string
          is_favorite?: boolean
          sheet_tab_name?: string | null
          position?: number
          tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          user_id: string
          first_name: string
          last_name: string | null
          company: string | null
          job_title: string | null
          email: string | null
          phone: string | null
          linkedin_url: string | null
          website: string | null
          notes: string | null
          tags: string[] | null
          meeting_location: string | null
          meeting_date: string | null
          relationship_strength: number
          sheet_row_number: number | null
          last_synced_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          first_name: string
          last_name?: string | null
          company?: string | null
          job_title?: string | null
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          website?: string | null
          notes?: string | null
          tags?: string[] | null
          meeting_location?: string | null
          meeting_date?: string | null
          relationship_strength?: number
          sheet_row_number?: number | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          first_name?: string
          last_name?: string | null
          company?: string | null
          job_title?: string | null
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          website?: string | null
          notes?: string | null
          tags?: string[] | null
          meeting_location?: string | null
          meeting_date?: string | null
          relationship_strength?: number
          sheet_row_number?: number | null
          last_synced_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      contact_list_memberships: {
        Row: {
          id: string
          contact_id: string
          list_id: string
          position: number
          added_at: string
        }
        Insert: {
          id?: string
          contact_id: string
          list_id: string
          position?: number
          added_at?: string
        }
        Update: {
          id?: string
          contact_id?: string
          list_id?: string
          position?: number
          added_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_contact_with_lists: {
        Args: {
          contact_uuid: string
        }
        Returns: {
          contact_data: Json
          list_memberships: Json[]
        }[]
      }
      get_list_with_contact_count: {
        Args: {
          list_uuid: string
        }
        Returns: {
          list_data: Json
          contact_count: number
        }[]
      }
      get_dashboard_stats: {
        Args: {
          user_uuid: string
        }
        Returns: {
          total_lists: number
          total_contacts: number
          favorite_lists: number
          recently_added: number
        }[]
      }
      add_contact_to_list: {
        Args: {
          contact_uuid: string
          list_uuid: string
        }
        Returns: boolean
      }
      remove_contact_from_list: {
        Args: {
          contact_uuid: string
          list_uuid: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}

type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
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
    : never = never,
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
    : never = never,
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
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
    ? Database["public"]["Enums"][PublicEnumNameOrOptions]
    : never