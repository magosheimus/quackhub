alter table public.habits add column position integer not null default 0;

update public.habits as habit
set position = ordered.row_index
from (
  select id, row_number() over (
    partition by user_id order by created_at, id
  ) - 1 as row_index
  from public.habits
) as ordered
where habit.id = ordered.id;

create or replace function public.set_habit_position()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select coalesce(max(position) + 1, 0)
    into new.position
    from public.habits
    where user_id = new.user_id;
  return new;
end;
$$;

create trigger habits_set_position
  before insert on public.habits
  for each row execute function public.set_habit_position();
