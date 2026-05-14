import { MapMarkersSync } from "@/components/google-maps";
import { getPlacesAction } from "@/features/places/actions";
import { PlacesList } from "@/features/places/components/PlacesList";
import { toPlaceMarkers } from "@/features/places/placeMarkers";

export default async function ExplorePage() {
  const places = await getPlacesAction();
  const markers = toPlaceMarkers(places);

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden not-italic">
      <MapMarkersSync source="places" markers={markers} />
      <h2 className="text-xl font-bold text-slate-950">お店を検索</h2>
      {/* <SearchFilterBar /> */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <p className="mt-1 text-sm text-slate-500">お店一覧 ({places.length}件)</p>
        <PlacesList places={places} />
      </div>
      {/* <Pagination /> */}
    </div>
  );
}
