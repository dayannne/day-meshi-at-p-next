"use client";

import { GoogleMap } from "@/components/google-maps";
import { useMapMarkerStore } from "@/stores";

import type { GoogleMapProps } from "./types";

type StoreConnectedGoogleMapProps = Omit<
  GoogleMapProps,
  "markers" | "selectedMarkerId" | "onMarkerSelect"
>;

export function StoreConnectedGoogleMap(props: StoreConnectedGoogleMapProps) {
  const markers = useMapMarkerStore((state) => state.markers);
  const selectedMarkerId = useMapMarkerStore((state) => state.selectedMarkerId);
  const selectMarker = useMapMarkerStore((state) => state.selectMarker);

  return (
    <GoogleMap
      {...props}
      markers={markers}
      selectedMarkerId={selectedMarkerId}
      onMarkerSelect={selectMarker}
    />
  );
}
