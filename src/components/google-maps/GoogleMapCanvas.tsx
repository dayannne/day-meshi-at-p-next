"use client";

import { APILoadingStatus, Map, useApiLoadingStatus } from "@vis.gl/react-google-maps";

import { cn } from "@/lib/utils";

import {
  DEFAULT_GOOGLE_MAP_CENTER,
  DEFAULT_GOOGLE_MAP_CENTER_MARKER,
  DEFAULT_GOOGLE_MAP_OPTIONS,
  DEFAULT_GOOGLE_MAP_ZOOM,
} from "./constants";
import { GoogleMapMarker } from "./GoogleMapMarker";
import { GoogleMapStatusMessage } from "./GoogleMapStatusMessage";
import type { GoogleMapMarkerItem, GoogleMapProps } from "./types";

const EMPTY_MARKERS: GoogleMapMarkerItem[] = [];
const DEFAULT_LOADING_CONTENT = {
  title: "Loading map",
  message: "Preparing Google Maps.",
};
const DEFAULT_ERROR_CONTENT = {
  title: "Map unavailable",
  message: "Check the Google Maps API settings.",
};

type GoogleMapCanvasProps = Omit<
  GoogleMapProps,
  "apiKey" | "apiVersion" | "language" | "region"
> & {
  loadError: Error | null;
};

export function GoogleMapCanvas({
  mapId,
  markers = EMPTY_MARKERS,
  showDefaultCenterMarker = true,
  selectedMarkerId = null,
  onMarkerSelect,
  defaultCenter = DEFAULT_GOOGLE_MAP_CENTER,
  defaultZoom = DEFAULT_GOOGLE_MAP_ZOOM,
  mapInstanceId = "google-map",
  mapOptions,
  loadingContent = DEFAULT_LOADING_CONTENT,
  errorContent = DEFAULT_ERROR_CONTENT,
  className,
  mapClassName,
  children,
  loadError,
}: GoogleMapCanvasProps) {
  const loadingStatus = useApiLoadingStatus();

  // 認証失敗も利用者にとってはロード失敗と同じなので、同じフォールバック表示にまとめる。
  const hasLoadError =
    Boolean(loadError) ||
    loadingStatus === APILoadingStatus.FAILED ||
    loadingStatus === APILoadingStatus.AUTH_FAILURE;
  const mergedMapOptions = {
    ...DEFAULT_GOOGLE_MAP_OPTIONS,
    ...mapOptions,
  };
  const mapMarkers = showDefaultCenterMarker
    ? [DEFAULT_GOOGLE_MAP_CENTER_MARKER, ...markers]
    : markers;

  return (
    <div className={cn("relative h-full w-full overflow-hidden", className)}>
      {hasLoadError ? (
        <GoogleMapStatusMessage title={errorContent.title} message={errorContent.message} />
      ) : loadingStatus !== APILoadingStatus.LOADED ? (
        <GoogleMapStatusMessage title={loadingContent.title} message={loadingContent.message} />
      ) : null}

      {!hasLoadError ? (
        <Map
          id={mapInstanceId}
          // Advanced Marker には Map ID が必要。reuseMaps と併用して再マウント時の生成コストも抑える。
          mapId={mapId}
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          reuseMaps
          clickableIcons={mergedMapOptions.clickableIcons}
          fullscreenControl={mergedMapOptions.fullscreenControl}
          gestureHandling={mergedMapOptions.gestureHandling}
          mapTypeControl={mergedMapOptions.mapTypeControl}
          streetViewControl={mergedMapOptions.streetViewControl}
          zoomControl={mergedMapOptions.zoomControl}
          className={cn("h-full w-full", mapClassName)}
        >
          {mapMarkers.map((marker) => (
            <GoogleMapMarker
              key={marker.id}
              marker={marker}
              selected={marker.id === selectedMarkerId}
              onMarkerSelect={onMarkerSelect}
            />
          ))}
          {children}
        </Map>
      ) : null}
    </div>
  );
}
