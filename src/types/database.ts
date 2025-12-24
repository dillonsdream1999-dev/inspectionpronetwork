export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type TerritoryStatus = 'available' | 'held' | 'taken'
export type TerritoryType = 'metro' | 'rural'
export type PriceType = 'base' | 'adjacent'
export type OwnershipStatus = 'active' | 'canceled'
export type LeadStatus = 'new' | 'contacted' | 'booked' | 'not_a_fit'
export type ContactPreference = 'phone' | 'email' | 'text'
export type UserRole = 'operator' | 'admin'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          role: UserRole
          created_at: string
        }
        Insert: {
          id: string
          email: string
          role?: UserRole
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          role?: UserRole
          created_at?: string
        }
      }
      companies: {
        Row: {
          id: string
          owner_user_id: string
          name: string
          phone: string | null
          website: string | null
          billing_email: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_user_id: string
          name: string
          phone?: string | null
          website?: string | null
          billing_email?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_user_id?: string
          name?: string
          phone?: string | null
          website?: string | null
          billing_email?: string | null
          created_at?: string
        }
      }
      territories: {
        Row: {
          id: string
          name: string
          state: string
          metro_area: string | null
          type: TerritoryType
          population_est: number
          zip_codes: string[]
          adjacent_ids: string[]
          status: TerritoryStatus
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          state: string
          metro_area?: string | null
          type: TerritoryType
          population_est: number
          zip_codes: string[]
          adjacent_ids?: string[]
          status?: TerritoryStatus
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          state?: string
          metro_area?: string | null
          type?: TerritoryType
          population_est?: number
          zip_codes?: string[]
          adjacent_ids?: string[]
          status?: TerritoryStatus
          created_at?: string
        }
      }
      territory_holds: {
        Row: {
          id: string
          territory_id: string
          company_id: string
          expires_at: string
          checkout_session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          territory_id: string
          company_id: string
          expires_at: string
          checkout_session_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          territory_id?: string
          company_id?: string
          expires_at?: string
          checkout_session_id?: string | null
          created_at?: string
        }
      }
      territory_ownership: {
        Row: {
          id: string
          territory_id: string
          company_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          price_type: PriceType
          status: OwnershipStatus
          started_at: string
          ended_at: string | null
        }
        Insert: {
          id?: string
          territory_id: string
          company_id: string
          stripe_customer_id: string
          stripe_subscription_id: string
          price_type?: PriceType
          status?: OwnershipStatus
          started_at?: string
          ended_at?: string | null
        }
        Update: {
          id?: string
          territory_id?: string
          company_id?: string
          stripe_customer_id?: string
          stripe_subscription_id?: string
          price_type?: PriceType
          status?: OwnershipStatus
          started_at?: string
          ended_at?: string | null
        }
      }
      leads: {
        Row: {
          id: string
          created_at: string
          zip: string
          room_type: string | null
          contact_pref: ContactPreference
          status: LeadStatus
          territory_id: string
          company_id: string
          contact_name: string | null
          contact_email: string | null
          contact_phone: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          zip: string
          room_type?: string | null
          contact_pref?: ContactPreference
          status?: LeadStatus
          territory_id: string
          company_id: string
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          zip?: string
          room_type?: string | null
          contact_pref?: ContactPreference
          status?: LeadStatus
          territory_id?: string
          company_id?: string
          contact_name?: string | null
          contact_email?: string | null
          contact_phone?: string | null
          notes?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      territory_status: TerritoryStatus
      territory_type: TerritoryType
      price_type: PriceType
      ownership_status: OwnershipStatus
      lead_status: LeadStatus
      contact_preference: ContactPreference
      user_role: UserRole
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

