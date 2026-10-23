export const SUPABASE_SETUP_SQL = `-- =================================================================
-- SCRIPT KHỞI TẠO CƠ SỞ DỮ LIỆU TIN HỌC SỐ TRÊN SUPABASE
-- Trường PT DTNT THPT Bình Thuận - GV: Nguyễn Thị Châu
-- =================================================================

-- 1. Bảng học sinh (students)
CREATE TABLE IF NOT EXISTS public.students (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  grade INTEGER NOT NULL,
  academic_year TEXT DEFAULT '2024-2025',
  status TEXT DEFAULT 'Đang học',
  exam_score NUMERIC DEFAULT 0,
  practical_score NUMERIC DEFAULT 0,
  rating TEXT,
  teacher_notes TEXT,
  avatar TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Bảng bài học (lessons)
CREATE TABLE IF NOT EXISTS public.lessons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL,
  title TEXT NOT NULL,
  grade INTEGER NOT NULL,
  topic TEXT,
  target_classes JSONB DEFAULT '[]'::jsonb,
  objectives JSONB DEFAULT '[]'::jsonb,
  content TEXT,
  code_examples JSONB DEFAULT '[]'::jsonb,
  attachments JSONB DEFAULT '[]'::jsonb,
  video_embed_url TEXT,
  status TEXT DEFAULT 'published',
  updated_at TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Bảng nộp bài thực hành (practical_submissions)
CREATE TABLE IF NOT EXISTS public.practical_submissions (
  id TEXT PRIMARY KEY,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class TEXT NOT NULL,
  exercise_id TEXT NOT NULL,
  exercise_title TEXT NOT NULL,
  submitted_at TEXT NOT NULL,
  html_code TEXT,
  css_code TEXT,
  score NUMERIC,
  teacher_comment TEXT,
  status TEXT DEFAULT 'Đã nộp',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Bảng đề kiểm tra (quizzes)
CREATE TABLE IF NOT EXISTS public.quizzes (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  grade INTEGER NOT NULL,
  target_classes JSONB DEFAULT '[]'::jsonb,
  duration_minutes INTEGER DEFAULT 15,
  total_points NUMERIC DEFAULT 10,
  status TEXT DEFAULT 'active',
  questions JSONB DEFAULT '[]'::jsonb,
  start_date TEXT,
  end_date TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Bảng kết quả làm bài kiểm tra (quiz_attempts)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id TEXT PRIMARY KEY,
  quiz_id TEXT NOT NULL,
  quiz_title TEXT NOT NULL,
  student_id TEXT NOT NULL,
  student_name TEXT NOT NULL,
  class TEXT NOT NULL,
  answers JSONB DEFAULT '{}'::jsonb,
  score NUMERIC DEFAULT 0,
  max_score NUMERIC DEFAULT 10,
  submitted_at TEXT NOT NULL,
  auto_graded BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Bảng thông báo (notifications)
CREATE TABLE IF NOT EXISTS public.notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT DEFAULT 'reminder',
  is_read BOOLEAN DEFAULT FALSE,
  color TEXT DEFAULT 'blue',
  details TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Bảng sự kiện lịch dạy (schedule_events)
CREATE TABLE IF NOT EXISTS public.schedule_events (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  day_of_week TEXT NOT NULL,
  formatted_date TEXT NOT NULL,
  period TEXT NOT NULL,
  class TEXT NOT NULL,
  title TEXT NOT NULL,
  type TEXT DEFAULT 'teaching',
  color TEXT DEFAULT 'cyan',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cho phép đọc/ghi công khai (Public Access) với anon key cho tiện thử nghiệm
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.practical_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_events ENABLE ROW LEVEL SECURITY;

-- Tạo chính sách cho phép toàn quyền thao tác (SELECT, INSERT, UPDATE, DELETE) qua API
DO $$
BEGIN
  DROP POLICY IF EXISTS "Cho phep tat ca tren students" ON public.students;
  CREATE POLICY "Cho phep tat ca tren students" ON public.students FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Cho phep tat ca tren lessons" ON public.lessons;
  CREATE POLICY "Cho phep tat ca tren lessons" ON public.lessons FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Cho phep tat ca tren practical_submissions" ON public.practical_submissions;
  CREATE POLICY "Cho phep tat ca tren practical_submissions" ON public.practical_submissions FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Cho phep tat ca tren quizzes" ON public.quizzes;
  CREATE POLICY "Cho phep tat ca tren quizzes" ON public.quizzes FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Cho phep tat ca tren quiz_attempts" ON public.quiz_attempts;
  CREATE POLICY "Cho phep tat ca tren quiz_attempts" ON public.quiz_attempts FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Cho phep tat ca tren notifications" ON public.notifications;
  CREATE POLICY "Cho phep tat ca tren notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

  DROP POLICY IF EXISTS "Cho phep tat ca tren schedule_events" ON public.schedule_events;
  CREATE POLICY "Cho phep tat ca tren schedule_events" ON public.schedule_events FOR ALL USING (true) WITH CHECK (true);
END $$;
`;
