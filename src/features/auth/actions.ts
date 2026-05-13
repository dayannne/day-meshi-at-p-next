"use server";

import { redirect } from "next/navigation";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { buildDummyEmail, loginSchema, signupWithInviteSchema } from "./schema";

export type AuthActionState = {
  error?: string;
  message?: string;
  fieldErrors?: {
    nickname?: string[];
    password?: string[];
    inviteCode?: string[];
  };
  values?: {
    nickname?: string;
    inviteCode?: string;
  };
};

function readFormValue(formData: FormData, name: string): string | undefined {
  const value = formData.get(name);

  return typeof value === "string" ? value : undefined;
}

function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData);
}

function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

async function deleteCreatedUser(userId: string) {
  const admin = createAdminClient();
  await admin.auth.admin.deleteUser(userId);
}

async function clearInviteCodeUse(code: string, userId: string) {
  const admin = createAdminClient();

  await admin
    .from("invite_codes")
    .update({
      used_at: null,
      used_by: null,
    })
    .eq("code", code)
    .eq("used_by", userId);
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: {
        nickname: readFormValue(formData, "nickname"),
      },
    };
  }

  const { nickname, password } = parsed.data;
  const email = buildDummyEmail(nickname);
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: "ログインに失敗しました。入力内容を確認してください。" };
  }

  redirect("/home/places");
}

export async function signupWithInviteAction(
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const parsed = signupWithInviteSchema.safeParse(formDataToObject(formData));

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: {
        nickname: readFormValue(formData, "nickname"),
        inviteCode: readFormValue(formData, "inviteCode"),
      },
    };
  }

  const { password, nickname, inviteCode } = parsed.data;
  const email = buildDummyEmail(nickname);

  const admin = createAdminClient();
  const { data: inviteCodeRow, error: inviteCodeError } = await admin
    .from("invite_codes")
    .select("code, used_at, expires_at")
    .eq("code", inviteCode)
    .maybeSingle();

  if (inviteCodeError) {
    return { error: "招待コードの確認に失敗しました。" };
  }

  if (!inviteCodeRow) {
    return { error: "招待コードが見つかりません。" };
  }

  if (inviteCodeRow.used_at) {
    return { error: "この招待コードはすでに使用されています。" };
  }

  if (isExpired(inviteCodeRow.expires_at)) {
    return { error: "この招待コードは有効期限が切れています。" };
  }

  const supabase = await createClient();
  const { data: signupData, error: signupError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nickname,
      },
    },
  });

  if (signupError || !signupData.user) {
    return { error: "アカウント作成に失敗しました。入力内容を確認してください。" };
  }

  const userId = signupData.user.id;
  const usedAt = new Date().toISOString();
  const { data: usedInviteCode, error: useInviteCodeError } = await admin
    .from("invite_codes")
    .update({
      used_at: usedAt,
      used_by: userId,
    })
    .eq("code", inviteCode)
    .is("used_at", null)
    .gt("expires_at", usedAt)
    .select("code")
    .maybeSingle();

  if (useInviteCodeError || !usedInviteCode) {
    await supabase.auth.signOut();
    await deleteCreatedUser(userId);

    return { error: "招待コードを使用できませんでした。もう一度お試しください。" };
  }

  const { error: profileError } = await admin.from("profiles").insert({
    id: userId,
    nickname,
  });

  if (profileError) {
    await clearInviteCodeUse(inviteCode, userId);
    await supabase.auth.signOut();
    await deleteCreatedUser(userId);

    if (profileError.code === "23505") {
      return { error: "このニックネームはすでに使用されています。" };
    }

    return { error: "プロフィール作成に失敗しました。もう一度お試しください。" };
  }

  if (signupData.session) {
    redirect("/home/places");
  }

  redirect("/login?signup=success");
}
