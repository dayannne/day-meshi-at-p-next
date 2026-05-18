"use server";

import { revalidatePath } from "next/cache";

import { requireActiveUser } from "@/features/auth/access";
import { fetchGooglePlaceDetails, type GooglePlaceDetails } from "@/features/places/googlePlaces";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type CreateReviewWithPlaceInput = {
  googlePlaceId: string;
  placeSessionToken: string;
  rating: number;
  priceRange: number | null;
  comment: string;
  visitDate: string | null;
  tagIds: string[];
};

export type CreateReviewWithPlaceResult =
  | {
      success: true;
      placeId: string;
      reviewId: string;
    }
  | {
      success: false;
      error: string;
    };

function isRating(value: number): boolean {
  return Number.isInteger(value) && value >= 1 && value <= 5;
}

function isPriceRange(value: number | null): boolean {
  return value === null || (Number.isInteger(value) && value >= 1 && value <= 5);
}

function normalizeVisitDate(value: string | null): string | null {
  return value && /^\d{4}-\d{2}-\d{2}$/.test(value) ? value : null;
}

async function upsertPlaceFromGoogleDetails(details: GooglePlaceDetails): Promise<string> {
  const admin = createAdminClient();
  const { data: place, error } = await admin
    .from("places")
    .upsert(
      {
        google_place_id: details.placeId,
        name: details.name,
        category: details.category,
        lat: details.lat,
        lng: details.lng,
      },
      {
        onConflict: "google_place_id",
      }
    )
    .select("id")
    .single();

  if (error) {
    throw new Error("Failed to save place.");
  }

  return place.id;
}

async function refreshPlaceRating(placeId: string) {
  const admin = createAdminClient();
  const { data: reviews, error: reviewsError } = await admin
    .from("reviews")
    .select("rating")
    .eq("place_id", placeId);

  if (reviewsError) {
    throw new Error("Failed to recalculate place rating.");
  }

  const reviewCount = reviews.length;
  const avgRating =
    reviewCount === 0
      ? 0
      : Number((reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount).toFixed(2));

  const { error: placeError } = await admin
    .from("places")
    .update({
      avg_rating: avgRating,
      review_count: reviewCount,
    })
    .eq("id", placeId);

  if (placeError) {
    throw new Error("Failed to update place rating.");
  }
}

async function deleteReview(reviewId: string) {
  const supabase = await createClient();

  await supabase.from("reviews").delete().eq("id", reviewId);
}

export async function createReviewWithPlaceAction(
  input: CreateReviewWithPlaceInput
): Promise<CreateReviewWithPlaceResult> {
  const user = await requireActiveUser();

  if (!input.googlePlaceId || !input.placeSessionToken) {
    return { success: false, error: "お店を選択してください。" };
  }

  if (!isRating(input.rating)) {
    return { success: false, error: "レートを選択してください。" };
  }

  if (!isPriceRange(input.priceRange)) {
    return { success: false, error: "価格帯を選択してください。" };
  }

  try {
    const placeDetails = await fetchGooglePlaceDetails({
      placeId: input.googlePlaceId,
      sessionToken: input.placeSessionToken,
    });
    const placeId = await upsertPlaceFromGoogleDetails(placeDetails);
    const supabase = await createClient();
    const { data: review, error: reviewError } = await supabase
      .from("reviews")
      .insert({
        user_id: user.userId,
        place_id: placeId,
        rating: input.rating,
        price_range: input.priceRange,
        comment: input.comment.trim() || null,
        visited_at: normalizeVisitDate(input.visitDate),
      })
      .select("id")
      .single();

    if (reviewError) {
      throw new Error("Failed to create review.");
    }

    const tagIds = Array.from(new Set(input.tagIds.filter(Boolean)));

    if (tagIds.length > 0) {
      const { error: reviewTagsError } = await supabase.from("review_tags").insert(
        tagIds.map((tagId) => ({
          review_id: review.id,
          tag_id: tagId,
        }))
      );

      if (reviewTagsError) {
        await deleteReview(review.id);
        throw new Error("Failed to create review tags.");
      }
    }

    await refreshPlaceRating(placeId);
    revalidatePath("/home/places");

    return {
      success: true,
      placeId,
      reviewId: review.id,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "レビューの投稿に失敗しました。",
    };
  }
}
