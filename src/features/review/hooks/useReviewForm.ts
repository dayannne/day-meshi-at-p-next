import { useEffect, useState } from "react";
import { createReviewWithPlaceAction } from "@/features/review/actions";
import { useTagSelection } from "@/features/tag/hooks/useTagSelection";
import type { GooglePlaceSuggestion } from "@/features/places/googlePlaces";
import type { TagGroup } from "@/features/tag/types";

interface PlaceInfo {
  id?: string;
  googlePlaceId?: string;
  name: string;
  address: string;
  sessionToken?: string;
}

function createSessionToken() {
  return crypto.randomUUID();
}

function formatDateInput(date: Date | undefined): string | null {
  if (!date) {
    return null;
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function useReviewForm(initialPlace?: PlaceInfo, tagGroups: TagGroup[] = []) {
  const [selectedPlace, setSelectedPlace] = useState(initialPlace);
  const [placeSearchInput, setPlaceSearchInput] = useState(initialPlace?.name ?? "");
  const [placeSuggestions, setPlaceSuggestions] = useState<GooglePlaceSuggestion[]>([]);
  const [placeSessionToken, setPlaceSessionToken] = useState(createSessionToken);
  const [isSearchingPlaces, setIsSearchingPlaces] = useState(false);
  const [placeSearchError, setPlaceSearchError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [visitDate, setVisitDate] = useState<Date | undefined>();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [priceRange, setPriceRange] = useState<number | null>(null);
  const { selectedTags, handleTagToggle } = useTagSelection();
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    const normalizedInput = placeSearchInput.trim();

    if (initialPlace || selectedPlace || normalizedInput.length < 2) {
      return;
    }

    const abortController = new AbortController();
    const timeoutId = window.setTimeout(async () => {
      setIsSearchingPlaces(true);
      setPlaceSearchError(null);

      try {
        const response = await fetch("/api/google-places/autocomplete", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            input: normalizedInput,
            sessionToken: placeSessionToken,
          }),
          signal: abortController.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to load place suggestions.");
        }

        const data = (await response.json()) as { suggestions?: GooglePlaceSuggestion[] };

        setPlaceSuggestions(data.suggestions ?? []);
      } catch {
        if (abortController.signal.aborted) {
          return;
        }

        setPlaceSuggestions([]);
        setPlaceSearchError("お店の候補を取得できませんでした。");
      } finally {
        if (!abortController.signal.aborted) {
          setIsSearchingPlaces(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeoutId);
      abortController.abort();
    };
  }, [initialPlace, placeSearchInput, placeSessionToken, selectedPlace]);

  const setPlaceSearch = (value: string) => {
    setPlaceSearchInput(value);

    if (selectedPlace) {
      setSelectedPlace(undefined);
      setPlaceSessionToken(createSessionToken());
    }

    if (value.trim().length < 2) {
      setPlaceSuggestions([]);
      setIsSearchingPlaces(false);
      setPlaceSearchError(null);
    }
  };

  const selectPlaceSuggestion = (suggestion: GooglePlaceSuggestion) => {
    setSelectedPlace({
      googlePlaceId: suggestion.placeId,
      name: suggestion.mainText,
      address: suggestion.secondaryText ?? suggestion.text,
      sessionToken: placeSessionToken,
    });
    setPlaceSearchInput(suggestion.text);
    setPlaceSuggestions([]);
    setPlaceSearchError(null);
    setErrors((currentErrors) => {
      const { place, ...restErrors } = currentErrors;
      void place;

      return restErrors;
    });
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!selectedPlace?.googlePlaceId) newErrors.place = "お店を選択してください。";
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
      const result = await createReviewWithPlaceAction({
        googlePlaceId: selectedPlace?.googlePlaceId ?? "",
        placeSessionToken: selectedPlace?.sessionToken ?? "",
        rating: rating,
        priceRange: priceRange,
        comment: comment,
        visitDate: formatDateInput(visitDate),
        tagIds: selectedTags.map((t) => t.id),
      });

      if (!result.success) {
        setErrors((currentErrors) => ({
          ...currentErrors,
          submit: result.error,
        }));
        return;
      }

      onSuccess();
    } catch {
      setErrors((currentErrors) => ({
        ...currentErrors,
        submit: "レビューの投稿に失敗しました。",
      }));
    } finally {
      setIsPending(false);
    }
  };

  return {
    state: {
      selectedPlace,
      placeSearchInput,
      placeSuggestions,
      isSearchingPlaces,
      placeSearchError,
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
      setPlaceSearch,
      selectPlaceSuggestion,
      handleTagToggle,
      setPriceRange,
      validate,
      onSubmit,
    },
  };
}
