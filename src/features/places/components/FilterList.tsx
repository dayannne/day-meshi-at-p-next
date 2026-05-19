"use client";

import React from "react";
import { Star } from "lucide-react";
import { CategorizedTags } from "@/features/tag/components/CategorizedTags";
import { PriceSelector } from "@/features/review/components/PriceSelector";
import { useFilterNavigation } from "../hooks/useFilterNavigation";
import { TagButton } from "@/components/ui/TagButton";

interface FilterListProps {
  onClose: () => void;
}

const GOOGLE_PLACE_CATEGORIES = {
  CAFE: "カフェ",
  SUSHI: "寿司",
  RAMEN: "ラーメン",
  CHINESE: "中華",
  CURRY: "カレー",
  IZAKAYA: "居酒屋",
  SWEETS: "スイーツ",
  BAR: "バー",
  JAPANESE: "和食",
  YAKINIKU: "焼肉",
  WESTERN: "洋食",
  FAST_FOOD: "ファストフード",
  ASIAN: "アジア",
  OTHERS: "その他",
};
type GooglePlaceCategoryKey = keyof typeof GOOGLE_PLACE_CATEGORIES;

export function FilterList({ onClose }: FilterListProps) {
  const {
    rating,
    price,
    selectedTagIds,
    selectedCategories,
    tagGroups,
    isTagsLoading,
    setRating,
    setPrice,
    toggleCategorySelection,
    toggleTagSelection,
  } = useFilterNavigation();

  const colors: (
    | "primary"
    | "secondary"
    | "tertiary"
    | "neutral"
    | "primary_outline"
    | "secondary_outline"
    | "tertiary_outline"
    | "neutral_outline"
  )[] = [
    "primary",
    "secondary",
    "tertiary",
    "neutral",
    "primary_outline",
    "secondary_outline",
    "tertiary_outline",
    "neutral_outline",
  ];

  // 💡 ② ローディングの判定も、フックから降ってきた状態（isTagsLoading）を見るだけ！
  if (isTagsLoading) return <div className="text-sm text-slate-500">タグを読み込み中...</div>;

  return (
    <div className="flex flex-col space-y-4 pt-2">
      {/*  評価（レート） */}
      <div className="space-y-2">
        <label className="border-l-4 border-slate-950 pl-2 text-sm font-bold">評価</label>
        <div className="flex gap-1 pt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              className={`h-8 w-8 cursor-pointer transition-all ${
                star <= rating ? "fill-yellow-400 text-yellow-400" : "text-slate-200"
              }`}
              onClick={() => setRating(star)}
            />
          ))}
          {rating > 0 && (
            <button
              onClick={() => setRating(0)}
              className="ml-2 text-xs text-slate-400 underline hover:text-slate-600"
            >
              クリア
            </button>
          )}
        </div>
      </div>

      {/*  価格帯 */}
      <div className="space-y-2">
        <PriceSelector value={price} isFilter={false} onChange={setPrice} />
      </div>

      <div className="space-y-2">
        <label className="border-l-4 border-slate-950 pl-2 text-sm font-bold">カテゴリー</label>
        <div className="flex flex-wrap gap-2 pt-1">
          {(Object.keys(GOOGLE_PLACE_CATEGORIES) as GooglePlaceCategoryKey[]).map((key) => {
            const label = GOOGLE_PLACE_CATEGORIES[key];
            const isSelected = selectedCategories.includes(key);

            return (
              <TagButton
                key={key}
                tagColor="primary"
                isActive={isSelected}
                onClick={() => toggleCategorySelection(key)}
                className="h-auto cursor-pointer rounded-full text-sm font-medium"
              >
                {label}
              </TagButton>
            );
          })}
        </div>
      </div>

      {/*  タグ */}
      <div className="space-y-2">
        <div className="space-y-6">
          {tagGroups.map((group, index) => {
            const variantColor = colors[(index % colors.length) + 1];
            return (
              <CategorizedTags
                key={group.category.id}
                categoryName={group.category.name}
                tags={group.tags}
                variant={variantColor}
                selectedTags={selectedTagIds}
                onTagToggle={toggleTagSelection}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
