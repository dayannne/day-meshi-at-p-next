import { getTagGroupsAction } from "@/features/tag/actions";

import { NewPlaceReviewForm } from "./NewPlaceReviewForm";

export default async function NewPlaceWithReviewPage() {
  const tagGroups = await getTagGroupsAction();

  return (
    <div className="min-h-screen bg-stone-50 p-6">
      <NewPlaceReviewForm tagGroups={tagGroups} />
    </div>
  );
}
