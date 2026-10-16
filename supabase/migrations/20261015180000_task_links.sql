create table public.task_links (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references public.tasks (id) on delete cascade,
  url text not null check (url ~ '^https?://'),
  title text check (title is null or length(trim(title)) > 0),
  position integer not null default 0,
  created_at timestamptz not null default now()
);

create index task_links_task_id_idx on public.task_links (task_id);

alter table public.task_links enable row level security;

create policy task_links_owner on public.task_links for all to authenticated
  using (exists (select 1 from public.tasks t where t.id = task_id))
  with check (exists (select 1 from public.tasks t where t.id = task_id));

create or replace function public.set_task_link_position()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  select coalesce(max(position) + 1, 0)
    into new.position
    from public.task_links
    where task_id = new.task_id;
  return new;
end;
$$;

create trigger task_links_set_position
  before insert on public.task_links
  for each row execute function public.set_task_link_position();
