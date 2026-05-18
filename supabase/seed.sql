-- ローカル環境の接続確認用データ。
delete from public.healthy_environment;

insert into public.healthy_environment (environment)
values ('local');

-- ローカル開発用の初回管理者登録向け招待コード。
insert into public.invite_codes (
  code,
  expires_at
)
values (
  'LOCAL_ADMIN_INVITE',
  now() + interval '30 days'
)
on conflict (code) do update
set
  used_at = null,
  used_by = null,
  expires_at = excluded.expires_at;

-- レビュータグのカテゴリとタグ。
with tag_category_values (name) as (
  values
    ('雰囲気'),
    ('状況'),
    ('特徴')
),
inserted_tag_categories as (
  insert into public.tag_categories (name)
  select name
  from tag_category_values
  on conflict (name) do nothing
  returning id, name
),
seed_tag_categories as (
  select id, name
  from inserted_tag_categories
  union
  select tag_categories.id, tag_categories.name
  from public.tag_categories
  join tag_category_values
    on tag_category_values.name = tag_categories.name
),
tag_values (category_name, name, emoji) as (
  values
    ('雰囲気', '静か', '🤫'),
    ('雰囲気', 'にぎやか', '🥳'),
    ('雰囲気', '入りやすい', '🚶'),
    ('雰囲気', '高級感がある', '✨'),
    ('状況', 'ランチ', '🍴'),
    ('状況', '一人ごはん', '👤'),
    ('状況', 'チームランチ', '👥'),
    ('状況', '飲み会', '🍺'),
    ('状況', '会食', '🤝'),
    ('特徴', '提供が早い', '🚀'),
    ('特徴', '個室あり', '🚪'),
    ('特徴', 'テイクアウト可', '🍱'),
    ('特徴', '現金のみ', '💴'),
    ('特徴', '要予約', '📅')
)
insert into public.tags (category_id, name, emoji)
select seed_tag_categories.id, tag_values.name, tag_values.emoji
from tag_values
join seed_tag_categories
  on seed_tag_categories.name = tag_values.category_name
on conflict (category_id, name) do update
set emoji = excluded.emoji
where public.tags.emoji is distinct from excluded.emoji;