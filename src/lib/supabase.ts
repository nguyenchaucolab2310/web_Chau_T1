import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://wanqgoqrcegkateqavll.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6-_TCW2nKPGGVa3HuLnV0w_Hd96WNPz';

export const isSupabaseConfigured = Boolean(
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  SUPABASE_URL !== 'MY_SUPABASE_URL' && 
  !SUPABASE_URL.includes('your-project')
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export interface ConnectionStatus {
  connected: boolean;
  message: string;
  tablesFound?: string[];
  missingTables?: string[];
}

/**
 * Kiểm tra kết nối tới Supabase và xem các bảng chính đã tồn tại chưa
 */
export async function testSupabaseConnection(): Promise<ConnectionStatus> {
  if (!isSupabaseConfigured) {
    return {
      connected: false,
      message: 'Chưa cấu hình URL hoặc Anon Key trong biến môi trường.',
    };
  }

  const expectedTables = ['students', 'lessons', 'practical_submissions', 'quizzes', 'notifications'];
  const tablesFound: string[] = [];
  const missingTables: string[] = [];

  try {
    for (const table of expectedTables) {
      const { error } = await supabase.from(table).select('id').limit(1);
      if (error) {
        if (error.code === '42P01' || error.message.includes('does not exist')) {
          missingTables.push(table);
        } else {
          // If error is permission or something else, table likely exists
          tablesFound.push(table);
        }
      } else {
        tablesFound.push(table);
      }
    }

    if (tablesFound.length > 0) {
      return {
        connected: true,
        message: `Kết nối thành công! Đã tìm thấy ${tablesFound.length}/${expectedTables.length} bảng trên Supabase.`,
        tablesFound,
        missingTables,
      };
    } else {
      return {
        connected: true,
        message: 'Đã kết nối máy chủ Supabase thành công! Cần khởi tạo cấu trúc bảng (Table schema) trong SQL Editor.',
        tablesFound: [],
        missingTables: expectedTables,
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      message: `Lỗi kết nối Supabase: ${err.message || 'Không thể liên lạc tới máy chủ'}`,
    };
  }
}
