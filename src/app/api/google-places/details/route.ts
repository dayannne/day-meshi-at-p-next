import { requireActiveUser } from "@/features/auth/access";
import { fetchGooglePlaceDetails, signGooglePlaceSelection } from "@/features/places/googlePlaces";

export async function POST(request: Request) {
  await requireActiveUser();

  const body = (await request.json().catch(() => null)) as {
    placeId?: unknown;
    sessionToken?: unknown;
  } | null;
  const placeId = typeof body?.placeId === "string" ? body.placeId : "";
  const sessionToken = typeof body?.sessionToken === "string" ? body.sessionToken : "";

  if (!placeId) {
    return Response.json({ error: "placeId is required." }, { status: 400 });
  }

  if (!sessionToken) {
    return Response.json({ error: "sessionToken is required." }, { status: 400 });
  }

  try {
    const place = await fetchGooglePlaceDetails({ placeId, sessionToken });

    return Response.json({
      place: {
        ...place,
        sessionToken,
        selectionSignature: signGooglePlaceSelection(place, sessionToken),
      },
    });
  } catch {
    return Response.json({ error: "Failed to load Google place details." }, { status: 502 });
  }
}
