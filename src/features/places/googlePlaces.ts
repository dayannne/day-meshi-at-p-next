import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { DEFAULT_GOOGLE_MAP_CENTER } from "@/components/google-maps/constants";
import { getServerGoogleMapsEnv } from "@/lib/google-maps/env";

export const GOOGLE_PLACES_SEARCH_CENTER = DEFAULT_GOOGLE_MAP_CENTER;
export const GOOGLE_PLACES_SEARCH_RADIUS_METERS = 2000;
export const GOOGLE_PLACES_INCLUDED_PRIMARY_TYPES = ["restaurant", "bar", "cafe"] as const;

export const GOOGLE_PLACE_CATEGORIES = {
  CAFE: "カフェ",
  SUSHI: "寿司",
  RAMEN: "ラーメン",
  CHINESE: "中華",
  CURRY: "カレー",
  IZAKAYA: "居酒屋",
  SWEETS: "スイーツ",
  BAR: "バー",
  JAPANESE: "和食",
  YAKINIKU: "焼肉",
  WESTERN: "洋食",
  FAST_FOOD: "ファストフード",
  ASIAN: "アジア",
  OTHERS: "その他",
} as const;

export type GooglePlaceCategory =
  (typeof GOOGLE_PLACE_CATEGORIES)[keyof typeof GOOGLE_PLACE_CATEGORIES];

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
  primaryType: string;
  category: GooglePlaceCategory;
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
  primaryType?: string;
};

type GooglePlacePhoto = NonNullable<GooglePlaceDetailsResponse["photos"]>[number];

type GooglePlacePhotoResponse = {
  photoUri?: string;
};

type GooglePlaceBusinessStatus =
  | "BUSINESS_STATUS_UNSPECIFIED"
  | "OPERATIONAL"
  | "CLOSED_TEMPORARILY"
  | "CLOSED_PERMANENTLY"
  | "FUTURE_OPENING";

type GoogleOpeningHoursPoint = {
  date?: {
    year?: number;
    month?: number;
    day?: number;
  };
  hour?: number;
  minute?: number;
};

type GooglePlaceBusinessDetailsResponse = {
  formattedAddress?: string;
  nationalPhoneNumber?: string;
  businessStatus?: GooglePlaceBusinessStatus;
  googleMapsUri?: string;
  timeZone?: {
    id?: string;
  };
  currentOpeningHours?: {
    openNow?: boolean;
    periods?: Array<{
      open?: GoogleOpeningHoursPoint;
      close?: GoogleOpeningHoursPoint;
    }>;
    weekdayDescriptions?: string[];
  };
};

type GoogleRouteResponse = {
  routes?: Array<{
    distanceMeters?: number;
    duration?: string;
  }>;
};

