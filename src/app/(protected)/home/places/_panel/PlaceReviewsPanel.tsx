import { Suspense } from "react";

import { MapMarkersSync } from "@/components/google-maps";
import { getPlaceAction, getPlaceReviewsAction } from "@/features/places/actions";
import { toPlaceMarker } from "@/features/places/placeMarkers";

import { HomePanelFrame } from "../../_panel/HomePanelFrame";
import { PlaceReviewsPanelClient } from "./PlaceReviewsPanelClient";

type PlaceReviewsPanelProps = {
  closeHref: string;
  detailHref: string;
  placeId: string;
};

function PlaceReviewsLoading() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-4">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
        <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
        <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
        <p className="text-sm text-slate-500">レビューを読み込んでいます。</p>
      </div>
    </div>
  );
}

function PlaceReviewsNotFound({ placeId }: { placeId: string }) {
  return (
    <>
      <MapMarkersSync source="place-detail" markers={[]} selectedMarkerId={null} />
      <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
        <div>
          <p>お店が見つかりませんでした。</p>
          <p className="mt-2 break-all">ID: {placeId}</p>
        </div>
      </div>
    </>
  );
}

async function PlaceReviewsBody({
  detailHref,
  placeId,
}: Pick<PlaceReviewsPanelProps, "detailHref" | "placeId">) {
  const [place, reviews] = await Promise.all([
    getPlaceAction(placeId),
    getPlaceReviewsAction(placeId),
  ]);

  if (!place) {
    return <PlaceReviewsNotFound placeId={placeId} />;
  }

  const marker = {
    ...toPlaceMarker(place),
    href: detailHref,
  };

  return (
    <>
      <MapMarkersSync source="place-detail" markers={[marker]} selectedMarkerId={place.id} />
      <PlaceReviewsPanelClient detailHref={detailHref} placeName={place.name} reviews={reviews} />
    </>
  );
}

export function PlaceReviewsPanel({ closeHref, detailHref, placeId }: PlaceReviewsPanelProps) {
  return (
    <HomePanelFrame title="社員レビュー" closeHref={closeHref}>
      <Suspense key={placeId} fallback={<PlaceReviewsLoading />}>
        <PlaceReviewsBody detailHref={detailHref} placeId={placeId} />
      </Suspense>
    </HomePanelFrame>
  );
}
