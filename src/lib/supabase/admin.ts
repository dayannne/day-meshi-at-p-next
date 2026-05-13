import "server-only";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getAdminSupabaseEnv } from "./env";
import type { Database } from "./types";

export function createAdminClient() {
  const { url, adminKey } = getAdminSupabaseEnv();

  return createSupabaseClient<Database>(url, adminKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
