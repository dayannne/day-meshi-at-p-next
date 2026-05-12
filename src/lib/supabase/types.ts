export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      healthy_environment: {
        Row: {
          environment: "local" | "preview" | "production";
        };
        Insert: {
          environment: "local" | "preview" | "production";
        };
        Update: {
          environment?: "local" | "preview" | "production";
        };
        Relationships: [];
      };
      invite_codes: {
        Row: {
          code: string;
          used_at: string | null;
          expires_at: string;
          used_by: string | null;
          created_at: string;
        };
        Insert: {
          code: string;
          used_at?: string | null;
          expires_at: string;
          used_by?: string | null;
          created_at?: string;
        };
        Update: {
          code?: string;
          used_at?: string | null;
          expires_at?: string;
          used_by?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "invite_codes_used_by_fkey";
            columns: ["used_by"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      places: {
        Row: {
          id: string;
          google_place_id: string;
          name: string;
          lat: number;
          lng: number;
          image_url: string | null;
          is_gochimeshi: boolean;
          avg_rating: number;
          review_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          google_place_id: string;
          name: string;
          lat: number;
          lng: number;
          image_url?: string | null;
          is_gochimeshi?: boolean;
          avg_rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          google_place_id?: string;
          name?: string;
          lat?: number;
          lng?: number;
          image_url?: string | null;
          is_gochimeshi?: boolean;
          avg_rating?: number;
          review_count?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          nickname: string;
          role: Database["public"]["Enums"]["user_role"];
          status: Database["public"]["Enums"]["user_status"];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          nickname: string;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["user_status"];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nickname?: string;
          role?: Database["public"]["Enums"]["user_role"];
          status?: Database["public"]["Enums"]["user_status"];
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      user_role: "USER" | "ADMIN";
      user_status: "ACTIVE" | "SUSPENDED";
    };
    CompositeTypes: Record<string, never>;
  };
};
