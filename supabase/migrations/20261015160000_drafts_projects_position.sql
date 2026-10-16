alter table public.projects add column position integer not null default 0;
alter table public.drafts_items add column position integer not null default 0;

update public.projects as project
set position = ordered.row_index
from (
  select id, row_number() over (
    partition by user_id order by created_at, id
  ) - 1 as row_index
  from public.projects
) as ordered
where project.id = ordered.id;

update public.drafts_items as draft
set position = ordered.row_index
from (
  select id, row_number() over (
    partition by user_id order by created_at desc, id
  ) - 1 as row_index
  from public.drafts_items
) as ordered
where draft.id = ordered.id;

create or replace function public.set_project_position()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select coalesce(max(position) + 1, 0)
    into new.position
    from public.projects
    where user_id = new.user_id;
  return new;
end;
$$;

create trigger projects_set_position
  before insert on public.projects
  for each row execute function public.set_project_position();

create or replace function public.set_draft_position()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select coalesce(min(position) - 1, 0)
    into new.position
    from public.drafts_items
    where user_id = new.user_id;
  return new;
end;
$$;

create trigger drafts_items_set_position
  before insert on public.drafts_items
  for each row execute function public.set_draft_position();
