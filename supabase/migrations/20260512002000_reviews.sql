-- ユーザーが店舗に投稿したレビューを管理する。
create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  comment text,
  visited_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, place_id)
);

create index reviews_place_id_idx
on public.reviews (place_id);

create trigger set_reviews_updated_at
before update on public.reviews
for each row
execute function public.set_updated_at();

alter table public.reviews enable row level security;
