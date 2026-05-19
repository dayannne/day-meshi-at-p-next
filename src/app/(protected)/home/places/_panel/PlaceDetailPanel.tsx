import { Button } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { ReviewCard } from "@/features/review/components/ReviewCard";
import type { Place, PlacePopularReviewTag, PlaceReviewPreview } from "@/features/places/types";

import { HomePanelFrame } from "../../_panel/HomePanelFrame";

type PlaceDetailPanelProps = {
  closeHref: string;
  place: Place | null;
  popularReviewTags: PlacePopularReviewTag[];
  reviewPreviews: PlaceReviewPreview[];
  requestedPlaceId?: string;
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

export function PlaceDetailPanel({
  closeHref,
  place,
  popularReviewTags,
  reviewPreviews,
  requestedPlaceId,
}: PlaceDetailPanelProps) {
  return (
    <HomePanelFrame title="お店詳細" closeHref={closeHref}>
      {place ? (
        <div className="h-full overflow-y-auto p-6">
          <div className="space-y-4">
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
              <h4 className="text-lg font-bold text-slate-950">{place.name}</h4>
            </div>

            <dl className="grid grid-cols-[max-content_1fr] gap-x-3 gap-y-2 text-sm text-slate-600">
              <dt className="font-semibold text-slate-950">評価</dt>
              <dd>
                {place.avgRating} ({place.reviewCount}件)
              </dd>
            </dl>

            <section className="border-t border-slate-200 pt-4">
              {popularReviewTags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  <Tag className="h-auto min-h-6 max-w-full px-2.5 py-1 whitespace-normal">
                    {place.category ?? "カテゴリ未設定"}
                  </Tag>
                  {popularReviewTags.map((tag) => (
                    <Tag
                      key={tag.id}
                      className="h-auto min-h-6 max-w-full px-2.5 py-1 whitespace-normal"
                    >
                      {tag.emoji ? <span>{tag.emoji}</span> : null}
                      <span className="break-words">{tag.name}</span>
                    </Tag>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">まだタグ付きレビューがありません。</p>
              )}
            </section>

            <section className="border-t border-slate-200 pt-4">
              <div className="flex items-center justify-between gap-3">
                <h5 className="text-sm font-bold text-slate-950">社員レビュー</h5>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled
                  className="h-8 px-2 text-xs"
                >
                  全てのレビュー
                </Button>
              </div>

              {reviewPreviews.length > 0 ? (
                <div className="mt-3 space-y-2">
                  {reviewPreviews.map((review) => (
                    <ReviewCard
                      key={review.id}
                      id={review.id}
                      name={review.authorName}
                      rating={review.rating}
                      comment={review.comment}
                      date={review.date}
                      variant="placeDetail"
                    />
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500">まだ社員レビューがありません。</p>
              )}
            </section>
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
