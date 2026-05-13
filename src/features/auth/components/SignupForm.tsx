"use client";

import Link from "next/link";
import { useActionState } from "react";
import { User, Lock, Key } from "lucide-react";

import { signupWithInviteAction } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/Form";

type SignupFormProps = {
  initialInviteCode?: string;
};

export function SignupForm({ initialInviteCode = "" }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signupWithInviteAction, {});
  const nicknameError = state?.fieldErrors?.nickname?.[0];
  const passwordError = state?.fieldErrors?.password?.[0];
  const confirmPasswordError = state?.fieldErrors?.confirmPassword?.[0];
  const inviteCodeError = state?.fieldErrors?.inviteCode?.[0];

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-9 shadow-sm">
      <form action={formAction} className="flex flex-col gap-7" noValidate>
        <div>
          <h2 className="text-center text-2xl font-bold text-slate-950">新規登録</h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            アカウントを作成してサービスを始めましょう
          </p>
        </div>

        <FormItem>
          <FormLabel className="text-base font-medium text-slate-950">
            ニックネーム <span className="text-red-600">*</span>
          </FormLabel>
          <FormControl className="mt-3">
            <Input
              variant="auth"
              name="nickname"
              type="text"
              autoComplete="nickname"
              defaultValue={state?.values?.nickname}
              aria-invalid={!!nicknameError}
              leftIcon={User}
              placeholder="ニックネームを入力"
              required
            />
          </FormControl>
          <FormMessage>{nicknameError}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel className="text-base font-medium text-slate-950">
            パスワード <span className="text-red-600">*</span>
          </FormLabel>
          <FormControl className="mt-3">
            <Input
              variant="auth"
              name="password"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!passwordError}
              leftIcon={Lock}
              placeholder="8文字以上"
              required
            />
          </FormControl>
          <FormMessage>{passwordError}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel className="text-base font-medium text-slate-950">
            パスワード確認 <span className="text-red-600">*</span>
          </FormLabel>
          <FormControl className="mt-3">
            <Input
              variant="auth"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={!!confirmPasswordError}
              leftIcon={Lock}
              placeholder="パスワードを再入力"
              required
            />
          </FormControl>
          <FormMessage>{confirmPasswordError}</FormMessage>
        </FormItem>

        <FormItem>
          <FormLabel className="text-base font-medium text-slate-950">
            招待コード <span className="text-red-600">*</span>
          </FormLabel>
          <FormControl className="mt-3">
            <Input
              variant="auth"
              name="inviteCode"
              type="text"
              defaultValue={state?.values?.inviteCode ?? initialInviteCode}
              aria-invalid={!!inviteCodeError}
              leftIcon={Key}
              placeholder="招待コードを入力"
              required
            />
          </FormControl>
          <FormMessage>{inviteCodeError}</FormMessage>
        </FormItem>

        {state?.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "登録中..." : "登録する"}
        </Button>

        <div className="mt-4 text-center text-sm text-slate-600">
          既にアカウントをお持ちですか？{" "}
          <Link
            href="/login"
            className="text-primary font-semibold underline-offset-4 hover:underline"
          >
            ログイン
          </Link>
        </div>
      </form>
    </div>
  );
}
