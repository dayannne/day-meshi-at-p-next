"use client";

import React from "react";
import { Star } from "lucide-react";
import { CategorizedTags } from "@/features/tag/components/CategorizedTags";
import { PriceSelector } from "@/features/review/components/PriceSelector";
import { useFilterNavigation } from "../hooks/useFilterNavigation";

interface FilterListProps {
  onClose: () => void;
}

export function FilterList({ onClose }: FilterListProps) {
  const {
    rating,
    price,
    selectedTagIds,
    category,
    tagGroups,
    isTagsLoading,
    setRating,
    setPrice,
    setCategory,
    toggleTagSelection,
  } = useFilterNavigation();

  const colors: ("primary" | "secondary" | "tertiary")[] = ["primary", "secondary", "tertiary"];

  // 💡 ② ローディングの判定も、フックから降ってきた状態（isTagsLoading）を見るだけ！
  if (isTagsLoading) return <div className="text-sm text-slate-500">タグを読み込み中...</div>;

  return (
    <div className="flex flex-col space-y-4 pt-2">
      <div className="space-y-2">
        <PriceSelector value={price} isFilter={false} onChange={setPrice} />
      </div>

      <div className="space-y-2">
        <div className="space-y-6">
          {tagGroups.map((group, index) => {
            const variantColor = colors[index % colors.length];
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

      {/* 3. 評価（レート） */}
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
    </div>
  );
}
