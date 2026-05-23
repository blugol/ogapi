import { createClient } from '@supabase/supabase-js';

// Supabase URL & Anon Key (환경변수가 주어지지 않았을 때도 사이트가 터지지 않고 
// 데모/시뮬레이션 모드로 매끄럽게 작동하도록 폴백을 제공합니다.)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 환경변수 등록 여부 확인
export const isSupabaseConfigured = 
  import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY;
