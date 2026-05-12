-- profiles と invite_codes のアクセス制御を管理する。
alter table public.profiles enable row level security;
alter table public.invite_codes enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can read their own profile'
  ) then
    create policy "Users can read their own profile"
    on public.profiles
    for select
    to authenticated
    using ((select auth.uid()) = id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'profiles'
      and policyname = 'Users can update their own profile'
  ) then
    create policy "Users can update their own profile"
    on public.profiles
    for update
    to authenticated
    using ((select auth.uid()) = id)
    with check ((select auth.uid()) = id);
  end if;
end;
$$;

create or replace function public.prevent_profile_role_status_update()
returns trigger
language plpgsql
as $$
begin
  if coalesce(auth.role(), '') <> 'service_role'
    and (
      new.role is distinct from old.role
      or new.status is distinct from old.status
    )
  then
    raise exception 'Only service role can update profile role or status.';
  end if;

  return new;
end;
$$;

create trigger prevent_profile_role_status_update
before update on public.profiles
for each row
execute function public.prevent_profile_role_status_update();
