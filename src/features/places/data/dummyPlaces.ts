export type DummyPlace = {
  id: string;
  googlePlaceId: string;
  name: string;
  lat: number;
  lng: number;
  isGochimeshi: boolean;
  avgRating: number;
  reviewCount: number;
};

export const dummyPlaces: DummyPlace[] = [
  {
    id: "dummy-place-1",
    googlePlaceId: "dummy-google-place-1",
    name: "東京駅 丸の内ランチ",
    lat: 35.681236,
    lng: 139.767125,
    isGochimeshi: true,
    avgRating: 4.6,
    reviewCount: 18,
  },
  {
    id: "dummy-place-2",
    googlePlaceId: "dummy-google-place-2",
    name: "八重洲カレー食堂",
    lat: 35.68035,
    lng: 139.77065,
    isGochimeshi: false,
    avgRating: 4.1,
    reviewCount: 9,
  },
  {
    id: "dummy-place-3",
    googlePlaceId: "dummy-google-place-3",
    name: "日本橋定食スタンド",
    lat: 35.68355,
    lng: 139.7731,
    isGochimeshi: true,
    avgRating: 4.8,
    reviewCount: 24,
  },
  {
    id: "dummy-place-4",
    googlePlaceId: "dummy-google-place-4",
    name: "京橋ヌードル",
    lat: 35.67595,
    lng: 139.7701,
    isGochimeshi: false,
    avgRating: 3.9,
    reviewCount: 5,
  },
];
