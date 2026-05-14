"use client";

import { create } from "zustand";

export type MapMarkerStore = Record<string, never>;

export const useMapMarkerStore = create<MapMarkerStore>(() => ({}));
