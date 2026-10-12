begin;

alter function public.set_updated_at() set search_path = public;
alter function public.set_task_number() set search_path = public;
alter function public.log_task_activity() set search_path = public;

commit;
