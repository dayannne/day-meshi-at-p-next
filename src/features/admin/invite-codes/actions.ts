"use server";

import { headers } from "next/headers";

import { requireAdmin } from "@/features/auth/access";
import { createAdminClient } from "@/lib/supabase/admin";

const INVITE_CODE_EXPIRES_IN_DAYS = 7;

export type InviteCodeActionState = {
  error?: string;
  message?: string;
  code?: string;
  inviteLink?: string;
  expiresAt?: string;
};

function buildInviteLink(origin: string | null, code: string) {
  const path = `/signup?inviteCode=${encodeURIComponent(code)}`;

  return origin ? `${origin}${path}` : path;
}

export async function createInviteCodeAction(): Promise<InviteCodeActionState> {
  await requireAdmin();

  const code = crypto.randomUUID();
  const expiresAt = new Date(
    Date.now() + INVITE_CODE_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();

  const admin = createAdminClient();
  const { error } = await admin.from("invite_codes").insert({
    code,
    expires_at: expiresAt,
  });

  if (error) {
    return { error: "招待コードの発行に失敗しました。" };
  }

  const headersList = await headers();
  const inviteLink = buildInviteLink(headersList.get("origin"), code);

  return {
    message: "招待コードを発行しました。",
    code,
    inviteLink,
    expiresAt,
  };
}
