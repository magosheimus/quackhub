create or replace function pg_temp.palette_key(hex text) returns text
language sql immutable as $$
  select case lower(hex)
    when '#e3a857' then 'amber'
    when '#7a9e7e' then 'sage'
    when '#5c8ca6' then 'blue'
    when '#b6656e' then 'rose'
    when '#8a7ca8' then 'lavender'
    when '#c2b280' then 'sand'
    else hex
  end
$$;

update public.projects set color = pg_temp.palette_key(color) where color like '#%';
update public.epics set color = pg_temp.palette_key(color) where color like '#%';

alter table public.habits drop constraint if exists habits_color_hex;
update public.habits set color = pg_temp.palette_key(color) where color like '#%';

alter table public.habits
  add constraint habits_color_valid check (
    color is null
    or color in ('amber', 'sage', 'blue', 'rose', 'lavender', 'sand')
  );
