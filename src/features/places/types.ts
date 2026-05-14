export type Place = {
  id: string;
  googlePlaceId: string;
  name: string;
  category: string | null;
  lat: number;
  lng: number;
  imageUrl: string | null;
  isGochimeshi: boolean;
  avgRating: number;
  reviewCount: number;
  distanceFromOfficeMeters: number | null;
  walkingDurationSeconds: number | null;
};
