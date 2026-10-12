begin;

update storage.buckets set public = false where id = 'task-attachments';

drop policy if exists task_attachments_access on storage.objects;

create policy task_attachments_owner on storage.objects
  for all to authenticated
  using (
    bucket_id = 'task-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  )
  with check (
    bucket_id = 'task-attachments'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

commit;
