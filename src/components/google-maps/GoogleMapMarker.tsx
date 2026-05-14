"use client";

import { AdvancedMarker } from "@vis.gl/react-google-maps";

import { GoogleMapMarkerIcon } from "./GoogleMapMarkerIcon";
import type { GoogleMapMarkerItem } from "./types";

type GoogleMapMarkerProps = {
  marker: GoogleMapMarkerItem;
  selected: boolean;
  onMarkerSelect?: (markerId: string) => void;
};

export function GoogleMapMarker({ marker, selected, onMarkerSelect }: GoogleMapMarkerProps) {
  // 選択後の詳細表示やドメイン処理は外側の責務にし、地図は markerId だけを通知する。
  const isClickable = marker.clickable !== false && Boolean(onMarkerSelect);
  const handleClick = isClickable ? () => onMarkerSelect?.(marker.id) : undefined;

  return (
    <AdvancedMarker
      position={marker.position}
      title={marker.title}
      clickable={isClickable}
      zIndex={selected ? (marker.selectedZIndex ?? 20) : marker.zIndex}
      onClick={handleClick}
    >
      <GoogleMapMarkerIcon selected={selected} variant={marker.variant} />
    </AdvancedMarker>
  );
}
