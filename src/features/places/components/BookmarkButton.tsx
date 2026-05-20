"use client";

import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBookmarkToggle } from "../hooks/useBookmarkToggle";
import { Button } from "@/components/ui/Button";

type Props = {
  placeId: string;
  isBookmarked: boolean;
  bookmarkCount?: number;
  variant?: "icon" | "extended";
  className?: string;
};

export function BookmarkButton({
  placeId,
  isBookmarked,
  bookmarkCount = 0,
  variant = "icon",
  className,
}: Props) {
  const { toggleBookmark, isPending } = useBookmarkToggle(placeId, isBookmarked);

  if (variant === "extended") {
    return (
      <Button
        variant="outline"
        onClick={toggleBookmark}
        disabled={isPending}
        size="sm"
        className={cn("gap-2", isPending && "opacity-50", className)}
        aria-label={isBookmarked ? "ブックマーク解除" : "ブックマーク登録"}
      >
        <Bookmark
          className={cn(
            "h-4 w-4 transition-colors",
            isBookmarked ? "fill-primary stroke-primary" : "text-slate-400"
          )}
        />
        <span
          className={cn("text-sm font-medium", isBookmarked ? "text-primary" : "text-slate-600")}
        >
          {bookmarkCount}
        </span>
      </Button>
    );
  }

  return (
    <button
      onClick={toggleBookmark}
      disabled={isPending}
      className={cn("cursor-pointer", isPending && "opacity-50", className)}
      aria-label={isBookmarked ? "ブックマーク解除" : "ブックマーク登録"}
    >
      <Bookmark
        className={cn(
          "h-5 w-5 transition-colors",
          isPending && "fill-primary-background",
          isBookmarked
            ? "fill-primary stroke-primary"
            : "hover:fill-primary-background text-slate-400"
        )}
      />
    </button>
  );
}
