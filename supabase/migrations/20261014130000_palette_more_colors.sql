alter table public.habits drop constraint if exists habits_color_valid;

alter table public.habits
  add constraint habits_color_valid check (
    color is null
    or color in (
      'amber', 'sage', 'blue', 'rose', 'lavender', 'sand',
      'magenta', 'teal', 'indigo', 'brown', 'lime', 'graphite'
    )
  );
