import "server-only";

import { createHash } from "node:crypto";

import { z } from "zod";

const DUMMY_EMAIL_DOMAIN = "example.com";

const nicknameSchema = z
  .string()
  .trim()
  .min(1, "ニックネームを入力してください。")
  .max(50, "ニックネームは50文字以内で入力してください。");

const signupPasswordSchema = z.string().min(8, "パスワードは8文字以上で入力してください。");

export const loginSchema = z.object({
  nickname: nicknameSchema,
  password: z.string().min(1, "パスワードを入力してください。"),
});

export const signupWithInviteSchema = z
  .object({
    nickname: nicknameSchema,
    password: signupPasswordSchema,
    confirmPassword: z.string(),
    inviteCode: z
      .string()
      .trim()
      .min(1, "招待コードを入力してください。")
      .max(128, "招待コードは128文字以内で入力してください。"),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupWithInviteInput = z.infer<typeof signupWithInviteSchema>;

export function buildDummyEmail(nickname: string): string {
  const localPart = createHash("sha256").update(nickname, "utf8").digest("hex");

  return `${localPart}@${DUMMY_EMAIL_DOMAIN}`;
}
