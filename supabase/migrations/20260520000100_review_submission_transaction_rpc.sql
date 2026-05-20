-- レビュー作成、タグ付与、店舗評価更新を同一トランザクションで処理するRPC。
create or replace function public.create_review_for_existing_place_transaction(
  p_user_id uuid,
  p_place_id uuid,
  p_rating integer,
  p_price_range integer,
  p_comment text,
  p_visited_at date,
  p_tag_ids uuid[]
)
returns table (
  place_id uuid,
  review_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_place_id uuid;
  v_review_id uuid;
  v_review_count integer;
  v_avg_rating numeric(3, 2);
begin
  select places.id
  into v_place_id
  from public.places
  where places.id = p_place_id
  for update;

  if v_place_id is null then
    raise exception 'place_not_found' using errcode = 'P0002';
  end if;

  insert into public.reviews (
    user_id,
    place_id,
    rating,
    price_range,
    comment,
    visited_at
  )
  values (
    p_user_id,
    v_place_id,
    p_rating,
    p_price_range,
    nullif(btrim(p_comment), ''),
    p_visited_at
  )
  returning id into v_review_id;

  insert into public.review_tags (review_id, tag_id)
  select v_review_id, unique_tags.tag_id
  from (
    select distinct unnest(coalesce(p_tag_ids, '{}'::uuid[])) as tag_id
  ) as unique_tags
  where unique_tags.tag_id is not null;

  select
    count(*)::integer,
    coalesce(round(avg(reviews.rating)::numeric, 2), 0)::numeric(3, 2)
  into v_review_count, v_avg_rating
  from public.reviews
  where reviews.place_id = v_place_id;

  update public.places
  set
    avg_rating = v_avg_rating,
    review_count = v_review_count
  where places.id = v_place_id;

  place_id := v_place_id;
  review_id := v_review_id;
  return next;
end;
$$;

create or replace function public.create_review_with_place_transaction(
  p_user_id uuid,
  p_google_place_id text,
  p_name text,
  p_category text,
  p_lat double precision,
  p_lng double precision,
  p_rating integer,
  p_price_range integer,
  p_comment text,
  p_visited_at date,
  p_tag_ids uuid[],
  p_image_url text,
  p_photo_attributions jsonb,
  p_distance_from_office_meters integer,
  p_walking_duration_seconds integer
)
returns table (
  place_id uuid,
  review_id uuid
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_place_id uuid;
  v_review_id uuid;
  v_review_count integer;
  v_avg_rating numeric(3, 2);
begin
  insert into public.places (
    google_place_id,
    name,
    category,
    lat,
    lng,
    image_url,
    photo_attributions,
    distance_from_office_meters,
    walking_duration_seconds
  )
  values (
    p_google_place_id,
    p_name,
    p_category,
    p_lat,
    p_lng,
    p_image_url,
    coalesce(p_photo_attributions, '[]'::jsonb),
    p_distance_from_office_meters,
    p_walking_duration_seconds
  )
  on conflict (google_place_id) do update
  set
    name = excluded.name,
    category = excluded.category,
    lat = excluded.lat,
    lng = excluded.lng,
    image_url = excluded.image_url,
    photo_attributions = excluded.photo_attributions,
    distance_from_office_meters = excluded.distance_from_office_meters,
    walking_duration_seconds = excluded.walking_duration_seconds
  returning places.id into v_place_id;

  perform 1
  from public.places
  where places.id = v_place_id
  for update;

  insert into public.reviews (
    user_id,
    place_id,
    rating,
    price_range,
    comment,
    visited_at
  )
  values (
    p_user_id,
    v_place_id,
    p_rating,
    p_price_range,
    nullif(btrim(p_comment), ''),
    p_visited_at
  )
  returning id into v_review_id;

  insert into public.review_tags (review_id, tag_id)
  select v_review_id, unique_tags.tag_id
  from (
    select distinct unnest(coalesce(p_tag_ids, '{}'::uuid[])) as tag_id
  ) as unique_tags
  where unique_tags.tag_id is not null;

  select
    count(*)::integer,
    coalesce(round(avg(reviews.rating)::numeric, 2), 0)::numeric(3, 2)
  into v_review_count, v_avg_rating
  from public.reviews
  where reviews.place_id = v_place_id;

  update public.places
  set
    avg_rating = v_avg_rating,
    review_count = v_review_count
  where places.id = v_place_id;

  place_id := v_place_id;
  review_id := v_review_id;
  return next;
end;
$$;

revoke all on function public.create_review_for_existing_place_transaction(
  uuid,
  uuid,
  integer,
  integer,
  text,
  date,
  uuid[]
) from public;
revoke all on function public.create_review_for_existing_place_transaction(
  uuid,
  uuid,
  integer,
  integer,
  text,
  date,
  uuid[]
) from anon;
revoke all on function public.create_review_for_existing_place_transaction(
  uuid,
  uuid,
  integer,
  integer,
  text,
  date,
  uuid[]
) from authenticated;
grant execute on function public.create_review_for_existing_place_transaction(
  uuid,
  uuid,
  integer,
  integer,
  text,
  date,
  uuid[]
) to service_role;

revoke all on function public.create_review_with_place_transaction(
  uuid,
  text,
  text,
  text,
  double precision,
  double precision,
  integer,
  integer,
  text,
  date,
  uuid[],
  text,
  jsonb,
  integer,
  integer
) from public;
revoke all on function public.create_review_with_place_transaction(
  uuid,
  text,
  text,
  text,
  double precision,
  double precision,
  integer,
  integer,
  text,
  date,
  uuid[],
  text,
  jsonb,
  integer,
  integer
) from anon;
revoke all on function public.create_review_with_place_transaction(
  uuid,
  text,
  text,
  text,
  double precision,
  double precision,
  integer,
  integer,
  text,
  date,
  uuid[],
  text,
  jsonb,
  integer,
  integer
) from authenticated;
grant execute on function public.create_review_with_place_transaction(
  uuid,
  text,
  text,
  text,
  double precision,
  double precision,
  integer,
  integer,
  text,
  date,
  uuid[],
  text,
  jsonb,
  integer,
  integer
) to service_role;
