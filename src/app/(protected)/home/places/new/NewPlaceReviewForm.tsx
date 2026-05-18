"use client";

import { useRouter } from "next/navigation";

import { ReviewForm } from "@/features/review/components/ReviewForm";
import type { TagGroup } from "@/features/tag/types";

type NewPlaceReviewFormProps = {
  tagGroups: TagGroup[];
};

export function NewPlaceReviewForm({ tagGroups }: NewPlaceReviewFormProps) {
  const router = useRouter();

  return <ReviewForm tagGroups={tagGroups} onClose={() => router.push("/home/places")} />;
}
