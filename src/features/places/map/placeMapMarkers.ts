import {
  GOCHIMESHI_MARKER_VARIANT,
  GOCHIMESHI_MARKER_Z_INDEX,
  NON_GOCHIMESHI_MARKER_VARIANT,
  NON_GOCHIMESHI_MARKER_Z_INDEX,
} from "@/components/google-maps/constants";
import type { GoogleMapMarkerItem } from "@/components/google-maps/types";
import type { DummyPlace } from "@/features/places/data/dummyPlaces";

export function toPlaceMapMarker(place: DummyPlace): GoogleMapMarkerItem {
  return {
    id: place.id,
    position: {
      lat: place.lat,
      lng: place.lng,
    },
    title: place.name,
    variant: place.isGochimeshi ? GOCHIMESHI_MARKER_VARIANT : NON_GOCHIMESHI_MARKER_VARIANT,
    zIndex: place.isGochimeshi ? GOCHIMESHI_MARKER_Z_INDEX : NON_GOCHIMESHI_MARKER_Z_INDEX,
  };
}

export function toPlaceMapMarkers(places: DummyPlace[]): GoogleMapMarkerItem[] {
  return places.map(toPlaceMapMarker);
}
