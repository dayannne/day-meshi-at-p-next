import { useState } from "react";
import { useTagSelection } from "@/features/tag/hooks/useTagSelection";
import type { TagGroup } from "@/features/tag/types";

interface PlaceInfo {
  id?: string;
  name: string;
  address: string;
}

export function useReviewForm(initialPlace?: PlaceInfo, tagGroups: TagGroup[] = []) {
  const [selectedPlace, setSelectedPlace] = useState(initialPlace);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [visitDate, setVisitDate] = useState<Date | undefined>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const { selectedTags, handleTagToggle } = useTagSelection();
  const [isPending, setIsPending] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedPlace) newErrors.place = "お店を選択してください。";
    if (rating === 0) newErrors.rating = "レートを選択してください。";
    // 価格帯の必須チェック
    if (priceRange === null) newErrors.priceRange = "価格帯を選択してください。";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (onSuccess: () => void) => {
    void onSuccess;

    if (!validate()) return;

    setIsPending(true);

    try {
      const submitData = {
        placeId: selectedPlace?.id,
        rating: rating,
        priceRange: priceRange,
        comment: comment,
        visitDate: visitDate,
        tagIds: selectedTags.map((t) => t.id),
      };
      console.log(submitData);

      // 4. Server Action 実行
      // const result = await createReviewAction(submitData);

      // if (result.success) {
      //   onSuccess(); // 成功したらフォームを閉じる等の処理
      // } else {
      //   alert(result.error);
      // }
    } finally {
      setIsPending(false);
    }
  };

  return {
    state: {
      selectedPlace,
      rating,
      comment,
      visitDate,
      errors,
      selectedTags,
      priceRange,
      groupedTags: tagGroups,
      isPending,
    },
    handlers: {
      setRating,
      setComment,
      setVisitDate,
      setSelectedPlace,
      handleTagToggle,
      setPriceRange,
      validate,
      onSubmit,
    },
  };
}
