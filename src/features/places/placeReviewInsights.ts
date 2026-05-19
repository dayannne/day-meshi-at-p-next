import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/types";

import type { PlacePopularReviewTag } from "./types";

const DEFAULT_POPULAR_REVIEW_TAGS_LIMIT = 4;

function normalizeLimit(limit: number | undefined): number {
  return Number.isInteger(limit) && limit && limit > 0 ? limit : DEFAULT_POPULAR_REVIEW_TAGS_LIMIT;
}

export async function getPlacePopularReviewTags(
  supabase: SupabaseClient<Database>,
  placeId: string,
  limit = DEFAULT_POPULAR_REVIEW_TAGS_LIMIT
): Promise<PlacePopularReviewTag[]> {
  const normalizedPlaceId = placeId.trim();

  if (!normalizedPlaceId) {
    return [];
  }

  const { data, error } = await supabase.rpc("get_place_popular_review_tags", {
    p_place_id: normalizedPlaceId,
    p_limit: normalizeLimit(limit),
  });

  if (error) {
    throw new Error("Failed to load popular review tags.");
  }

  return (data ?? []).map((tag) => ({
    id: tag.id,
    name: tag.name,
    emoji: tag.emoji,
    categoryId: tag.category_id,
    reviewCount: tag.review_count,
  }));
}
