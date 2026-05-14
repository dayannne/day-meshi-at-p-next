import type { ReactNode } from "react";

export type GoogleMapPosition = {
  lat: number;
  lng: number;
};

export type GoogleMapGestureHandling = "auto" | "cooperative" | "greedy" | "none";

export type GoogleMapOptions = {
  clickableIcons?: boolean;
  fullscreenControl?: boolean;
  gestureHandling?: GoogleMapGestureHandling;
  mapTypeControl?: boolean;
  streetViewControl?: boolean;
  zoomControl?: boolean;
};

export type GoogleMapMarkerVariant = "default-center" | "gochimeshi" | "non-gochimeshi";

export type GoogleMapMarkerItem = {
  id: string;
  position: GoogleMapPosition;
  title?: string;
  variant?: GoogleMapMarkerVariant;
  clickable?: boolean;
  zIndex?: number;
  selectedZIndex?: number;
};

export type GoogleMapStatusContent = {
  title: string;
  message: string;
};

export type GoogleMapProps = {
  apiKey: string;
  mapId: string;
  apiVersion?: string;
  language?: string;
  region?: string;
  markers?: GoogleMapMarkerItem[];
  showDefaultCenterMarker?: boolean;
  selectedMarkerId?: string | null;
  onMarkerSelect?: (markerId: string) => void;
  defaultCenter?: GoogleMapPosition;
  defaultZoom?: number;
  mapInstanceId?: string;
  mapOptions?: GoogleMapOptions;
  loadingContent?: GoogleMapStatusContent;
  errorContent?: GoogleMapStatusContent;
  className?: string;
  mapClassName?: string;
  children?: ReactNode;
};
