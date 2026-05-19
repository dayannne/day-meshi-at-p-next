-- 店舗ごとのレビュータグ利用数をDB側で集計するRPC。
create or replace function public.get_place_popular_review_tags(
  p_place_id uuid,
  p_limit integer default 4
)
returns table (
  id uuid,
  name text,
  emoji text,
  category_id uuid,
  review_count bigint
)
language sql
stable
security invoker
set search_path = public
as $$
  select
    tags.id,
    tags.name,
    tags.emoji,
    tags.category_id,
    count(*) as review_count
  from public.reviews
  inner join public.review_tags
    on review_tags.review_id = reviews.id
  inner join public.tags
    on tags.id = review_tags.tag_id
  where reviews.place_id = p_place_id
  group by tags.id, tags.name, tags.emoji, tags.category_id
  order by count(*) desc, tags.name asc, tags.id asc
  limit greatest(coalesce(p_limit, 4), 0)
$$;

revoke all on function public.get_place_popular_review_tags(uuid, integer) from public;
grant execute on function public.get_place_popular_review_tags(uuid, integer) to authenticated;
