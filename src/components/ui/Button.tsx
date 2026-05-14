import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "focus-visible:ring-ring inline-flex shrink-0 cursor-pointer items-center justify-center rounded-lg text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:ring-2 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        /* 基本スタイル（線形グラデーション適用） */
        default: "bg-primary-linear text-white shadow-md hover:opacity-90",
        /* アウトラインスタイル（背景はホワイト） */
        outline: "border-primary text-primary hover:bg-primary/5 border bg-white shadow-sm",
        /* アウトラインなし、ホバー時のみ要素の色を変更 */
        ghost: "hover:text-primary text-slate-600",
        /* 背景に色を付けたバージョン（fillColorと連動） */
        fill: "bg border hover:text-white",
      },
      size: {
        lg: "w-full p-3 text-base",
        sm: "h-10 px-4 py-2 text-sm",
        /* アイコン用サイズ（ナビゲーションメニューなど） */
        icon: "size-14",
        /* タグボタンに使用 */
        tag: "rounded-full px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "lg",
    },
  }
);

export interface ButtonProps
  extends React.ComponentProps<"button">, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

function Button({
  className,
  variant = "default",
  size = "lg",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot.Root : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
