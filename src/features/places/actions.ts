"use server";

import {
  fetchGooglePlaceBusinessDetails,
  type GooglePlacePhotoAttribution,
} from "@/features/places/googlePlaces";
import { getPlacePopularReviewTags } from "@/features/places/placeReviewInsights";
import type {
  Place,
  PlaceGoogleBusinessDetails,
  PlacePopularReviewTag,
  PlaceReview,
  PlaceReviewPreview,
} from "@/features/places/types";
import { requireActiveUser } from "@/features/auth/access";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";

const PLACES_SELECT_COLUMNS = `
  id,
  google_place_id,
  name,
  category,
  price_range,
  lat,
  lng,
  image_url,
  photo_attributions,
  is_gochimeshi,
  avg_rating,
  review_count,
  distance_from_office_meters,
  walking_duration_seconds
`;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;
const POPULAR_REVIEW_TAGS_LIMIT = 4;
const PLACE_REVIEW_PREVIEWS_LIMIT = 3;
const REVIEW_PAGE_SIZE = 10;

type GetPlacesActionParams = {
  page?: number;
  pageSize?: number;
  rating?: number;
  price?: number | null;
  categories?: string[];
  tags?: string[];
  isGochimeshi?: boolean;
};

type GetPlaceReviewsActionParams = {
  offset?: number;
  limit?: number;
  sort?: PlaceReviewSort;
};

export type PlaceReviewSort = "latest" | "rating";

type PlacesPagination = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

type GetPlacesActionResult = {
  places: Place[];
  pagination: PlacesPagination;
};

export type GetPlaceReviewsActionResult = {
  reviews: PlaceReview[];
  hasMore: boolean;
  nextOffset: number;
};

type ReviewPreviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
} & ReviewAuthorRow;

type PlaceReviewRow = {
  id: string;
  user_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
} & ReviewAuthorRow;

type ReviewAuthorRow = {
  profiles: EmbeddedReviewProfile | EmbeddedReviewProfile[] | null;
};

type EmbeddedReviewProfile = {
  nickname: string | null;
};

type ReviewTagRow = {
  review_id: string;
  tags: EmbeddedReviewTag | EmbeddedReviewTag[] | null;
};

type EmbeddedReviewTag = {
  name: string | null;
  emoji: string | null;
};

type ReviewLikeRow = {
  review_id: string;
  user_id: string;
};

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value && value > 0 ? value : fallback;
}

function normalizeNonNegativeInteger(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value !== undefined && value >= 0 ? value : fallback;
}

function toPhotoAttributions(value: Json): GooglePlacePhotoAttribution[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((attribution): GooglePlacePhotoAttribution | null => {
      if (
        !attribution ||
        typeof attribution !== "object" ||
        Array.isArray(attribution) ||
        typeof attribution.displayName !== "string"
      ) {
        return null;
      }

      return {
        displayName: attribution.displayName,
        uri: typeof attribution.uri === "string" ? attribution.uri : null,
        photoUri: typeof attribution.photoUri === "string" ? attribution.photoUri : null,
      };
    })
    .filter((attribution): attribution is GooglePlacePhotoAttribution => attribution !== null);
}

function toPlace(place: {
  id: string;
  google_place_id: string;
  name: string;
  category: string | null;
  price_range: number | null;
  lat: number;
  lng: number;
  image_url: string | null;
  photo_attributions: Json;
  is_gochimeshi: boolean;
  avg_rating: number;
  review_count: number;
  distance_from_office_meters: number | null;
  walking_duration_seconds: number | null;
}): Place {
  return {
    id: place.id,
    googlePlaceId: place.google_place_id,
    name: place.name,
    category: place.category,
    price_range: place.price_range,
    lat: place.lat,
    lng: place.lng,
    imageUrl: place.image_url,
    photoAttributions: toPhotoAttributions(place.photo_attributions),
    isGochimeshi: place.is_gochimeshi,
    avgRating: place.avg_rating,
    reviewCount: place.review_count,
    distanceFromOfficeMeters: place.distance_from_office_meters,
    walkingDurationSeconds: place.walking_duration_seconds,
  };
}

async function fetchNullableGoogleBusinessDetails(
  googlePlaceId: string
): Promise<PlaceGoogleBusinessDetails | null> {
  try {
    return await fetchGooglePlaceBusinessDetails(googlePlaceId);
  } catch {
    return null;
  }
}

