import "server-only";

import { createClient } from "@/lib/supabase/server";

import { logoutAction } from "../actions";

export async function AuthSessionStatus() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="fixed top-3 right-3 z-50 rounded-md border border-stone-200 bg-white/95 px-3 py-2 text-xs font-medium text-stone-600 shadow-sm backdrop-blur">
        未ログイン
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nickname")
    .eq("id", user.id)
    .maybeSingle();
  const displayName = profile?.nickname ?? "プロフィール未設定";

  return (
    <div className="fixed top-3 right-3 z-50 flex max-w-[calc(100vw-1.5rem)] items-center gap-2 rounded-md border border-stone-200 bg-white/95 px-3 py-2 text-xs text-stone-700 shadow-sm backdrop-blur">
      <span className="min-w-0 truncate font-medium">ログイン中: {displayName}</span>
      <form action={logoutAction}>
        <button
          className="rounded bg-black px-2 py-1 font-medium text-white transition hover:bg-stone-800"
          type="submit"
        >
          ログアウト
        </button>
      </form>
    </div>
  );
}
