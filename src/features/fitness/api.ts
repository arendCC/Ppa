import { supabase } from '@/lib/supabase/client'
import type { WeightEntry, WeightEntryInsert, WeightEntryUpdate } from './types'

export async function getWeightEntries(): Promise<WeightEntry[]> {
  const { data, error } = await supabase
    .from('weight_entries')
    .select('*')
    .order('date', { ascending: true })

  if (error) throw error
  return data
}

export async function upsertWeightEntry(
  entry: WeightEntryInsert,
): Promise<WeightEntry> {
  const { data, error } = await supabase
    .from('weight_entries')
    .upsert(entry, { onConflict: 'user_id,date' })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateWeightEntry(
  id: string,
  update: WeightEntryUpdate,
): Promise<WeightEntry> {
  const { data, error } = await supabase
    .from('weight_entries')
    .update(update)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteWeightEntry(id: string): Promise<void> {
  const { error } = await supabase.from('weight_entries').delete().eq('id', id)
  if (error) throw error
}
