import * as React from "react";
import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        // ベースの形状とフォント設定
        "flex min-h-[300px] w-full resize-none rounded-2xl border px-4 py-3 text-base transition-all outline-none md:text-sm",
        // 背景色とボーダー
        "border-2 border-slate-100 placeholder:text-slate-400",
        // 無効時のスタイル
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      // placeholderの引数を渡すことで中にガイドテキストを書くことができる
      placeholder=""
      {...props}
    />
  );
}

export { Textarea };
