begin;

-- 1. Tipos
create type public.project_type as enum ('general', 'study');
create type public.sprint_status as enum ('planned', 'active', 'closed');
create type public.task_status as enum (
  'to_study', 'studying', 'scheduled', 'to_review',
  'todo', 'doing', 'blocked', 'done'
);
create type public.task_priority as enum ('high', 'medium', 'low');
create type public.task_origin as enum ('manual', 'inbox', 'recurrence', 'quackdump');
create type public.recurrence_type as enum ('daily', 'weekly', 'monthly', 'yearly');
create type public.draft_triage_target as enum ('task', 'project', 'habit', 'discarded', 'done');
create type public.srs_log_type as enum ('srs', 'manual');
create type public.activity_event_type as enum ('status_change', 'sprint_change');

-- 2. projects
alter table public.projects drop constraint projects_type_check;
alter table public.projects
  alter column type type public.project_type using type::public.project_type;

-- 3. sprints
drop index public.sprints_only_one_active;
alter table public.sprints drop constraint sprints_status_check;
alter table public.sprints alter column status drop default;
alter table public.sprints
  alter column status type public.sprint_status using status::public.sprint_status;
alter table public.sprints alter column status set default 'planned';
create unique index sprints_only_one_active
  on public.sprints using btree (status)
  where (status = 'active');

-- 4. tasks
alter table public.tasks rename column origem to origin;
alter table public.tasks
  drop constraint tasks_status_check,
  drop constraint tasks_priority_check,
  drop constraint tasks_origem_check,
  drop constraint tasks_recurrence_type_check;
alter table public.tasks
  alter column status drop default,
  alter column priority drop default,
  alter column origin drop default;
alter table public.tasks
  alter column status type public.task_status using status::public.task_status,
  alter column priority type public.task_priority using (
    case priority
      when 'alta' then 'high'
      when 'média' then 'medium'
      when 'baixa' then 'low'
    end
  )::public.task_priority,
  alter column origin type public.task_origin using origin::public.task_origin,
  alter column recurrence_type type public.recurrence_type
    using recurrence_type::public.recurrence_type;
alter table public.tasks
  alter column status set default 'to_study',
  alter column priority set default 'medium',
  alter column origin set default 'manual';

-- 5. drafts_items
alter table public.drafts_items drop constraint inbox_items_triaged_to_check;
alter table public.drafts_items
  alter column triaged_to type public.draft_triage_target
    using triaged_to::public.draft_triage_target;

-- 6. srs_logs
alter table public.srs_logs drop constraint srs_logs_log_type_check;
alter table public.srs_logs alter column log_type drop default;
alter table public.srs_logs
  alter column log_type type public.srs_log_type using log_type::public.srs_log_type;
alter table public.srs_logs alter column log_type set default 'srs';

-- 7. task_activity_log
alter table public.task_activity_log
  alter column event_type type public.activity_event_type
    using event_type::public.activity_event_type;

-- 8. Trigger: conversão explícita de enum para text no histórico
create or replace function public.log_task_activity()
returns trigger
language plpgsql
as $function$
begin
  if old.status is distinct from new.status then
    insert into task_activity_log (task_id, event_type, old_value, new_value)
    values (new.id, 'status_change', old.status::text, new.status::text);
  end if;

  if old.sprint_id is distinct from new.sprint_id then
    insert into task_activity_log (task_id, event_type, old_value, new_value)
    values (new.id, 'sprint_change', old.sprint_id::text, new.sprint_id::text);
  end if;

  return new;
end;
$function$;

commit;
