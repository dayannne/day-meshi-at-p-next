export type Tag = {
  id: string;
  name: string;
  categoryId: string;
  emoji?: string | null;
};

export type TagCategory = {
  id: string;
  name: string;
};

export type TagGroup = {
  category: TagCategory;
  tags: Tag[];
};
