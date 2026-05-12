-- places、reviews、review_tags のアクセス制御を管理する。
alter table public.places enable row level security;
alter table public.reviews enable row level security;
alter table public.review_tags enable row level security;
alter table public.tag_categories enable row level security;
alter table public.tags enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'places'
      and policyname = 'Authenticated users can read places'
  ) then
    create policy "Authenticated users can read places"
    on public.places
    for select
    to authenticated
    using (true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'places'
      and policyname = 'Authenticated users can create places'
  ) then
    create policy "Authenticated users can create places"
    on public.places
    for insert
    to authenticated
    with check (true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'reviews'
      and policyname = 'Authenticated users can read reviews'
  ) then
    create policy "Authenticated users can read reviews"
    on public.reviews
    for select
    to authenticated
    using (true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'reviews'
      and policyname = 'Users can create their own reviews'
  ) then
    create policy "Users can create their own reviews"
    on public.reviews
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
      and tablename = 'reviews'
      and policyname = 'Users can update their own reviews'
  ) then
    create policy "Users can update their own reviews"
    on public.reviews
    for update
    to authenticated
    using ((select auth.uid()) = user_id)
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
      and tablename = 'reviews'
      and policyname = 'Users can delete their own reviews'
  ) then
    create policy "Users can delete their own reviews"
    on public.reviews
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
      and tablename = 'review_tags'
      and policyname = 'Authenticated users can read review tags'
  ) then
    create policy "Authenticated users can read review tags"
    on public.review_tags
    for select
    to authenticated
    using (true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'review_tags'
      and policyname = 'Review owners can create review tags'
  ) then
    create policy "Review owners can create review tags"
    on public.review_tags
    for insert
    to authenticated
    with check (
      exists (
        select 1
        from public.reviews
        where reviews.id = review_tags.review_id
          and reviews.user_id = (select auth.uid())
      )
    );
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'review_tags'
      and policyname = 'Review owners can delete review tags'
  ) then
    create policy "Review owners can delete review tags"
    on public.review_tags
    for delete
    to authenticated
    using (
      exists (
        select 1
        from public.reviews
        where reviews.id = review_tags.review_id
          and reviews.user_id = (select auth.uid())
      )
    );
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'tag_categories'
      and policyname = 'Authenticated users can read tag categories'
  ) then
    create policy "Authenticated users can read tag categories"
    on public.tag_categories
    for select
    to authenticated
    using (true);
  end if;
end;
$$;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'tags'
      and policyname = 'Authenticated users can read tags'
  ) then
    create policy "Authenticated users can read tags"
    on public.tags
    for select
    to authenticated
    using (true);
  end if;
end;
$$;
