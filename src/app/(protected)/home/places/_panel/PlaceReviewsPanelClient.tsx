"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/Button";
import type { PlaceReview } from "@/features/places/types";
import { ReviewCard } from "@/features/review/components/ReviewCard";
import { ReviewDetail } from "@/features/review/components/ReviewDetail";
import { toggleReviewLikeAction } from "@/features/review/actions";

type PlaceReviewsPanelClientProps = {
  detailHref: string;
  placeName: string;
  reviews: PlaceReview[];
};

export function PlaceReviewsPanelClient({
  detailHref,
  placeName,
  reviews,
}: PlaceReviewsPanelClientProps) {
  const [reviewItems, setReviewItems] = useState(reviews);
  const [selectedReviewId, setSelectedReviewId] = useState<string | null>(null);
  const selectedReview = reviewItems.find((review) => review.id === selectedReviewId) ?? null;

  const toggleLike = async (reviewId: string, newState: boolean) => {
    await toggleReviewLikeAction(reviewId, newState);
    setReviewItems((currentReviews) =>
      currentReviews.map((review) => {
        if (review.id !== reviewId) {
          return review;
        }

        return {
          ...review,
          initialIsLiked: newState,
          initialLikeCount: Math.max(0, review.initialLikeCount + (newState ? 1 : -1)),
        };
      })
    );
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-none flex-col gap-3 border-b border-slate-100 p-4">
        <Button asChild variant="ghost" size="sm" className="h-8 justify-start gap-2 px-0 text-xs">
          <Link href={detailHref} scroll={false}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            お店詳細に戻る
          </Link>
        </Button>
        <div>
          <p className="text-xs font-bold text-slate-500">レビュー一覧</p>
          <h4 className="mt-1 text-lg font-bold break-words text-slate-950">{placeName}</h4>
          <p className="mt-1 text-xs font-medium text-slate-500">{reviewItems.length}件</p>
        </div>
      </div>

      {selectedReview ? (
        <>
          <div className="flex flex-none border-b border-slate-100 px-4 py-3">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 justify-start gap-2 px-0 text-xs"
              onClick={() => setSelectedReviewId(null)}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
              レビュー一覧に戻る
            </Button>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            <ReviewDetail
              id={selectedReview.id}
              mode="shop-detail"
              name={selectedReview.authorName}
              rating={selectedReview.rating}
              date={selectedReview.date}
              comment={selectedReview.comment}
              tags={selectedReview.tags}
              initialLikeCount={selectedReview.initialLikeCount}
              initialIsLiked={selectedReview.initialIsLiked}
              authorId={selectedReview.authorId}
              onLikeToggle={toggleLike}
            />
          </div>
        </>
      ) : (
        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          {reviewItems.length > 0 ? (
            <div className="space-y-3">
              {reviewItems.map((review) => (
                <ReviewCard
                  key={review.id}
                  id={review.id}
                  name={review.authorName}
                  rating={review.rating}
                  comment={review.comment}
                  date={review.date}
                  variant="reviewList"
                  onClick={setSelectedReviewId}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-sm text-slate-500">
              まだ社員レビューがありません。
            </div>
          )}
        </div>
      )}
    </div>
  );
}
