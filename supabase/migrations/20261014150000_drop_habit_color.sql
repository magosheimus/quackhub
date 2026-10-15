alter table public.habits drop constraint if exists habits_color_valid;

alter table public.habits drop column if exists color;
