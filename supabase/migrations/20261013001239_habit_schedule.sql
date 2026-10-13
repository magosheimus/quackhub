alter table public.habits
  add column weekdays smallint[],
  add column duration_minutes integer;

alter table public.habits
  add constraint habits_weekdays_valid check (
    weekdays is null
    or (
      cardinality(weekdays) between 1 and 7
      and weekdays <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]
    )
  ),
  add constraint habits_duration_positive check (
    duration_minutes is null or duration_minutes > 0
  );
