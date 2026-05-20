"use client";
import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number; // 現在のレート
  size?: number;
  className?: string;
  onSelect?: (value: number) => void; // 【追加】これがあると入力モードになる
}

export const StarRating = ({ rating, size = 16, className = "", onSelect }: StarRatingProps) => {
  // 入力モードかどうかを判定
  const isReadOnly = !onSelect;

  return (
    <div className={`flex gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const star = (
          <Star
            size={size}
            // 指定された rating 以下の星を塗りつぶす
            fill={value <= rating ? "currentColor" : "none"}
            className={value <= rating ? "text-yellow-400" : "text-slate-300"}
          />
        );

        if (isReadOnly) {
          return (
            <span key={value} className="pointer-events-none" aria-hidden="true">
              {star}
            </span>
          );
        }

        return (
          <button
            key={value}
            type="button"
            onClick={() => onSelect?.(value)}
            className="cursor-pointer transition-transform hover:scale-110 active:scale-95"
          >
            {star}
          </button>
        );
      })}
    </div>
  );
};
