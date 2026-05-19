"use client";

import { useRouter } from "next/navigation";

import { ReviewForm } from "@/features/review/components/ReviewForm";
import type { TagGroup } from "@/features/tag/types";

type NewPlaceReviewPanelClientProps = {
  tagGroups: TagGroup[];
  closeHref: string;
};

export function NewPlaceReviewPanelClient({
  tagGroups,
  closeHref,
}: NewPlaceReviewPanelClientProps) {
  const router = useRouter();

  return (
    <ReviewForm
      tagGroups={tagGroups}
      onClose={() => router.replace(closeHref, { scroll: false })}
    />
  );
}
