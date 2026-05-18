import { requireActiveUser } from "@/features/auth/access";
import { fetchGooglePlaceAutocomplete } from "@/features/places/googlePlaces";

export async function POST(request: Request) {
  await requireActiveUser();

  const body = (await request.json().catch(() => null)) as {
    input?: unknown;
    sessionToken?: unknown;
  } | null;
  const input = typeof body?.input === "string" ? body.input : "";
  const sessionToken = typeof body?.sessionToken === "string" ? body.sessionToken : "";

  if (!sessionToken) {
    return Response.json({ error: "sessionToken is required." }, { status: 400 });
  }

  try {
    const suggestions = await fetchGooglePlaceAutocomplete({ input, sessionToken });

    return Response.json({ suggestions });
  } catch {
    return Response.json({ error: "Failed to load Google place suggestions." }, { status: 502 });
  }
}
