alter table public.habits
  add column icon text not null default 'target',
  add column color text;

alter table public.habits
  add constraint habits_icon_valid check (char_length(icon) between 1 and 32),
  add constraint habits_color_hex check (
    color is null or color ~ '^#[0-9a-f]{6}$'
  );
