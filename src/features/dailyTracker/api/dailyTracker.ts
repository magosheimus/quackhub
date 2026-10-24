import { supabase } from '@/shared/api/supabase'
import type {
  DailyLog,
  Habit,
  HabitLog,
  HabitUpdate,
  NewHabit,
} from '@/shared/types/entities'

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('active', true)
    .order('position')
    .order('created_at', { ascending: true })
  if (error) {
    throw new Error(`Falha ao buscar hábitos: ${error.message}`)
  }
  return data
}

export async function getAllHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .order('position')
    .order('created_at', { ascending: true })
  if (error) {
    throw new Error(`Falha ao buscar hábitos: ${error.message}`)
  }
  return data
}

export async function createHabit(habit: NewHabit): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .insert(habit)
    .select()
    .single()
  if (error) {
    throw new Error(`Falha ao criar hábito: ${error.message}`)
  }
  return data
}

export async function updateHabit(
  id: string,
  changes: HabitUpdate,
): Promise<void> {
  const { error } = await supabase.from('habits').update(changes).eq('id', id)
  if (error) {
    throw new Error(`Falha ao editar hábito: ${error.message}`)
  }
}

export async function archiveHabit(id: string): Promise<void> {
  await updateHabit(id, { active: false })
}

export async function getHabitLogs(
  start: string,
  end: string,
): Promise<HabitLog[]> {
  const { data, error } = await supabase
    .from('habit_logs')
    .select('*')
    .gte('date', start)
    .lte('date', end)
  if (error) {
    throw new Error(`Falha ao buscar registros: ${error.message}`)
  }
  return data
}

export async function logHabit(
  habitId: string,
  date: string,
  value: number,
): Promise<void> {
  const { error } = await supabase
    .from('habit_logs')
    .upsert({ habit_id: habitId, date, value }, { onConflict: 'habit_id,date' })
  if (error) {
    throw new Error(`Falha ao registrar hábito: ${error.message}`)
  }
}

export async function getDailyLogs(
  start: string,
  end: string,
): Promise<DailyLog[]> {
  const { data, error } = await supabase
    .from('daily_logs')
    .select('*')
    .gte('date', start)
    .lte('date', end)
    .order('date', { ascending: true })
  if (error) {
    throw new Error(`Falha ao buscar o diário: ${error.message}`)
  }
  return data
}

export async function logMood(
  date: string,
  mood: number,
  comment: string | null,
): Promise<void> {
  const { error } = await supabase
    .from('daily_logs')
    .upsert({ date, mood, comment }, { onConflict: 'user_id,date' })
  if (error) {
    throw new Error(`Falha ao registrar o humor: ${error.message}`)
  }
}
