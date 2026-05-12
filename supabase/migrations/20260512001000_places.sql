-- Google Maps 由来の店舗情報を管理する。
create table public.places (
  id uuid primary key default gen_random_uuid(),
  google_place_id text not null unique,
  name text not null,
  lat double precision not null,
  lng double precision not null,
  image_url text,
  is_gochimeshi boolean not null default false,
  avg_rating numeric(3, 2) not null default 0 check (avg_rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  distance_from_office_meters integer check (distance_from_office_meters >= 0),
  walking_duration_seconds integer check (walking_duration_seconds >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create trigger set_places_updated_at
before update on public.places
for each row
execute function public.set_updated_at();

alter table public.places enable row level security;
