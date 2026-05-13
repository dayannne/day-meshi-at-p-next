"use client";

import { Heart } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils"; // shadcn/ui等で使われる標準的なクラス結合関数

interface LikeButtonProps {
  reviewId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
  onLikeToggle?: (id: string, newState: boolean) => Promise<void>;
  className?: string;
}

export const LikeButton = ({
  reviewId,
  initialLikeCount,
  initialIsLiked,
  onLikeToggle,
  className,
}: LikeButtonProps) => {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const [isLoading, setIsLoading] = useState(false);

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation(); // カード全体のクリックイベント発火を防ぐ
    if (isLoading) return;

    setIsLoading(true);
    const newState = !isLiked;

    // 楽観的更新
    setIsLiked(newState);
    setLikeCount((prev) => (newState ? prev + 1 : prev - 1));

    try {
      if (onLikeToggle) {
        await onLikeToggle(reviewId, newState);
      }
    } catch (error) {
      // 失敗時にロールバック
      setIsLiked(!newState);
      setLikeCount((prev) => (newState ? prev - 1 : prev + 1));
      console.error("Like toggle failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={cn(
        "group flex items-center gap-1.5 transition-all active:scale-90 disabled:opacity-70",
        className
      )}
    >
      <Heart
        size={20}
        className={cn(
          "transition-colors",
          isLiked ? "fill-red-500 text-red-500" : "text-slate-400 group-hover:text-red-400"
        )}
      />
      <span className={cn("text-sm font-bold", isLiked ? "text-red-500" : "text-slate-500")}>
        {likeCount}
      </span>
    </button>
  );
};
