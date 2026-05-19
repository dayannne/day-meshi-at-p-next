import type { GooglePlacePhotoAttribution } from "@/features/places/googlePlaces";

export type Place = {
  id: string;
  googlePlaceId: string;
  name: string;
  category: string | null;
  lat: number;
  lng: number;
  imageUrl: string | null;
  photoAttributions: GooglePlacePhotoAttribution[];
  isGochimeshi: boolean;
  avgRating: number;
  reviewCount: number;
  distanceFromOfficeMeters: number | null;
  walkingDurationSeconds: number | null;
};

export type PlacePopularReviewTag = {
  id: string;
  name: string;
  emoji: string | null;
  categoryId: string;
  reviewCount: number;
};

export type PlaceReviewPreview = {
  id: string;
  authorName: string;
  rating: number;
  comment: string;
  date: string;
};
