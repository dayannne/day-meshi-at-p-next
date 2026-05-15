"use client";

import { useActionState, useState, useEffect } from "react";
import { Pencil, X, User, Check } from "lucide-react";
import { updateNicknameAction, ProfileActionState } from "../actions";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { FormItem, FormControl, FormMessage } from "@/components/ui/Form";

interface StatusMessageProps {
  isEditing: boolean;
  nicknameError?: string;
  displayState: ProfileActionState;
}

const StatusMessage = ({ isEditing, nicknameError, displayState }: StatusMessageProps) => {
  if (isEditing) return <FormMessage>{nicknameError}</FormMessage>;
  if (displayState?.error)
    return <p className="text-sm font-medium text-red-600">{displayState.error}</p>;
  if (displayState?.message && displayState.success)
    return <p className="text-sm font-medium text-emerald-600">{displayState.message}</p>;
  return null;
};

export function NicknameEditForm({ initialNickname }: { initialNickname: string }) {
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState(initialNickname);
  const [formKey, setFormKey] = useState(0);

  const [displayState, setDisplayState] = useState<ProfileActionState>({
    success: false,
    fieldErrors: {},
  });

  const [state, formAction, isPending] = useActionState(
    async (prevState: ProfileActionState, formData: FormData) => {
      const result = await updateNicknameAction(prevState, formData);
      if (result.success) {
        const newNickname = formData.get("nickname") as string;
        if (newNickname) setNickname(newNickname);
        setIsEditing(false);
      }
      setDisplayState(result);
      return result;
    },
    { success: false, fieldErrors: {} }
  );

  useEffect(() => {
    if ((displayState?.message || displayState?.error) && !isEditing) {
      const timer = setTimeout(() => {
        setDisplayState({ success: false, fieldErrors: {} });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [displayState, isEditing]);

  const toggleEditing = () => {
    setDisplayState({ success: false, fieldErrors: {} });
    if (!isEditing) setFormKey((prev) => prev + 1);
    setIsEditing((prev) => !prev);
  };

  const nicknameError = displayState?.fieldErrors?.nickname?.[0];

  return (
    <>
      <div className="flex gap-3">
        <div className="bg-primary-linear inline-flex h-16 w-16 shrink-0 items-center justify-center rounded-full shadow">
          <User className="text-white" />
        </div>
        <div className="flex-1">
          {!isEditing ? (
            <div className="flex h-16 items-center">
              <div className="flex-1">
                <p className="text-lg font-bold text-slate-900">{nickname}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleEditing}
                className="h-10 w-10 text-slate-500"
                aria-label="ニックネームを編集"
              >
                <Pencil className="size-5" />
              </Button>
            </div>
          ) : (
            <form key={formKey} action={formAction} className="flex h-16 items-center gap-2">
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    name="nickname"
                    defaultValue={state?.values?.nickname ?? nickname}
                    placeholder="ニックネーム"
                    leftIcon={Pencil}
                    aria-invalid={!!nicknameError}
                    disabled={isPending}
                    autoFocus
                  />
                </FormControl>
              </FormItem>
              <div className="flex items-center gap-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={toggleEditing}
                  className="h-10 w-10 rounded-full p-3"
                  disabled={isPending}
                  aria-label="編集をキャンセル"
                >
                  <X className="size-4" />
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="h-10 w-10 rounded-full p-3"
                  disabled={isPending}
                >
                  <Check />
                </Button>
              </div>
            </form>
          )}
          <StatusMessage
            isEditing={isEditing}
            nicknameError={nicknameError}
            displayState={displayState}
          />
        </div>
      </div>
    </>
  );
}
