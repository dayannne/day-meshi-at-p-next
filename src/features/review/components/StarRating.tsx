"use client";
import { Star } from "lucide-react";
import { useState } from "react";

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
      {[1, 2, 3, 4, 5].map((value) => (
        <button
          key={value}
          type="button"
          // 入力モードではない時は、クリックを無効化する
          disabled={isReadOnly}
          onClick={() => onSelect?.(value)}
          className={`transition-transform ${
            isReadOnly ? "cursor-default" : "cursor-pointer hover:scale-110 active:scale-95"
          }`}
        >
          <Star
            size={size}
            // 指定された rating 以下の星を塗りつぶす
            fill={value <= rating ? "currentColor" : "none"}
            className={value <= rating ? "text-yellow-400" : "text-slate-300"}
          />
        </button>
      ))}
    </div>
  );
};
