import type { Place } from "@/features/places/types";

export const dummyPlaces: Place[] = [
  {
    id: "dummy-place-1",
    googlePlaceId: "dummy-google-place-1",
    name: "渋谷ブリッジ ランチ",
    lat: 35.65677,
    lng: 139.69712,
    isGochimeshi: true,
    avgRating: 4.6,
    reviewCount: 18,
  },
  {
    id: "dummy-place-2",
    googlePlaceId: "dummy-google-place-2",
    name: "代官山カレー食堂",
    lat: 35.65572,
    lng: 139.69565,
    isGochimeshi: false,
    avgRating: 4.1,
    reviewCount: 9,
  },
  {
    id: "dummy-place-3",
    googlePlaceId: "dummy-google-place-3",
    name: "並木橋定食スタンド",
    lat: 35.65735,
    lng: 139.69495,
    isGochimeshi: true,
    avgRating: 4.8,
    reviewCount: 24,
  },
  {
    id: "dummy-place-4",
    googlePlaceId: "dummy-google-place-4",
    name: "恵比寿ヌードル",
    lat: 35.65498,
    lng: 139.69755,
    isGochimeshi: false,
    avgRating: 3.9,
    reviewCount: 5,
  },
];
