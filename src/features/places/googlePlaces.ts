import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

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
  googlePlaceId: string;
  name: string;
  address: string | null;
  lat: number;
  lng: number;
  types: string[];
  category: GooglePlacePrimaryType;
  imageUrl: string | null;
  photoAttributions: GooglePlacePhotoAttribution[];
  distanceFromOfficeMeters: number | null;
  walkingDurationSeconds: number | null;
};

export type GooglePlacePhotoAttribution = {
  displayName: string;
  uri: string | null;
  photoUri: string | null;
};

export type SignedGooglePlaceDetails = GooglePlaceDetails & {
  sessionToken: string;
  selectionSignature: string;
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
  photos?: Array<{
    name?: string;
    authorAttributions?: Array<{
      displayName?: string;
      uri?: string;
      photoUri?: string;
    }>;
  }>;
  types?: string[];
};

type GooglePlacePhoto = NonNullable<GooglePlaceDetailsResponse["photos"]>[number];

type GooglePlacePhotoResponse = {
  photoUri?: string;
};

type GoogleRouteResponse = {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
  }>;
};

function getGoogleMapsApiKey() {
  return getServerGoogleMapsEnv().apiKey;
}

function getAllowedPlaceCategory(types: string[]): GooglePlacePrimaryType | null {
  return GOOGLE_PLACES_INCLUDED_PRIMARY_TYPES.find((type) => types.includes(type)) ?? null;
}

function parseDurationSeconds(duration: string | undefined): number | null {
  if (!duration) {
    return null;
  }

  const match = duration.match(/^(\d+)s$/);

  if (!match) {
    return null;
  }

  return Number(match[1]);
}

function createPlaceSelectionPayload(details: GooglePlaceDetails, sessionToken: string) {
  return JSON.stringify({
    googlePlaceId: details.googlePlaceId,
    name: details.name,
    address: details.address,
    lat: details.lat,
    lng: details.lng,
    types: details.types,
    category: details.category,
    imageUrl: details.imageUrl,
    photoAttributions: details.photoAttributions,
    distanceFromOfficeMeters: details.distanceFromOfficeMeters,
    walkingDurationSeconds: details.walkingDurationSeconds,
    sessionToken,
  });
}

export function signGooglePlaceSelection(details: GooglePlaceDetails, sessionToken: string) {
  return createHmac("sha256", getGoogleMapsApiKey())
    .update(createPlaceSelectionPayload(details, sessionToken))
    .digest("base64url");
}

export function verifyGooglePlaceSelection({
  details,
  sessionToken,
  selectionSignature,
}: {
  details: GooglePlaceDetails;
  sessionToken: string;
  selectionSignature: string;
}) {
  if (!selectionSignature) {
    return false;
  }

  const expectedSignature = signGooglePlaceSelection(details, sessionToken);
  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(selectionSignature);

  return (
    expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer)
  );
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

async function fetchGooglePlacePhotoUri(photoName: string | undefined): Promise<string | null> {
  if (!photoName) {
    return null;
  }

  try {
    const params = new URLSearchParams({
      key: getGoogleMapsApiKey(),
      maxWidthPx: "800",
      maxHeightPx: "600",
      skipHttpRedirect: "true",
    });
    const response = await fetch(
      `https://places.googleapis.com/v1/${encodeURI(photoName)}/media?${params}`,
      {
        method: "GET",
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as GooglePlacePhotoResponse;

    return data.photoUri ?? null;
  } catch {
    return null;
  }
}

function toPhotoAttributions(photo: GooglePlacePhoto | undefined): GooglePlacePhotoAttribution[] {
  return (photo?.authorAttributions ?? [])
    .map((attribution): GooglePlacePhotoAttribution | null => {
      if (!attribution.displayName) {
        return null;
      }

      return {
        displayName: attribution.displayName,
        uri: attribution.uri ?? null,
        photoUri: attribution.photoUri ?? null,
      };
    })
    .filter((attribution): attribution is GooglePlacePhotoAttribution => attribution !== null);
}

async function fetchGoogleWalkingRoute({ lat, lng }: { lat: number; lng: number }): Promise<{
  distanceFromOfficeMeters: number | null;
  walkingDurationSeconds: number | null;
}> {
  try {
    const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": getGoogleMapsApiKey(),
        "X-Goog-FieldMask": "routes.distanceMeters,routes.duration",
      },
      body: JSON.stringify({
        origin: {
          location: {
            latLng: {
              latitude: GOOGLE_PLACES_SEARCH_CENTER.lat,
              longitude: GOOGLE_PLACES_SEARCH_CENTER.lng,
            },
          },
        },
        destination: {
          location: {
            latLng: {
              latitude: lat,
              longitude: lng,
            },
          },
        },
        travelMode: "WALK",
        languageCode: "ja",
        units: "METRIC",
      }),
    });

    if (!response.ok) {
      return {
        distanceFromOfficeMeters: null,
        walkingDurationSeconds: null,
      };
    }

    const data = (await response.json()) as GoogleRouteResponse;
    const route = data.routes?.[0];

    return {
      distanceFromOfficeMeters:
        typeof route?.distanceMeters === "number" ? route.distanceMeters : null,
      walkingDurationSeconds: parseDurationSeconds(route?.duration),
    };
  } catch {
    return {
      distanceFromOfficeMeters: null,
      walkingDurationSeconds: null,
    };
  }
}

export async function fetchGooglePlaceDetails({
  placeId,
  sessionToken,
}: {
  placeId: string;
  sessionToken?: string;
}): Promise<GooglePlaceDetails> {
  const params = new URLSearchParams({
    languageCode: "ja",
    regionCode: "jp",
  });

  if (sessionToken) {
    params.set("sessionToken", sessionToken);
  }
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(placeId)}?${params}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": getGoogleMapsApiKey(),
        "X-Goog-FieldMask":
          "id,displayName,formattedAddress,location,types,photos.name,photos.authorAttributions",
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
  const photo = data.photos?.[0];

  if (!resolvedPlaceId || !name || typeof lat !== "number" || typeof lng !== "number") {
    throw new Error("Google place details response is missing required fields.");
  }

  if (!category) {
    throw new Error("Selected Google place is not an allowed food or drink place.");
  }

  const [imageUrl, walkingRoute] = await Promise.all([
    fetchGooglePlacePhotoUri(photo?.name),
    fetchGoogleWalkingRoute({ lat, lng }),
  ]);

  return {
    googlePlaceId: resolvedPlaceId,
    name,
    address: data.formattedAddress ?? null,
    lat,
    lng,
    types,
    category,
    imageUrl,
    photoAttributions: imageUrl ? toPhotoAttributions(photo) : [],
    distanceFromOfficeMeters: walkingRoute.distanceFromOfficeMeters,
    walkingDurationSeconds: walkingRoute.walkingDurationSeconds,
  };
}
