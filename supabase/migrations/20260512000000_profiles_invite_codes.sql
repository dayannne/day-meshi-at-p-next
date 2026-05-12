-- ユーザープロフィールと招待コードを管理する。
do $$
begin
  if to_regclass('public.profiles') is null and to_regclass('public.profile') is not null then
    alter table public.profile rename to profiles;
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profile_pkey'
  ) then
    alter table public.profiles rename constraint profile_pkey to profiles_pkey;
  end if;

  if exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profile_id_fkey'
  ) then
    alter table public.profiles rename constraint profile_id_fkey to profiles_id_fkey;
  end if;
end;
$$;

do $$
begin
  if exists (
    select 1
    from pg_trigger
    where tgrelid = 'public.profiles'::regclass
      and tgname = 'set_profile_updated_at'
  ) then
    alter trigger set_profile_updated_at on public.profiles rename to set_profiles_updated_at;
  end if;
end;
$$;

alter table public.profiles
  add column if not exists nickname text not null check (char_length(nickname) between 1 and 50),
  add column if not exists role public.user_role not null default 'USER',
  add column if not exists status public.user_status not null default 'ACTIVE',
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now();

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conrelid = 'public.profiles'::regclass
      and conname = 'profiles_nickname_key'
  ) then
    alter table public.profiles add constraint profiles_nickname_key unique (nickname);
  end if;
end;
$$;

create table public.invite_codes (
  code text primary key check (char_length(code) between 1 and 128),
  used_at timestamptz,
  expires_at timestamptz not null,
  used_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create index invite_codes_used_by_idx
on public.invite_codes (used_by);

alter table public.invite_codes enable row level security;
