import { MapMarkersSync } from "@/components/google-maps";
import { getPlacesAction } from "@/features/places/actions";
import { toPlaceMarkers } from "@/features/places/placeMarkers";

export default async function ExplorePage() {
  const places = await getPlacesAction();
  const markers = toPlaceMarkers(places);

  return (
    <div className="p-4">
      <MapMarkersSync source="places" markers={markers} />
      <h2 className="mb-4 text-xl font-bold">お店を検索</h2>
      {/* <SearchFilterBar /> */}
      {/* <PlacesList /> */}
      {/* <Pagination /> */}
    </div>
  );
}
