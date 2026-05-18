"use client";

import { create } from "zustand";

import type { GoogleMapMarkerItem } from "@/components/google-maps/types";

export type MapMarkerSource = "places" | "bookmarks" | "review-place";

export type MapMarkerStore = {
  markers: GoogleMapMarkerItem[];
  selectedMarkerId: string | null;
  markerSource: MapMarkerSource | null;
  setMarkers: (source: MapMarkerSource, markers: GoogleMapMarkerItem[]) => void;
  clearMarkers: (source?: MapMarkerSource) => void;
  selectMarker: (markerId: string | null) => void;
};

export const useMapMarkerStore = create<MapMarkerStore>((set) => ({
  markers: [],
  selectedMarkerId: null,
  markerSource: null,
  setMarkers: (source, markers) => {
    set({
      markers,
      markerSource: source,
      selectedMarkerId: null,
    });
  },
  clearMarkers: (source) => {
    set((state) => {
      if (source && state.markerSource !== source) {
        return state;
      }

      return {
        markers: [],
        markerSource: null,
        selectedMarkerId: null,
      };
    });
  },
  selectMarker: (markerId) => {
    set({ selectedMarkerId: markerId });
  },
}));
