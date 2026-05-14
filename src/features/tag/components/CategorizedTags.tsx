"use client";

import { TagButton } from "@/components/ui/TagButton";
import { cn } from "@/lib/utils";
import { TagItem } from "../types"; // 型を別出ししておくと便利

interface CategorizedTagsProps {
  categoryName: string;
  tags: TagItem[];
  variant?: "primary" | "secondary" | "tertiary" | "neutral";
  selectedTags?: TagItem[]; // 選択状態の管理用
  onTagToggle?: (tagName: TagItem) => void;
}

export const CategorizedTags = ({
  categoryName,
  tags,
  variant = "primary",
  selectedTags = [],
  onTagToggle,
}: CategorizedTagsProps) => {
  const variantStyles = {
    primary: "bg-primary",
    secondary: "bg-secondary",
    tertiary: "bg-tertiary",
    neutral: "bg-neutral",
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <div className={cn("h-5 w-1.5 rounded-full", variantStyles[variant])} /> {/* 縦線 */}
        <h3 className="text-lg text-slate-950">{categoryName}</h3>
      </div>

      {/* タグ一覧レイアウト */}
      <div className="flex flex-wrap gap-x-3 gap-y-3">
        {tags.map((tag) => {
          const isSelected = selectedTags.some((t) => t.id === tag.id);

          // TagButton を使用
          return (
            <TagButton
              key={tag.id}
              tagColor={variant}
              isActive={isSelected}
              onClick={() => onTagToggle?.(tag)}
              className="h-auto rounded-full px-5 py-2 text-base font-semibold" // 画像のような丸みとサイズ感
            >
              {tag.emoji && <span className="mr-1">{tag.emoji}</span>}
              {tag.name}
            </TagButton>
          );
        })}
      </div>
    </div>
  );
};
