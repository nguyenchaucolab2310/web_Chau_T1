import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  Lesson,
  PracticalExercise,
  PracticalSubmission,
  Quiz,
  QuizAttempt,
  ScheduleEvent,
  NotificationItem,
  ActivityItem,
  UserRole
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_LESSONS,
  INITIAL_PRACTICAL_EXERCISES,
  INITIAL_QUIZZES,
  INITIAL_SCHEDULE,
  INITIAL_NOTIFICATIONS,
  INITIAL_ACTIVITIES,
  INITIAL_SUBMISSIONS
} from '../data/mockData';

export type ActiveTab = 'home' | 'lessons' | 'practical' | 'quizzes' | 'students' | 'results' | 'ai-assistant';

interface AppContextType {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedClassFilter: string;
  setSelectedClassFilter: (cls: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  students: Student[];
  addStudent: (student: Omit<Student, 'rating'>) => void;
  updateStudent: (student: Student) => void;
  deleteStudent: (id: string) => void;
  batchImportStudents: (imported: Student[]) => void;

  lessons: Lesson[];
  activeLessonId: string | null;
  setActiveLessonId: (id: string | null) => void;
  addLesson: (lesson: Omit<Lesson, 'id' | 'updatedAt'>) => void;
  updateLesson: (lesson: Lesson) => void;
  deleteLesson: (id: string) => void;

  exercises: PracticalExercise[];
  activeExerciseId: string | null;
  setActiveExerciseId: (id: string | null) => void;
  submissions: PracticalSubmission[];
  submitPractical: (sub: Omit<PracticalSubmission, 'id' | 'submittedAt'>) => void;
  gradePractical: (submissionId: string, score: number, comment: string) => void;

  quizzes: Quiz[];
  activeQuizId: string | null;
  setActiveQuizId: (id: string | null) => void;
  quizAttempts: QuizAttempt[];
  addQuiz: (quiz: Omit<Quiz, 'id'>) => void;
  submitQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'submittedAt'>) => void;

  schedule: ScheduleEvent[];
  addScheduleEvent: (ev: Omit<ScheduleEvent, 'id'>) => void;
  deleteScheduleEvent: (id: string) => void;

  notifications: NotificationItem[];
  addNotification: (notif: Omit<NotificationItem, 'id' | 'isRead'>) => void;
  markNotificationAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;

