alter table public.personas
  drop column color,
  add column icon text not null default 'avatar',
  add constraint personas_icon_valid check (char_length(icon) between 1 and 32);