const GOOGLE_PLACE_CATEGORY_RULES: Array<{
  category: GooglePlaceCategory;
  primaryTypes: string[];
}> = [
  {
    category: GOOGLE_PLACE_CATEGORIES.CAFE,
    primaryTypes: [
      "cafe",
      "coffee_shop",
      "coffee_roastery",
      "coffee_stand",
      "tea_house",
      "bagel_shop",
      "acai_shop",
      "juice_shop",
      "cat_cafe",
      "dog_cafe",
      "cafeteria",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.SUSHI,
    primaryTypes: ["sushi_restaurant"],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.RAMEN,
    primaryTypes: ["ramen_restaurant"],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.CHINESE,
    primaryTypes: [
      "chinese_restaurant",
      "chinese_noodle_restaurant",
      "cantonese_restaurant",
      "dim_sum_restaurant",
      "dumpling_restaurant",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.CURRY,
    primaryTypes: [
      "japanese_curry_restaurant",
      "indian_restaurant",
      "north_indian_restaurant",
      "south_indian_restaurant",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.IZAKAYA,
    primaryTypes: [
      "japanese_izakaya_restaurant",
      "yakitori_restaurant",
      "pub",
      "gastropub",
      "bar_and_grill",
      "snack_bar",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.SWEETS,
    primaryTypes: [
      "bakery",
      "dessert_restaurant",
      "dessert_shop",
      "cake_shop",
      "pastry_shop",
      "confectionery",
      "candy_store",
      "chocolate_shop",
      "chocolate_factory",
      "ice_cream_shop",
      "donut_shop",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.BAR,
    primaryTypes: [
      "bar",
      "cocktail_bar",
      "wine_bar",
      "lounge_bar",
      "hookah_bar",
      "sports_bar",
      "brewery",
      "brewpub",
      "beer_garden",
      "winery",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.JAPANESE,
    primaryTypes: ["japanese_restaurant", "tonkatsu_restaurant"],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.YAKINIKU,
    primaryTypes: [
      "yakiniku_restaurant",
      "korean_barbecue_restaurant",
      "barbecue_restaurant",
      "mongolian_barbecue_restaurant",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.WESTERN,
    primaryTypes: [
      "western_restaurant",
      "italian_restaurant",
      "french_restaurant",
      "spanish_restaurant",
      "steak_house",
      "pizza_restaurant",
      "pizza_delivery",
      "american_restaurant",
      "british_restaurant",
      "german_restaurant",
      "greek_restaurant",
      "mediterranean_restaurant",
      "mexican_restaurant",
      "tex_mex_restaurant",
      "tapas_restaurant",
      "bistro",
      "diner",
      "fish_and_chips_restaurant",
      "fondue_restaurant",
      "austrian_restaurant",
      "belgian_restaurant",
      "czech_restaurant",
      "danish_restaurant",
      "dutch_restaurant",
      "european_restaurant",
      "irish_restaurant",
      "polish_restaurant",
      "portuguese_restaurant",
      "romanian_restaurant",
      "russian_restaurant",
      "scandinavian_restaurant",
      "swiss_restaurant",
      "ukrainian_restaurant",
      "hungarian_restaurant",
      "croatian_restaurant",
      "bavarian_restaurant",
      "basque_restaurant",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.FAST_FOOD,
    primaryTypes: [
      "hamburger_restaurant",
      "fast_food_restaurant",
      "sandwich_shop",
      "hot_dog_restaurant",
      "hot_dog_stand",
      "taco_restaurant",
      "burrito_restaurant",
      "falafel_restaurant",
      "kebab_shop",
      "shawarma_restaurant",
      "gyro_restaurant",
      "chicken_restaurant",
      "chicken_wings_restaurant",
      "meal_takeaway",
      "meal_delivery",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.ASIAN,
    primaryTypes: [
      "korean_restaurant",
      "asian_restaurant",
      "asian_fusion_restaurant",
      "thai_restaurant",
      "vietnamese_restaurant",
      "indonesian_restaurant",
      "malaysian_restaurant",
      "filipino_restaurant",
      "taiwanese_restaurant",
      "cambodian_restaurant",
      "burmese_restaurant",
      "tibetan_restaurant",
      "sri_lankan_restaurant",
      "bangladeshi_restaurant",
      "pakistani_restaurant",
    ],
  },
  {
    category: GOOGLE_PLACE_CATEGORIES.OTHERS,
    primaryTypes: [
      "noodle_shop",
      "restaurant",
      "family_restaurant",
      "buffet_restaurant",
      "brunch_restaurant",
      "breakfast_restaurant",
      "food_court",
      "fine_dining_restaurant",
      "vegan_restaurant",
      "vegetarian_restaurant",
      "salad_shop",
      "soup_restaurant",
      "seafood_restaurant",
      "oyster_bar_restaurant",
      "halal_restaurant",
      "fusion_restaurant",
      "latin_american_restaurant",
      "brazilian_restaurant",
      "peruvian_restaurant",
      "argentinian_restaurant",
      "chilean_restaurant",
      "colombian_restaurant",
      "cuban_restaurant",
      "caribbean_restaurant",
      "middle_eastern_restaurant",
      "lebanese_restaurant",
      "turkish_restaurant",
      "persian_restaurant",
      "israeli_restaurant",
      "african_restaurant",
      "ethiopian_restaurant",
      "moroccan_restaurant",
      "afghani_restaurant",
      "australian_restaurant",
      "cajun_restaurant",
      "californian_restaurant",
      "southwestern_us_restaurant",
      "soul_food_restaurant",
      "hawaiian_restaurant",
    ],
  },
];

const GOOGLE_PLACE_CATEGORY_BY_PRIMARY_TYPE = new Map(
  GOOGLE_PLACE_CATEGORY_RULES.flatMap(({ category, primaryTypes }) =>
    primaryTypes.map((primaryType) => [primaryType, category] as const)
  )
);

function getGoogleMapsApiKey() {
  return getServerGoogleMapsEnv().apiKey;
}

export function getGooglePlaceCategory(
  primaryType: string | null | undefined
): GooglePlaceCategory | null {
  if (!primaryType) {
    return null;
  }

  return GOOGLE_PLACE_CATEGORY_BY_PRIMARY_TYPE.get(primaryType) ?? null;
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

function getLocalDateParts(timeZoneId: string | undefined): {
  year: number;
  month: number;
  day: number;
} | null {
  if (!timeZoneId) {
    return null;
  }

  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZoneId,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(new Date());
    const year = Number(parts.find((part) => part.type === "year")?.value);
    const month = Number(parts.find((part) => part.type === "month")?.value);
    const day = Number(parts.find((part) => part.type === "day")?.value);

    return Number.isInteger(year) && Number.isInteger(month) && Number.isInteger(day)
      ? { year, month, day }
      : null;
  } catch {
    return null;
  }
}

function isSameGoogleDate(
  date: GoogleOpeningHoursPoint["date"] | undefined,
  target: { year: number; month: number; day: number }
): boolean {
  return date?.year === target.year && date.month === target.month && date.day === target.day;
}

function formatOpeningTime(point: GoogleOpeningHoursPoint | undefined): string | null {
  if (!point || typeof point.hour !== "number" || typeof point.minute !== "number") {
    return null;
  }

  return `${String(point.hour).padStart(2, "0")}:${String(point.minute).padStart(2, "0")}`;
}

function getTodayWeekdayDescription(
  weekdayDescriptions: string[] | undefined,
  timeZoneId: string | undefined
): string | null {
  if (!weekdayDescriptions?.length || !timeZoneId) {
    return null;
  }

  try {
    const weekday = new Intl.DateTimeFormat("ja-JP", {
      timeZone: timeZoneId,
      weekday: "long",
    }).format(new Date());
    const todayDescription = weekdayDescriptions.find((description) =>
      description.startsWith(weekday)
    );

    return todayDescription?.replace(/^[^:：]+[:：]\s*/, "") || null;
  } catch {
    return null;
  }
}

function formatTodayOpeningHours(
  currentOpeningHours: GooglePlaceBusinessDetailsResponse["currentOpeningHours"],
  timeZoneId: string | undefined
): string | null {
  const today = getLocalDateParts(timeZoneId);

  if (!today) {
    return getTodayWeekdayDescription(currentOpeningHours?.weekdayDescriptions, timeZoneId);
  }

  const periodLabels = (currentOpeningHours?.periods ?? [])
    .filter((period) => isSameGoogleDate(period.open?.date, today))
    .map((period) => {
      const open = formatOpeningTime(period.open);
      const close = formatOpeningTime(period.close);

      if (!open) {
        return null;
      }

      return close ? `${open} - ${close}` : "24時間営業";
    })
    .filter((label): label is string => label !== null);

  return (
    periodLabels.join(" / ") ||
    getTodayWeekdayDescription(currentOpeningHours?.weekdayDescriptions, timeZoneId)
  );
}

function createPlaceSelectionPayload(details: GooglePlaceDetails, sessionToken: string) {
  return JSON.stringify({
    googlePlaceId: details.googlePlaceId,
    name: details.name,
    address: details.address,
    lat: details.lat,
    lng: details.lng,
    types: details.types,
    primaryType: details.primaryType,
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
          "id,displayName,formattedAddress,location,types,primaryType,photos.name,photos.authorAttributions",
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
  const primaryType = data.primaryType ?? null;
  const category = getGooglePlaceCategory(primaryType);
  const photo = data.photos?.[0];

  if (!resolvedPlaceId || !name || typeof lat !== "number" || typeof lng !== "number") {
    throw new Error("Google place details response is missing required fields.");
  }

  if (!primaryType || !category) {
    throw new Error("Google place primaryType is not supported.");
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
    primaryType,
    category,
    imageUrl,
    photoAttributions: imageUrl ? toPhotoAttributions(photo) : [],
    distanceFromOfficeMeters: walkingRoute.distanceFromOfficeMeters,
    walkingDurationSeconds: walkingRoute.walkingDurationSeconds,
  };
}

export async function fetchGooglePlaceBusinessDetails(googlePlaceId: string) {
  const normalizedGooglePlaceId = googlePlaceId.trim();

  if (!normalizedGooglePlaceId) {
    return null;
  }

  const params = new URLSearchParams({
    languageCode: "ja",
    regionCode: "jp",
  });
  const response = await fetch(
    `https://places.googleapis.com/v1/places/${encodeURIComponent(normalizedGooglePlaceId)}?${params}`,
    {
      method: "GET",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": getGoogleMapsApiKey(),
        "X-Goog-FieldMask": [
          "formattedAddress",
          "nationalPhoneNumber",
          "businessStatus",
          "googleMapsUri",
          "timeZone",
          "currentOpeningHours.openNow",
          "currentOpeningHours.periods.open.date",
          "currentOpeningHours.periods.open.hour",
          "currentOpeningHours.periods.open.minute",
          "currentOpeningHours.periods.close.date",
          "currentOpeningHours.periods.close.hour",
          "currentOpeningHours.periods.close.minute",
          "currentOpeningHours.weekdayDescriptions",
        ].join(","),
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to load Google place business details.");
  }

  const data = (await response.json()) as GooglePlaceBusinessDetailsResponse;

  return {
    address: data.formattedAddress ?? null,
    phoneNumber: data.nationalPhoneNumber ?? null,
    businessStatus: data.businessStatus ?? null,
    openNow:
      typeof data.currentOpeningHours?.openNow === "boolean"
        ? data.currentOpeningHours.openNow
        : null,
    todayOpeningHours: formatTodayOpeningHours(data.currentOpeningHours, data.timeZone?.id),
    googleMapsUri: data.googleMapsUri ?? null,
  };
}
