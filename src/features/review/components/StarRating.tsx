import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  size?: number; // サイズを自由に変えられるようにする
  className?: string; // 外側から色などを微調整したい時用
}

export const StarRating = ({ rating, size = 12, className = "" }: StarRatingProps) => {
  return (
    <div className={`flex gap-0.5 text-yellow-400 ${className}`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={size}
          // rating が 3.5 などの場合も考えて、i < rating で判定
          fill={i < rating ? "currentColor" : "none"}
          className={i < rating ? "" : "text-slate-300"}
        />
      ))}
    </div>
  );
};
