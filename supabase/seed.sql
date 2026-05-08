-- ローカル環境の接続確認用データ。
delete from public.healthy_environment;

insert into public.healthy_environment (environment)
values ('local');
