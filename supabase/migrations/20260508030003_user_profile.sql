-- Supabase Auth ユーザーに紐づくプロフィール情報を管理する。
create type public.user_role as enum ('USER', 'ADMIN');

create type public.user_status as enum ('ACTIVE', 'SUSPENDED');

create table public.profile (
  id uuid primary key references auth.users (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 50),
  role public.user_role not null default 'USER',
  status public.user_status not null default 'ACTIVE',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at を更新時に自動更新する。
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_profile_updated_at
before update on public.profile
for each row
execute function public.set_updated_at();

alter table public.profile enable row level security;

create policy "Users can read their own profile"
on public.profile
for select
to authenticated
using ((select auth.uid()) = id);
