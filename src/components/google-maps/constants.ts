import type { GoogleMapOptions, GoogleMapPinOptions, GoogleMapPosition } from "./types";

export const DEFAULT_GOOGLE_MAP_CENTER: GoogleMapPosition = {
  lat: 35.681236,
  lng: 139.767125,
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
  background: "#FFFFFF",
  borderColor: "#824434",
  glyphColor: "#824434",
};

export const DEFAULT_SELECTED_MARKER_PIN: GoogleMapPinOptions = {
  background: "#F18362",
  borderColor: "#824434",
  glyphColor: "#FFFFFF",
  scale: 1.18,
};
