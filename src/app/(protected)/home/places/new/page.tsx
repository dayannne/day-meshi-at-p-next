"use client";

import { useRouter } from "next/navigation";

import { ReviewForm } from "@/features/review/components/ReviewForm";

export default function NewPlaceWithReviewPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <ReviewForm onClose={() => router.push("/home/places")} />
    </div>
  );
}
