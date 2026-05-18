alter table public.places
add column if not exists photo_attributions jsonb not null default '[]'::jsonb;

comment on column public.places.photo_attributions is
  'Google Places photo author attribution data required when displaying stored place photos.';