  activities: ActivityItem[];
  toast: { message: string; type: 'success' | 'info' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const calculateRating = (exam: number, practical: number): 'Giỏi' | 'Khá' | 'Trung bình' | 'Yếu' => {
  const avg = (exam + practical) / 2;
  if (avg >= 8.0 && exam >= 6.5 && practical >= 6.5) return 'Giỏi';
  if (avg >= 6.5 && exam >= 5.0 && practical >= 5.0) return 'Khá';
  if (avg >= 5.0) return 'Trung bình';
  return 'Yếu';
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentRole, setCurrentRole] = useState<UserRole>('teacher');
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('Tất cả');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [activeExerciseId, setActiveExerciseId] = useState<string | null>('ex-1-text-formatting');
  const [activeQuizId, setActiveQuizId] = useState<string | null>(null);

  // Load from LocalStorage or defaults
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem('tinhocso_students');
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    try {
      const saved = localStorage.getItem('tinhocso_lessons');
      return saved ? JSON.parse(saved) : INITIAL_LESSONS;
    } catch {
      return INITIAL_LESSONS;
    }
  });

  const [exercises] = useState<PracticalExercise[]>(INITIAL_PRACTICAL_EXERCISES);

  const [submissions, setSubmissions] = useState<PracticalSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('tinhocso_submissions');
      return saved ? JSON.parse(saved) : INITIAL_SUBMISSIONS;
    } catch {
      return INITIAL_SUBMISSIONS;
    }
  });

  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    try {
      const saved = localStorage.getItem('tinhocso_quizzes');
      return saved ? JSON.parse(saved) : INITIAL_QUIZZES;
    } catch {
      return INITIAL_QUIZZES;
    }
  });

  const [quizAttempts, setQuizAttempts] = useState<QuizAttempt[]>(() => {
    try {
      const saved = localStorage.getItem('tinhocso_quiz_attempts');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [schedule, setSchedule] = useState<ScheduleEvent[]>(() => {
    try {
      const saved = localStorage.getItem('tinhocso_schedule');
      return saved ? JSON.parse(saved) : INITIAL_SCHEDULE;
    } catch {
      return INITIAL_SCHEDULE;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('tinhocso_notifications');
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activities, setActivities] = useState<ActivityItem[]>(() => {
    try {
      const saved = localStorage.getItem('tinhocso_activities');
      return saved ? JSON.parse(saved) : INITIAL_ACTIVITIES;
    } catch {
      return INITIAL_ACTIVITIES;
    }
  });

  // Auto-save to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('tinhocso_students', JSON.stringify(students));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem('tinhocso_lessons', JSON.stringify(lessons));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [lessons]);

  useEffect(() => {
    try {
      localStorage.setItem('tinhocso_submissions', JSON.stringify(submissions));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [submissions]);

  useEffect(() => {
    try {
      localStorage.setItem('tinhocso_quizzes', JSON.stringify(quizzes));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [quizzes]);

  useEffect(() => {
    try {
      localStorage.setItem('tinhocso_quiz_attempts', JSON.stringify(quizAttempts));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [quizAttempts]);

  useEffect(() => {
    try {
      localStorage.setItem('tinhocso_schedule', JSON.stringify(schedule));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [schedule]);

  useEffect(() => {
    try {
      localStorage.setItem('tinhocso_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [notifications]);

  useEffect(() => {
    try {
      localStorage.setItem('tinhocso_activities', JSON.stringify(activities));
    } catch (e) {
      console.error('LocalStorage error:', e);
    }
  }, [activities]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Student operations
  const addStudent = (studentData: Omit<Student, 'rating'>) => {
    const rating = calculateRating(studentData.examScore, studentData.practicalScore);
    const newStudent: Student = {
      ...studentData,
      rating,
    };
    setStudents(prev => [newStudent, ...prev]);

    // Record activity
    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        studentName: newStudent.name,
        action: `đã được thêm vào danh sách lớp ${newStudent.class}`,
        timeAgo: 'Vừa xong',
        type: 'grade',
      },
      ...prev.slice(0, 9),
    ]);

    showToast(`Đã thêm học sinh ${newStudent.name} (${newStudent.id}) thành công!`);
  };

  const updateStudent = (updatedStudent: Student) => {
    const rating = calculateRating(updatedStudent.examScore, updatedStudent.practicalScore);
    setStudents(prev =>
      prev.map(s => (s.id === updatedStudent.id ? { ...updatedStudent, rating } : s))
    );

    // Record activity
    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        studentName: updatedStudent.name,
        action: `đã được cập nhật thông tin và điểm số`,
        timeAgo: 'Vừa xong',
        type: 'grade',
      },
      ...prev.slice(0, 9),
    ]);

    showToast(`Đã cập nhật thông tin học sinh ${updatedStudent.name}!`);
  };

  const deleteStudent = (id: string) => {
    const target = students.find(s => s.id === id);
    setStudents(prev => prev.filter(s => s.id !== id));
    showToast(`Đã xóa học sinh ${target ? target.name : id} khỏi danh sách!`, 'info');
  };

  const batchImportStudents = (imported: Student[]) => {
    const processed = imported.map(s => ({
      ...s,
      rating: calculateRating(s.examScore, s.practicalScore),
    }));

    // Merge by ID: update existing, add new
    setStudents(prev => {
      const map = new Map<string, Student>();
      prev.forEach(item => map.set(item.id, item));
      processed.forEach(item => map.set(item.id, item));
      return Array.from(map.values());
    });

    showToast(`Nhập dữ liệu thành công! Đã cập nhật ${processed.length} học sinh.`, 'success');
  };

  // Lesson operations
  const addLesson = (lessonData: Omit<Lesson, 'id' | 'updatedAt'>) => {
    const newLesson: Lesson = {
      ...lessonData,
      id: `lesson-${Date.now()}`,
      updatedAt: new Date().toISOString().split('T')[0],
    };
    setLessons(prev => [newLesson, ...prev]);
    showToast(`Đã tạo bài học mới: ${newLesson.code} - ${newLesson.title}`);
  };

  const updateLesson = (updatedLesson: Lesson) => {
    setLessons(prev =>
      prev.map(l =>
        l.id === updatedLesson.id
          ? { ...updatedLesson, updatedAt: new Date().toISOString().split('T')[0] }
          : l
      )
    );
    showToast(`Đã lưu thay đổi cho bài học ${updatedLesson.title}`);
  };

  const deleteLesson = (id: string) => {
    setLessons(prev => prev.filter(l => l.id !== id));
    showToast('Đã xóa bài học thành công.', 'info');
  };

  // Practical operations
  const submitPractical = (subData: Omit<PracticalSubmission, 'id' | 'submittedAt'>) => {
    const newSub: PracticalSubmission = {
      ...subData,
      id: `sub-${Date.now()}`,
      submittedAt: new Date().toLocaleString('vi-VN'),
    };
    setSubmissions(prev => [newSub, ...prev]);

    // Record activity
    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        studentName: subData.studentName,
        action: `đã nộp bài thực hành "${subData.exerciseTitle}"`,
        timeAgo: 'Vừa xong',
        type: 'practical',
      },
      ...prev.slice(0, 9),
    ]);

    showToast(`Nộp bài thực hành thành công! Giáo viên sẽ xem và chấm điểm.`);
  };

  const gradePractical = (submissionId: string, score: number, comment: string) => {
    setSubmissions(prev =>
      prev.map(sub =>
        sub.id === submissionId
          ? { ...sub, score, teacherComment: comment, status: 'Đã chấm' }
          : sub
      )
    );

    // Also update practicalScore of student if found
    const targetSub = submissions.find(s => s.id === submissionId);
    if (targetSub) {
      setStudents(prev =>
        prev.map(s => {
          if (s.id === targetSub.studentId) {
            const updatedPrac = score;
            const newRating = calculateRating(s.examScore, updatedPrac);
            return { ...s, practicalScore: updatedPrac, rating: newRating };
          }
          return s;
        })
      );
    }

    showToast('Đã lưu điểm và nhận xét bài thực hành thành công!');
  };

  // Quiz operations
  const addQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: `quiz-${Date.now()}`,
    };
    setQuizzes(prev => [newQuiz, ...prev]);
    showToast(`Đã tạo đề kiểm tra: ${newQuiz.title}`);
  };

  const submitQuizAttempt = (attemptData: Omit<QuizAttempt, 'id' | 'submittedAt'>) => {
    const newAttempt: QuizAttempt = {
      ...attemptData,
      id: `att-${Date.now()}`,
      submittedAt: new Date().toLocaleString('vi-VN'),
    };
    setQuizAttempts(prev => [newAttempt, ...prev]);

    // Update student examScore
    setStudents(prev =>
      prev.map(s => {
        if (s.id === attemptData.studentId) {
          const newRating = calculateRating(attemptData.score, s.practicalScore);
          return { ...s, examScore: attemptData.score, rating: newRating };
        }
        return s;
      })
    );

    // Record activity
    setActivities(prev => [
      {
        id: `act-${Date.now()}`,
        studentName: attemptData.studentName,
        action: `hoàn thành bài kiểm tra "${attemptData.quizTitle}" (${attemptData.score}/${attemptData.maxScore} đ)`,
        timeAgo: 'Vừa xong',
        type: 'quiz',
      },
      ...prev.slice(0, 9),
    ]);

    showToast(`Nộp bài kiểm tra thành công! Điểm của em: ${attemptData.score} / ${attemptData.maxScore}`);
  };

  // Schedule operations
  const addScheduleEvent = (evData: Omit<ScheduleEvent, 'id'>) => {
    const newEv: ScheduleEvent = {
      ...evData,
      id: `ev-${Date.now()}`,
    };
    setSchedule(prev => [...prev, newEv]);
    showToast(`Đã thêm sự kiện lịch: ${newEv.title}`);
  };

  const deleteScheduleEvent = (id: string) => {
    setSchedule(prev => prev.filter(e => e.id !== id));
    showToast('Đã xóa sự kiện lịch làm việc.', 'info');
  };

  // Notification operations
  const addNotification = (notifData: Omit<NotificationItem, 'id' | 'isRead'>) => {
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif-${Date.now()}`,
      isRead: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Đã gửi thông báo mới!`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Reset demo
  const resetAllDemoData = () => {
    setStudents(INITIAL_STUDENTS);
    setLessons(INITIAL_LESSONS);
    setSubmissions(INITIAL_SUBMISSIONS);
    setQuizzes(INITIAL_QUIZZES);
    setQuizAttempts([]);
    setSchedule(INITIAL_SCHEDULE);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActivities(INITIAL_ACTIVITIES);
    localStorage.clear();
    showToast('Đã khôi phục dữ liệu mẫu ban đầu!', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        activeTab,
        setActiveTab,
        currentRole,
        setCurrentRole,
        selectedClassFilter,
        setSelectedClassFilter,
        searchQuery,
        setSearchQuery,
        students,
        addStudent,
        updateStudent,
        deleteStudent,
        batchImportStudents,
        lessons,
        activeLessonId,
        setActiveLessonId,
        addLesson,
        updateLesson,
        deleteLesson,
        exercises,
        activeExerciseId,
        setActiveExerciseId,
        submissions,
        submitPractical,
        gradePractical,
        quizzes,
        activeQuizId,
        setActiveQuizId,
        quizAttempts,
        addQuiz,
        submitQuizAttempt,
        schedule,
        addScheduleEvent,
        deleteScheduleEvent,
        notifications,
        addNotification,
        markNotificationAsRead,
        deleteNotification,
        activities,
        toast,
        showToast,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
