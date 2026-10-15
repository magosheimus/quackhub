export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '14.17'
  }
  public: {
    Tables: {
      daily_logs: {
        Row: {
          comment: string | null
          created_at: string
          date: string
          id: string
          mood: number
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          date: string
          id?: string
          mood: number
          user_id?: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          date?: string
          id?: string
          mood?: number
          user_id?: string
        }
        Relationships: []
      }
      drafts_items: {
        Row: {
          checked_at: string | null
          content: string
          created_at: string | null
          id: string
          triaged_at: string | null
          triaged_task_id: string | null
          triaged_to: Database['public']['Enums']['draft_triage_target'] | null
          user_id: string
        }
        Insert: {
          checked_at?: string | null
          content: string
          created_at?: string | null
          id?: string
          triaged_at?: string | null
          triaged_task_id?: string | null
          triaged_to?: Database['public']['Enums']['draft_triage_target'] | null
          user_id?: string
        }
        Update: {
          checked_at?: string | null
          content?: string
          created_at?: string | null
          id?: string
          triaged_at?: string | null
          triaged_task_id?: string | null
          triaged_to?: Database['public']['Enums']['draft_triage_target'] | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'inbox_items_triaged_task_id_fkey'
            columns: ['triaged_task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      epics: {
        Row: {
          color: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          position: number
          project_id: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          position?: number
          project_id: string
          user_id?: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          position?: number
          project_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'epics_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      habit_logs: {
        Row: {
          created_at: string
          date: string
          habit_id: string
          id: string
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          date: string
          habit_id: string
          id?: string
          user_id?: string
          value?: number
        }
        Update: {
          created_at?: string
          date?: string
          habit_id?: string
          id?: string
          user_id?: string
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: 'habit_logs_habit_id_fkey'
            columns: ['habit_id']
            isOneToOne: false
            referencedRelation: 'habits'
            referencedColumns: ['id']
          },
        ]
      }
      habits: {
        Row: {
          active: boolean
          created_at: string
          duration_minutes: number | null
          goal: number | null
          icon: string
          id: string
          name: string
          type: Database['public']['Enums']['habit_type']
          user_id: string
          weekdays: number[] | null
        }
        Insert: {
          active?: boolean
          created_at?: string
          duration_minutes?: number | null
          goal?: number | null
          icon?: string
          id?: string
          name: string
          type: Database['public']['Enums']['habit_type']
          user_id?: string
          weekdays?: number[] | null
        }
        Update: {
          active?: boolean
          created_at?: string
          duration_minutes?: number | null
          goal?: number | null
          icon?: string
          id?: string
          name?: string
          type?: Database['public']['Enums']['habit_type']
          user_id?: string
          weekdays?: number[] | null
        }
        Relationships: []
      }
      projects: {
        Row: {
          color: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          last_task_number: number
          name: string
          prefix: string | null
          type: Database['public']['Enums']['project_type']
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          last_task_number?: number
          name: string
          prefix?: string | null
          type: Database['public']['Enums']['project_type']
          user_id?: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          last_task_number?: number
          name?: string
          prefix?: string | null
          type?: Database['public']['Enums']['project_type']
          user_id?: string
        }
        Relationships: []
      }
      sprints: {
        Row: {
          analytics_snapshot: Json | null
          carried_to_backlog: number | null
          carried_to_next: number | null
          completed_tasks: number | null
          completion_by_project: Json | null
          completion_rate: number | null
          created_at: string | null
          deleted_at: string | null
          end_date: string | null
          goal: string | null
          id: string
          name: string
          start_date: string | null
          status: Database['public']['Enums']['sprint_status']
          total_tasks: number | null
          user_id: string
        }
        Insert: {
          analytics_snapshot?: Json | null
          carried_to_backlog?: number | null
          carried_to_next?: number | null
          completed_tasks?: number | null
          completion_by_project?: Json | null
          completion_rate?: number | null
          created_at?: string | null
          deleted_at?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          name: string
          start_date?: string | null
          status?: Database['public']['Enums']['sprint_status']
          total_tasks?: number | null
          user_id?: string
        }
        Update: {
          analytics_snapshot?: Json | null
          carried_to_backlog?: number | null
          carried_to_next?: number | null
          completed_tasks?: number | null
          completion_by_project?: Json | null
          completion_rate?: number | null
          created_at?: string | null
          deleted_at?: string | null
          end_date?: string | null
          goal?: string | null
          id?: string
          name?: string
          start_date?: string | null
          status?: Database['public']['Enums']['sprint_status']
          total_tasks?: number | null
          user_id?: string
        }
        Relationships: []
      }
      srs_logs: {
        Row: {
          comment: string | null
          confianca: number | null
          created_at: string | null
          id: string
          log_type: Database['public']['Enums']['srs_log_type']
          new_ef: number | null
          new_interval: number | null
          nota: number | null
          quality: number | null
          session_date: string
          sprint_id: string | null
          task_id: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          confianca?: number | null
          created_at?: string | null
          id?: string
          log_type?: Database['public']['Enums']['srs_log_type']
          new_ef?: number | null
          new_interval?: number | null
          nota?: number | null
          quality?: number | null
          session_date: string
          sprint_id?: string | null
          task_id: string
          user_id?: string
        }
        Update: {
          comment?: string | null
          confianca?: number | null
          created_at?: string | null
          id?: string
          log_type?: Database['public']['Enums']['srs_log_type']
          new_ef?: number | null
          new_interval?: number | null
          nota?: number | null
          quality?: number | null
          session_date?: string
          sprint_id?: string | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'srs_logs_sprint_id_fkey'
            columns: ['sprint_id']
            isOneToOne: false
            referencedRelation: 'sprints'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'srs_logs_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      task_activity_log: {
        Row: {
          created_at: string | null
          event_type: Database['public']['Enums']['activity_event_type']
          id: string
          new_value: string | null
          old_value: string | null
          task_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: Database['public']['Enums']['activity_event_type']
          id?: string
          new_value?: string | null
          old_value?: string | null
          task_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: Database['public']['Enums']['activity_event_type']
          id?: string
          new_value?: string | null
          old_value?: string | null
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_activity_log_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      task_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          id: string
          mime_type: string
          storage_path: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          id?: string
          mime_type: string
          storage_path: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          id?: string
          mime_type?: string
          storage_path?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_attachments_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      task_checklist_items: {
        Row: {
          content: string
          created_at: string | null
          done: boolean
          id: string
          position: number
          task_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          done?: boolean
          id?: string
          position?: number
          task_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          done?: boolean
          id?: string
          position?: number
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_checklist_items_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      task_dependencies: {
        Row: {
          created_at: string | null
          depends_on_task_id: string
          id: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          depends_on_task_id: string
          id?: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          depends_on_task_id?: string
          id?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_dependencies_depends_on_task_id_fkey'
            columns: ['depends_on_task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'task_dependencies_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      task_tags: {
        Row: {
          id: string
          tag_name: string
          task_id: string
        }
        Insert: {
          id?: string
          tag_name: string
          task_id: string
        }
        Update: {
          id?: string
          tag_name?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'task_tags_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      tasks: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          description: string | null
          due_date: string | null
          ease_factor: number | null
          epic_id: string | null
          estimated_minutes: number | null
          flag_note: string | null
          flagged: boolean
          id: string
          interval: number | null
          next_review: string | null
          origin: Database['public']['Enums']['task_origin']
          priority: Database['public']['Enums']['task_priority']
          project_id: string
          recurrence_day_of_month: number | null
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_parent_id: string | null
          recurrence_type: Database['public']['Enums']['recurrence_type'] | null
          sprint_id: string | null
          status: Database['public']['Enums']['task_status']
          task_number: number | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          ease_factor?: number | null
          epic_id?: string | null
          estimated_minutes?: number | null
          flag_note?: string | null
          flagged?: boolean
          id?: string
          interval?: number | null
          next_review?: string | null
          origin?: Database['public']['Enums']['task_origin']
          priority?: Database['public']['Enums']['task_priority']
          project_id: string
          recurrence_day_of_month?: number | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_parent_id?: string | null
          recurrence_type?:
            Database['public']['Enums']['recurrence_type'] | null
          sprint_id?: string | null
          status?: Database['public']['Enums']['task_status']
          task_number?: number | null
          title: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          ease_factor?: number | null
          epic_id?: string | null
          estimated_minutes?: number | null
          flag_note?: string | null
          flagged?: boolean
          id?: string
          interval?: number | null
          next_review?: string | null
          origin?: Database['public']['Enums']['task_origin']
          priority?: Database['public']['Enums']['task_priority']
          project_id?: string
          recurrence_day_of_month?: number | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_parent_id?: string | null
          recurrence_type?:
            Database['public']['Enums']['recurrence_type'] | null
          sprint_id?: string | null
          status?: Database['public']['Enums']['task_status']
          task_number?: number | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'tasks_epic_id_fkey'
            columns: ['epic_id']
            isOneToOne: false
            referencedRelation: 'epics'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_recurrence_parent_id_fkey'
            columns: ['recurrence_parent_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_sprint_id_fkey'
            columns: ['sprint_id']
            isOneToOne: false
            referencedRelation: 'sprints'
            referencedColumns: ['id']
          },
        ]
      }
      time_entries: {
        Row: {
          created_at: string | null
          ended_at: string | null
          id: string
          started_at: string
          task_id: string
        }
        Insert: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          started_at: string
          task_id: string
        }
        Update: {
          created_at?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'time_entries_task_id_fkey'
            columns: ['task_id']
            isOneToOne: false
            referencedRelation: 'tasks'
            referencedColumns: ['id']
          },
        ]
      }
      user_settings: {
        Row: {
          settings: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          settings: Json
          updated_at?: string
          user_id?: string
        }
        Update: {
          settings?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      activity_event_type: 'status_change' | 'sprint_change'
      draft_triage_target: 'task' | 'project' | 'habit' | 'discarded' | 'done'
      habit_type: 'boolean' | 'counter'
      project_type: 'general' | 'study'
      recurrence_type: 'daily' | 'weekly' | 'monthly' | 'yearly'
      sprint_status: 'planned' | 'active' | 'closed'
      srs_log_type: 'srs' | 'manual'
      task_origin: 'manual' | 'inbox' | 'recurrence' | 'quackdump'
      task_priority: 'high' | 'medium' | 'low'
      task_status:
        | 'to_study'
        | 'studying'
        | 'scheduled'
        | 'to_review'
        | 'todo'
        | 'doing'
        | 'blocked'
        | 'done'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] &
        DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] &
        DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema['Tables'] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema['Enums'] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      activity_event_type: ['status_change', 'sprint_change'],
      draft_triage_target: ['task', 'project', 'habit', 'discarded', 'done'],
      habit_type: ['boolean', 'counter'],
      project_type: ['general', 'study'],
      recurrence_type: ['daily', 'weekly', 'monthly', 'yearly'],
      sprint_status: ['planned', 'active', 'closed'],
      srs_log_type: ['srs', 'manual'],
      task_origin: ['manual', 'inbox', 'recurrence', 'quackdump'],
      task_priority: ['high', 'medium', 'low'],
      task_status: [
        'to_study',
        'studying',
        'scheduled',
        'to_review',
        'todo',
        'doing',
        'blocked',
        'done',
      ],
    },
  },
} as const
