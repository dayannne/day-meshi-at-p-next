-- ユーザーごとの店舗ブックマークとレビューいいねを管理する。
create table public.place_bookmarks (
  user_id uuid not null references public.profiles (id) on delete cascade,
  place_id uuid not null references public.places (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

create index place_bookmarks_place_id_idx
on public.place_bookmarks (place_id);

create table public.review_likes (
  user_id uuid not null references public.profiles (id) on delete cascade,
  review_id uuid not null references public.reviews (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, review_id)
);

create index review_likes_review_id_idx
on public.review_likes (review_id);

alter table public.place_bookmarks enable row level security;
alter table public.review_likes enable row level security;
