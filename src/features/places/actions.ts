"use server";

import { dummyPlaces } from "@/features/places/data/dummyPlaces";
import type { Place } from "@/features/places/types";

export async function getPlacesAction(): Promise<Place[]> {
  return dummyPlaces;
}
