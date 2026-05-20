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

type GetPlacesActionParams = {
  page?: number;
  pageSize?: number;
  rating?: number;
  price?: number | null;
  categories?: string[];
  tags?: string[];
  isGochimeshi?: boolean;
};

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

type ReviewPreviewRow = {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  profiles: EmbeddedReviewPreviewProfile | EmbeddedReviewPreviewProfile[] | null;
};

type EmbeddedReviewPreviewProfile = {
  nickname: string | null;
};

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value && value > 0 ? value : fallback;
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

function getReviewPreviewAuthorName(row: ReviewPreviewRow): string {
  const profile = Array.isArray(row.profiles) ? row.profiles[0] : row.profiles;

  return profile?.nickname ?? "社員";
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
  const { data, error, count } = await supabase
    .from("places")
    .select(PLACES_SELECT_COLUMNS, { count: "exact" })
    .order("avg_rating", { ascending: false })
    .order("id", { ascending: true })
    .range(from, to);

  if (error) {
    throw new Error("Failed to load places.");
  }

  const totalCount = count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / normalizedPageSize));

  if (normalizedPage > totalPages) {
    return getPlacesAction({
      page: totalPages,
      pageSize: normalizedPageSize,
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
    authorName: getReviewPreviewAuthorName(review),
    rating: review.rating,
    comment: review.comment?.trim() || "コメントなし",
    date: review.created_at,
  }));
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
