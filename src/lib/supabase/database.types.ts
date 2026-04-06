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
      service_requests: {
        Row: {
          id: string
          service_type: string
          status: string
          admin_note: string | null
          full_name: string
          phone: string
          email: string
          city: string
          property_type: string
          property_area: string
          current_boiler_type: string
          boiler_status: string
          replacement_reason: string
          message: string | null
          form_data_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          service_type: string
          status?: string
          admin_note?: string | null
          full_name: string
          phone: string
          email: string
          city: string
          property_type: string
          property_area: string
          current_boiler_type: string
          boiler_status: string
          replacement_reason: string
          message?: string | null
          form_data_json?: Json
          created_at?: string
        }
        Update: {
          id?: string
          service_type?: string
          status?: string
          admin_note?: string | null
          full_name?: string
          phone?: string
          email?: string
          city?: string
          property_type?: string
          property_area?: string
          current_boiler_type?: string
          boiler_status?: string
          replacement_reason?: string
          message?: string | null
          form_data_json?: Json
          created_at?: string
        }
        Relationships: []
      }
      service_request_attachments: {
        Row: {
          id: string
          service_request_id: string
          bucket_name: string
          storage_path: string
          file_name: string
          content_type: string
          file_size_bytes: number
          created_at: string
        }
        Insert: {
          id?: string
          service_request_id: string
          bucket_name: string
          storage_path: string
          file_name: string
          content_type: string
          file_size_bytes: number
          created_at?: string
        }
        Update: {
          id?: string
          service_request_id?: string
          bucket_name?: string
          storage_path?: string
          file_name?: string
          content_type?: string
          file_size_bytes?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "service_request_attachments_service_request_id_fkey"
            columns: ["service_request_id"]
            isOneToOne: false
            referencedRelation: "service_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      job_applications: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string
          motivation_text: string
          interest_area: string | null
          note: string | null
          cv_file_path: string
          cv_file_name: string
          cv_content_type: string
          cv_file_size_bytes: number
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          full_name: string
          email: string
          phone: string
          motivation_text: string
          interest_area?: string | null
          note?: string | null
          cv_file_path: string
          cv_file_name: string
          cv_content_type: string
          cv_file_size_bytes: number
          status?: string
          created_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string
          motivation_text?: string
          interest_area?: string | null
          note?: string | null
          cv_file_path?: string
          cv_file_name?: string
          cv_content_type?: string
          cv_file_size_bytes?: number
          status?: string
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
