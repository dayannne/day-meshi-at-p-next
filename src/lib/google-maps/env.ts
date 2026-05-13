type PublicGoogleMapsEnv = {
  apiKey: string;
  mapId: string;
};

function readRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export function getPublicGoogleMapsEnv(): PublicGoogleMapsEnv {
  return {
    apiKey: readRequiredEnv("NEXT_PUBLIC_GOOGLE_MAPS_API_KEY"),
    mapId: readRequiredEnv("NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID"),
  };
}
