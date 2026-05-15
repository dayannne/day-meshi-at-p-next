import { requireActiveUser } from "@/features/auth/access";
import { NicknameEditForm } from "@/features/profile/components/NicknameEditForm";

export default async function Mypage() {
  const user = await requireActiveUser();

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-8 text-2xl font-bold text-slate-900">マイページ</h1>

      <section className="space-y-6">
        <div>
          <h2 className="mb-4 text-sm font-semibold tracking-wider text-slate-500 uppercase">
            プロフィール設定
          </h2>
          <NicknameEditForm initialNickname={user.nickname} />
        </div>
      </section>
    </div>
  );
}
