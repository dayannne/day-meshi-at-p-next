"use client";

import { useActionState } from "react";

import { createInviteCodeAction } from "../actions";

export function InviteCodeIssuer() {
  const [state, formAction, isPending] = useActionState(createInviteCodeAction, {});

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">招待コード発行</h1>
        <p className="text-sm text-gray-600">有効期限7日の新しい招待リンクを発行します。</p>
      </div>

      {state.error ? <p className="text-sm text-red-600">{state.error}</p> : null}

      {state.message && state.inviteLink ? (
        <section className="space-y-3 rounded border p-4">
          <p className="text-sm text-green-700">{state.message}</p>
          <label className="block space-y-1">
            招待リンク
            <input className="w-full rounded border px-3 py-2" value={state.inviteLink} readOnly />
          </label>
          <div className="text-sm">
            <p>
              <span>コード:</span> {state.code}
            </p>
            <p>
              <span>有効期限:</span>{" "}
              {state.expiresAt ? new Date(state.expiresAt).toLocaleString("ja-JP") : ""}
            </p>
          </div>
        </section>
      ) : null}

      <button
        className="rounded bg-black px-4 py-2 text-white disabled:opacity-50"
        type="submit"
        disabled={isPending}
      >
        {isPending ? "発行中..." : "招待コードを発行"}
      </button>
    </form>
  );
}
