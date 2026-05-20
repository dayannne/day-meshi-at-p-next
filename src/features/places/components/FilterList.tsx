"use client";

import React from "react";
import { Star } from "lucide-react";
import { CategorizedTags } from "@/features/tag/components/CategorizedTags";
import { PriceSelector } from "@/features/review/components/PriceSelector";
import { StarRating } from "@/features/review/components/StarRating";
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
    selectedTags,
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
        <div className="flex items-center gap-2">
          <div className="bg-secondary h-5 w-1.5 rounded-full" /> {/* 縦線 */}
          <h3 className="text-sm text-slate-950">レート</h3>
        </div>
        <div className="flex items-center gap-1 pt-1">
          <StarRating rating={rating} size={32} onSelect={(star) => setRating(star)} />

          {rating > 0 && (
            <button
              type="button"
              onClick={() => setRating(0)}
              className="ml-2 cursor-pointer text-xs text-slate-400 underline hover:text-slate-600"
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
        <div className="flex items-center gap-2">
          <div className="bg-primary h-5 w-1.5 rounded-full" /> {/* 縦線 */}
          <h3 className="text-sm text-slate-950">カテゴリ</h3>
        </div>
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
                selectedTags={selectedTags}
                onTagToggle={toggleTagSelection}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
