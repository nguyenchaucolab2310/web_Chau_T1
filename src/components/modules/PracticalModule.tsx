import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { PracticalExercise, PracticalSubmission } from '../../types';
import {
  Code2,
  Play,
  RotateCcw,
  Save,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
  Award,
  ChevronDown,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const PracticalModule: React.FC = () => {
  const {
    exercises,
    activeExerciseId,
    setActiveExerciseId,
    submissions,
    submitPractical,
    gradePractical,
    currentRole,
    students,
    showToast,
  } = useApp();

  const currentExercise =
    exercises.find((ex) => ex.id === activeExerciseId) || exercises[0];

  // Editor states
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css'>('html');
  const [htmlCode, setHtmlCode] = useState(currentExercise.starterHtml);
  const [cssCode, setCssCode] = useState(currentExercise.starterCss);
  const [showRequirements, setShowRequirements] = useState(true);
  const [testResults, setTestResults] = useState<{ description: string; passed: boolean }[]>([]);
  const [autoCheckDone, setAutoCheckDone] = useState(false);

  // Teacher grading states
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<string>('9.0');
  const [commentInput, setCommentInput] = useState<string>('Bài làm rất tốt, đúng chuẩn!');

  // Sync editor when exercise changes
  useEffect(() => {
    if (currentExercise) {
      setHtmlCode(currentExercise.starterHtml);
      setCssCode(currentExercise.starterCss);
      setTestResults([]);
      setAutoCheckDone(false);
    }
  }, [currentExercise?.id]);

  // Combine HTML and CSS into iframe document
  const previewDoc = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html lang="vi">
        <head>
          <meta charset="utf-8" />
          <style>
            ${cssCode}
          </style>
        </head>
        <body>
          ${htmlCode}
        </body>
      </html>
    `;
  }, [htmlCode, cssCode]);

  // Check if current user has already submitted this exercise
  const mySubmission = submissions.find(
    (s) => s.exerciseId === currentExercise.id && s.studentId === 'HS1201'
  );

  // Automated test runner
  const runAutoTests = () => {
    const results = currentExercise.tests.map((t) => {
      let passed = false;
      try {
        // Safe evaluation on source strings
        const html = htmlCode.toLowerCase();
        const css = cssCode.toLowerCase();
        // eslint-disable-next-line no-eval
        passed = eval(t.checkFnCode);
      } catch (e) {
        passed = false;
      }
      return { description: t.description, passed };
    });

    setTestResults(results);
    setAutoCheckDone(true);

    const allPassed = results.every((r) => r.passed);
    if (allPassed) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      showToast('Tuyệt vời! Mã nguồn của em đạt 100% các tiêu chí kiểm tra!', 'success');
    } else {
      showToast('Có tiêu chí chưa đạt, em hãy kiểm tra lại theo danh sách nhé!', 'info');
    }
  };

  const handleReset = () => {
    setHtmlCode(currentExercise.starterHtml);
    setCssCode(currentExercise.starterCss);
    setTestResults([]);
    setAutoCheckDone(false);
    showToast('Đã khôi phục mã khởi tạo ban đầu.');
  };

  const handleSave = () => {
    localStorage.setItem(`draft_html_${currentExercise.id}`, htmlCode);
    localStorage.setItem(`draft_css_${currentExercise.id}`, cssCode);
    showToast('Đã lưu bài làm vào bộ nhớ trình duyệt!');
  };

  const handleSubmit = () => {
    submitPractical({
      studentId: 'HS1201',
      studentName: 'Nguyễn Văn An',
      class: '12A1',
      exerciseId: currentExercise.id,
      exerciseTitle: currentExercise.title,
      htmlCode,
      cssCode,
      status: 'Đã nộp',
    });
  };

  const handleTeacherGrade = (subId: string) => {
    const scoreNum = parseFloat(gradeInput);
    if (isNaN(scoreNum) || scoreNum < 0 || scoreNum > 10) {
      showToast('Điểm số phải từ 0 đến 10', 'error');
      return;
    }
    gradePractical(subId, scoreNum, commentInput);
    setSelectedSubmissionId(null);
  };

  return (
    <div className="space-y-4">
      {/* Exercise Selector Bar */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-[#073B7A]">
          <Code2 className="w-6 h-6 text-[#00B8D9]" />
          <div>
            <h2 className="text-xl font-bold font-serif leading-tight">
              Thực hành tương tác HTML/CSS
            </h2>
            <p className="text-xs text-slate-500">
              Trình soạn thảo trực tiếp, kiểm thử tự động và cửa sổ xem trước
            </p>
          </div>
        </div>

        {/* Exercises dropdown */}
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-slate-600 whitespace-nowrap">
            Chọn bài tập:
          </label>
          <select
            value={currentExercise.id}
            onChange={(e) => setActiveExerciseId(e.target.value)}
            className="text-xs sm:text-sm border border-slate-300 rounded-lg px-3 py-1.5 bg-white text-[#12305B] font-serif focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
          >
            {exercises.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title} ({ex.difficulty})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Dual Pane Layout (Left: Editor, Right: Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Pane: Code Editor (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#DBE8F7] shadow-xs flex flex-col overflow-hidden">
          {/* Top Bar with Tab Buttons & Actions */}
          <div className="bg-[#073B7A] text-white p-2.5 px-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#0D4E9B]">
            {/* HTML / CSS tabs */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setActiveCodeTab('html')}
                className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition cursor-pointer ${
                  activeCodeTab === 'html'
                    ? 'bg-[#0969DA] text-white shadow-xs'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                index.html
              </button>
              <button
                onClick={() => setActiveCodeTab('css')}
                className={`px-3 py-1 rounded-md text-xs font-bold font-mono transition cursor-pointer ${
                  activeCodeTab === 'css'
                    ? 'bg-[#00B8D9] text-[#073B7A] shadow-xs'
                    : 'text-blue-200 hover:text-white hover:bg-white/10'
                }`}
              >
                style.css
              </button>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={runAutoTests}
                className="flex items-center gap-1 px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-md text-xs font-semibold transition cursor-pointer shadow-xs"
                title="Kiểm tra tiêu chí tự động"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Tự chấm</span>
              </button>
              <button
                onClick={handleReset}
                className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition"
                title="Khôi phục mã ban đầu"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleSave}
                className="p-1 text-blue-200 hover:text-white hover:bg-white/10 rounded-md transition"
                title="Lưu bản nháp"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Textarea Editor with line counter feel */}
          <div className="relative flex-1 min-h-[360px] bg-[#1E293B]">
            {activeCodeTab === 'html' ? (
              <textarea
                value={htmlCode}
                onChange={(e) => setHtmlCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[360px] p-4 font-mono text-xs sm:text-sm text-emerald-400 bg-transparent resize-y focus:outline-none focus:ring-1 focus:ring-[#00B8D9] leading-relaxed selection:bg-blue-600"
                placeholder="Nhập mã HTML vào đây..."
              />
            ) : (
              <textarea
                value={cssCode}
                onChange={(e) => setCssCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full min-h-[360px] p-4 font-mono text-xs sm:text-sm text-sky-300 bg-transparent resize-y focus:outline-none focus:ring-1 focus:ring-[#00B8D9] leading-relaxed selection:bg-blue-600"
                placeholder="Nhập mã CSS vào đây..."
              />
            )}
          </div>

          {/* Bottom Toolbar: Submit & Status */}
          <div className="bg-slate-50 p-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              {mySubmission ? (
                <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    Trạng thái: {mySubmission.status} ({mySubmission.score ? `${mySubmission.score} đ` : 'Chờ chấm'})
                  </span>
                </span>
              ) : (
                <span className="text-slate-500 font-medium">
                  Chưa nộp bài tập này
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRequirements(!showRequirements)}
                className="px-3 py-1.5 text-xs text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition"
              >
                {showRequirements ? 'Ẩn yêu cầu' : 'Xem yêu cầu'}
              </button>
              <button
                onClick={handleSubmit}
                className="flex items-center gap-1.5 px-4 py-1.5 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-bold rounded-lg shadow-xs transition"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Nộp bài cho cô</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Pane: Live Iframe Preview (lg:col-span-6) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#DBE8F7] shadow-xs flex flex-col overflow-hidden">
          {/* Top Bar for Preview */}
          <div className="bg-slate-100 p-2.5 px-4 flex items-center justify-between border-b border-slate-200">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <span className="text-xs font-semibold text-slate-700 ml-2">
                Cửa sổ xem trước kết quả trực tiếp
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Iframe sandbox</span>
          </div>

          {/* Sandboxed iframe */}
          <div className="flex-1 min-h-[360px] bg-white">
            <iframe
              srcDoc={previewDoc}
              title="Preview sandbox"
              sandbox="allow-scripts"
              className="w-full h-full min-h-[360px] border-0"
            />
          </div>

          {/* Requirements & Auto-Test Results Drawer */}
          {showRequirements && (
            <div className="bg-slate-50/90 border-t border-slate-200 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-[#073B7A] font-serif text-sm">
                  Yêu cầu bài tập: {currentExercise.title}
                </h4>
                <span className="text-[11px] text-slate-500">
                  Độ khó: {currentExercise.difficulty}
                </span>
              </div>
              <p className="text-slate-600 leading-relaxed font-serif">
                {currentExercise.description}
              </p>

              {/* Requirements Checklist */}
              <div className="pt-2">
                <div className="font-semibold text-slate-700 mb-1">Tiêu chí cần đạt:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {currentExercise.requirements.map((req, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-slate-600">
                      <span className="text-[#0969DA] font-bold">•</span>
                      <span>{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auto Test Results (if run) */}
              {autoCheckDone && (
                <div className="pt-2 border-t border-slate-200 mt-2">
                  <div className="font-semibold text-slate-800 mb-1">
                    Kết quả kiểm tra tự động:
                  </div>
                  <div className="space-y-1">
                    {testResults.map((tr, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-1.5 ${
                          tr.passed ? 'text-emerald-700 font-medium' : 'text-rose-600'
                        }`}
                      >
                        <span>{tr.passed ? '✓' : '✗'}</span>
                        <span>{tr.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Teacher View: Student Submissions Review Panel */}
      {currentRole === 'teacher' && (
        <div className="bg-white rounded-xl border border-[#DBE8F7] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF5FC]">
            <div className="flex items-center gap-2 text-[#073B7A]">
              <Award className="w-5 h-5 text-[#0969DA]" />
              <h3 className="font-bold text-base font-serif">
                Danh sách bài nộp của học sinh (Giáo viên duyệt & chấm điểm)
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Tổng số bài nộp: {submissions.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm font-serif">
              <thead>
                <tr className="bg-[#F4F9FF] text-[#073B7A] border-b border-[#DBE8F7]">
                  <th className="py-2.5 px-3 font-bold">Mã HS</th>
                  <th className="py-2.5 px-3 font-bold">Họ và tên</th>
                  <th className="py-2.5 px-3 font-bold text-center">Lớp</th>
                  <th className="py-2.5 px-3 font-bold">Tên bài thực hành</th>
                  <th className="py-2.5 px-3 font-bold text-center">Thời gian nộp</th>
                  <th className="py-2.5 px-3 font-bold text-center">Điểm số</th>
                  <th className="py-2.5 px-3 font-bold text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF5FC]">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-blue-50/40 transition">
                    <td className="py-2.5 px-3 font-mono text-slate-600">{sub.studentId}</td>
                    <td className="py-2.5 px-3 font-medium text-[#12305B]">{sub.studentName}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-slate-700">{sub.class}</td>
                    <td className="py-2.5 px-3 text-slate-700">{sub.exerciseTitle}</td>
                    <td className="py-2.5 px-3 text-center text-slate-500 text-xs">{sub.submittedAt}</td>
                    <td className="py-2.5 px-3 text-center font-bold text-[#0969DA]">
                      {sub.score !== undefined ? `${sub.score} đ` : <span className="text-amber-500 text-xs">Chưa chấm</span>}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <button
                        onClick={() => {
                          setSelectedSubmissionId(sub.id);
                          setGradeInput(sub.score ? String(sub.score) : '9.0');
                          setCommentInput(sub.teacherComment || 'Làm tốt, đúng yêu cầu bài tập.');
                        }}
                        className="px-2.5 py-1 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-semibold rounded-md transition"
                      >
                        Chấm điểm
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Grade submission modal */}
          {selectedSubmissionId && (
            <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
                <h4 className="text-lg font-bold text-[#073B7A] font-serif mb-3">
                  Nhận xét & Chấm điểm bài thực hành
                </h4>
                <div className="space-y-3 text-sm font-serif">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Điểm số (thang điểm 10):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0"
                      max="10"
                      value={gradeInput}
                      onChange={(e) => setGradeInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nhận xét của Giáo viên:
                    </label>
                    <textarea
                      rows={3}
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setSelectedSubmissionId(null)}
                      className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTeacherGrade(selectedSubmissionId)}
                      className="px-4 py-2 bg-[#0969DA] hover:bg-[#073B7A] text-white rounded-lg text-xs font-semibold"
                    >
                      Lưu điểm vào học bạ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
