"use client";

import React, { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, Plus, Search, Star } from "lucide-react";
import { PlaceList } from "@/features/places/components/PlaceList";
import { FilterList } from "./FilterList";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Place } from "@/features/places/types";
import { TagButton } from "@/components/ui/TagButton";
import { Checkbox } from "@/components/ui/Checkbox";
import { useFilterNavigation } from "../hooks/useFilterNavigation";
import { Paginator } from "@/components/ui/Paginator";

// 価格帯の表示ラベル用マスター
const PRICE_LEVELS = [
  { value: 1, label: "〜¥1,000" },
  { value: 2, label: "¥1,000〜¥3,000" },
  { value: 3, label: "¥3,000〜¥5,000" },
  { value: 4, label: "¥5,000〜¥10,000" },
  { value: 5, label: "¥10,000〜" },
];
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

interface ExploreLeftPanelProps {
  places: Place[];
  pagination: {
    page: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    totalCount: number;
  };
  newPlaceReviewHref: string;
  placeDetailHrefs: Record<string, string>;
}

export function ExploreLeftPanel({
  places,
  pagination,
  newPlaceReviewHref,
  placeDetailHrefs,
}: ExploreLeftPanelProps) {
  const [activeView, setActiveView] = useState<"list" | "filter">("list");

  const {
    rating,
    price,
    selectedCategories,
    isGochimeshi,
    selectedTags,
    setRating,
    setPrice,
    toggleCategorySelection,
    toggleGochimeshi,
    toggleTagSelection,
  } = useFilterNavigation();

  // 現在の価格帯とカテゴリーのラベルを取得
  const currentPriceLevel = PRICE_LEVELS.find((level) => level.value === price);
  // 表示判定用のフラグ（カテゴリー配列に中身があるかチェック）
  const hasActiveFilters =
    price !== null || rating > 0 || selectedCategories.length > 0 || selectedTags.length > 0;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden bg-white">
      {/* タイトルと検索バー・ボタン */}
      <div className="flex flex-col gap-4 border-b border-slate-200 p-4">
        <div className="flex items-center justify-between gap-3">
          <h1 className="bg-primary-linear bg-clip-text text-4xl font-black text-transparent">
            Meshi At Play
          </h1>
          <Button asChild size="sm" className="gap-2">
            <Link href={newPlaceReviewHref} scroll={false}>
              <Plus className="size-4" aria-hidden="true" />
              新しいレビュー
            </Link>
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 z-5 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="お店を検索..."
            autoComplete="off"
            className="border-slate-300 py-2 pr-4 pl-10 placeholder:text-slate-950"
          />
        </div>
      </div>

      {/* フィルターヘッダー */}
      <div
        onClick={() => setActiveView(activeView === "list" ? "filter" : "list")}
        className="flex cursor-pointer flex-row items-center justify-between border-b border-slate-200 bg-white p-4 transition-colors duration-150 select-none hover:bg-slate-50"
      >
        {/* 左側：アイコンと「フィルター」の文言 */}
        <div className="flex flex-row items-center gap-3">
          <SlidersHorizontal className="text-primary h-5 w-5" />
          <span className="text-sm font-bold text-slate-950">フィルター</span>
        </div>

        {/* 右側：ボタンタグを廃止し、クリック領域を邪魔しないテキスト（span）に変更 */}
        <span className="flex h-auto w-16 shrink-0 items-center justify-end p-0 text-sm font-medium text-slate-500">
          {activeView === "list" ? "開く" : "閉じる"}
        </span>
      </div>

      {/* 選択中のフィルター表示エリア */}
      <div className="flex flex-col gap-3 border-b border-slate-200 bg-white p-4">
        <h3 className="text-primary text-sm font-semibold">選択中のフィルター</h3>
        <div className="flex flex-row items-center gap-2 font-medium text-slate-950">
          <Checkbox
            id="gotimeshi"
            className="border-primary"
            checked={isGochimeshi}
            onCheckedChange={(checked) => toggleGochimeshi(!!checked)}
          />
          <label htmlFor="gotimeshi" className="cursor-pointer text-sm">
            ごちめし利用可
          </label>
        </div>

        {/* 動的バッジ表示エリア */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-1">
            {/* 1. 価格帯 */}
            {price !== null && currentPriceLevel && (
              <TagButton onClick={() => setPrice(null)} tagColor={"neutral"}>
                <span>{currentPriceLevel.label}</span>
                <span className="text-neutral ml-1 font-bold">×</span>
              </TagButton>
            )}

            {/* 2. カテゴリー */}
            {selectedCategories.map((catKey) => {
              const label = GOOGLE_PLACE_CATEGORIES[catKey];
              return (
                <TagButton
                  key={catKey}
                  tagColor={"primary"}
                  onClick={() => toggleCategorySelection(catKey)}
                >
                  <span>{label}</span>
                  <span className="ml-1 font-bold text-slate-400 hover:text-slate-600">×</span>
                </TagButton>
              );
            })}

            {/* 3. 星評価（レート） */}
            {rating > 0 && (
              <TagButton
                onClick={() => setRating(0)}
                className="flex cursor-pointer items-center gap-1 border-yellow-200 bg-yellow-50 text-yellow-700"
              >
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                <span>{rating}.0 〜</span>
                <span className="ml-1 font-bold text-yellow-400 hover:text-yellow-600">×</span>
              </TagButton>
            )}

            {/* 4. タグ */}
            {selectedTags.map((tag) => (
              <TagButton key={tag.id} tagColor={"neutral"} onClick={() => toggleTagSelection(tag)}>
                {tag.emoji && <span className="mr-0.5">{tag.emoji}</span>}
                <span>{tag.name}</span>
                <span className="text-primary ml-1 font-bold">×</span>
              </TagButton>
            ))}
          </div>
        )}
      </div>

      {/* 動的コンテンツエリア */}
      {activeView === "filter" ? (
        <div className="flex-1 overflow-y-auto p-5">
          <FilterList onClose={() => setActiveView("list")} />
        </div>
      ) : (
        <>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
            <p className="p-4 pb-3 text-sm font-semibold text-slate-950">
              お店一覧 ({pagination.totalCount}件)
            </p>
            <div className="flex-1 overflow-y-auto px-4 pb-3">
              <PlaceList places={places} placeDetailHrefs={placeDetailHrefs} />
            </div>
          </div>
          <Paginator pagination={pagination} baseUrl="/home/places" />
        </>
      )}
    </div>
  );
}
