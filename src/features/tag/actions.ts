"use server";

import type { Tag, TagCategory, TagGroup } from "@/features/tag/types";
import { createClient } from "@/lib/supabase/server";

function toTagCategory(category: { id: string; name: string }): TagCategory {
  return {
    id: category.id,
    name: category.name,
  };
}

function toTag(tag: { id: string; name: string; category_id: string; emoji: string | null }): Tag {
  return {
    id: tag.id,
    name: tag.name,
    categoryId: tag.category_id,
    emoji: tag.emoji,
  };
}

export async function getTagGroupsAction(): Promise<TagGroup[]> {
  const supabase = await createClient();

  const { data: categories, error: categoriesError } = await supabase
    .from("tag_categories")
    .select("id, name")
    .order("name", { ascending: true });

  if (categoriesError) {
    throw new Error("Failed to load tag categories.");
  }

  const { data: tags, error: tagsError } = await supabase
    .from("tags")
    .select("id, name, category_id, emoji")
    .order("name", { ascending: true });

  if (tagsError) {
    throw new Error("Failed to load tags.");
  }

  const tagsByCategoryId = tags.reduce<Record<string, Tag[]>>((acc, tag) => {
    const normalizedTag = toTag(tag);

    acc[normalizedTag.categoryId] = acc[normalizedTag.categoryId] ?? [];
    acc[normalizedTag.categoryId].push(normalizedTag);

    return acc;
  }, {});

  return categories.map((category) => {
    const normalizedCategory = toTagCategory(category);

    return {
      category: normalizedCategory,
      tags: tagsByCategoryId[normalizedCategory.id] ?? [],
    };
  });
}