function getReviewAuthorName(row: ReviewAuthorRow): string {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return profile?.nickname ?? "社員";
}

function getReviewTagLabel(row: ReviewTagRow): string | null {
  const tag = Array.isArray(row.tags) ? row.tags[0] : row.tags;
  const name = tag?.name?.trim();

  if (!name) {
    return null;
  }

  return tag?.emoji ? `${tag.emoji} ${name}` : name;
}

export async function getPlacesAction({
  page,
  pageSize,
  rating,
  price,
  categories,
  tags,
  isGochimeshi,
}: GetPlacesActionParams = {}): Promise<GetPlacesActionResult> {
  const normalizedPage = normalizePositiveInteger(page, DEFAULT_PAGE);
  const normalizedPageSize = normalizePositiveInteger(pageSize, DEFAULT_PAGE_SIZE);
  const from = (normalizedPage - 1) * normalizedPageSize;
  const to = from + normalizedPageSize - 1;

  const supabase = await createClient();
  let query = supabase.from("places").select(PLACES_SELECT_COLUMNS, { count: "exact" });

  if (rating && rating > 0) {
    query = query.gte("avg_rating", rating);
  }
  if (price !== undefined && price !== null) {
    query = query.eq("price_range", price);
  }
  if (categories && categories.length > 0) {
    query = query.in("category", categories);
  }
  if (isGochimeshi === true) {
    query = query.eq("is_gochimeshi", true);
  }
  if (tags && tags.length > 0) {
    query = query.select(`${PLACES_SELECT_COLUMNS}, reviews!inner(review_tags!inner(tag_id))`);
    query = query.in("reviews.review_tags.tag_id", tags);
  }

  const { data, error, count } = await query
    .order("avg_rating", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    console.error("【Supabaseデバッグ】エラーの全貌:", error);
    throw new Error("Failed to load places.");
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / normalizedPageSize));

  if (normalizedPage > totalPages) {
    return getPlacesAction({
      page: totalPages,
      pageSize: normalizedPageSize,
      rating,
      price,
      categories,
      tags,
      isGochimeshi,
    });
  }

  return {
    places: data.map(toPlace),
    pagination: {
      page: normalizedPage,
      pageSize: normalizedPageSize,
      totalCount,
      totalPages,
      hasPreviousPage: normalizedPage > 1,
      hasNextPage: normalizedPage < totalPages,
    },
  };
}

export async function getPlaceAction(placeId: string): Promise<Place | null> {
  const normalizedPlaceId = placeId.trim();

  if (!normalizedPlaceId) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select(PLACES_SELECT_COLUMNS)
    .eq("id", normalizedPlaceId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load place.");
  }

  return data ? toPlace(data) : null;
}

export async function getPlacePopularReviewTagsAction(
  placeId: string
): Promise<PlacePopularReviewTag[]> {
  const normalizedPlaceId = placeId.trim();

  if (!normalizedPlaceId) {
    return [];
  }

  const supabase = await createClient();

  return getPlacePopularReviewTags(supabase, normalizedPlaceId, POPULAR_REVIEW_TAGS_LIMIT);
}

export async function getPlaceReviewPreviewsAction(placeId: string): Promise<PlaceReviewPreview[]> {
  const normalizedPlaceId = placeId.trim();

  if (!normalizedPlaceId) {
    return [];
  }

  await requireActiveUser();

  const admin = createAdminClient();
  const { data: reviews, error: reviewsError } = await admin
    .from("reviews")
    .select(
      `
        id,
        rating,
        comment,
        created_at,
        profiles!reviews_user_id_fkey (
          nickname
        )
      `
    )
    .eq("place_id", normalizedPlaceId)
    .order("created_at", { ascending: false })
    .order("id", { ascending: true })
    .limit(PLACE_REVIEW_PREVIEWS_LIMIT);

  if (reviewsError) {
    throw new Error("Failed to load review previews.");
  }

  const reviewRows = (reviews ?? []) as ReviewPreviewRow[];

  return reviewRows.map((review) => ({
    id: review.id,
    authorName: getReviewAuthorName(review),
    rating: review.rating,
    comment: review.comment?.trim() || "コメントなし",
    date: review.created_at,
  }));
}

