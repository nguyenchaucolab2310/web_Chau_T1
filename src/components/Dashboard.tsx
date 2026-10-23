import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  BookOpen,
  Code2,
  CheckSquare,
  Users,
  BarChart3,
  Bot,
  ArrowRight,
  ChevronRight,
  LayoutGrid,
  Sparkles,
  Database,
  Cpu,
  MonitorCheck
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const {
    students,
    setActiveTab,
    setActiveLessonId,
    selectedClassFilter,
    setSelectedClassFilter,
  } = useApp();

  const [dashboardClassFilter, setDashboardClassFilter] = useState<'Tất cả' | '12A1' | '12A2' | '12A3'>('Tất cả');

  // Filter students for the dashboard table
  const displayedStudents = useMemo(() => {
    let list = students;
    if (dashboardClassFilter !== 'Tất cả') {
      list = list.filter((s) => s.class === dashboardClassFilter);
    }
    // Take first 5 to match screenshot exactly
    return list.slice(0, 5);
  }, [students, dashboardClassFilter]);

  // Compute live averages for classes 12A1, 12A2, 12A3 to feed the dynamic bar chart
  const classStats = useMemo(() => {
    const targetClasses = ['12A1', '12A2', '12A3'];
    return targetClasses.map((clsName) => {
      const clsStudents = students.filter((s) => s.class === clsName);
      if (clsStudents.length === 0) {
        return { name: clsName, avgExam: 0, avgPractical: 0, count: 0 };
      }
      const sumExam = clsStudents.reduce((acc, curr) => acc + curr.examScore, 0);
      const sumPrac = clsStudents.reduce((acc, curr) => acc + curr.practicalScore, 0);
      return {
        name: clsName,
        avgExam: Number((sumExam / clsStudents.length).toFixed(1)),
        avgPractical: Number((sumPrac / clsStudents.length).toFixed(1)),
        count: clsStudents.length,
      };
    });
  }, [students]);

  return (
    <div className="space-y-5">
      {/* 1. BANNER CHÀO MỪNG (Matching Reference Screenshot) */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#CDE4FD] via-[#DFEFFE] to-[#BEE0FF] border border-[#BFDBFE] p-6 sm:p-7 shadow-xs">
        {/* Decorative background vectors */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 pointer-events-none overflow-hidden">
          <svg className="w-full h-full object-cover" viewBox="0 0 400 200" fill="none">
            <circle cx="350" cy="80" r="120" stroke="#0969DA" strokeWidth="1.5" strokeDasharray="6 6" />
            <circle cx="280" cy="140" r="90" stroke="#00B8D9" strokeWidth="1" />
            <path d="M200,20 L380,180" stroke="#0969DA" strokeWidth="0.75" />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Left Text */}
          <div className="text-center lg:text-left space-y-1.5 max-w-2xl">
            <p className="text-[#0969DA] font-serif italic text-base sm:text-lg tracking-wide">
              Chào mừng đến với
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-[34px] font-bold text-[#073B7A] tracking-tight font-serif drop-shadow-xs">
              TIN HỌC SỐ – BÌNH THUẬN
            </h2>
            <p className="text-sm sm:text-base font-serif italic text-[#0969DA] pt-0.5">
              Cùng học – Cùng thực hành – Cùng khám phá thế giới số
            </p>
          </div>

          {/* Right Slogan Box */}
          <div className="shrink-0 bg-white/70 backdrop-blur-xs rounded-xl p-3.5 sm:p-4 border border-white/80 shadow-xs text-right hidden sm:block">
            <p className="text-xs sm:text-sm font-serif italic text-[#073B7A] leading-relaxed">
              <span className="block font-semibold">Kiến thức hôm nay</span>
              <span className="block font-semibold text-[#0969DA]">Công nghệ ngày mai</span>
              <span className="block text-slate-700">Tương lai trong tầm tay</span>
            </p>
          </div>
        </div>
      </div>

      {/* 2. BẢNG ĐIỀU KHIỂN GIÁO VIÊN (6 Colored Cards) */}
      <div className="space-y-2.5">
        <div className="flex items-center gap-2 text-[#073B7A] px-1">
          <LayoutGrid className="w-5 h-5 text-[#0969DA]" />
          <h3 className="font-bold text-lg sm:text-xl font-serif">Bảng điều khiển giáo viên</h3>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* Card 1: Bài học số */}
          <div
            onClick={() => setActiveTab('lessons')}
            className="group relative bg-[#0969DA] hover:bg-[#0756b5] text-white rounded-xl p-3.5 sm:p-4 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] overflow-hidden"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-[15px] font-serif leading-tight">Bài học số</h4>
              <p className="text-[11px] text-blue-100 leading-snug line-clamp-2">
                Quản lý bài giảng, tài liệu học tập
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#0969DA] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 2: Thực hành HTML/CSS */}
          <div
            onClick={() => setActiveTab('practical')}
            className="group relative bg-[#00B8D9] hover:bg-[#009cb8] text-white rounded-xl p-3.5 sm:p-4 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] overflow-hidden"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Code2 className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-[15px] font-serif leading-tight">Thực hành HTML/CSS</h4>
              <p className="text-[11px] text-teal-100 leading-snug line-clamp-2">
                Bài tập thực hành, dự án học sinh
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#00B8D9] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 3: Kiểm tra trực tuyến */}
          <div
            onClick={() => setActiveTab('quizzes')}
            className="group relative bg-[#FA8C16] hover:bg-[#e07b10] text-white rounded-xl p-3.5 sm:p-4 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] overflow-hidden"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <CheckSquare className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-[15px] font-serif leading-tight">Kiểm tra trực tuyến</h4>
              <p className="text-[11px] text-amber-100 leading-snug line-clamp-2">
                Tạo đề, tổ chức kiểm tra, chấm điểm
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#FA8C16] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 4: Quản lý học sinh */}
          <div
            onClick={() => setActiveTab('students')}
            className="group relative bg-[#722ED1] hover:bg-[#6023b5] text-white rounded-xl p-3.5 sm:p-4 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] overflow-hidden"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-[15px] font-serif leading-tight">Quản lý học sinh</h4>
              <p className="text-[11px] text-purple-100 leading-snug line-clamp-2">
                Danh sách, thông tin và theo dõi học tập
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#722ED1] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 5: Thống kê kết quả */}
          <div
            onClick={() => setActiveTab('results')}
            className="group relative bg-[#1890FF] hover:bg-[#107bd6] text-white rounded-xl p-3.5 sm:p-4 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] overflow-hidden"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-[15px] font-serif leading-tight">Thống kê kết quả</h4>
              <p className="text-[11px] text-blue-100 leading-snug line-clamp-2">
                Báo cáo, biểu đồ học tập
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#1890FF] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          {/* Card 6: Trợ lý AI */}
          <div
            onClick={() => setActiveTab('ai-assistant')}
            className="group relative bg-[#EB2F96] hover:bg-[#c9207e] text-white rounded-xl p-3.5 sm:p-4 shadow-sm transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[125px] overflow-hidden"
          >
            <div className="space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <h4 className="font-bold text-sm sm:text-[15px] font-serif leading-tight">Trợ lý AI</h4>
              <p className="text-[11px] text-pink-100 leading-snug line-clamp-2">
                Hỗ trợ giảng dạy, tạo bài tập, giải đáp
              </p>
            </div>
            <div className="flex justify-end pt-2">
              <span className="w-6 h-6 rounded-full bg-white/20 group-hover:bg-white text-white group-hover:text-[#EB2F96] flex items-center justify-center transition-colors">
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MIDDLE SECTION: 2 COLUMNS (Table & Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Danh sách học sinh (mẫu) - lg:col-span-7 */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#DBE8F7] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#EEF5FC] gap-2">
              <div className="flex items-center gap-2 text-[#073B7A]">
                <Users className="w-5 h-5 text-[#0969DA]" />
                <h3 className="font-bold text-base sm:text-[17px] font-serif">
                  Danh sách học sinh (mẫu)
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={dashboardClassFilter}
                  onChange={(e) => setDashboardClassFilter(e.target.value as any)}
                  className="text-xs border border-slate-300 rounded-md px-2 py-1 text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#0969DA]"
                >
                  <option value="Tất cả">Tất cả lớp</option>
                  <option value="12A1">Lớp 12A1</option>
                  <option value="12A2">Lớp 12A2</option>
                  <option value="12A3">Lớp 12A3</option>
                </select>
                <button
                  onClick={() => setActiveTab('students')}
                  className="text-[#0969DA] text-xs font-semibold hover:underline flex items-center gap-0.5"
                >
                  <span>Xem tất cả học sinh</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Table matching reference */}
            <div className="overflow-x-auto mt-3">
              <table className="w-full text-left text-xs sm:text-sm font-serif">
                <thead>
                  <tr className="bg-[#F4F9FF] text-[#073B7A] border-b border-[#DBE8F7]">
                    <th className="py-2.5 px-3 font-bold text-center w-12">STT</th>
                    <th className="py-2.5 px-3 font-bold">Họ tên</th>
                    <th className="py-2.5 px-3 font-bold text-center">Lớp</th>
                    <th className="py-2.5 px-3 font-bold text-center">Điểm kiểm tra</th>
                    <th className="py-2.5 px-3 font-bold text-center">Điểm thực hành</th>
                    <th className="py-2.5 px-3 font-bold text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EEF5FC]">
                  {displayedStudents.map((st, idx) => {
                    const ratingBadge =
                      st.rating === 'Giỏi'
                        ? 'bg-emerald-100 text-emerald-800'
                        : st.rating === 'Khá'
                        ? 'bg-sky-100 text-sky-800'
                        : st.rating === 'Trung bình'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800';

                    return (
                      <tr key={st.id} className="hover:bg-blue-50/40 transition">
                        <td className="py-2.5 px-3 text-center text-slate-500 tabular-nums">
                          {idx + 1}
                        </td>
                        <td className="py-2.5 px-3 font-medium text-[#12305B]">
                          {st.name}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-600 font-semibold">
                          {st.class}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-800 font-bold tabular-nums">
                          {st.examScore.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-center text-slate-800 font-bold tabular-nums">
                          {st.practicalScore.toFixed(1)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`inline-block px-3 py-0.5 rounded-full text-xs font-semibold ${ratingBadge}`}
                          >
                            {st.rating || 'Khá'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Thống kê điểm học tập theo lớp (Bar Chart) - lg:col-span-5 */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#DBE8F7] p-4 sm:p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#EEF5FC]">
              <div className="flex items-center gap-2 text-[#073B7A]">
                <BarChart3 className="w-5 h-5 text-[#0969DA]" />
                <h3 className="font-bold text-base sm:text-[17px] font-serif">
                  Thống kê điểm học tập theo lớp
                </h3>
              </div>
            </div>

            {/* Legend matching screenshot */}
            <div className="flex items-center justify-center gap-6 mt-3 text-xs font-medium text-slate-700">
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-[#0969DA] rounded-xs" />
                <span>Điểm kiểm tra</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 bg-[#00B8D9] rounded-xs" />
                <span>Điểm thực hành</span>
              </div>
            </div>

            {/* Interactive SVG Bar Chart (0 - 10 scale) */}
            <div className="mt-4 relative h-48 w-full flex">
              {/* Y-axis label */}
              <div className="w-6 flex items-center justify-center">
                <span className="text-[11px] text-slate-500 -rotate-90 whitespace-nowrap">
                  Điểm trung bình
                </span>
              </div>

              {/* Y-axis markers */}
              <div className="flex flex-col justify-between text-[11px] text-slate-400 font-mono pr-2 py-1 select-none">
                <span>10</span>
                <span>8</span>
                <span>6</span>
                <span>4</span>
                <span>2</span>
                <span>0</span>
              </div>

              {/* Bars container */}
              <div className="flex-1 relative border-l border-b border-slate-300 grid grid-cols-3 items-end pt-3 pb-0 px-2 gap-3">
                {/* Horizontal guide lines */}
                <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-1">
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-slate-100 w-full" />
                  <div className="border-b border-transparent w-full" />
                </div>

                {/* 3 Classes: 12A1, 12A2, 12A3 */}
                {classStats.map((item) => {
                  const examHeightPct = Math.min(100, Math.max(0, (item.avgExam / 10) * 100));
                  const pracHeightPct = Math.min(100, Math.max(0, (item.avgPractical / 10) * 100));

                  return (
                    <div key={item.name} className="flex flex-col items-center h-full justify-end z-10">
                      <div className="flex items-end justify-center gap-1.5 w-full h-[150px]">
                        {/* Exam Bar (Blue) */}
                        <div className="flex flex-col items-center flex-1 max-w-[28px] h-full justify-end">
                          <span className="text-[10px] font-bold text-slate-700 mb-0.5 tabular-nums">
                            {item.avgExam.toFixed(1)}
                          </span>
                          <div
                            style={{ height: `${examHeightPct}%` }}
                            className="w-full bg-[#0969DA] rounded-t-xs hover:opacity-90 transition-all duration-300"
                            title={`Điểm kiểm tra ${item.name}: ${item.avgExam}`}
                          />
                        </div>

                        {/* Practical Bar (Cyan) */}
                        <div className="flex flex-col items-center flex-1 max-w-[28px] h-full justify-end">
                          <span className="text-[10px] font-bold text-slate-700 mb-0.5 tabular-nums">
                            {item.avgPractical.toFixed(1)}
                          </span>
                          <div
                            style={{ height: `${pracHeightPct}%` }}
                            className="w-full bg-[#00B8D9] rounded-t-xs hover:opacity-90 transition-all duration-300"
                            title={`Điểm thực hành ${item.name}: ${item.avgPractical}`}
                          />
                        </div>
                      </div>

                      {/* Class Label */}
                      <span className="mt-2 text-xs font-bold text-[#073B7A]">{item.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. BOTTOM SECTION: BÀI HỌC NỔI BẬT (4 Cards) */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF5FC]">
          <div className="flex items-center gap-2 text-[#073B7A]">
            <span className="text-amber-500 text-lg">★</span>
            <h3 className="font-bold text-base sm:text-[17px] font-serif">Bài học nổi bật</h3>
          </div>
          <button
            onClick={() => setActiveTab('lessons')}
            className="text-[#0969DA] text-xs font-semibold hover:underline flex items-center gap-0.5"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {/* Featured Card 1: Python */}
          <div className="rounded-xl border border-[#DBE8F7] p-3.5 flex flex-col justify-between hover:shadow-md transition bg-gradient-to-b from-white to-blue-50/20">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#0F284E] flex items-center justify-center shrink-0 shadow-inner">
                {/* Python icon */}
                <span className="text-xl font-bold text-yellow-400">🐍</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#073B7A] font-serif leading-tight">
                  Bài 5. Lập trình Python cơ bản
                </h4>
                <p className="text-xs text-slate-500 mt-1">Video bài giảng, slide, bài tập</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveLessonId('lesson-python-basic');
                setActiveTab('lessons');
              }}
              className="mt-3.5 w-full py-1.5 px-3 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-semibold rounded-lg transition text-center shadow-xs"
            >
              Xem bài học
            </button>
          </div>

          {/* Featured Card 2: HTML/CSS */}
          <div className="rounded-xl border border-[#DBE8F7] p-3.5 flex flex-col justify-between hover:shadow-md transition bg-gradient-to-b from-white to-orange-50/20">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-600 to-sky-600 flex items-center justify-center shrink-0 shadow-inner text-white font-black text-xs">
                <span>&lt;5/3&gt;</span>
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#073B7A] font-serif leading-tight">
                  Bài 3. Thiết kế web với HTML/CSS
                </h4>
                <p className="text-xs text-slate-500 mt-1">Tài liệu, ví dụ minh họa, bài tập</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveLessonId('lesson-html-css-intro');
                setActiveTab('lessons');
              }}
              className="mt-3.5 w-full py-1.5 px-3 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-semibold rounded-lg transition text-center shadow-xs"
            >
              Xem bài học
            </button>
          </div>

          {/* Featured Card 3: Database & SQL */}
          <div className="rounded-xl border border-[#DBE8F7] p-3.5 flex flex-col justify-between hover:shadow-md transition bg-gradient-to-b from-white to-blue-50/20">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#073B7A] flex items-center justify-center shrink-0 shadow-inner text-white">
                <Database className="w-6 h-6 text-[#00B8D9]" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#073B7A] font-serif leading-tight">
                  Bài 7. Cơ sở dữ liệu và SQL
                </h4>
                <p className="text-xs text-slate-500 mt-1">Lý thuyết, thực hành, bài tập</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveLessonId('lesson-sql-db');
                setActiveTab('lessons');
              }}
              className="mt-3.5 w-full py-1.5 px-3 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-semibold rounded-lg transition text-center shadow-xs"
            >
              Xem bài học
            </button>
          </div>

          {/* Featured Card 4: AI in Informatics */}
          <div className="rounded-xl border border-[#DBE8F7] p-3.5 flex flex-col justify-between hover:shadow-md transition bg-gradient-to-b from-white to-purple-50/20">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-tr from-[#0F284E] to-[#722ED1] flex items-center justify-center shrink-0 shadow-inner text-white">
                <Cpu className="w-6 h-6 text-pink-300" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-sm text-[#073B7A] font-serif leading-tight">
                  Bài 8. Trí tuệ nhân tạo trong Tin học
                </h4>
                <p className="text-xs text-slate-500 mt-1">Tài liệu mở rộng, thảo luận</p>
              </div>
            </div>
            <button
              onClick={() => {
                setActiveLessonId('lesson-ai-intro');
                setActiveTab('lessons');
              }}
              className="mt-3.5 w-full py-1.5 px-3 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-semibold rounded-lg transition text-center shadow-xs"
            >
              Xem bài học
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
