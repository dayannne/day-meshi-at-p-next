import { useState } from "react";
import { TagItem } from "../types";

export const useTagSelection = (initialSelected: TagItem[] = []) => {
  const [selectedTags, setSelectedTags] = useState<TagItem[]>(initialSelected);

  const handleTagToggle = (tag: TagItem) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id) ? prev.filter((t) => t.id !== tag.id) : [...prev, tag]
    );
  };

  return { selectedTags, handleTagToggle };
};
