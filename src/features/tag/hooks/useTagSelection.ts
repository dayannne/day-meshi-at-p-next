import { useState } from "react";
import { Tag } from "../types";

export const useTagSelection = (initialSelected: Tag[] = []) => {
  const [selectedTags, setSelectedTags] = useState<Tag[]>(initialSelected);

  const handleTagToggle = (tag: Tag) => {
    setSelectedTags((prev) =>
      prev.some((t) => t.id === tag.id) ? prev.filter((t) => t.id !== tag.id) : [...prev, tag]
    );
  };

  return { selectedTags, handleTagToggle };
};
