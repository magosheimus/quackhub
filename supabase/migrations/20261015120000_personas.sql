create table public.personas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null check (length(trim(name)) > 0),
  color text,
  created_at timestamptz not null default now(),
  unique (user_id, name),
  constraint personas_color_valid check (
    color is null
    or color in (
      'amber', 'sage', 'blue', 'rose', 'lavender', 'sand',
      'magenta', 'teal', 'indigo', 'brown', 'lime', 'graphite'
    )
  )
);

alter table public.personas enable row level security;

create policy personas_owner on public.personas
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

alter table public.tasks
  add column assignee_id uuid references public.personas (id) on delete set null;

create index tasks_assignee_id_idx on public.tasks (assignee_id);
