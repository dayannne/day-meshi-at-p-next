import { Suspense } from "react";
import Link from "next/link";
import { PencilLine } from "lucide-react";

import { MapMarkersSync } from "@/components/google-maps";
import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import {
  getPlaceAction,
  getPlaceGoogleBusinessDetailsAction,
  getPlacePopularReviewTagsAction,
  getPlaceReviewPreviewsAction,
} from "@/features/places/actions";
import { toPlaceMarker } from "@/features/places/placeMarkers";
import type {
  Place,
  PlaceGoogleBusinessDetails,
  PlacePopularReviewTag,
  PlaceReviewPreview,
} from "@/features/places/types";
import { ReviewCard } from "@/features/review/components/ReviewCard";

import { HomePanelFrame } from "../../_panel/HomePanelFrame";

type PlaceDetailPanelProps = {
  closeHref: string;
  placeId: string;
  // 지도 마커 클릭/선택 상태와 상세 패널 URL을 맞추기 위한 href.
  detailHref: string;
  reviewHref: string;
  reviewDetailHref: (reviewId: string) => string;
  reviewsHref: string;
};

function normalizeAttributionUrl(uri: string | null) {
  if (!uri) {
    return null;
  }

  if (uri.startsWith("//")) {
    return `https:${uri}`;
  }

  return uri;
}

function PhotoAttributions({ place }: { place: Place }) {
  if (place.photoAttributions.length === 0) {
    return null;
  }

  return (
    <p className="text-xs leading-snug text-slate-500">
      Photo:{" "}
      {place.photoAttributions.map((attribution, index) => {
        const href = normalizeAttributionUrl(attribution.uri);
        const separator = index > 0 ? ", " : "";

        return (
          <span key={`${attribution.displayName}-${index}`}>
            {separator}
            {href ? (
              <a
                href={href}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-2"
              >
                {attribution.displayName}
              </a>
            ) : (
              attribution.displayName
            )}
          </span>
        );
      })}
    </p>
  );
}

function getBusinessStatusLabel(details: PlaceGoogleBusinessDetails): string {
  switch (details.businessStatus) {
    case "CLOSED_TEMPORARILY":
      return "臨時休業";
    case "CLOSED_PERMANENTLY":
      return "閉業";
    case "FUTURE_OPENING":
      return "開業予定";
    default:
      if (details.openNow === true) {
        return "営業中";
      }

      if (details.openNow === false) {
        return "営業時間外";
      }

      return "不明";
  }
}

function BusinessInfoSection({ details }: { details: PlaceGoogleBusinessDetails | null }) {
  // Google Places에서 가져오는 영업 정보 영역. 기본 장소 정보보다 늦게 로드될 수 있다.
  return (
    <section className="border-t border-slate-200 pt-4">
      <h5 className="text-sm font-bold text-slate-950">店舗情報</h5>
      {details ? (
        <div className="mt-3 space-y-3">
          <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm text-slate-600">
            <dt className="font-semibold text-slate-950">住所</dt>
            <dd className="break-words">{details.address ?? "-"}</dd>
            <dt className="font-semibold text-slate-950">電話番号</dt>
            <dd className="break-words">
              {details.phoneNumber ? (
                <a href={`tel:${details.phoneNumber}`} className="underline underline-offset-2">
                  {details.phoneNumber}
                </a>
              ) : (
                "-"
              )}
            </dd>
            <dt className="font-semibold text-slate-950">営業状態</dt>
            <dd>{getBusinessStatusLabel(details)}</dd>
            <dt className="font-semibold text-slate-950">今日の営業時間</dt>
            <dd className="break-words">{details.todayOpeningHours ?? "営業時間不明"}</dd>
          </dl>
          {details.googleMapsUri ? (
            <Button asChild variant="outline" size="sm" className="h-9 w-full">
              <a href={details.googleMapsUri} target="_blank" rel="noreferrer">
                Google Mapsで開く
              </a>
            </Button>
          ) : null}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">Google Mapsの店舗情報を取得できませんでした。</p>
      )}
    </section>
  );
}

