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
      profile: {
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
            foreignKeyName: "profile_id_fkey";
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
