"use client";

import Link from "next/link";
import { useActionState } from "react";

import { loginAction } from "../actions";

type LoginFormProps = {
  signupSuccess?: boolean;
};

export function LoginForm({ signupSuccess = false }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, {});
  const nicknameError = state.fieldErrors?.nickname?.[0];
  const passwordError = state.fieldErrors?.password?.[0];

  return (
    <form action={formAction} className="space-y-4" noValidate>
      <div>
        <h1 className="text-xl font-bold">ログイン</h1>
        <p className="text-sm text-gray-600">Meshi at P にアクセスします。</p>
      </div>

      {signupSuccess ? (
        <p className="text-sm text-green-700">
          アカウントを作成しました。ニックネームでログインしてください。
        </p>
      ) : null}

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
          aria-describedby={nicknameError ? "login-nickname-error" : undefined}
        />
        {nicknameError ? (
          <p className="text-sm text-red-600" id="login-nickname-error">
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
          autoComplete="current-password"
          aria-invalid={passwordError ? true : undefined}
          aria-describedby={passwordError ? "login-password-error" : undefined}
        />
        {passwordError ? (
          <p className="text-sm text-red-600" id="login-password-error">
            {passwordError}
          </p>
        ) : null}
      </label>

      <button
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "ログイン中..." : "ログイン"}
      </button>

      <Link className="block text-sm underline" href="/signup">
        招待コードを持っている場合はこちら
      </Link>
    </form>
  );
}
