export const NEW_PLACE_REVIEW_PANEL = "new-place-review";
export const PLACE_DETAIL_PANEL = "place-detail";
export const EXISTING_PLACE_REVIEW_PANEL = "existing-place-review";

type PlacesPanel =
  | typeof NEW_PLACE_REVIEW_PANEL
  | typeof PLACE_DETAIL_PANEL
  | typeof EXISTING_PLACE_REVIEW_PANEL;

type BuildPlacesHrefOptions = {
  page: number;
  panel?: PlacesPanel;
  placeId?: string;
};

export function buildPlacesHref({ page, panel, placeId }: BuildPlacesHrefOptions): string {
  const params = new URLSearchParams({ page: String(page) });

  if (panel) {
    params.set("panel", panel);
  }

  if ((panel === PLACE_DETAIL_PANEL || panel === EXISTING_PLACE_REVIEW_PANEL) && placeId) {
    params.set("placeId", placeId);
  }

  return `/home/places?${params.toString()}`;
}
