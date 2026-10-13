alter table public.epics add column position integer not null default 0;

update public.epics as epic
set position = ordered.row_index
from (
  select id, row_number() over (
    partition by project_id order by created_at, id
  ) - 1 as row_index
  from public.epics
) as ordered
where epic.id = ordered.id;

create or replace function public.set_epic_position()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select coalesce(max(position) + 1, 0)
    into new.position
    from public.epics
    where project_id = new.project_id;
  return new;
end;
$$;

create trigger epics_set_position
  before insert on public.epics
  for each row execute function public.set_epic_position();
