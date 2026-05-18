import Link from "next/link";
import { requireActiveUser } from "@/features/auth/access";
import { NicknameEditForm } from "@/features/profile/components/NicknameEditForm";
import { Button } from "@/components/ui/Button";

export default async function Mypage() {
  const user = await requireActiveUser();

  // 仮の統計データ
  const stats = { reviews: 0, bookmarks: 0 };

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-b-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">マイページ</h1>
        <div className="bg-primary-background flex w-full flex-col gap-4 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <NicknameEditForm initialNickname={user.nickname} />
            </div>
          </div>
          <div className="flex w-full gap-6">
            <Link
              href="/home/mypage/reviews"
              className="flex-1 rounded-lg bg-white p-2 text-center"
            >
              <p className="text-primary text-xl font-bold">{stats.reviews}</p>
              <p className="text-xs text-slate-500">レビュー</p>
            </Link>
            <Link
              href="/home/bookmarks"
              className="flex-1 rounded-lg bg-white p-2 pb-0 text-center"
            >
              <p className="text-primary text-xl font-bold">{stats.bookmarks}</p>
              <p className="text-xs text-slate-500">ブックマーク</p>
            </Link>
          </div>
        </div>
      </div>

      {/* マイレビューセクション */}
      <div className="flex flex-1 flex-col gap-3 border-b border-slate-200 p-4">
        <div className="flex items-center">
          <h2 className="flex-1 text-sm font-bold">マイレビュー</h2>
          <button className="text-primary cursor-pointer text-sm hover:underline">
            全てのレビュー
          </button>
        </div>

        {/* TODO: レビューコンポーネントの導入 */}
        <div className="flex h-full items-center justify-center">まだレビューがありません</div>
      </div>

      {/* ブックマークセクション */}
      <div className="flex flex-1 flex-col gap-3 border-slate-200 p-4">
        <div className="flex items-center">
          <h2 className="flex-1 text-sm font-bold">ブックマーク</h2>
          <Link href="/home/bookmarks" className="text-primary text-sm hover:underline">
            全てのブックマーク
          </Link>
        </div>

        {/* TODO: ブックマークコンポーネントの導入 */}
        <div className="flex h-full items-center justify-center">
          まだブックマークした店がありません
        </div>
      </div>
    </>
  );
}
