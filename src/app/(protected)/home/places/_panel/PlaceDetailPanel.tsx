import type { Place } from "@/features/places/types";

import { HomePanelFrame } from "../../_panel/HomePanelFrame";

type PlaceDetailPanelProps = {
  closeHref: string;
  place: Place | null;
  requestedPlaceId?: string;
};

export function PlaceDetailPanel({ closeHref, place, requestedPlaceId }: PlaceDetailPanelProps) {
  return (
    <HomePanelFrame title="お店詳細" closeHref={closeHref}>
      {place ? (
        <div className="h-full overflow-y-auto p-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-slate-950">{place.name}</h4>
              <p className="mt-1 text-sm text-slate-500">{place.category ?? "カテゴリ未設定"}</p>
            </div>

            <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-sm text-slate-600">
              <dt className="font-semibold text-slate-950">評価</dt>
              <dd>
                {place.avgRating} ({place.reviewCount}件)
              </dd>
              <dt className="font-semibold text-slate-950">Google Place ID</dt>
              <dd className="break-all">{place.googlePlaceId}</dd>
              <dt className="font-semibold text-slate-950">緯度</dt>
              <dd>{place.lat}</dd>
              <dt className="font-semibold text-slate-950">経度</dt>
              <dd>{place.lng}</dd>
            </dl>
          </div>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center p-6 text-center text-sm text-slate-500">
          <div>
            <p>お店が見つかりませんでした。</p>
            {requestedPlaceId ? <p className="mt-2 break-all">ID: {requestedPlaceId}</p> : null}
          </div>
        </div>
      )}
    </HomePanelFrame>
  );
}
