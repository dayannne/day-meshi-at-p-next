"use client";

import { AdvancedMarker, Pin } from "@vis.gl/react-google-maps";

import { DEFAULT_MARKER_PIN, DEFAULT_SELECTED_MARKER_PIN } from "./constants";
import type { GoogleMapMarkerItem, GoogleMapPinOptions } from "./types";

type GoogleMapMarkerProps = {
  marker: GoogleMapMarkerItem;
  selected: boolean;
  onMarkerSelect?: (markerId: string) => void;
};

export function GoogleMapMarker({ marker, selected, onMarkerSelect }: GoogleMapMarkerProps) {
  const pinOptions = getPinOptions(marker, selected);

  // 選択後の詳細表示やドメイン処理は外側の責務にし、地図は markerId だけを通知する。
  const handleClick = onMarkerSelect ? () => onMarkerSelect(marker.id) : undefined;

  return (
    <AdvancedMarker
      position={marker.position}
      title={marker.title}
      clickable={Boolean(onMarkerSelect)}
      zIndex={selected ? (marker.selectedZIndex ?? 20) : marker.zIndex}
      onClick={handleClick}
    >
      <Pin
        background={pinOptions.background}
        borderColor={pinOptions.borderColor}
        glyphColor={pinOptions.glyphColor}
        glyphText={pinOptions.glyphText}
        glyphSrc={pinOptions.glyphSrc}
        scale={pinOptions.scale}
      />
    </AdvancedMarker>
  );
}

function getPinOptions(marker: GoogleMapMarkerItem, selected: boolean): GoogleMapPinOptions {
  const basePin = {
    ...DEFAULT_MARKER_PIN,
    ...marker.pin,
  };

  if (!selected) {
    return basePin;
  }

  // 選択状態の既定スタイルを重ねる。用途別の上書きは marker.selectedPin で行う。
  return {
    ...basePin,
    ...DEFAULT_SELECTED_MARKER_PIN,
    ...marker.selectedPin,
  };
}
