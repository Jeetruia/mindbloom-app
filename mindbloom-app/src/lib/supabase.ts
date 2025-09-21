import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          nickname: string
          age_band: string
          language: string
          role: 'student' | 'parent' | 'teacher'
          avatar_level: number
          xp: number
          streak: number
          created_at: string
          last_checkin: string | null
          privacy_settings: any
          wellness_metrics: any
        }
        Insert: {
          id?: string
          nickname: string
          age_band: string
          language: string
          role: 'student' | 'parent' | 'teacher'
          avatar_level?: number
          xp?: number
          streak?: number
          created_at?: string
          last_checkin?: string | null
          privacy_settings?: any
          wellness_metrics?: any
        }
        Update: {
          id?: string
          nickname?: string
          age_band?: string
          language?: string
          role?: 'student' | 'parent' | 'teacher'
          avatar_level?: number
          xp?: number
          streak?: number
          created_at?: string
          last_checkin?: string | null
          privacy_settings?: any
          wellness_metrics?: any
        }
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          content: string
          is_from_user: boolean
          created_at: string
          emotion: any
          session_id: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          is_from_user: boolean
          created_at?: string
          emotion?: any
          session_id: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          is_from_user?: boolean
          created_at?: string
          emotion?: any
          session_id?: string
        }
      }
      wellness_sessions: {
        Row: {
          id: string
          user_id: string
          type: 'chat' | 'breathing' | 'journaling' | 'exercise' | 'micro_task'
          duration: number
          xp_earned: number
          completed_at: string
          notes: string | null
          metadata: any
        }
        Insert: {
          id?: string
          user_id: string
          type: 'chat' | 'breathing' | 'journaling' | 'exercise' | 'micro_task'
          duration: number
          xp_earned: number
          completed_at?: string
          notes?: string | null
          metadata?: any
        }
        Update: {
          id?: string
          user_id?: string
          type?: 'chat' | 'breathing' | 'journaling' | 'exercise' | 'micro_task'
          duration?: number
          xp_earned?: number
          completed_at?: string
          notes?: string | null
          metadata?: any
        }
      }
      peer_circles: {
        Row: {
          id: string
          name: string
          description: string
          theme: string
          max_capacity: number
          current_members: number
          rules: string[]
          created_at: string
          is_active: boolean
        }
        Insert: {
          id?: string
          name: string
          description: string
          theme: string
          max_capacity: number
          current_members?: number
          rules: string[]
          created_at?: string
          is_active?: boolean
        }
        Update: {
          id?: string
          name?: string
          description?: string
          theme?: string
          max_capacity?: number
          current_members?: number
          rules?: string[]
          created_at?: string
          is_active?: boolean
        }
      }
      circle_members: {
        Row: {
          id: string
          circle_id: string
          user_id: string
          joined_at: string
          is_anonymous: boolean
        }
        Insert: {
          id?: string
          circle_id: string
          user_id: string
          joined_at?: string
          is_anonymous?: boolean
        }
        Update: {
          id?: string
          circle_id?: string
          user_id?: string
          joined_at?: string
          is_anonymous?: boolean
        }
      }
      stories: {
        Row: {
          id: string
          title: string
          content: string
          author_id: string
          category: string
          is_anonymous: boolean
          created_at: string
          likes: number
          views: number
          audio_url: string | null
        }
        Insert: {
          id?: string
          title: string
          content: string
          author_id: string
          category: string
          is_anonymous?: boolean
          created_at?: string
          likes?: number
          views?: number
          audio_url?: string | null
        }
        Update: {
          id?: string
          title?: string
          content?: string
          author_id?: string
          category?: string
          is_anonymous?: boolean
          created_at?: string
          likes?: number
          views?: number
          audio_url?: string | null
        }
      }
      challenges: {
        Row: {
          id: string
          title: string
          description: string
          type: 'community' | 'individual' | 'normalization'
          start_date: string
          end_date: string
          xp_reward: number
          is_active: boolean
          metadata: any
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'community' | 'individual' | 'normalization'
          start_date: string
          end_date: string
          xp_reward: number
          is_active?: boolean
          metadata?: any
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'community' | 'individual' | 'normalization'
          start_date?: string
          end_date?: string
          xp_reward?: number
          is_active?: boolean
          metadata?: any
        }
      }
      community_garden: {
        Row: {
          id: string
          user_id: string
          object_type: 'tree' | 'bench' | 'lantern' | 'flower'
          position_x: number
          position_y: number
          message: string | null
          created_at: string
          xp_cost: number
        }
        Insert: {
          id?: string
          user_id: string
          object_type: 'tree' | 'bench' | 'lantern' | 'flower'
          position_x: number
          position_y: number
          message?: string | null
          created_at?: string
          xp_cost: number
        }
        Update: {
          id?: string
          user_id?: string
          object_type?: 'tree' | 'bench' | 'lantern' | 'flower'
          position_x?: number
          position_y?: number
          message?: string | null
          created_at?: string
          xp_cost?: number
        }
      }
      micro_tasks: {
        Row: {
          id: string
          title: string
          description: string
          type: 'breathing' | 'journaling' | 'mindfulness' | 'gratitude'
          duration: number
          xp_reward: number
          instructions: string[]
          is_daily: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          type: 'breathing' | 'journaling' | 'mindfulness' | 'gratitude'
          duration: number
          xp_reward: number
          instructions: string[]
          is_daily?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          type?: 'breathing' | 'journaling' | 'mindfulness' | 'gratitude'
          duration?: number
          xp_reward?: number
          instructions?: string[]
          is_daily?: boolean
          created_at?: string
        }
      }
    }
  }
}
