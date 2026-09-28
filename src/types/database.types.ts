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
    PostgrestVersion: '14.5'
  }
  public: {
    Tables: {
      epics: {
        Row: {
          color: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          name: string
          project_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name: string
          project_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          name?: string
          project_id?: string
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
      inbox_items: {
        Row: {
          content: string
          created_at: string | null
          id: string
          triaged_at: string | null
          triaged_task_id: string | null
          triaged_to: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          triaged_at?: string | null
          triaged_task_id?: string | null
          triaged_to?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          triaged_at?: string | null
          triaged_task_id?: string | null
          triaged_to?: string | null
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
      projects: {
        Row: {
          color: string | null
          created_at: string | null
          deleted_at: string | null
          id: string
          last_task_number: number
          name: string
          prefix: string | null
          type: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          last_task_number?: number
          name: string
          prefix?: string | null
          type: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          last_task_number?: number
          name?: string
          prefix?: string | null
          type?: string
        }
        Relationships: []
      }
      sprints: {
        Row: {
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
          status: string
          total_tasks: number | null
        }
        Insert: {
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
          status?: string
          total_tasks?: number | null
        }
        Update: {
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
          status?: string
          total_tasks?: number | null
        }
        Relationships: []
      }
      srs_logs: {
        Row: {
          comment: string | null
          confianca: number | null
          created_at: string | null
          id: string
          log_type: string
          new_ef: number | null
          new_interval: number | null
          nota: number | null
          quality: number | null
          session_date: string
          task_id: string
        }
        Insert: {
          comment?: string | null
          confianca?: number | null
          created_at?: string | null
          id?: string
          log_type?: string
          new_ef?: number | null
          new_interval?: number | null
          nota?: number | null
          quality?: number | null
          session_date: string
          task_id: string
        }
        Update: {
          comment?: string | null
          confianca?: number | null
          created_at?: string | null
          id?: string
          log_type?: string
          new_ef?: number | null
          new_interval?: number | null
          nota?: number | null
          quality?: number | null
          session_date?: string
          task_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'srs_logs_task_id_fkey'
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
          flag_note: string | null
          flagged: boolean
          id: string
          interval: number | null
          next_review: string | null
          origem: string
          priority: string
          project_id: string
          recurrence_day_of_month: number | null
          recurrence_end_date: string | null
          recurrence_interval: number | null
          recurrence_parent_id: string | null
          recurrence_type: string | null
          sprint_id: string | null
          status: string
          task_number: number | null
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          ease_factor?: number | null
          epic_id?: string | null
          flag_note?: string | null
          flagged?: boolean
          id?: string
          interval?: number | null
          next_review?: string | null
          origem?: string
          priority?: string
          project_id: string
          recurrence_day_of_month?: number | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_parent_id?: string | null
          recurrence_type?: string | null
          sprint_id?: string | null
          status?: string
          task_number?: number | null
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          description?: string | null
          due_date?: string | null
          ease_factor?: number | null
          epic_id?: string | null
          flag_note?: string | null
          flagged?: boolean
          id?: string
          interval?: number | null
          next_review?: string | null
          origem?: string
          priority?: string
          project_id?: string
          recurrence_day_of_month?: number | null
          recurrence_end_date?: string | null
          recurrence_interval?: number | null
          recurrence_parent_id?: string | null
          recurrence_type?: string | null
          sprint_id?: string | null
          status?: string
          task_number?: number | null
          title?: string
          updated_at?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
