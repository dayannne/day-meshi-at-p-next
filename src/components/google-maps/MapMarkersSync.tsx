"use client";

import { useEffect } from "react";

import type { GoogleMapMarkerItem } from "@/components/google-maps/types";
import { useMapMarkerStore, type MapMarkerSource } from "@/stores";

type MapMarkersSyncProps = {
  source: MapMarkerSource;
  markers: GoogleMapMarkerItem[];
  selectedMarkerId?: string | null;
};

export function MapMarkersSync({ source, markers, selectedMarkerId }: MapMarkersSyncProps) {
  const setMarkers = useMapMarkerStore((state) => state.setMarkers);
  const clearMarkers = useMapMarkerStore((state) => state.clearMarkers);
  const selectMarker = useMapMarkerStore((state) => state.selectMarker);

  useEffect(() => {
    setMarkers(source, markers);

    if (selectedMarkerId !== undefined) {
      const markerExists = markers.some((marker) => marker.id === selectedMarkerId);
      selectMarker(selectedMarkerId && markerExists ? selectedMarkerId : null);
    }
  }, [markers, selectMarker, selectedMarkerId, setMarkers, source]);

  useEffect(() => {
    return () => {
      clearMarkers(source);
    };
  }, [clearMarkers, source]);

  return null;
}
