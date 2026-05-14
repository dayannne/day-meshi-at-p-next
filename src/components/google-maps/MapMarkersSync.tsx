"use client";

import { useEffect } from "react";

import type { GoogleMapMarkerItem } from "@/components/google-maps/types";
import { useMapMarkerStore, type MapMarkerSource } from "@/stores";

type MapMarkersSyncProps = {
  source: MapMarkerSource;
  markers: GoogleMapMarkerItem[];
};

export function MapMarkersSync({ source, markers }: MapMarkersSyncProps) {
  const setMarkers = useMapMarkerStore((state) => state.setMarkers);
  const clearMarkers = useMapMarkerStore((state) => state.clearMarkers);

  useEffect(() => {
    setMarkers(source, markers);

    return () => {
      clearMarkers(source);
    };
  }, [clearMarkers, markers, setMarkers, source]);

  return null;
}
