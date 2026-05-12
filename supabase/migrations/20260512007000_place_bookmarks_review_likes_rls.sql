-- 店舗ブックマークとレビューいいねのクライアント操作を制御する。
alter table public.place_bookmarks enable row level security;
alter table public.review_likes enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'place_bookmarks'
      and policyname = 'Users can read their own place bookmarks'
  ) then
    create policy "Users can read their own place bookmarks"
    on public.place_bookmarks
    for select
    to authenticated
    using ((select auth.uid()) = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'place_bookmarks'
      and policyname = 'Users can create their own place bookmarks'
  ) then
    create policy "Users can create their own place bookmarks"
    on public.place_bookmarks
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'place_bookmarks'
      and policyname = 'Users can delete their own place bookmarks'
  ) then
    create policy "Users can delete their own place bookmarks"
    on public.place_bookmarks
    for delete
    to authenticated
    using ((select auth.uid()) = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'review_likes'
      and policyname = 'Users can read their own review likes'
  ) then
    create policy "Users can read their own review likes"
    on public.review_likes
    for select
    to authenticated
    using ((select auth.uid()) = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'review_likes'
      and policyname = 'Users can create their own review likes'
  ) then
    create policy "Users can create their own review likes"
    on public.review_likes
    for insert
    to authenticated
    with check ((select auth.uid()) = user_id);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'review_likes'
      and policyname = 'Users can delete their own review likes'
  ) then
    create policy "Users can delete their own review likes"
    on public.review_likes
    for delete
    to authenticated
    using ((select auth.uid()) = user_id);
  end if;
end;
$$;
