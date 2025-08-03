
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      trips: {
        Row: {
          id: string
          created_at: string
          passenger_id: string
          driver_id: string | null
          pickup_lat: number
          pickup_lng: number
          dest_lat: number
          dest_lng: number
          status: "requested" | "accepted" | "in_progress" | "completed" | "cancelled"
          fare: number | null
          distance: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          passenger_id: string
          driver_id?: string | null
          pickup_lat: number
          pickup_lng: number
          dest_lat: number
          dest_lng: number
          status: "requested" | "accepted" | "in_progress" | "completed" | "cancelled"
          fare?: number | null
          distance?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          passenger_id?: string
          driver_id?: string | null
          pickup_lat?: number
          pickup_lng?: number
          dest_lat?: number
          dest_lng?: number
          status?: "requested" | "accepted" | "in_progress" | "completed" | "cancelled"
          fare?: number | null
          distance?: number | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
