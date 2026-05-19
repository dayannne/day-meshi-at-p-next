-- 店舗詳細の最新レビュー3件取得を安定させるための複合インデックス。
create index if not exists reviews_place_id_created_at_id_idx
on public.reviews (place_id, created_at desc, id asc);
