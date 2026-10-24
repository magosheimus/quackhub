import { supabase } from '@/shared/api/supabase'
import { UserFacingError } from '@/shared/lib/errors'
import {
  toPersona,
  toPersonaInsert,
  toPersonaUpdate,
} from '@/features/personas/api/personaMapper'
import type {
  NewPersona,
  Persona,
  PersonaUpdate,
} from '@/features/personas/model/persona'
import { PERSONAS_TEXTS } from '@/features/personas/constants/texts'

export async function getPersonas(): Promise<Persona[]> {
  const { data, error } = await supabase
    .from('personas')
    .select('*')
    .order('name')
  if (error) {
    throw new Error(`Falha ao buscar personas: ${error.message}`)
  }
  return data.map(toPersona)
}

export async function createPersona(data: NewPersona): Promise<Persona> {
  const { data: persona, error } = await supabase
    .from('personas')
    .insert(toPersonaInsert(data))
    .select()
    .single()
  if (error) {
    if (error.code === '23505') {
      throw new UserFacingError(PERSONAS_TEXTS.duplicateName)
    }
    throw new Error(`Falha ao criar persona: ${error.message}`)
  }
  return toPersona(persona)
}

export async function updatePersona(
  id: string,
  data: PersonaUpdate,
): Promise<Persona> {
  const { data: persona, error } = await supabase
    .from('personas')
    .update(toPersonaUpdate(data))
    .eq('id', id)
    .select()
    .single()
  if (error) {
    if (error.code === '23505') {
      throw new UserFacingError(PERSONAS_TEXTS.duplicateName)
    }
    throw new Error(`Falha ao atualizar persona: ${error.message}`)
  }
  return toPersona(persona)
}

export async function deletePersona(id: string): Promise<void> {
  const { error } = await supabase.from('personas').delete().eq('id', id)
  if (error) {
    throw new Error(`Falha ao remover persona: ${error.message}`)
  }
}
