create or replace function public.renumber_task_on_project_change()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.project_id is distinct from old.project_id then
    update public.projects
      set last_task_number = last_task_number + 1
      where id = new.project_id
      returning last_task_number into new.task_number;
    if not found then
      raise exception 'Projeto de destino não encontrado';
    end if;
  end if;
  return new;
end;
$$;

create trigger tasks_renumber_on_project_change
  before update of project_id on public.tasks
  for each row execute function public.renumber_task_on_project_change();
