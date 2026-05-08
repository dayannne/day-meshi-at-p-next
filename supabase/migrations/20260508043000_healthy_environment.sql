-- 接続先の Supabase 環境を画面で確認するためのテーブル。
create table public.healthy_environment (
  environment text primary key
    check (environment in ('local', 'preview', 'production'))
);

-- 環境確認用の値は必ず 1 行だけにする。
create unique index healthy_environment_singleton
on public.healthy_environment ((true));

alter table public.healthy_environment enable row level security;
