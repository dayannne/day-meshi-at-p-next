import Link from "next/link";
import { Plus } from "lucide-react";

import { MapMarkersSync } from "@/components/google-maps";
import { Button } from "@/components/ui/Button";
import {
  getPlaceAction,
  getPlaceGoogleBusinessDetailsAction,
  getPlacePopularReviewTagsAction,
  getPlaceReviewPreviewsAction,
  getPlacesAction,
} from "@/features/places/actions";
import { PlacesList } from "@/features/places/components/PlacesList";
import { PlacesPagination } from "@/features/places/components/PlacesPagination";
import { toPlaceMarker, toPlaceMarkers } from "@/features/places/placeMarkers";
import { getTagGroupsAction } from "@/features/tag/actions";

import { NewPlaceReviewPanel } from "./_panel/NewPlaceReviewPanel";
import { PlaceDetailPanel } from "./_panel/PlaceDetailPanel";
import { buildPlacesHref, NEW_PLACE_REVIEW_PANEL, PLACE_DETAIL_PANEL } from "./_panel/panelLinks";

const PLACES_PAGE_SIZE = 20;

type SearchParamValue = string | string[] | undefined;

type ExplorePageProps = {
  searchParams: Promise<{
    page?: SearchParamValue;
    panel?: SearchParamValue;
    placeId?: SearchParamValue;
  }>;
};

function getFirstParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePageParam(value: SearchParamValue): number {
  const parsedPage = Number(getFirstParam(value));

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { page, panel, placeId } = await searchParams;
  const requestedPage = parsePageParam(page);
  const panelName = getFirstParam(panel);
  const selectedPlaceId = getFirstParam(placeId);
  const isNewPlaceReviewPanel = panelName === NEW_PLACE_REVIEW_PANEL;
  const isPlaceDetailPanel = panelName === PLACE_DETAIL_PANEL && Boolean(selectedPlaceId);
  const placesResultPromise = getPlacesAction({
    page: requestedPage,
    pageSize: PLACES_PAGE_SIZE,
  });
  const tagGroupsPromise = isNewPlaceReviewPanel ? getTagGroupsAction() : Promise.resolve(null);
  const selectedPlacePromise =
    isPlaceDetailPanel && selectedPlaceId ? getPlaceAction(selectedPlaceId) : Promise.resolve(null);
  const popularReviewTagsPromise =
    isPlaceDetailPanel && selectedPlaceId
      ? getPlacePopularReviewTagsAction(selectedPlaceId)
      : Promise.resolve([]);
  const reviewPreviewsPromise =
    isPlaceDetailPanel && selectedPlaceId
      ? getPlaceReviewPreviewsAction(selectedPlaceId)
      : Promise.resolve([]);
  const googleBusinessDetailsPromise =
    isPlaceDetailPanel && selectedPlaceId
      ? getPlaceGoogleBusinessDetailsAction(selectedPlaceId)
      : Promise.resolve(null);
  const [
    { places, pagination },
    tagGroups,
    selectedPlaceResult,
    popularReviewTags,
    reviewPreviews,
    googleBusinessDetails,
  ] = await Promise.all([
    placesResultPromise,
    tagGroupsPromise,
    selectedPlacePromise,
    popularReviewTagsPromise,
    reviewPreviewsPromise,
    googleBusinessDetailsPromise,
  ]);
  const selectedPlace =
    selectedPlaceId != null
      ? (places.find((place) => place.id === selectedPlaceId) ?? selectedPlaceResult)
      : null;
  const closePanelHref = buildPlacesHref({ page: pagination.page });
  const newPlaceReviewHref = buildPlacesHref({
    page: pagination.page,
    panel: NEW_PLACE_REVIEW_PANEL,
  });
  const buildPlaceDetailHref = (placeId: string) =>
    buildPlacesHref({
      page: pagination.page,
      panel: PLACE_DETAIL_PANEL,
      placeId,
    });
  const placeDetailHrefs = Object.fromEntries(
    places.map((place) => [place.id, buildPlaceDetailHref(place.id)])
  );
  const placeMarkers = toPlaceMarkers(places).map((marker) => ({
    ...marker,
    href: placeDetailHrefs[marker.id],
  }));
  const markers =
    selectedPlace && !places.some((place) => place.id === selectedPlace.id)
      ? [
          ...placeMarkers,
          { ...toPlaceMarker(selectedPlace), href: buildPlaceDetailHref(selectedPlace.id) },
        ]
      : placeMarkers;
  const selectedMarkerId = isPlaceDetailPanel ? (selectedPlace?.id ?? null) : null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden not-italic">
      <MapMarkersSync source="places" markers={markers} selectedMarkerId={selectedMarkerId} />
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-slate-950">お店を検索</h2>
        <Button asChild size="sm" className="gap-2">
          <Link href={newPlaceReviewHref} scroll={false}>
            <Plus className="size-4" aria-hidden="true" />
            新しいレビュー
          </Link>
        </Button>
      </div>
      {/* <SearchFilterBar /> */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <p className="mt-1 text-sm text-slate-500">お店一覧 ({pagination.totalCount}件)</p>
        <PlacesList places={places} placeDetailHrefs={placeDetailHrefs} />
      </div>
      <PlacesPagination
        currentPage={pagination.page}
        totalPages={pagination.totalPages}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
      />
      {isNewPlaceReviewPanel && tagGroups ? (
        <NewPlaceReviewPanel tagGroups={tagGroups} closeHref={closePanelHref} />
      ) : null}
      {isPlaceDetailPanel ? (
        <PlaceDetailPanel
          closeHref={closePanelHref}
          place={selectedPlace}
          popularReviewTags={popularReviewTags}
          reviewPreviews={reviewPreviews}
          googleBusinessDetails={googleBusinessDetails}
          requestedPlaceId={selectedPlaceId}
        />
      ) : null}
    </div>
  );
}
