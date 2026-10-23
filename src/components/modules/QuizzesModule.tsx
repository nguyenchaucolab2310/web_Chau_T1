import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Quiz, QuizQuestion, QuizAttempt } from '../../types';
import {
  CheckSquare,
  Clock,
  Plus,
  Play,
  Award,
  CheckCircle2,
  FileSpreadsheet,
  AlertTriangle,
  RotateCcw,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';

export const QuizzesModule: React.FC = () => {
  const {
    quizzes,
    addQuiz,
    quizAttempts,
    submitQuizAttempt,
    currentRole,
    showToast,
  } = useApp();

  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [takingQuiz, setTakingQuiz] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [resultModal, setResultModal] = useState<QuizAttempt | null>(null);

  // Teacher create quiz modal
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDuration, setNewDuration] = useState(15);
  const [newGrade, setNewGrade] = useState(12);
  const [newClasses, setNewClasses] = useState('12A1, 12A2, 12A3');

  // Countdown timer when taking quiz
  useEffect(() => {
    if (!takingQuiz || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [takingQuiz, timeLeft]);

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setTimeLeft(quiz.durationMinutes * 60);
    setUserAnswers({});
    setTakingQuiz(true);
  };

  const handleAutoSubmit = () => {
    if (!activeQuiz) return;
    submitAnswers(activeQuiz, userAnswers);
  };

  const submitAnswers = (quiz: Quiz, answers: Record<string, any>) => {
    let score = 0;
    let maxScore = quiz.totalPoints;

    quiz.questions.forEach((q) => {
      const ans = answers[q.id];
      if (ans === undefined) return;

      if (q.type === 'single' || q.type === 'true_false') {
        if (Array.isArray(q.correctAnswers) && q.correctAnswers.includes(Number(ans))) {
          score += q.points;
        }
      } else if (q.type === 'multiple') {
        if (Array.isArray(ans) && Array.isArray(q.correctAnswers)) {
          const correctArr = q.correctAnswers as number[];
          const isExact =
            ans.length === correctArr.length &&
            ans.every((val: any) => correctArr.includes(val));
          if (isExact) score += q.points;
        }
      } else if (q.type === 'short_answer') {
        if (
          typeof q.correctAnswers === 'string' &&
          String(ans).trim().toLowerCase() === q.correctAnswers.trim().toLowerCase()
        ) {
          score += q.points;
        }
      }
    });

    score = Number(score.toFixed(1));

    const attempt: Omit<QuizAttempt, 'id' | 'submittedAt'> = {
      quizId: quiz.id,
      quizTitle: quiz.title,
      studentId: 'HS1201',
      studentName: 'Nguyễn Văn An',
      class: '12A1',
      answers,
      score,
      maxScore,
      autoGraded: true,
    };

    submitQuizAttempt(attempt);
    setTakingQuiz(false);
    setResultModal({
      ...attempt,
      id: `att-${Date.now()}`,
      submittedAt: new Date().toLocaleString('vi-VN'),
    });

    if (score >= 8.0) {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    }
  };

  const exportAttemptsToExcel = () => {
    const data = quizAttempts.map((att, idx) => ({
      STT: idx + 1,
      'Mã Học Sinh': att.studentId,
      'Họ và Tên': att.studentName,
      'Lớp': att.class,
      'Tên bài kiểm tra': att.quizTitle,
      'Điểm đạt được': att.score,
      'Điểm tối đa': att.maxScore,
      'Thời gian nộp': att.submittedAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'KetQuaKiemTra');
    XLSX.writeFile(workbook, `Ket_Qua_Kiem_Tra_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Đã xuất kết quả kiểm tra sang file Excel thành công!');
  };

  const handleCreateQuizSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    addQuiz({
      title: newTitle,
      grade: newGrade,
      targetClasses: newClasses.split(',').map((c) => c.trim()),
      durationMinutes: newDuration,
      totalPoints: 10,
      status: 'active',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2025-05-15',
      questions: [
        {
          id: `q_${Date.now()}_1`,
          type: 'single',
          question: 'Ngôn ngữ nào định dạng phong cách giao diện của trang web?',
          options: ['HTML', 'CSS', 'Python', 'SQL'],
          correctAnswers: [1],
          points: 5,
          explanation: 'CSS (Cascading Style Sheets) dùng để định dạng giao diện.',
        },
        {
          id: `q_${Date.now()}_2`,
          type: 'true_false',
          question: 'Một trang HTML chuẩn chỉ có duy nhất một thẻ <body>.',
          options: ['Đúng', 'Sai'],
          correctAnswers: [0],
          points: 5,
          explanation: 'Đúng, mỗi tài liệu HTML5 chỉ chứa một phần thân <body>.',
        },
      ],
    });

    setNewTitle('');
    setShowCreateModal(false);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-[#073B7A]">
          <CheckSquare className="w-6 h-6 text-[#FA8C16]" />
          <div>
            <h2 className="text-xl font-bold font-serif leading-tight">
              Kiểm tra trực tuyến – Tin học THPT
            </h2>
            <p className="text-xs text-slate-500">
              Tổ chức thi, đồng hồ đếm ngược, tự động chấm điểm và xuất file Excel
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {currentRole === 'teacher' && (
            <>
              <button
                onClick={exportAttemptsToExcel}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>Xuất Excel</span>
              </button>
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Tạo đề thi mới</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Taking Quiz View */}
      {takingQuiz && activeQuiz ? (
        <div className="bg-white rounded-xl border-2 border-[#0969DA] p-6 shadow-md space-y-6">
          {/* Quiz Taking Top Bar with Timer */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <span className="text-xs font-bold text-[#0969DA]">
                Khối {activeQuiz.grade} · Lớp: {activeQuiz.targetClasses.join(', ')}
              </span>
              <h3 className="text-xl font-bold text-[#073B7A] font-serif">{activeQuiz.title}</h3>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-base font-bold font-mono shadow-xs ${
                  timeLeft < 180 ? 'bg-rose-100 text-rose-700 animate-pulse' : 'bg-blue-50 text-[#0969DA]'
                }`}
              >
                <Clock className="w-5 h-5" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
              <button
                onClick={() => submitAnswers(activeQuiz, userAnswers)}
                className="px-5 py-2 bg-[#0969DA] hover:bg-[#073B7A] text-white font-bold text-sm rounded-xl shadow-xs transition"
              >
                Nộp bài ngay
              </button>
            </div>
          </div>

          {/* Questions list */}
          <div className="space-y-6 font-serif">
            {activeQuiz.questions.map((q, qIndex) => (
              <div
                key={q.id}
                className="p-4.5 rounded-xl border border-[#DBE8F7] bg-[#F8FAFC]/50 space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-bold text-base text-[#12305B]">
                    Câu {qIndex + 1}: {q.question}
                  </h4>
                  <span className="text-xs font-semibold bg-blue-100 text-[#073B7A] px-2 py-0.5 rounded-full shrink-0">
                    {q.points} điểm
                  </span>
                </div>

                {/* Question Types rendering */}
                {(q.type === 'single' || q.type === 'true_false') && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIndex) => (
                      <label
                        key={optIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer text-sm ${
                          userAnswers[q.id] === optIndex
                            ? 'border-[#0969DA] bg-blue-50/70 font-semibold text-[#073B7A]'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`q_${q.id}`}
                          checked={userAnswers[q.id] === optIndex}
                          onChange={() => setUserAnswers({ ...userAnswers, [q.id]: optIndex })}
                          className="accent-[#0969DA] w-4 h-4"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                )}

                {q.type === 'multiple' && q.options && (
                  <div className="space-y-2 pt-1">
                    {q.options.map((opt, optIndex) => {
                      const cur = (userAnswers[q.id] as number[]) || [];
                      const isChecked = cur.includes(optIndex);
                      return (
                        <label
                          key={optIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border transition cursor-pointer text-sm ${
                            isChecked
                              ? 'border-[#0969DA] bg-blue-50/70 font-semibold text-[#073B7A]'
                              : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {
                              const next = isChecked
                                ? cur.filter((x) => x !== optIndex)
                                : [...cur, optIndex];
                              setUserAnswers({ ...userAnswers, [q.id]: next });
                            }}
                            className="accent-[#0969DA] w-4 h-4 rounded-xs"
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {q.type === 'short_answer' && (
                  <div className="pt-1">
                    <input
                      type="text"
                      value={userAnswers[q.id] || ''}
                      onChange={(e) =>
                        setUserAnswers({ ...userAnswers, [q.id]: e.target.value })
                      }
                      placeholder="Nhập câu trả lời ngắn của em..."
                      className="w-full px-3.5 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA] text-sm"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200">
            <button
              onClick={() => submitAnswers(activeQuiz, userAnswers)}
              className="px-6 py-2.5 bg-[#0969DA] hover:bg-[#073B7A] text-white font-bold rounded-xl shadow-md transition"
            >
              Hoàn thành & Nộp bài thi
            </button>
          </div>
        </div>
      ) : (
        /* Quizzes List & Attempts Table */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Available Quizzes (lg:col-span-7) */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-[#DBE8F7] p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-base sm:text-lg text-[#073B7A] font-serif">
              Danh sách đề kiểm tra Tin học
            </h3>

            <div className="space-y-3.5">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="p-4 rounded-xl border border-[#DBE8F7] hover:border-[#0969DA] bg-gradient-to-r from-white to-blue-50/20 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-[#0969DA]">Khối {quiz.grade}</span>
                      <span>·</span>
                      <span className="text-slate-500">Lớp: {quiz.targetClasses.join(', ')}</span>
                      <span>·</span>
                      <span className="text-emerald-700 bg-emerald-100 px-2 py-0.2 rounded-full font-semibold">
                        Đang mở
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-[#12305B] font-serif">
                      {quiz.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Thời gian: {quiz.durationMinutes} phút</span>
                      </span>
                      <span>·</span>
                      <span>{quiz.questions.length} câu hỏi ({quiz.totalPoints} đ)</span>
                    </div>
                  </div>

                  <button
                    onClick={() => startQuiz(quiz)}
                    className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FA8C16] hover:bg-[#e07b10] text-white font-bold text-xs rounded-xl shadow-xs transition shrink-0"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Làm bài thi</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Student Attempts (lg:col-span-5) */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#DBE8F7] p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-base sm:text-lg text-[#073B7A] font-serif">
              Lịch sử làm bài gần đây
            </h3>

            {quizAttempts.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-serif">
                Chưa có học sinh nào nộp bài kiểm tra. Hãy bấm &quot;Làm bài thi&quot; để thử nghiệm.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[450px] overflow-y-auto">
                {quizAttempts.map((att) => (
                  <div
                    key={att.id}
                    className="p-3 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between text-xs font-serif"
                  >
                    <div>
                      <div className="font-bold text-[#12305B]">{att.studentName} ({att.class})</div>
                      <div className="text-slate-500 text-[11px] truncate max-w-[200px]">
                        {att.quizTitle}
                      </div>
                      <div className="text-slate-400 text-[10px]">{att.submittedAt}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-[#0969DA]">{att.score}</span>
                      <span className="text-slate-400 text-[11px]"> / {att.maxScore} đ</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Result Modal after submission */}
      {resultModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center font-serif space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#073B7A]">Kết quả bài kiểm tra</h3>
              <p className="text-xs text-slate-500 mt-1">{resultModal.quizTitle}</p>
            </div>

            <div className="bg-[#F4F9FF] p-4 rounded-xl border border-[#DBE8F7] space-y-1">
              <div className="text-xs text-slate-600">Điểm số của em:</div>
              <div className="text-4xl font-extrabold text-[#0969DA] font-mono">
                {resultModal.score} <span className="text-base font-normal text-slate-500">/ {resultModal.maxScore}</span>
              </div>
              <div className="text-xs font-semibold text-emerald-700 pt-1">
                {resultModal.score >= 8
                  ? 'Xuất sắc! Em nắm rất vững kiến thức!'
                  : resultModal.score >= 6.5
                  ? 'Khá tốt! Hãy tiếp tục phát huy nhé!'
                  : 'Em hãy ôn tập kỹ hơn các bài học số nhé!'}
              </div>
            </div>

            <div className="text-xs text-slate-500">
              Kết quả đã được tự động lưu vào học bạ điện tử của em và cập nhật lên biểu đồ thống kê của lớp!
            </div>

            <button
              onClick={() => setResultModal(null)}
              className="w-full py-2.5 bg-[#0969DA] hover:bg-[#073B7A] text-white font-bold rounded-xl shadow-xs transition"
            >
              Đóng và xem tổng kết
            </button>
          </div>
        </div>
      )}

      {/* Teacher Create Quiz Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-[#073B7A] font-serif mb-4">
              Tạo đề kiểm tra trực tuyến mới
            </h3>
            <form onSubmit={handleCreateQuizSubmit} className="space-y-3.5 text-sm font-serif">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tên bài kiểm tra</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Kiểm tra 15 phút - Cú pháp Python cơ bản"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={newGrade}
                    onChange={(e) => setNewGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thời gian (phút)</label>
                  <input
                    type="number"
                    min="5"
                    max="90"
                    value={newDuration}
                    onChange={(e) => setNewDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp áp dụng (cách nhau bởi dấu phẩy)</label>
                <input
                  type="text"
                  value={newClasses}
                  onChange={(e) => setNewClasses(e.target.value)}
                  placeholder="12A1, 12A2, 12A3"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0969DA] hover:bg-[#073B7A] text-white rounded-lg text-xs font-semibold"
                >
                  Khởi tạo đề thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
