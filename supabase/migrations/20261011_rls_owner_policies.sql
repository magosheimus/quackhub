begin;

-- 1. Dono dos dados nas tabelas principais
alter table public.projects     add column user_id uuid references auth.users (id) on delete cascade;
alter table public.epics        add column user_id uuid references auth.users (id) on delete cascade;
alter table public.tasks        add column user_id uuid references auth.users (id) on delete cascade;
alter table public.sprints      add column user_id uuid references auth.users (id) on delete cascade;
alter table public.drafts_items add column user_id uuid references auth.users (id) on delete cascade;
alter table public.srs_logs     add column user_id uuid references auth.users (id) on delete cascade;

update public.projects     set user_id = '22b216de-ce1c-4dcc-a7d7-21510d7bbd9a';
update public.epics        set user_id = '22b216de-ce1c-4dcc-a7d7-21510d7bbd9a';
update public.tasks        set user_id = '22b216de-ce1c-4dcc-a7d7-21510d7bbd9a';
update public.sprints      set user_id = '22b216de-ce1c-4dcc-a7d7-21510d7bbd9a';
update public.drafts_items set user_id = '22b216de-ce1c-4dcc-a7d7-21510d7bbd9a';
update public.srs_logs     set user_id = '22b216de-ce1c-4dcc-a7d7-21510d7bbd9a';

alter table public.projects     alter column user_id set not null, alter column user_id set default auth.uid();
alter table public.epics        alter column user_id set not null, alter column user_id set default auth.uid();
alter table public.tasks        alter column user_id set not null, alter column user_id set default auth.uid();
alter table public.sprints      alter column user_id set not null, alter column user_id set default auth.uid();
alter table public.drafts_items alter column user_id set not null, alter column user_id set default auth.uid();
alter table public.srs_logs     alter column user_id set not null, alter column user_id set default auth.uid();

create index projects_user_id_idx     on public.projects (user_id);
create index epics_user_id_idx        on public.epics (user_id);
create index tasks_user_id_idx        on public.tasks (user_id);
create index sprints_user_id_idx      on public.sprints (user_id);
create index drafts_items_user_id_idx on public.drafts_items (user_id);
create index srs_logs_user_id_idx     on public.srs_logs (user_id);

-- 2. Uma sprint ativa por usuário (antes: uma no sistema inteiro)
drop index public.sprints_only_one_active;
create unique index sprints_only_one_active
  on public.sprints using btree (user_id)
  where (status = 'active');

-- 3. Liga o RLS em todas as tabelas
alter table public.projects             enable row level security;
alter table public.epics                enable row level security;
alter table public.tasks                enable row level security;
alter table public.sprints              enable row level security;
alter table public.drafts_items         enable row level security;
alter table public.srs_logs             enable row level security;
alter table public.task_tags            enable row level security;
alter table public.task_checklist_items enable row level security;
alter table public.task_attachments     enable row level security;
alter table public.task_dependencies    enable row level security;
alter table public.task_activity_log    enable row level security;
alter table public.time_entries         enable row level security;

-- 4. Tabelas principais: só o dono
create policy projects_owner on public.projects for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy epics_owner on public.epics for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy tasks_owner on public.tasks for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy sprints_owner on public.sprints for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy drafts_items_owner on public.drafts_items for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy srs_logs_owner on public.srs_logs for all to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- 5. Tabelas filhas: acesso pela task pai (o RLS de tasks vale dentro do exists)
create policy task_tags_owner on public.task_tags for all to authenticated
  using (exists (select 1 from public.tasks t where t.id = task_id))
  with check (exists (select 1 from public.tasks t where t.id = task_id));
create policy task_checklist_items_owner on public.task_checklist_items for all to authenticated
  using (exists (select 1 from public.tasks t where t.id = task_id))
  with check (exists (select 1 from public.tasks t where t.id = task_id));
create policy task_attachments_owner on public.task_attachments for all to authenticated
  using (exists (select 1 from public.tasks t where t.id = task_id))
  with check (exists (select 1 from public.tasks t where t.id = task_id));
create policy task_activity_log_owner on public.task_activity_log for all to authenticated
  using (exists (select 1 from public.tasks t where t.id = task_id))
  with check (exists (select 1 from public.tasks t where t.id = task_id));
create policy time_entries_owner on public.time_entries for all to authenticated
  using (exists (select 1 from public.tasks t where t.id = task_id))
  with check (exists (select 1 from public.tasks t where t.id = task_id));
create policy task_dependencies_owner on public.task_dependencies for all to authenticated
  using (
    exists (select 1 from public.tasks t where t.id = task_id)
    and exists (select 1 from public.tasks t where t.id = depends_on_task_id)
  )
  with check (
    exists (select 1 from public.tasks t where t.id = task_id)
    and exists (select 1 from public.tasks t where t.id = depends_on_task_id)
  );

commit;
