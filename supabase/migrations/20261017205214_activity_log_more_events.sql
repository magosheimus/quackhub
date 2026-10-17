alter type public.activity_event_type add value if not exists 'priority_change';
alter type public.activity_event_type add value if not exists 'flag_change';
alter type public.activity_event_type add value if not exists 'epic_change';
alter type public.activity_event_type add value if not exists 'project_change';

create or replace function public.log_task_activity()
returns trigger
language plpgsql
set search_path = public
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

  if old.priority is distinct from new.priority then
    insert into task_activity_log (task_id, event_type, old_value, new_value)
    values (new.id, 'priority_change', old.priority::text, new.priority::text);
  end if;

  if old.flagged is distinct from new.flagged then
    insert into task_activity_log (task_id, event_type, old_value, new_value)
    values (new.id, 'flag_change', old.flagged::text, new.flagged::text);
  end if;

  if old.epic_id is distinct from new.epic_id then
    insert into task_activity_log (task_id, event_type, old_value, new_value)
    values (new.id, 'epic_change', old.epic_id::text, new.epic_id::text);
  end if;

  if old.project_id is distinct from new.project_id then
    insert into task_activity_log (task_id, event_type, old_value, new_value)
    values (new.id, 'project_change', old.project_id::text, new.project_id::text);
  end if;

  return new;
end;
$function$;
