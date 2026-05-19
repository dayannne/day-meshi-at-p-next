-- places テーブルの place_range カラムを price_range にリネームする。
alter table public.places
rename column place_range to price_range;

comment on column public.places.price_range is '店舗の価格帯';
