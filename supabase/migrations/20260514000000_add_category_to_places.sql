-- places に店舗カテゴリを段階的に追加する。
-- 既存データへのバックフィル前でも安全に適用できるよう、まずは nullable で追加する。
alter table public.places
add column if not exists category text;

comment on column public.places.category is 'Google Places やアプリ内分類に由来する店舗カテゴリ。';
