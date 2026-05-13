import "server-only";

import { z } from "zod";

const DUMMY_EMAIL_DOMAIN = "example.com";

const nicknameSchema = z
  .string()
  .trim()
  .min(1, "ニックネームを入力してください。")
  .max(50, "ニックネームは50文字以内で入力してください。");

export const loginSchema = z.object({
  nickname: nicknameSchema,
  password: z.string().min(1, "パスワードを入力してください。"),
});

export const signupWithInviteSchema = z.object({
  nickname: nicknameSchema,
  password: z.string().min(6, "パスワードは6文字以上で入力してください。"),
  inviteCode: z
    .string()
    .trim()
    .min(1, "招待コードを入力してください。")
    .max(128, "招待コードは128文字以内で入力してください。"),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupWithInviteInput = z.infer<typeof signupWithInviteSchema>;

export function buildDummyEmail(nickname: string): string {
  const localPart = nickname
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/^[._-]+|[._-]+$/g, "")
    .replace(/[._-]{2,}/g, "-")
    .slice(0, 50);

  if (localPart) {
    return `${localPart}@${DUMMY_EMAIL_DOMAIN}`;
  }

  const fallbackLocalPart = Buffer.from(nickname.toLowerCase()).toString("hex").slice(0, 50);

  return `user-${fallbackLocalPart}@${DUMMY_EMAIL_DOMAIN}`;
}
