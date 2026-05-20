export const NEW_PLACE_REVIEW_PANEL = "new-place-review";
export const PLACE_DETAIL_PANEL = "place-detail";
export const EXISTING_PLACE_REVIEW_PANEL = "existing-place-review";
export const PLACE_REVIEWS_PANEL = "place-reviews";

type PlacesPanel =
  | typeof NEW_PLACE_REVIEW_PANEL
  | typeof PLACE_DETAIL_PANEL
  | typeof EXISTING_PLACE_REVIEW_PANEL
  | typeof PLACE_REVIEWS_PANEL;

type BuildPlacesHrefOptions = {
  page: number;
  panel?: PlacesPanel;
  placeId?: string;
  reviewId?: string;
};

export function buildPlacesHref({
  page,
  panel,
  placeId,
  reviewId,
}: BuildPlacesHrefOptions): string {
  const params = new URLSearchParams({ page: String(page) });

  if (panel) {
    params.set("panel", panel);
  }

  if (
    (panel === PLACE_DETAIL_PANEL ||
      panel === EXISTING_PLACE_REVIEW_PANEL ||
      panel === PLACE_REVIEWS_PANEL) &&
    placeId
  ) {
    params.set("placeId", placeId);
  }

  if (panel === PLACE_REVIEWS_PANEL && reviewId) {
    params.set("reviewId", reviewId);
  }

  return `/home/places?${params.toString()}`;
}
