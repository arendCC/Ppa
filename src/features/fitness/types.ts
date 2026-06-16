export interface WeightEntry {
  id: string
  user_id: string
  date: string
  weight_kg: number
  note: string | null
  created_at: string
  updated_at: string
}

export type WeightEntryInsert = {
  user_id: string
  date: string
  weight_kg: number
  note?: string | null
}

export type WeightEntryUpdate = {
  weight_kg?: number
  note?: string | null
}
