-- レビューに付与するタグカテゴリ、タグ、レビュータグ関連を管理する。
create table public.tag_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category_id uuid not null references public.tag_categories (id) on delete cascade,
  emoji text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (category_id, name)
);

create table public.review_tags (
  review_id uuid not null references public.reviews (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  primary key (review_id, tag_id)
);

create index tags_category_id_idx
on public.tags (category_id);

create index review_tags_tag_id_idx
on public.review_tags (tag_id);

create trigger set_tag_categories_updated_at
before update on public.tag_categories
for each row
execute function public.set_updated_at();

create trigger set_tags_updated_at
before update on public.tags
for each row
execute function public.set_updated_at();

alter table public.tag_categories enable row level security;
alter table public.tags enable row level security;
alter table public.review_tags enable row level security;
