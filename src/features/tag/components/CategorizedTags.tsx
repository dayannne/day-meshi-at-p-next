"use client";

import { TagButton } from "@/components/ui/TagButton";
import { cn } from "@/lib/utils";
import { Tag } from "../types";

interface CategorizedTagsProps {
  categoryName: string;
  tags: Tag[];
  variant?: "primary" | "secondary" | "tertiary" | "neutral";
  selectedTags?: Tag[];
  onTagToggle?: (tagName: Tag) => void;
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className={cn("h-5 w-1.5 rounded-full", variantStyles[variant])} /> {/* 縦線 */}
        <h3 className="text-sm text-slate-950">{categoryName}</h3>
      </div>

      {/* タグ一覧レイアウト */}
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => {
          const isSelected = selectedTags.some((t) => t.id === tag.id);

          // TagButton を使用
          return (
            <TagButton
              key={tag.id}
              tagColor={variant}
              isActive={isSelected}
              onClick={() => onTagToggle?.(tag)}
              className="h-auto rounded-full text-sm font-medium"
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
