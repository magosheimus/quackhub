alter table public.drafts_items
  add column project_id uuid references public.projects (id) on delete set null;

create index drafts_items_project_id_idx on public.drafts_items (project_id);
