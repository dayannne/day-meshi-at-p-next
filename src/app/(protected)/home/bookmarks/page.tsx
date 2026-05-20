import { getBookmarkedPlacesAction } from "@/features/places/actions";
import { PlaceList } from "@/features/places/components/PlaceList";
import { buildPlacesHref, PLACE_DETAIL_PANEL } from "../places/_panel/panelLinks";
import { MapMarkersSync } from "@/components/google-maps";
import { toPlaceMarkers } from "@/features/places/placeMarkers";

export default async function BookmarksPage() {
  const bookmarkedPlaces = await getBookmarkedPlacesAction();

  const placeDetailHrefs = Object.fromEntries(
    bookmarkedPlaces.map((place) => [
      place.id,
      buildPlacesHref("", {
        page: 1,
        panel: PLACE_DETAIL_PANEL,
        placeId: place.id,
      }),
    ])
  );

  const placeMarkers = toPlaceMarkers(bookmarkedPlaces).map((marker) => ({
    ...marker,
    href: placeDetailHrefs[marker.id],
  }));

  return (
    <>
      <MapMarkersSync source="bookmarks" markers={placeMarkers} />

      <div className="flex h-full flex-col overflow-hidden">
        <div className="flex flex-col gap-1 border-b border-b-slate-200 bg-white p-6">
          <h1 className="text-xl font-bold text-slate-900">ブックマーク</h1>
          <span className="text-slate-500">{bookmarkedPlaces.length ?? 0}件のお店</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {bookmarkedPlaces.length > 0 ? (
            <PlaceList places={bookmarkedPlaces} placeDetailHrefs={placeDetailHrefs} />
          ) : (
            <div className="flex h-full items-center justify-center py-20 text-sm text-slate-500">
              まだブックマークした店がありません
            </div>
          )}
        </div>
      </div>
    </>
  );
}
