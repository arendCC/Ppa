/**
 * Generierte Supabase-Datenbanktypen.
 *
 * Bei Schema-Änderungen idealerweise ersetzen mit:
 *   npx supabase gen types typescript --project-id <PROJECT_ID> > src/lib/supabase/types.ts
 */

export type EventColor =
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'mint'
  | 'teal'
  | 'blue'
  | 'indigo'
  | 'purple'
  | 'pink'

export type TaskPriority = 'low' | 'medium' | 'high'

export type RecurrenceType = 'daily' | 'weekly' | 'monthly' | 'custom'

export type NoteType = 'free' | 'daily' | 'weekly'

export type Database = {
  public: {
    Tables: {
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          location: string | null
          start_time: string
          end_time: string
          all_day: boolean
          color: EventColor
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          description?: string | null
          location?: string | null
          start_time: string
          end_time: string
          all_day?: boolean
          color?: EventColor
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          location?: string | null
          start_time?: string
          end_time?: string
          all_day?: boolean
          color?: EventColor
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: TaskPriority
          category: string | null
          due_date: string | null
          completed: boolean
          completed_at: string | null
          recurring_task_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          description?: string | null
          priority?: TaskPriority
          category?: string | null
          due_date?: string | null
          completed?: boolean
          completed_at?: string | null
          recurring_task_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: TaskPriority
          category?: string | null
          due_date?: string | null
          completed?: boolean
          completed_at?: string | null
          recurring_task_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      recurring_tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          priority: TaskPriority
          category: string | null
          recurrence_type: RecurrenceType
          recurrence_interval: number
          next_due_date: string
          active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          title: string
          description?: string | null
          priority?: TaskPriority
          category?: string | null
          recurrence_type: RecurrenceType
          recurrence_interval?: number
          next_due_date: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          priority?: TaskPriority
          category?: string | null
          recurrence_type?: RecurrenceType
          recurrence_interval?: number
          next_due_date?: string
          active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      daily_goals: {
        Row: {
          id: string
          user_id: string
          date: string
          title: string
          completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          date: string
          title: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          title?: string
          completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      weekly_goals: {
        Row: {
          id: string
          user_id: string
          week_start: string
          title: string
          completed: boolean
          archived: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          week_start: string
          title: string
          completed?: boolean
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          week_start?: string
          title?: string
          completed?: boolean
          archived?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          id: string
          user_id: string
          type: NoteType
          title: string | null
          content: string
          note_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          type: NoteType
          title?: string | null
          content?: string
          note_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: NoteType
          title?: string | null
          content?: string
          note_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      weight_entries: {
        Row: {
          id: string
          user_id: string
          date: string
          weight_kg: number
          note: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string
          date: string
          weight_kg: number
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          weight_kg?: number
          note?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      generate_due_recurring_tasks: {
        Args: Record<string, never>
        Returns: void
      }
    }
    Enums: Record<string, never>
  }
}
