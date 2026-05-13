import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/lib/supabase/types";

type UserRole = Database["public"]["Enums"]["user_role"];
type UserStatus = Database["public"]["Enums"]["user_status"];

export type ActiveUser = {
  userId: string;
  nickname: string;
  role: UserRole;
  status: UserStatus;
};

export const requireUser = cache(async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();
  const userId = data?.claims.sub;

  if (error || !userId) {
    redirect("/login");
  }

  return {
    userId,
  };
});

export const requireActiveUser = cache(async (): Promise<ActiveUser> => {
  const { userId } = await requireUser();
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("nickname, role, status")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load the current user's profile.");
  }

  if (!profile || profile.status !== "ACTIVE") {
    redirect("/login?auth=inactive");
  }

  return {
    userId,
    nickname: profile.nickname,
    role: profile.role,
    status: profile.status,
  };
});

export const requireAdmin = cache(async () => {
  const user = await requireActiveUser();

  if (user.role !== "ADMIN") {
    redirect("/home/places");
  }

  return user;
});
