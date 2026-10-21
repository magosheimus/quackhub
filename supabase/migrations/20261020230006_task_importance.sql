alter table public.tasks
  add column importance smallint
  check (importance between 1 and 5);
