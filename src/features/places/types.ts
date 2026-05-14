export type Place = {
  id: string;
  googlePlaceId: string;
  name: string;
  category: string | null;
  lat: number;
  lng: number;
  isGochimeshi: boolean;
  avgRating: number;
  reviewCount: number;
};