export async function getPlaceReviewsAction(
  placeId: string,
  { offset, limit, sort }: GetPlaceReviewsActionParams = {}
): Promise<GetPlaceReviewsActionResult> {
  const normalizedPlaceId = placeId.trim();

  if (!normalizedPlaceId) {
    return {
      reviews: [],
      hasMore: false,
      nextOffset: 0,
    };
  }

  const normalizedOffset = normalizeNonNegativeInteger(offset, 0);
  const normalizedLimit = normalizePositiveInteger(limit, REVIEW_PAGE_SIZE);
  const normalizedSort: PlaceReviewSort = sort === "rating" ? "rating" : "latest";
  const user = await requireActiveUser();
  const admin = createAdminClient();
  let reviewsQuery = admin
    .from("reviews")
    .select(
      `
        id,
        user_id,
        rating,
        comment,
        created_at,
        profiles!reviews_user_id_fkey (
          nickname
        )
      `
    )
    .eq("place_id", normalizedPlaceId);

  reviewsQuery =
    normalizedSort === "rating"
      ? reviewsQuery
          .order("rating", { ascending: false })
          .order("created_at", { ascending: false })
          .order("id", { ascending: true })
      : reviewsQuery.order("created_at", { ascending: false }).order("id", { ascending: true });

  const { data: reviews, error: reviewsError } = await reviewsQuery.range(
    normalizedOffset,
    normalizedOffset + normalizedLimit
  );

  if (reviewsError) {
    throw new Error("Failed to load place reviews.");
  }

  const fetchedReviewRows = (reviews ?? []) as PlaceReviewRow[];
  const hasMore = fetchedReviewRows.length > normalizedLimit;
  const reviewRows = fetchedReviewRows.slice(0, normalizedLimit);

  if (reviewRows.length === 0) {
    return {
      reviews: [],
      hasMore: false,
      nextOffset: normalizedOffset,
    };
  }

  const reviewIds = reviewRows.map((review) => review.id);
  const [reviewTagsResult, reviewLikesResult] = await Promise.all([
    admin
      .from("review_tags")
      .select(
        `
          review_id,
          tags!review_tags_tag_id_fkey (
            name,
            emoji
          )
        `
      )
      .in("review_id", reviewIds),
    admin.from("review_likes").select("review_id, user_id").in("review_id", reviewIds),
  ]);

  if (reviewTagsResult.error) {
    throw new Error("Failed to load review tags.");
  }

  if (reviewLikesResult.error) {
    throw new Error("Failed to load review likes.");
  }

  const tagsByReviewId = new Map<string, string[]>();
  const likeCountsByReviewId = new Map<string, number>();
  const likedReviewIds = new Set<string>();

  for (const reviewTag of (reviewTagsResult.data ?? []) as ReviewTagRow[]) {
    const tagLabel = getReviewTagLabel(reviewTag);

    if (!tagLabel) {
      continue;
    }

    const tags = tagsByReviewId.get(reviewTag.review_id) ?? [];

    tags.push(tagLabel);
    tagsByReviewId.set(reviewTag.review_id, tags);
  }

  for (const like of (reviewLikesResult.data ?? []) as ReviewLikeRow[]) {
    likeCountsByReviewId.set(like.review_id, (likeCountsByReviewId.get(like.review_id) ?? 0) + 1);

    if (like.user_id === user.userId) {
      likedReviewIds.add(like.review_id);
    }
  }

  return {
    reviews: reviewRows.map((review) => ({
      id: review.id,
      authorId: review.user_id,
      authorName: getReviewAuthorName(review),
      rating: review.rating,
      comment: review.comment?.trim() || "コメントなし",
      date: review.created_at,
      tags: tagsByReviewId.get(review.id) ?? [],
      initialLikeCount: likeCountsByReviewId.get(review.id) ?? 0,
      initialIsLiked: likedReviewIds.has(review.id),
    })),
    hasMore,
    nextOffset: normalizedOffset + reviewRows.length,
  };
}

export async function getPlaceGoogleBusinessDetailsAction(
  placeId: string
): Promise<PlaceGoogleBusinessDetails | null> {
  const normalizedPlaceId = placeId.trim();

  if (!normalizedPlaceId) {
    return null;
  }

  const supabase = await createClient();
  const { data: place, error } = await supabase
    .from("places")
    .select("google_place_id")
    .eq("id", normalizedPlaceId)
    .maybeSingle();

  if (error) {
    throw new Error("Failed to load place Google Place ID.");
  }

  if (!place?.google_place_id) {
    return null;
  }

  return fetchNullableGoogleBusinessDetails(place.google_place_id);
}
