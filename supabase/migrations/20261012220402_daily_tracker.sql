create type public.habit_type as enum ('boolean', 'counter');

create table public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name text not null,
  type public.habit_type not null,
  goal integer,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint habits_goal_matches_type check (
    (type = 'boolean' and goal is null)
    or (type = 'counter' and goal is not null and goal > 0)
  )
);

create table public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  habit_id uuid not null references public.habits (id) on delete cascade,
  date date not null,
  value integer not null default 0 check (value >= 0),
  created_at timestamptz not null default now(),
  unique (habit_id, date)
);

create table public.daily_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  date date not null,
  mood smallint not null check (mood between 1 and 5),
  comment text,
  created_at timestamptz not null default now(),
  unique (user_id, date)
);

create index habits_user_id_idx on public.habits (user_id);
create index habit_logs_user_date_idx on public.habit_logs (user_id, date);

alter table public.habits enable row level security;
alter table public.habit_logs enable row level security;
alter table public.daily_logs enable row level security;

create policy habits_owner on public.habits
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy habit_logs_owner on public.habit_logs
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));

create policy daily_logs_owner on public.daily_logs
  for all to authenticated
  using (user_id = (select auth.uid()))
  with check (user_id = (select auth.uid()));
