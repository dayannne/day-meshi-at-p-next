import { z } from "zod";

export const nicknameSchema = z
  .string()
  .min(2, "ニックネームは2文字以上で入力してください。")
  .max(12, "ニックネームは12文字以内で入力してください。")
  .regex(
    /^[a-zA-Z0-9ぁ-んァ-ヶー一-龠]+$/,
    "ニックネームは漢字、ひらがな、カタカナ、英数字のみ使用可能です（特殊文字やスペースは不可）。"
  );

export const signupPasswordSchema = z
  .string()
  .min(8, "パスワードは8文字以上で入力してください。")
  .refine(
    (password) => {
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      const typesCount = [hasUppercase, hasLowercase, hasNumber, hasSpecial].filter(Boolean).length;
      return typesCount >= 3;
    },
    {
      message:
        "パスワードは英大文字、英小文字、数字、特殊文字のうち3種類以上を組み合わせてください。",
    }
  );

export const loginSchema = z.object({
  nickname: z.string().min(1, "ニックネームまたはメールアドレスを入力してください。"),
  password: z.string().min(1, "パスワードを入力してください。"),
});

export const signupWithInviteSchema = z
  .object({
    nickname: nicknameSchema,
    password: signupPasswordSchema,
    confirmPassword: z.string().min(1, "パスワード（確認）を入力してください。"),
    inviteCode: z
      .string()
      .trim()
      .min(1, "招待コードを入力してください。")
      .max(128, "招待コードは128文字以内で入力してください。"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません。",
    path: ["confirmPassword"],
  })
  .refine((data) => data.password !== data.nickname, {
    message: "ニックネームと同じパスワードは使用できません。",
    path: ["password"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type SignupWithInviteInput = z.infer<typeof signupWithInviteSchema>;
