import type { GooglePlacePhotoAttribution } from "@/features/places/googlePlaces";

export type Place = {
  id: string;
  googlePlaceId: string;
  name: string;
  category: string | null;
  price_range: number | null;
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

export type PlaceGoogleBusinessStatus =
  | "BUSINESS_STATUS_UNSPECIFIED"
  | "OPERATIONAL"
  | "CLOSED_TEMPORARILY"
  | "CLOSED_PERMANENTLY"
  | "FUTURE_OPENING";

export type PlaceGoogleBusinessDetails = {
  address: string | null;
  phoneNumber: string | null;
  businessStatus: PlaceGoogleBusinessStatus | null;
  openNow: boolean | null;
  todayOpeningHours: string | null;
  googleMapsUri: string | null;
};
