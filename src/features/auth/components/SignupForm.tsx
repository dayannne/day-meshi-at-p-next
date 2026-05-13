"use client";

import Link from "next/link";
import { useActionState } from "react";

import { signupWithInviteAction } from "../actions";

type SignupFormProps = {
  initialInviteCode?: string;
};

export function SignupForm({ initialInviteCode = "" }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signupWithInviteAction, {});
  const nicknameError = state.fieldErrors?.nickname?.[0];
  const passwordError = state.fieldErrors?.password?.[0];
  const confirmPasswordError = state.fieldErrors?.confirmPassword?.[0];
  const inviteCodeError = state.fieldErrors?.inviteCode?.[0];

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <h1 className="text-xl font-bold">新規登録</h1>
        <p className="text-sm text-gray-600">招待コードを使ってアカウントを作成します。</p>
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      <label className="block space-y-1">
        ニックネーム
        <input
          className="w-full rounded border px-3 py-2"
          name="nickname"
          type="text"
          autoComplete="nickname"
          defaultValue={state.values?.nickname}
          aria-invalid={nicknameError ? true : undefined}
          aria-describedby={nicknameError ? "signup-nickname-error" : undefined}
        />
        {nicknameError ? (
          <p className="text-sm text-red-600" id="signup-nickname-error">
            {nicknameError}
          </p>
        ) : null}
      </label>

      <label className="block space-y-1">
        パスワード
        <input
          className="w-full rounded border px-3 py-2"
          name="password"
          type="password"
          autoComplete="new-password"
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "signup-password-error" : undefined}
        />
        {passwordError ? (
          <p className="text-sm text-red-600" id="signup-password-error">
            {passwordError}
          </p>
        ) : null}
      </label>

      <label className="block space-y-1">
        パスワード確認
        <input
          className="w-full rounded border px-3 py-2"
          name="confirmPassword"
          type="password"
          autoComplete="new-password"
          aria-invalid={confirmPasswordError ? true : undefined}
          aria-describedby={confirmPasswordError ? "signup-confirm-password-error" : undefined}
        />
        {confirmPasswordError ? (
          <p className="text-sm text-red-600" id="signup-confirm-password-error">
            {confirmPasswordError}
          </p>
        ) : null}
      </label>

      <label className="block space-y-1">
        招待コード
        <input
          className="w-full rounded border px-3 py-2"
          name="inviteCode"
          type="text"
          defaultValue={state.values?.inviteCode ?? initialInviteCode}
          aria-invalid={inviteCodeError ? true : undefined}
          aria-describedby={inviteCodeError ? "signup-invite-code-error" : undefined}
        />
        {inviteCodeError ? (
          <p className="text-sm text-red-600" id="signup-invite-code-error">
            {inviteCodeError}
          </p>
        ) : null}
      </label>

      <button
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "登録中..." : "登録する"}
      </button>

      <Link className="block text-sm underline" href="/login">
        すでにアカウントを持っている場合はこちら
      </Link>
    </form>
  );
}
