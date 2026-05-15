// features/tag/constants/tags.ts などのファイルに置くイメージです
import { Tag, TagCategory } from "../types";

// 1. カテゴリーだけのリスト
export const dummyCategories: TagCategory[] = [
  { id: "cat_001", name: "味・食感" },
  { id: "cat_002", name: "設備・サービス" },
  { id: "cat_003", name: "利用シーン" },
];

// 2. タグだけのリスト（categoryId で自分がどこに属するか持っている）
export const dummyTags: Tag[] = [
  // 味・食感 (cat_001)
  { id: "t_01", name: "モチモチ", categoryId: "cat_001", emoji: "🍡" },
  { id: "t_02", name: "ガッツリ", categoryId: "cat_001", emoji: "🍖" },
  { id: "t_03", name: "激辛", categoryId: "cat_001", emoji: "🔥" },

  // 設備・サービス (cat_002)
  { id: "t_04", name: "Wi-Fiあり", categoryId: "cat_002", emoji: "📶" },
  { id: "t_05", name: "コンセントあり", categoryId: "cat_002", emoji: "🔌" },
  { id: "t_06", name: "テラス席", categoryId: "cat_002", emoji: "🌿" },

  // 利用シーン (cat_003)
  { id: "t_07", name: "お一人様歓迎", categoryId: "cat_003", emoji: "🚶" },
  { id: "t_08", name: "女子会向き", categoryId: "cat_003", emoji: "👩‍👩‍👧" },
  { id: "t_09", name: "子連れOK", categoryId: "cat_003", emoji: "👶" },
];
