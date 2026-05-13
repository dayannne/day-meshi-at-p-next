import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "flex h-11 w-full rounded-lg border text-sm transition-all outline-none placeholder:text-slate-400 disabled:cursor-not-allowed disabled:opacity-50 [&::-webkit-search-cancel-button]:appearance-none",
  {
    variants: {
      variant: {
        /* 基本スタイル */
        default: "focus:border-primary border-slate-400 bg-white",
        /* 認証・入力フォーム用 (M3 Elevation Light 1) */
        auth: "focus:border-primary border-slate-200 bg-white shadow-[0_1px_3px_1px_rgba(0,0,0,0.15),0_1px_2px_0_rgba(0,0,0,0.06)]",
      },
      status: {
        default: "",
        /* バリデーションエラー時 */
        invalid: "border-red-600 focus:border-red-600",
        /* バリデーション成功時 */
        valid: "border-emerald-600 focus:border-emerald-600",
      },
    },
    defaultVariants: {
      variant: "default",
      status: "default",
    },
  }
);

export interface InputProps
  extends React.ComponentProps<"input">, VariantProps<typeof inputVariants> {
  leftIcon?: LucideIcon;
}

function Input({ className, variant, status, type, leftIcon: LeftIcon, ...props }: InputProps) {
  /* aria-invalid属性に基づき、自動的にstatusをinvalidに切り替え */
  const currentStatus = props["aria-invalid"] ? "invalid" : status;

  return (
    <div className="relative w-full">
      {LeftIcon && (
        <div className="pointer-events-none absolute top-1/2 left-3 flex -translate-y-1/2 items-center justify-center">
          <LeftIcon className="size-5 text-slate-400" />
        </div>
      )}
      <input
        type={type}
        data-slot="input"
        className={cn(
          inputVariants({ variant, status: currentStatus, className }),
          /* アイコンがある場合、左側にパディングを確保 */
          LeftIcon && "pl-10",
          className
        )}
        {...props}
      />
    </div>
  );
}

export { Input };
