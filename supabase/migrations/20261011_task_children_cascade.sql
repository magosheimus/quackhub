begin;

alter table public.task_tags
  drop constraint task_tags_task_id_fkey,
  add constraint task_tags_task_id_fkey
    foreign key (task_id) references public.tasks (id) on delete cascade;

alter table public.task_checklist_items
  drop constraint task_checklist_items_task_id_fkey,
  add constraint task_checklist_items_task_id_fkey
    foreign key (task_id) references public.tasks (id) on delete cascade;

alter table public.task_dependencies
  drop constraint task_dependencies_task_id_fkey,
  add constraint task_dependencies_task_id_fkey
    foreign key (task_id) references public.tasks (id) on delete cascade,
  drop constraint task_dependencies_depends_on_task_id_fkey,
  add constraint task_dependencies_depends_on_task_id_fkey
    foreign key (depends_on_task_id) references public.tasks (id) on delete cascade;

alter table public.time_entries
  drop constraint time_entries_task_id_fkey,
  add constraint time_entries_task_id_fkey
    foreign key (task_id) references public.tasks (id) on delete cascade;

commit;
