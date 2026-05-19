import Link from "next/link";
import { Plus } from "lucide-react";

import { MapMarkersSync } from "@/components/google-maps";
import { Button } from "@/components/ui/Button";
import { getPlacesAction } from "@/features/places/actions";
import { PlacesList } from "@/features/places/components/PlacesList";
import { PlacesPagination } from "@/features/places/components/PlacesPagination";
import { toPlaceMarkers } from "@/features/places/placeMarkers";

import { ExistingPlaceReviewPanel } from "./_panel/ExistingPlaceReviewPanel";
import { NewPlaceReviewPanel } from "./_panel/NewPlaceReviewPanel";
import { PlaceDetailPanel } from "./_panel/PlaceDetailPanel";
import {
  buildPlacesHref,
  EXISTING_PLACE_REVIEW_PANEL,
  NEW_PLACE_REVIEW_PANEL,
  PLACE_DETAIL_PANEL,
} from "./_panel/panelLinks";
import { ExploreLeftPanel } from "@/features/places/components/ExploreLeftPanel";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/Input";

const PLACES_PAGE_SIZE = 20;

type SearchParamValue = string | string[] | undefined;

type ExplorePageProps = {
  searchParams: Promise<{
    page?: SearchParamValue;
    panel?: SearchParamValue;
    placeId?: SearchParamValue;
    rating?: SearchParamValue;
    price?: SearchParamValue;
  }>;
};

function getFirstParam(value: SearchParamValue): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function parsePageParam(value: SearchParamValue): number {
  const parsedPage = Number(getFirstParam(value));

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

function getOptionalStringParam(value: string | string[] | undefined): string | undefined {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

export default async function ExplorePage({ searchParams }: ExplorePageProps) {
  const { page, panel, placeId } = await searchParams;
  const requestedPage = parsePageParam(page);
  const panelName = getFirstParam(panel);
  const selectedPlaceId = getFirstParam(placeId);
  const isNewPlaceReviewPanel = panelName === NEW_PLACE_REVIEW_PANEL;
  const isPlaceDetailPanel = panelName === PLACE_DETAIL_PANEL && Boolean(selectedPlaceId);
  const isExistingPlaceReviewPanel =
    panelName === EXISTING_PLACE_REVIEW_PANEL && Boolean(selectedPlaceId);
  const { places, pagination } = await getPlacesAction({
    page: requestedPage,
    pageSize: PLACES_PAGE_SIZE,
  });
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
  const buildExistingPlaceReviewHref = (placeId: string) =>
    buildPlacesHref({
      page: pagination.page,
      panel: EXISTING_PLACE_REVIEW_PANEL,
      placeId,
    });
  const placeDetailHrefs = Object.fromEntries(
    places.map((place) => [place.id, buildPlaceDetailHref(place.id)])
  );
  const placeMarkers = toPlaceMarkers(places).map((marker) => ({
    ...marker,
    href: placeDetailHrefs[marker.id],
  }));
  const selectedMarkerId =
    isPlaceDetailPanel || isExistingPlaceReviewPanel ? selectedPlaceId : null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 overflow-hidden">
      <MapMarkersSync source="places" markers={placeMarkers} selectedMarkerId={selectedMarkerId} />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ExploreLeftPanel
          places={places}
          pagination={pagination}
          newPlaceReviewHref={newPlaceReviewHref}
          placeDetailHrefs={placeDetailHrefs} // 一覧のリンク用
        />
      </div>
      {isNewPlaceReviewPanel ? <NewPlaceReviewPanel closeHref={closePanelHref} /> : null}
      {isPlaceDetailPanel && selectedPlaceId ? (
        <PlaceDetailPanel
          closeHref={closePanelHref}
          placeId={selectedPlaceId}
          detailHref={buildPlaceDetailHref(selectedPlaceId)}
          reviewHref={buildExistingPlaceReviewHref(selectedPlaceId)}
        />
      ) : null}
      {isExistingPlaceReviewPanel && selectedPlaceId ? (
        <ExistingPlaceReviewPanel
          closeHref={closePanelHref}
          detailHref={buildPlaceDetailHref(selectedPlaceId)}
          placeId={selectedPlaceId}
        />
      ) : null}
    </div>
  );
}
