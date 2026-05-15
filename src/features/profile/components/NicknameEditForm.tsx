"use client";

import { useActionState, useState } from "react";
import { Pencil, X, User } from "lucide-react";
import { updateNicknameAction, ProfileActionState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormItem, FormControl, FormMessage } from "@/components/ui/Form";

interface NicknameEditFormProps {
  initialNickname: string;
}

export function NicknameEditForm({ initialNickname }: NicknameEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(initialNickname);

  // サーバーアクションの実行と結果に基づく状態管理
  const [state, formAction, isPending] = useActionState(
    async (prevState: ProfileActionState, formData: FormData) => {
      const result = await updateNicknameAction(prevState, formData);

      // 更新成功時はローカル状態を更新して編集モードを終了
      if (result.success) {
        const newNickname = formData.get("nickname") as string;
        if (newNickname) {
          setNickname(newNickname);
        }
        setIsEditing(false);
      }
      return result;
    },
    { success: false, fieldErrors: {} }
  );

  const toggleEditing = () => setIsEditing((prev) => !prev);
  const nicknameError = state?.fieldErrors?.nickname?.[0];

  return (
    <div className="w-full max-w-md">
      {!isEditing ? (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div>
            <p className="text-xs font-medium text-slate-500">ニックネーム</p>
            <p className="text-lg font-bold text-slate-900">{nickname}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleEditing}
            className="hover:bg-slate-100"
            aria-label="ニックネームを編集"
          >
            <Pencil className="size-5 text-slate-600" />
          </Button>
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <form action={formAction} className="space-y-4">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="mb-3 text-sm font-medium text-slate-600">
                  新しいニックネームを入力してください。
                </p>
                <FormItem>
                  <FormControl>
                    <Input
                      name="nickname"
                      defaultValue={state?.values?.nickname ?? nickname}
                      placeholder="ニックネーム"
                      leftIcon={User}
                      aria-invalid={!!nicknameError}
                      disabled={isPending}
                      autoFocus
                    />
                  </FormControl>
                  <FormMessage>{nicknameError}</FormMessage>
                </FormItem>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={toggleEditing}
                className="mt-8 hover:bg-slate-100"
                disabled={isPending}
                aria-label="編集をキャンセル"
              >
                <X className="size-5 text-slate-600" />
              </Button>
            </div>

            {state?.error && <p className="text-sm font-medium text-red-600">{state.error}</p>}

            <div className="flex justify-end gap-2">
              <Button type="submit" size="sm" className="h-9 px-4 text-xs" disabled={isPending}>
                {isPending ? "更新中..." : "変更を保存"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* 更新成功時のメッセージ表示 */}
      {state?.message && state.success && !isEditing && (
        <p className="mt-2 text-center text-sm font-medium text-emerald-600">{state.message}</p>
      )}
    </div>
  );
}
