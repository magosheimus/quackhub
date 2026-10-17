alter table public.tasks
  add column due_time time,
  add constraint tasks_due_time_needs_date check (
    due_time is null or due_date is not null
  );
