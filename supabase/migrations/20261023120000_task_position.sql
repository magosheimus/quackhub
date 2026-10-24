alter table public.tasks add column position integer not null default 0;

update public.tasks as task
set position = ordered.row_index
from (
  select id, row_number() over (
    partition by user_id order by created_at desc, id
  ) - 1 as row_index
  from public.tasks
) as ordered
where task.id = ordered.id;

create or replace function public.set_task_position()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select coalesce(min(position) - 1, 0)
    into new.position
    from public.tasks
    where user_id = new.user_id;
  return new;
end;
$$;

create trigger tasks_set_position
  before insert on public.tasks
  for each row execute function public.set_task_position();
