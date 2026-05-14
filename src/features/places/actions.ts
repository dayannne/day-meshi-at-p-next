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

export async function getPlacesAction(): Promise<Place[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("places")
    .select(PLACES_SELECT_COLUMNS)
    .order("name", { ascending: true });

  if (error) {
    throw new Error("Failed to load places.");
  }

  return data.map((place) => ({
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
  }));
}
