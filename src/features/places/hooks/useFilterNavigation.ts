import { useEffect, useState } from "react";
import { Tag, TagGroup } from "@/features/tag/types";
import { useRouter, useSearchParams } from "next/navigation";
import { getTagGroupsAction } from "@/features/tag/actions";

export const useFilterNavigation = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLから値を取るロジック
  const rating = Number(searchParams.get("rating")) || 0;
  const price = searchParams.get("price") ? Number(searchParams.get("price")) : null;
  const isGochimeshi = searchParams.get("gotimeshi") === "true";
  const selectedTagIds = searchParams.getAll("tags");
  const category = searchParams.get("category") || null;
  const [tagGroups, setTagGroups] = useState<TagGroup[]>([]);
  const [isTagsLoading, setIsTagsLoading] = useState(true);

  // URLを更新する共通のヘルパー
  const updateURL = (params: URLSearchParams) => {
    router.push(`?${params.toString()}`, { scroll: false });
  };

  // 2. 各更新関数
  const setRating = (newRating: number) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newRating > 0) params.set("rating", String(newRating));
    else params.delete("rating");
    updateURL(params);
  };

  const setPrice = (newPrice: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newPrice) params.set("price", String(newPrice));
    else params.delete("price");
    updateURL(params);
  };

  const toggleGochimeshi = (checked: boolean) => {
    const params = new URLSearchParams(searchParams.toString());
    if (checked) {
      params.set("gotimeshi", "true");
    } else {
      params.delete("gotimeshi");
    }
    updateURL(params);
  };

  const setCategory = (newCategory: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newCategory) {
      params.set("category", newCategory);
    } else {
      params.delete("category");
    }
    updateURL(params);
  };

  // タグの追加と削除
  const toggleTagSelection = (tag: string | Tag) => {
    const params = new URLSearchParams(searchParams.toString());
    const tagId = typeof tag === "string" ? tag : tag.id;
    const currentTags = params.getAll("tags");

    if (currentTags.includes(tagId)) {
      const filteredTags = currentTags.filter((id) => id !== tagId);
      params.delete("tags");
      filteredTags.forEach((id) => params.append("tags", id));
    } else {
      params.append("tags", tagId);
    }
    updateURL(params);
  };
  useEffect(() => {
    async function loadTags() {
      try {
        const data = await getTagGroupsAction();
        setTagGroups(data);
      } catch (e) {
        console.error(e);
      } finally {
        setIsTagsLoading(false);
      }
    }
    loadTags();
  }, []);

  const flatTags = tagGroups.flatMap((group) => group.tags);
  const selectedTags = flatTags.filter((tag) => selectedTagIds.includes(tag.id));

  return {
    rating,
    price,
    isGochimeshi,
    selectedTagIds,
    category,
    tagGroups, // 💡 カテゴリ一覧の描画用に使う
    selectedTags, // 💡 選択中のバッジ（名前・絵文字付き）の描画用に使う
    isTagsLoading,
    setRating,
    setPrice,
    setCategory,
    toggleGochimeshi,
    toggleTagSelection,
  };
};
