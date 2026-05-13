import "server-only";

import { createClient } from "@/lib/supabase/server";

export type AdminAccess =
  | {
      ok: true;
      userId: string;
    }
  | {
      ok: false;
      reason: "unauthenticated" | "forbidden";
    };

export async function getAdminAccess(): Promise<AdminAccess> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, reason: "unauthenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.role !== "ADMIN" || profile.status !== "ACTIVE") {
    return { ok: false, reason: "forbidden" };
  }

  return {
    ok: true,
    userId: user.id,
  };
}
