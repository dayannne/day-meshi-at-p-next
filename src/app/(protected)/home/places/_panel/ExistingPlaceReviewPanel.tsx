import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { MapMarkersSync } from "@/components/google-maps";
import { Button } from "@/components/ui/Button";
import { getPlaceAction } from "@/features/places/actions";
import { toPlaceMarker } from "@/features/places/placeMarkers";

import { HomePanelFrame } from "../../_panel/HomePanelFrame";

type ExistingPlaceReviewPanelProps = {
  closeHref: string;
  detailHref: string;
  placeId: string;
};

function ExistingPlaceReviewLoading() {
  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="space-y-4">
        <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
        <div className="h-24 w-full animate-pulse rounded bg-slate-100" />
        <p className="text-sm text-slate-500">レビュー投稿フォームを読み込んでいます。</p>
      </div>
    </div>
  );
}

function ExistingPlaceReviewNotFound({ placeId }: { placeId: string }) {
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

async function ExistingPlaceReviewBody({
  detailHref,
  placeId,
}: Pick<ExistingPlaceReviewPanelProps, "detailHref" | "placeId">) {
  const place = await getPlaceAction(placeId);

  if (!place) {
    return <ExistingPlaceReviewNotFound placeId={placeId} />;
  }

  const marker = {
    ...toPlaceMarker(place),
    href: detailHref,
  };

  return (
    <>
      <MapMarkersSync source="place-detail" markers={[marker]} selectedMarkerId={place.id} />
      <div className="h-full overflow-y-auto p-6">
        <div className="space-y-5">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 justify-start gap-2 px-0 text-xs"
          >
            <Link href={detailHref} scroll={false}>
              <ArrowLeft className="size-4" aria-hidden="true" />
              お店詳細に戻る
            </Link>
          </Button>

          <div>
            <p className="text-xs font-bold text-slate-500">レビュー対象</p>
            <h4 className="mt-1 text-lg font-bold break-words text-slate-950">{place.name}</h4>
          </div>

          <form className="space-y-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
            <div className="space-y-2">
              <p className="text-sm font-bold text-slate-950">既存店舗レビュー投稿フォーム</p>
              <p className="text-sm leading-6 text-slate-600">
                テスト用のダミーテキストです。ここに既存DB店舗向けのレビュー作成フォームを接続します。
              </p>
            </div>
            <Button type="button" disabled className="h-11 w-full text-base">
              投稿フォーム準備中
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}

export function ExistingPlaceReviewPanel({
  closeHref,
  detailHref,
  placeId,
}: ExistingPlaceReviewPanelProps) {
  return (
    <HomePanelFrame title="レビューを投稿" closeHref={closeHref}>
      <Suspense key={placeId} fallback={<ExistingPlaceReviewLoading />}>
        <ExistingPlaceReviewBody detailHref={detailHref} placeId={placeId} />
      </Suspense>
    </HomePanelFrame>
  );
}
