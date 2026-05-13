// マイレビューページで使用するカードコンポーネント
"use client";

import { StarRating } from "@/features/review/components/StarRating";
import { Tag } from "@/components/ui/Tag";

//テスト使用例:
// import { MyReviewCard } from "@/features/review/components/MyReviewCard";
// <MyReviewCard
//   id="(uuid)"
//   place="イタリアン トラットリア"
//   rating={4}
//   comment="とても静かなカフェで、集中して作業ができました！コーヒーも美味しかったです。ぎゃおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおおお。ペイペイ！"
//   date={new Date()}
//   tags={["kawaii", "おしゃれ", "1000-2000"]}
// />

// 型定義
interface MyReviewCardProps {
  id: string; //レビューID. onclick時に使用
  place: string; // お店の名前
  rating: number; //レート(星)
  tags: string[]; //タグたち
  comment: string; //コメント
  date: Date; //日付(created_at or visited_at)
  onClick?: (id: string) => void;
}

export const MyReviewCard = ({
  id,
  place,
  rating,
  comment,
  date,
  tags,
  onClick,
}: MyReviewCardProps) => {
  const formattedDate = new Date(date).toLocaleDateString("sv-SE");

  return (
    <div
      onClick={() => onClick?.(id)}
      className={`bg-card flex cursor-pointer flex-col gap-3 rounded-xl border border-slate-200 bg-white p-3 transition-all duration-200 hover:border hover:border-slate-100`}
    >
      {/* 店名と星を一列に */}
      <div className="flex items-center gap-3">
        <p className="text-sm font-semibold text-slate-900">{place}</p>
        {/* 星（レート） */}
        <div className="ml-auto">
          <StarRating rating={rating} />
        </div>
      </div>
      <div className="flex gap-2">
        {tags.map((tag) => (
          <Tag key={tag} variant="primary">
            {tag}
          </Tag>
        ))}
      </div>

      {/* 3行制限のコメント */}
      <p className={`wrab-break-words line-clamp-1 text-xs leading-relaxed text-slate-700`}>
        {comment}
      </p>

      {/* 日付 */}
      <span className="text-muted-foreground text-xs font-medium text-slate-500">
        {formattedDate}
      </span>
    </div>
  );
};
