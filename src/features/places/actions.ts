"use server";

import type { Place } from "@/features/places/types";
import { createClient } from "@/lib/supabase/server";

const PLACES_SELECT_COLUMNS = `
  id,
  google_place_id,
  name,
  category,
  lat,
  lng,
  image_url,
  is_gochimeshi,
  avg_rating,
  review_count,
  distance_from_office_meters,
  walking_duration_seconds
`;

const DEFAULT_PAGE = 1;
const DEFAULT_PAGE_SIZE = 20;

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

function normalizePositiveInteger(value: number | undefined, fallback: number): number {
  return Number.isInteger(value) && value && value > 0 ? value : fallback;
}

function toPlace(place: {
  id: string;
  google_place_id: string;
  name: string;
  category: string | null;
  lat: number;
  lng: number;
  image_url: string | null;
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
    isGochimeshi: place.is_gochimeshi,
    avgRating: place.avg_rating,
    reviewCount: place.review_count,
    distanceFromOfficeMeters: place.distance_from_office_meters,
    walkingDurationSeconds: place.walking_duration_seconds,
  };
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
