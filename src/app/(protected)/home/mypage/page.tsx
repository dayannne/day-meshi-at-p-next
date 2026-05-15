import { requireActiveUser } from "@/features/auth/access";
import { NicknameEditForm } from "@/features/profile/components/NicknameEditForm";

export default async function Mypage() {
  const user = await requireActiveUser();

  return (
    <>
      <div className="flex flex-col gap-4 border-b border-b-slate-200 bg-white p-6">
        <h1 className="text-xl font-bold text-slate-900">マイページ</h1>
        <div className="bg-primary-background w-full rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <NicknameEditForm initialNickname={user.nickname} />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-6"></div>
      <div className="space-y-6"></div>
    </>
  );
}
