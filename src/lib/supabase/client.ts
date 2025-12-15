import { createClient } from '@supabase/supabase-js'

// Verificação de variáveis de ambiente com valores padrão para desenvolvimento
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Aviso se as variáveis não estão configuradas
if (supabaseUrl === 'https://placeholder.supabase.co') {
  console.warn('⚠️ Supabase não configurado. Configure .env.local com suas credenciais para usar o sistema completo.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos das tabelas do Supabase
export type Database = {
  public: {
    Tables: {
      chronicles: {
        Row: {
          id: string
          name: string
          storyteller_user_id: string
          settings_json: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          storyteller_user_id: string
          settings_json: any
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          storyteller_user_id?: string
          settings_json?: any
          created_at?: string
          updated_at?: string
        }
      }
      characters: {
        Row: {
          id: string
          chronicle_id: string
          owner_user_id: string
          name: string
          concept: string
          clan: string
          nature: string
          demeanor: string
          generation: number
          sire: string
          attributes_json: any
          skills_json: any
          advantages_json: any
          morality_json: any
          status: string
          approval_notes: string
          experience_points: number
          experience_total: number
          created_at: string
          updated_at: string
          approved_at: string | null
        }
        Insert: {
          id?: string
          chronicle_id: string
          owner_user_id: string
          name: string
          concept: string
          clan: string
          nature: string
          demeanor: string
          generation: number
          sire: string
          attributes_json: any
          skills_json: any
          advantages_json: any
          morality_json: any
          status?: string
          approval_notes?: string
          experience_points?: number
          experience_total?: number
          created_at?: string
          updated_at?: string
          approved_at?: string | null
        }
        Update: {
          id?: string
          chronicle_id?: string
          owner_user_id?: string
          name?: string
          concept?: string
          clan?: string
          nature?: string
          demeanor?: string
          generation?: number
          sire?: string
          attributes_json?: any
          skills_json?: any
          advantages_json?: any
          morality_json?: any
          status?: string
          approval_notes?: string
          experience_points?: number
          experience_total?: number
          created_at?: string
          updated_at?: string
          approved_at?: string | null
        }
      }
      character_changelog: {
        Row: {
          id: string
          character_id: string
          change_type: string
          diff_json: any
          notes: string
          created_at: string
          created_by: string
        }
        Insert: {
          id?: string
          character_id: string
          change_type: string
          diff_json: any
          notes: string
          created_at?: string
          created_by: string
        }
        Update: {
          id?: string
          character_id?: string
          change_type?: string
          diff_json?: any
          notes?: string
          created_at?: string
          created_by?: string
        }
      }
    }
  }
}