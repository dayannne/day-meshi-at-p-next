"use server";

import type { GooglePlacePhotoAttribution } from "@/features/places/googlePlaces";
import type { Place, PlacePopularReviewTag } from "@/features/places/types";
import type { Json } from "@/lib/supabase/types";
import { createClient } from "@/lib/supabase/server";

const PLACES_SELECT_COLUMNS = `
  id,
  google_place_id,
  name,
  category,
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
const REVIEW_TAGS_PAGE_SIZE = 1000;

type GetPlacesActionParams = {
  page?: number;
  pageSize?: number;
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

type EmbeddedReviewTagTag = {
  id: string;
  name: string;
  emoji: string | null;
  category_id: string;
};

type ReviewTagWithTag = {
  tags: EmbeddedReviewTagTag | EmbeddedReviewTagTag[] | null;
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

function getEmbeddedReviewTagTag(row: ReviewTagWithTag): EmbeddedReviewTagTag | null {
  if (Array.isArray(row.tags)) {
    return row.tags[0] ?? null;
  }

  return row.tags;
}

export async function getPlacesAction({
  page,
  pageSize,
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
  const tagsById = new Map<string, PlacePopularReviewTag>();
  let from = 0;

  while (true) {
    const { data, error } = await supabase
      .from("review_tags")
      .select(
        `
          tags!inner (
            id,
            name,
            emoji,
            category_id
          ),
          reviews!inner (
            place_id
          )
        `
      )
      .eq("reviews.place_id", normalizedPlaceId)
      .order("review_id", { ascending: true })
      .order("tag_id", { ascending: true })
      .range(from, from + REVIEW_TAGS_PAGE_SIZE - 1);

    if (error) {
      throw new Error("Failed to load popular review tags.");
    }

    const rows = (data ?? []) as ReviewTagWithTag[];

    for (const row of rows) {
      const tag = getEmbeddedReviewTagTag(row);

      if (!tag) {
        continue;
      }

      const currentTag = tagsById.get(tag.id);

      if (currentTag) {
        currentTag.reviewCount += 1;
        continue;
      }

      tagsById.set(tag.id, {
        id: tag.id,
        name: tag.name,
        emoji: tag.emoji,
        categoryId: tag.category_id,
        reviewCount: 1,
      });
    }

    if (rows.length < REVIEW_TAGS_PAGE_SIZE) {
      break;
    }

    from += REVIEW_TAGS_PAGE_SIZE;
  }

  return Array.from(tagsById.values())
    .sort((left, right) => {
      if (left.reviewCount !== right.reviewCount) {
        return right.reviewCount - left.reviewCount;
      }

      const nameComparison = left.name.localeCompare(right.name, "ja");

      return nameComparison === 0 ? left.id.localeCompare(right.id) : nameComparison;
    })
    .slice(0, POPULAR_REVIEW_TAGS_LIMIT);
}
