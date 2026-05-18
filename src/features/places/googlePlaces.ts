import { DEFAULT_GOOGLE_MAP_CENTER } from "@/components/google-maps/constants";
import { getServerGoogleMapsEnv } from "@/lib/google-maps/env";

export const GOOGLE_PLACES_SEARCH_CENTER = DEFAULT_GOOGLE_MAP_CENTER;
export const GOOGLE_PLACES_SEARCH_RADIUS_METERS = 2000;
export const GOOGLE_PLACES_INCLUDED_PRIMARY_TYPES = ["restaurant", "bar", "cafe"] as const;

export type GooglePlacePrimaryType = (typeof GOOGLE_PLACES_INCLUDED_PRIMARY_TYPES)[number];

export type GooglePlaceSuggestion = {
  placeId: string;
  mainText: string;
  secondaryText: string | null;
  text: string;
  types: string[];
  distanceMeters: number | null;
};

export type GooglePlaceDetails = {
  placeId: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  types: string[];
  category: GooglePlacePrimaryType;
};

type GoogleAutocompleteResponse = {
  suggestions?: Array<{
    placePrediction?: {
      placeId?: string;
      text?: {
        text?: string;
      };
      structuredFormat?: {
        mainText?: {
          text?: string;
        };
        secondaryText?: {
          text?: string;
        };
      };
      types?: string[];
      distanceMeters?: number;
    };
  }>;
};

type GooglePlaceDetailsResponse = {
  id?: string;
  displayName?: {
    text?: string;
  };
  formattedAddress?: string;
  location?: {
    latitude?: number;
    longitude?: number;
  };
  types?: string[];
};

function getGoogleMapsApiKey() {
  return getServerGoogleMapsEnv().apiKey;
}

function getAllowedPlaceCategory(types: string[]): GooglePlacePrimaryType | null {
  return GOOGLE_PLACES_INCLUDED_PRIMARY_TYPES.find((type) => types.includes(type)) ?? null;
}

export async function fetchGooglePlaceAutocomplete({
  input,
  sessionToken,
}: {
  input: string;
  sessionToken: string;
}): Promise<GooglePlaceSuggestion[]> {
  const normalizedInput = input.trim();

  if (normalizedInput.length < 2) {
    return [];
  }

  const response = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": getGoogleMapsApiKey(),
      "X-Goog-FieldMask": [
        "suggestions.placePrediction.placeId",
        "suggestions.placePrediction.text",
        "suggestions.placePrediction.structuredFormat",
        "suggestions.placePrediction.types",
        "suggestions.placePrediction.distanceMeters",
      ].join(","),
    },
    body: JSON.stringify({
      input: normalizedInput,
      includedPrimaryTypes: GOOGLE_PLACES_INCLUDED_PRIMARY_TYPES,
      locationRestriction: {
        circle: {
          center: {
            latitude: GOOGLE_PLACES_SEARCH_CENTER.lat,
            longitude: GOOGLE_PLACES_SEARCH_CENTER.lng,
          },
          radius: GOOGLE_PLACES_SEARCH_RADIUS_METERS,
        },
      },
      origin: {
        latitude: GOOGLE_PLACES_SEARCH_CENTER.lat,
        longitude: GOOGLE_PLACES_SEARCH_CENTER.lng,
      },
      languageCode: "ja",
      regionCode: "jp",
      sessionToken,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to load Google place suggestions.");
  }

  const data = (await response.json()) as GoogleAutocompleteResponse;

  return (data.suggestions ?? [])
    .map((suggestion): GooglePlaceSuggestion | null => {
      const prediction = suggestion.placePrediction;
      const placeId = prediction?.placeId;
      const text = prediction?.text?.text;

      if (!prediction || !placeId || !text) {
        return null;
      }

      return {
        placeId,
        text,
        mainText: prediction.structuredFormat?.mainText?.text ?? text,
        secondaryText: prediction.structuredFormat?.secondaryText?.text ?? null,
        types: prediction.types ?? [],
        distanceMeters:
          typeof prediction.distanceMeters === "number" ? prediction.distanceMeters : null,
      };
    })
    .filter((suggestion): suggestion is GooglePlaceSuggestion => suggestion !== null);
}

export async function fetchGooglePlaceDetails({
  placeId,
  sessionToken,
}: {
  placeId: string;
  sessionToken: string;
}): Promise<GooglePlaceDetails> {
  const params = new URLSearchParams({
    languageCode: "ja",
    regionCode: "jp",
    sessionToken,
  });
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?${params}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": getGoogleMapsApiKey(),
        "X-Goog-FieldMask": "id,displayName,formattedAddress,location,types",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load Google place details.");
  }

  const data = (await response.json()) as GooglePlaceDetailsResponse;
  const resolvedPlaceId = data.id;
  const name = data.displayName?.text;
  const lat = data.location?.latitude;
  const lng = data.location?.longitude;
  const types = data.types ?? [];
  const category = getAllowedPlaceCategory(types);

  if (!resolvedPlaceId || !name || typeof lat !== "number" || typeof lng !== "number") {
    throw new Error("Google place details response is missing required fields.");
  }

  if (!category) {
    throw new Error("Selected Google place is not an allowed food or drink place.");
  }

  return {
    placeId: resolvedPlaceId,
    name,
    address: data.formattedAddress ?? null,
    lat,
    lng,
    types,
    category,
  };
}
