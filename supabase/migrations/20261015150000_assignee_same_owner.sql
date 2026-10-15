alter table public.personas
  add constraint personas_id_user_unique unique (id, user_id);

alter table public.tasks
  drop constraint tasks_assignee_id_fkey,
  add constraint tasks_assignee_fkey
    foreign key (assignee_id, user_id)
    references public.personas (id, user_id)
    on delete set null (assignee_id);
