import {
  GOCHIMESHI_MARKER_PIN,
  GOCHIMESHI_MARKER_Z_INDEX,
  NON_GOCHIMESHI_MARKER_PIN,
  NON_GOCHIMESHI_MARKER_Z_INDEX,
  PLACE_SELECTED_MARKER_PIN,
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
    pin: place.isGochimeshi ? GOCHIMESHI_MARKER_PIN : NON_GOCHIMESHI_MARKER_PIN,
    selectedPin: PLACE_SELECTED_MARKER_PIN,
    zIndex: place.isGochimeshi ? GOCHIMESHI_MARKER_Z_INDEX : NON_GOCHIMESHI_MARKER_Z_INDEX,
  };
}

export function toPlaceMapMarkers(places: DummyPlace[]): GoogleMapMarkerItem[] {
  return places.map(toPlaceMapMarker);
}
