"use client";

import { Trash2, User } from "lucide-react";
import { StarRating } from "@/features/review/components/StarRating";
import { LikeButton } from "@/features/review/components/LikeButton";
import { Tag } from "@/components/ui/Tag";

interface ReviewDetailProps {
  id: string;
  mode: "my-review" | "shop-detail";

  // 表示用データ
  name?: string; // shop-detailモードの時はユーザー名
  place?: string; // my-reviewモードの時は店名
  rating: number;
  date: Date;
  comment: string;
  tags: string[];

  // いいね機能用
  initialLikeCount: number;
  initialIsLiked: boolean;

  // 権限・アクション用
  currentUserId?: string;
  authorId: string;
  onDelete?: (id: string) => void;
  onLikeToggle?: (id: string, newState: boolean) => Promise<void>;
}

export const ReviewDetail = ({
  id,
  mode,
  name,
  place,
  rating,
  date,
  comment,
  tags,
  initialLikeCount,
  initialIsLiked,
  currentUserId,
  authorId,
  onDelete,
  onLikeToggle,
}: ReviewDetailProps) => {
  // --- 状態管理 ---
  // LikeButtonに任せるので、ここでの useState は不要になりました！スッキリ！

  const formattedDate = new Date(date).toLocaleDateString("sv-SE");
  const isOwner = currentUserId === authorId;

  return (
    <div className="relative flex flex-col gap-6 p-6">
      {/* 1. ヘッダー：モードによって出し分け */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {mode === "shop-detail" ? (
            <>
              {/* アイコン部分の背景色やサイズ、良い感じですね！ */}
              <div className="bg-primary-background flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full">
                <User size={18} className="text-primary" />
              </div>
              <p className="font-bold text-slate-900">{name}</p>
            </>
          ) : (
            <h2 className="text-xl font-bold text-slate-950">{place}</h2>
          )}
        </div>
      </div>

      {/* 2. 評価エリア */}
      <div className="-mt-4 flex items-center gap-3">
        <StarRating rating={rating} size={18} />
        <span className="text-sm font-medium text-slate-400">{formattedDate}</span>
      </div>

      {/* 3. コメントエリア */}
      <p className="text-base leading-relaxed break-words text-slate-700">{comment}</p>

      {/* 4. タグエリア */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Tag key={tag} variant="primary">
            {tag}
          </Tag>
        ))}
      </div>

      {/* 5. フッター：いいね ＆ 削除アクション */}
      <div className="mt-2 flex items-center justify-between border-t border-slate-50 pt-4">
        {/* 子コンポーネントがすべてのロジックを持ってくれているので、渡すだけで完結 */}
        <LikeButton
          reviewId={id}
          initialLikeCount={initialLikeCount}
          initialIsLiked={initialIsLiked}
          onLikeToggle={onLikeToggle}
        />

        {isOwner && (
          <button
            onClick={() => onDelete?.(id)}
            className="flex items-center gap-1 rounded-lg px-2 py-1 text-slate-300 transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 size={20} />
          </button>
        )}
      </div>
    </div>
  );
};
