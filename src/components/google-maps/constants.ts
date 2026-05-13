import type {
  GoogleMapMarkerItem,
  GoogleMapOptions,
  GoogleMapPinOptions,
  GoogleMapPosition,
} from "./types";

export const DEFAULT_GOOGLE_MAP_CENTER: GoogleMapPosition = {
  lat: 35.6563924,
  lng: 139.6965651,
};

export const DEFAULT_GOOGLE_MAP_ZOOM = 14;

export const DEFAULT_GOOGLE_MAP_OPTIONS: GoogleMapOptions = {
  clickableIcons: true,
  fullscreenControl: false,
  gestureHandling: "greedy",
  mapTypeControl: true,
  streetViewControl: false,
};

export const DEFAULT_MARKER_PIN: GoogleMapPinOptions = {
  background: "#111111",
  borderColor: "#824434",
  glyphColor: "#824434",
};

export const DEFAULT_SELECTED_MARKER_PIN: GoogleMapPinOptions = {
  background: "#111111",
  borderColor: "#824434",
  glyphColor: "#FFFFFF",
  scale: 1.18,
};

export const DEFAULT_GOOGLE_MAP_CENTER_MARKER: GoogleMapMarkerItem = {
  id: "default-google-map-center",
  position: DEFAULT_GOOGLE_MAP_CENTER,
  title: "Default map center",
  pin: {
    background: "#aaaaaa",
    borderColor: "#824434",
    glyphColor: "#111111",
    glyphText: "office",
  },
  zIndex: 0,
};

export const GOCHIMESHI_MARKER_PIN: GoogleMapPinOptions = {
  background: "#F7BF6C",
  borderColor: "#824434",
  glyphColor: "#051419",
  glyphText: "isgochimeshi",
};

export const NON_GOCHIMESHI_MARKER_PIN: GoogleMapPinOptions = {
  glyphText: "nongochimeshi",
};

export const PLACE_SELECTED_MARKER_PIN: GoogleMapPinOptions = {
  glyphText: "selected",
};

export const GOCHIMESHI_MARKER_Z_INDEX = 10;
export const NON_GOCHIMESHI_MARKER_Z_INDEX = 1;
