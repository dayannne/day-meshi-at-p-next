-- places に店舗の価格帯などの範囲情報を段階的に追加する。
-- 既存データへのバックフィル前でも安全に適用できるよう、まずは nullable で追加する。
alter table public.places
add column if not exists place_range int;

comment on column public.places.place_range is '店舗の価格帯';