function PopularReviewTagsSection({
  category,
  tags,
}: {
  category: string | null;
  tags: PlacePopularReviewTag[];
}) {
  // 카테고리는 첫 번째 칩으로 고정하고, 리뷰 기반 인기 태그는 그 뒤에 붙인다.
  return (
    <section className="border-t border-slate-200 pt-4">
      <h5 className="text-sm font-bold text-slate-950">カテゴリ・人気タグ</h5>
      <div className="mt-3 flex flex-wrap gap-2">
        <Tag className="h-auto min-h-6 max-w-full px-2.5 py-1 whitespace-normal">
          <span className="break-words">{category ?? "カテゴリ未設定"}</span>
        </Tag>
        {tags.map((tag) => (
          <Tag key={tag.id} className="h-auto min-h-6 max-w-full px-2.5 py-1 whitespace-normal">
            {tag.emoji ? <span>{tag.emoji}</span> : null}
            <span className="break-words">{tag.name}</span>
          </Tag>
        ))}
      </div>
      {tags.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">まだタグ付きレビューがありません。</p>
      ) : null}
    </section>
  );
}

function ReviewPreviewsSection({
  reviews,
  reviewDetailHref,
  reviewsHref,
}: {
  reviews: PlaceReviewPreview[];
  reviewDetailHref: (reviewId: string) => string;
  reviewsHref: string;
}) {
  // 상세 패널 안의 리뷰 미리보기 영역. 전체 리뷰 이동 버튼은 전체 리뷰 패널로 연결한다.
  return (
    <section className="border-t border-slate-200 pt-4">
      <div className="flex items-center justify-between gap-3">
        <h5 className="text-sm font-bold text-slate-950">社員レビュー</h5>
        <Button asChild variant="ghost" size="sm" className="h-8 px-2 text-xs">
          <Link href={reviewsHref} scroll={false}>
            全てのレビュー
          </Link>
        </Button>
      </div>

      {reviews.length > 0 ? (
        <div className="mt-3 space-y-2">
          {reviews.map((review) => (
            <ReviewCard
              key={review.id}
              id={review.id}
              name={review.authorName}
              rating={review.rating}
              comment={review.comment}
              date={review.date}
              href={reviewDetailHref(review.id)}
              variant="placeDetail"
            />
          ))}
        </div>
      ) : (
        <p className="mt-3 text-sm text-slate-500">まだ社員レビューがありません。</p>
      )}
    </section>
  );
}

function PlaceDetailLoading() {
  // 바깥 Suspense fallback. 로딩 중에도 기존 리스트 마커 선택은 유지해야 하므로 선택 상태는 건드리지 않는다.
  return (
    <>
      <MapMarkersSync source="place-detail" markers={[]} />
      <div className="h-full overflow-y-auto p-6">
        <div className="space-y-4">
          <div className="aspect-4/3 w-full animate-pulse rounded-lg bg-slate-100" />
          <div className="space-y-2">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-100" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-slate-100" />
          </div>
          <p className="text-sm text-slate-500">お店情報を読み込んでいます。</p>
        </div>
      </div>
    </>
  );
}

function PlaceDetailExtrasLoading() {
  // 안쪽 Suspense fallback. Google 정보/태그/리뷰처럼 느린 부가 섹션만 대체한다.
  return (
    <div className="space-y-4">
      <section className="border-t border-slate-200 pt-4">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-slate-100" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-slate-100" />
        </div>
      </section>
      <section className="border-t border-slate-200 pt-4">
        <div className="h-4 w-20 animate-pulse rounded bg-slate-100" />
        <div className="mt-3 flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-slate-100" />
          <div className="h-6 w-20 animate-pulse rounded-full bg-slate-100" />
        </div>
      </section>
    </div>
  );
}

