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
