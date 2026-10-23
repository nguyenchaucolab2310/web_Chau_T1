import { supabase, isSupabaseConfigured } from './supabase';
import {
  Student,
  Lesson,
  PracticalSubmission,
  Quiz,
  QuizAttempt,
  ScheduleEvent,
  NotificationItem,
} from '../types';

export const SupabaseService = {
  // ================= STUDENTS =================
  async getStudents(): Promise<Student[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('students').select('*').order('name', { ascending: true });
      if (error) {
        console.warn('Supabase getStudents error:', error.message);
        return null;
      }
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        class: row.class,
        grade: row.grade,
        academicYear: row.academic_year || '2024-2025',
        status: row.status || 'Đang học',
        examScore: Number(row.exam_score) || 0,
        practicalScore: Number(row.practical_score) || 0,
        rating: row.rating,
        teacherNotes: row.teacher_notes,
        avatar: row.avatar,
        email: row.email,
      }));
    } catch (e) {
      console.warn('Supabase getStudents exception:', e);
      return null;
    }
  },

  async upsertStudent(student: Student): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('students').upsert({
        id: student.id,
        name: student.name,
        class: student.class,
        grade: student.grade,
        academic_year: student.academicYear,
        status: student.status,
        exam_score: student.examScore,
        practical_score: student.practicalScore,
        rating: student.rating,
        teacher_notes: student.teacherNotes,
        avatar: student.avatar,
        email: student.email,
      });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertStudent error:', e);
      return false;
    }
  },

  async deleteStudent(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('students').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteStudent error:', e);
      return false;
    }
  },

  async batchInsertStudents(students: Student[]): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const rows = students.map(s => ({
        id: s.id,
        name: s.name,
        class: s.class,
        grade: s.grade,
        academic_year: s.academicYear,
        status: s.status,
        exam_score: s.examScore,
        practical_score: s.practicalScore,
        rating: s.rating,
        teacher_notes: s.teacherNotes,
        avatar: s.avatar,
        email: s.email,
      }));
      const { error } = await supabase.from('students').upsert(rows);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase batchInsertStudents error:', e);
      return false;
    }
  },

  // ================= LESSONS =================
  async getLessons(): Promise<Lesson[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('lessons').select('*').order('code', { ascending: true });
      if (error) {
        console.warn('Supabase getLessons error:', error.message);
        return null;
      }
      return data.map((row: any) => ({
        id: row.id,
        code: row.code,
        title: row.title,
        grade: row.grade,
        topic: row.topic,
        targetClasses: row.target_classes || [],
        objectives: row.objectives || [],
        content: row.content || '',
        codeExamples: row.code_examples || [],
        attachments: row.attachments || [],
        videoEmbedUrl: row.video_embed_url,
        status: row.status || 'published',
        updatedAt: row.updated_at || '',
      }));
    } catch (e) {
      console.warn('Supabase getLessons exception:', e);
      return null;
    }
  },

  async upsertLesson(lesson: Lesson): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('lessons').upsert({
        id: lesson.id,
        code: lesson.code,
        title: lesson.title,
        grade: lesson.grade,
        topic: lesson.topic,
        target_classes: lesson.targetClasses,
        objectives: lesson.objectives,
        content: lesson.content,
        code_examples: lesson.codeExamples,
        attachments: lesson.attachments,
        video_embed_url: lesson.videoEmbedUrl,
        status: lesson.status,
        updated_at: lesson.updatedAt,
      });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertLesson error:', e);
      return false;
    }
  },

  async deleteLesson(id: string): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('lessons').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase deleteLesson error:', e);
      return false;
    }
  },

  // ================= PRACTICAL SUBMISSIONS =================
  async getSubmissions(): Promise<PracticalSubmission[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase
        .from('practical_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });
      if (error) return null;
      return data.map((row: any) => ({
        id: row.id,
        studentId: row.student_id,
        studentName: row.student_name,
        class: row.class,
        exerciseId: row.exercise_id,
        exerciseTitle: row.exercise_title,
        submittedAt: row.submitted_at,
        htmlCode: row.html_code || '',
        cssCode: row.css_code || '',
        score: row.score !== null ? Number(row.score) : undefined,
        teacherComment: row.teacher_comment,
        status: row.status || 'Đã nộp',
      }));
    } catch (e) {
      return null;
    }
  },

  async upsertSubmission(sub: PracticalSubmission): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('practical_submissions').upsert({
        id: sub.id,
        student_id: sub.studentId,
        student_name: sub.studentName,
        class: sub.class,
        exercise_id: sub.exerciseId,
        exercise_title: sub.exerciseTitle,
        submitted_at: sub.submittedAt,
        html_code: sub.htmlCode,
        css_code: sub.cssCode,
        score: sub.score,
        teacher_comment: sub.teacherComment,
        status: sub.status,
      });
      if (error) throw error;
      return true;
    } catch (e) {
      console.warn('Supabase upsertSubmission error:', e);
      return false;
    }
  },

  // ================= QUIZZES & ATTEMPTS =================
  async getQuizzes(): Promise<Quiz[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('quizzes').select('*');
      if (error) return null;
      return data.map((row: any) => ({
        id: row.id,
        title: row.title,
        grade: row.grade,
        targetClasses: row.target_classes || [],
        durationMinutes: row.duration_minutes,
        totalPoints: Number(row.total_points),
        status: row.status,
        questions: row.questions || [],
        startDate: row.start_date,
        endDate: row.end_date,
      }));
    } catch (e) {
      return null;
    }
  },

  async upsertQuiz(quiz: Quiz): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('quizzes').upsert({
        id: quiz.id,
        title: quiz.title,
        grade: quiz.grade,
        target_classes: quiz.targetClasses,
        duration_minutes: quiz.durationMinutes,
        total_points: quiz.totalPoints,
        status: quiz.status,
        questions: quiz.questions,
        start_date: quiz.startDate,
        end_date: quiz.endDate,
      });
      if (error) throw error;
      return true;
    } catch (e) {
      return false;
    }
  },

  async getQuizAttempts(): Promise<QuizAttempt[] | null> {
    if (!isSupabaseConfigured) return null;
    try {
      const { data, error } = await supabase.from('quiz_attempts').select('*').order('submitted_at', { ascending: false });
      if (error) return null;
      return data.map((row: any) => ({
        id: row.id,
        quizId: row.quiz_id,
        quizTitle: row.quiz_title,
        studentId: row.student_id,
        studentName: row.student_name,
        class: row.class,
        answers: row.answers || {},
        score: Number(row.score),
        maxScore: Number(row.max_score),
        submittedAt: row.submitted_at,
        autoGraded: row.auto_graded,
      }));
    } catch (e) {
      return null;
    }
  },

  async insertQuizAttempt(att: QuizAttempt): Promise<boolean> {
    if (!isSupabaseConfigured) return false;
    try {
      const { error } = await supabase.from('quiz_attempts').insert({
        id: att.id,
        quiz_id: att.quizId,
        quiz_title: att.quizTitle,
        student_id: att.studentId,
        student_name: att.studentName,
        class: att.class,
        answers: att.answers,
        score: att.score,
        max_score: att.maxScore,
        submitted_at: att.submittedAt,
        auto_graded: att.autoGraded,
      });
      if (error) throw error;
      return true;
    } catch (e) {
      return false;
    }
  },

  // ================= SEED INITIAL DATA =================
  async seedAllInitialData(payload: {
    students: Student[];
    lessons: Lesson[];
    submissions: PracticalSubmission[];
    quizzes: Quiz[];
    schedule: ScheduleEvent[];
    notifications: NotificationItem[];
  }): Promise<{ success: boolean; message: string }> {
    if (!isSupabaseConfigured) {
      return { success: false, message: 'Chưa cấu hình Supabase URL hoặc Key' };
    }

    try {
      // 1. Seed students
      if (payload.students.length > 0) {
        await this.batchInsertStudents(payload.students);
      }
      // 2. Seed lessons
      for (const l of payload.lessons) {
        await this.upsertLesson(l);
      }
      // 3. Seed submissions
      for (const s of payload.submissions) {
        await this.upsertSubmission(s);
      }
      // 4. Seed quizzes
      for (const q of payload.quizzes) {
        await this.upsertQuiz(q);
      }
      return {
        success: true,
        message: 'Đã đồng bộ toàn bộ dữ liệu danh sách học sinh, bài giảng, bài thực hành và đề kiểm tra lên Supabase thành công!',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `Lỗi khi đồng bộ dữ liệu: ${err.message || 'Không xác định'}`,
      };
    }
  },
};