function PlaceNotFound({ placeId }: { placeId: string }) {
  // 없는 장소로 직접 접근한 경우 상세 전용 마커 레이어도 같이 비운다.
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

async function PlaceDetailExtras({
  category,
  placeId,
  reviewDetailHref,
  reviewsHref,
}: {
  category: string | null;
  placeId: string;
  reviewDetailHref: (reviewId: string) => string;
  reviewsHref: string;
}) {
  // 부가 정보는 기본 장소 표시 이후 병렬로 로드해서 패널 첫 표시를 막지 않는다.
  const [googleBusinessDetails, popularReviewTags, reviewPreviews] = await Promise.all([
    getPlaceGoogleBusinessDetailsAction(placeId),
    getPlacePopularReviewTagsAction(placeId),
    getPlaceReviewPreviewsAction(placeId),
  ]);

  return (
    <>
      <BusinessInfoSection details={googleBusinessDetails} />
      <PopularReviewTagsSection category={category} tags={popularReviewTags} />
      <ReviewPreviewsSection
        reviews={reviewPreviews}
        reviewDetailHref={reviewDetailHref}
        reviewsHref={reviewsHref}
      />
    </>
  );
}

async function PlaceDetailBody({
  placeId,
  detailHref,
  reviewHref,
  reviewDetailHref,
  reviewsHref,
}: {
  placeId: string;
  detailHref: string;
  reviewHref: string;
  reviewDetailHref: (reviewId: string) => string;
  reviewsHref: string;
}) {
  // 첫 화면에 필요한 기본 장소 데이터만 여기서 로드한다.
  const place = await getPlaceAction(placeId);

  if (!place) {
    return <PlaceNotFound placeId={placeId} />;
  }

  const marker = {
    ...toPlaceMarker(place),
    href: detailHref,
  };

  return (
    <>
      {/* 리스트 페이지에 없는 장소로 직접 접근해도 지도에서 선택 장소가 보이도록 별도 레이어에 등록한다. */}
      <MapMarkersSync source="place-detail" markers={[marker]} selectedMarkerId={place.id} />
      <div className="h-full overflow-y-auto p-6">
        <div className="space-y-4">
          {/* 대표 이미지 영역. 디자인 변경 시 attribution 텍스트까지 한 세트로 다룬다. */}
          {place.imageUrl ? (
            <div className="space-y-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={place.imageUrl}
                alt={`${place.name}の写真`}
                className="aspect-4/3 w-full rounded-lg object-cover"
              />
              <PhotoAttributions place={place} />
            </div>
          ) : null}

          <div>
            <h4 className="text-lg font-bold break-words text-slate-950">{place.name}</h4>
          </div>

          {/* 기본 정보 영역. 이 블록은 부가 정보 로딩과 독립적으로 먼저 표시되어야 한다. */}
          <dl className="grid grid-cols-[max-content_minmax(0,1fr)] gap-x-3 gap-y-2 text-sm text-slate-600">
            <dt className="font-semibold text-slate-950">評価</dt>
            <dd>
              {place.avgRating} ({place.reviewCount}件)
            </dd>
          </dl>

          <Button asChild size="sm" className="h-10 w-full gap-2">
            <Link href={reviewHref} scroll={false}>
              <PencilLine className="size-4" aria-hidden="true" />
              レビューを書く
            </Link>
          </Button>

          <Suspense fallback={<PlaceDetailExtrasLoading />}>
            <PlaceDetailExtras
              category={place.category}
              placeId={place.id}
              reviewDetailHref={reviewDetailHref}
              reviewsHref={reviewsHref}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

export function PlaceDetailPanel({
  closeHref,
  placeId,
  detailHref,
  reviewHref,
  reviewDetailHref,
  reviewsHref,
}: PlaceDetailPanelProps) {
  return (
    <HomePanelFrame title="お店詳細" closeHref={closeHref}>
      {/* 장소 전환 시 이전 상세 내용이 남지 않도록 placeId를 Suspense key로 사용한다. */}
      <Suspense key={placeId} fallback={<PlaceDetailLoading />}>
        <PlaceDetailBody
          placeId={placeId}
          detailHref={detailHref}
          reviewHref={reviewHref}
          reviewDetailHref={reviewDetailHref}
          reviewsHref={reviewsHref}
        />
      </Suspense>
    </HomePanelFrame>
  );
}
