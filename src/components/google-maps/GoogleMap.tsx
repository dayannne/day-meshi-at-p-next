"use client";

import { APIProvider } from "@vis.gl/react-google-maps";
import { useState } from "react";

import { GoogleMapCanvas } from "./GoogleMapCanvas";
import type { GoogleMapProps } from "./types";

export function GoogleMap({
  apiKey,
  apiVersion = "weekly",
  language = "ja",
  region = "JP",
  ...canvasProps
}: GoogleMapProps) {
  const [loadError, setLoadError] = useState<Error | null>(null);

  return (
    // APIProvider は Google Maps JavaScript API のロード境界。地図本体は子コンポーネントで状態を読む。
    <APIProvider
      apiKey={apiKey}
      version={apiVersion}
      language={language}
      region={region}
      onError={(error: unknown) => {
        setLoadError(
          error instanceof Error ? error : new Error("Google Maps JavaScript API failed to load.")
        );
      }}
    >
      <GoogleMapCanvas {...canvasProps} loadError={loadError} />
    </APIProvider>
  );
}
