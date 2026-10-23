export type UserRole = 'teacher' | 'student';

export interface Student {
  id: string; // Mã học sinh, e.g. HS1201
  name: string;
  class: string; // e.g. 12A1
  grade: number; // 10, 11, 12
  academicYear: string; // e.g. 2024-2025
  status: 'Đang học' | 'Nghỉ học' | 'Chuyển trường';
  examScore: number; // Điểm kiểm tra (0-10)
  practicalScore: number; // Điểm thực hành (0-10)
  rating?: 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu';
  teacherNotes?: string;
  avatar?: string;
  email?: string;
  completedLessons?: string[];
  submittedPracticals?: string[];
}

export interface Lesson {
  id: string;
  title: string;
  code: string; // e.g. "Bài 3"
  grade: number; // 10, 11, 12
  topic: string; // e.g. "Thiết kế web với HTML/CSS"
  targetClasses: string[];
  objectives: string[];
  content: string; // Lý thuyết chi tiết
  codeExamples?: {
    language: string;
    code: string;
    explanation: string;
  }[];
  attachments?: {
    name: string;
    type: 'pdf' | 'slides' | 'video' | 'doc';
    url: string;
  }[];
  videoEmbedUrl?: string;
  status: 'published' | 'draft';
  updatedAt: string;
}

export interface PracticalExercise {
  id: string;
  title: string;
  lessonId?: string;
  grade: number;
  difficulty: 'Cơ bản' | 'Trung bình' | 'Nâng cao';
  description: string;
  requirements: string[];
  starterHtml: string;
  starterCss: string;
  solutionHint?: string;
  tests: {
    description: string;
    checkFnCode: string; // Simple keyword / tag verification
  }[];
}

export interface PracticalSubmission {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  exerciseId: string;
  exerciseTitle: string;
  submittedAt: string;
  htmlCode: string;
  cssCode: string;
  score?: number;
  teacherComment?: string;
  status: 'Đã nộp' | 'Đã chấm';
}

export interface QuizQuestion {
  id: string;
  type: 'single' | 'multiple' | 'true_false' | 'short_answer';
  question: string;
  options?: string[];
  correctAnswers: number[] | string; // index or text
  points: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  grade: number;
  targetClasses: string[];
  durationMinutes: number;
  totalPoints: number;
  status: 'active' | 'upcoming' | 'closed';
  questions: QuizQuestion[];
  startDate: string;
  endDate: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  studentId: string;
  studentName: string;
  class: string;
  answers: Record<string, any>;
  score: number;
  maxScore: number;
  submittedAt: string;
  autoGraded: boolean;
}

export interface ScheduleEvent {
  id: string;
  date: string; // e.g. "2025-04-22"
  dayOfWeek: string; // "Thứ Ba"
  formattedDate: string; // "22/04/2025"
  period: string; // "Tiết 1 - 2"
  class: string; // "12A1"
  title: string; // "Bài 5. Lập trình Python"
  type: 'teaching' | 'exam' | 'activity' | 'meeting';
  color: 'cyan' | 'yellow' | 'red' | 'blue';
}

export interface NotificationItem {
  id: string;
  title: string;
  date: string; // "21/04/2025"
  category: 'lesson' | 'exam' | 'assignment' | 'material' | 'reminder';
  isRead: boolean;
  color: 'yellow' | 'red' | 'blue' | 'green';
  details?: string;
}

export interface ActivityItem {
  id: string;
  studentName: string;
  action: string;
  timeAgo: string;
  type: 'practical' | 'quiz' | 'lesson' | 'grade';
}

export interface ClassSummary {
  name: string; // "12A1"
  grade: number; // 12
  totalStudents: number;
  avgExamScore: number;
  avgPracticalScore: number;
}
