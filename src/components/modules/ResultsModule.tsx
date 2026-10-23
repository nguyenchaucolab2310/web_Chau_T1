import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  BarChart3,
  Download,
  Printer,
  FileSpreadsheet,
  Award,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Filter,
  Users
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const ResultsModule: React.FC = () => {
  const { students, showToast } = useApp();

  const [filterClass, setFilterClass] = useState<string>('Tất cả');
  const [filterSemester, setFilterSemester] = useState<string>('Học kỳ II');
  const [filterYear, setFilterYear] = useState<string>('2024-2025');

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchClass = filterClass === 'Tất cả' || s.class === filterClass;
      return matchClass;
    });
  }, [students, filterClass]);

  // Key KPI metrics
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    if (total === 0) {
      return {
        total: 0,
        avgExam: 0,
        avgPrac: 0,
        avgOverall: 0,
        excellentCount: 0,
        goodCount: 0,
        averageCount: 0,
        weakCount: 0,
        passRate: 0,
      };
    }

    const sumExam = filteredStudents.reduce((acc, s) => acc + s.examScore, 0);
    const sumPrac = filteredStudents.reduce((acc, s) => acc + s.practicalScore, 0);
    const avgExam = Number((sumExam / total).toFixed(1));
    const avgPrac = Number((sumPrac / total).toFixed(1));
    const avgOverall = Number(((avgExam + avgPrac) / 2).toFixed(1));

    const excellentCount = filteredStudents.filter((s) => s.rating === 'Giỏi').length;
    const goodCount = filteredStudents.filter((s) => s.rating === 'Khá').length;
    const averageCount = filteredStudents.filter((s) => s.rating === 'Trung bình').length;
    const weakCount = filteredStudents.filter((s) => s.rating === 'Yếu').length;

    const passCount = filteredStudents.filter(
      (s) => (s.examScore + s.practicalScore) / 2 >= 5.0
    ).length;
    const passRate = Number(((passCount / total) * 100).toFixed(1));

    return {
      total,
      avgExam,
      avgPrac,
      avgOverall,
      excellentCount,
      goodCount,
      averageCount,
      weakCount,
      passRate,
    };
  }, [filteredStudents]);

  // Class comparison dataset
  const classComparison = useMemo(() => {
    const classes = ['12A1', '12A2', '12A3'];
    return classes.map((c) => {
      const list = students.filter((s) => s.class === c);
      if (list.length === 0) return { name: c, avgExam: 0, avgPrac: 0 };
      const sExam = list.reduce((acc, s) => acc + s.examScore, 0);
      const sPrac = list.reduce((acc, s) => acc + s.practicalScore, 0);
      return {
        name: c,
        avgExam: Number((sExam / list.length).toFixed(1)),
        avgPrac: Number((sPrac / list.length).toFixed(1)),
      };
    });
  }, [students]);

  // At-risk students (Điểm TB < 6.5 hoặc yếu)
  const atRiskStudents = useMemo(() => {
    return filteredStudents.filter(
      (s) => (s.examScore + s.practicalScore) / 2 < 6.5 || s.rating === 'Trung bình' || s.rating === 'Yếu'
    );
  }, [filteredStudents]);

  const handleExportExcel = () => {
    const data = filteredStudents.map((s, idx) => ({
      STT: idx + 1,
      'Mã HS': s.id,
      'Họ và tên': s.name,
      'Lớp': s.class,
      'Điểm kiểm tra': s.examScore,
      'Điểm thực hành': s.practicalScore,
      'Điểm TB môn': Number(((s.examScore + s.practicalScore) / 2).toFixed(1)),
      'Xếp loại': s.rating,
      'Học kỳ': filterSemester,
      'Năm học': filterYear,
      'Nhận xét': s.teacherNotes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'ThongKeDiem');
    XLSX.writeFile(workbook, `Bao_Cao_Thong_Ke_Diem_${filterClass}_${filterSemester}.xlsx`);
    showToast('Đã xuất báo cáo thống kê kết quả sang Excel!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Top Header & Export Buttons */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-[#073B7A]">
          <BarChart3 className="w-6 h-6 text-[#1890FF]" />
          <div>
            <h2 className="text-xl font-bold font-serif leading-tight">
              Thống kê kết quả học tập – Tin học THPT
            </h2>
            <p className="text-xs text-slate-500">
              Đánh giá quá trình, so sánh theo lớp và lập danh sách học sinh cần bồi dưỡng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In báo cáo</span>
          </button>
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Xuất báo cáo Excel</span>
          </button>
        </div>
      </div>

      {/* Filter toolbar */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-3.5 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs font-serif">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Lớp học:</span>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0969DA]"
            >
              <option value="Tất cả">Tất cả các lớp</option>
              <option value="12A1">Lớp 12A1</option>
              <option value="12A2">Lớp 12A2</option>
              <option value="12A3">Lớp 12A3</option>
              <option value="11A1">Lớp 11A1</option>
              <option value="10A1">Lớp 10A1</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Học kỳ:</span>
            <select
              value={filterSemester}
              onChange={(e) => setFilterSemester(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0969DA]"
            >
              <option value="Học kỳ II">Học kỳ II</option>
              <option value="Học kỳ I">Học kỳ I</option>
              <option value="Cả năm">Cả năm học</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Năm học:</span>
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="px-2.5 py-1 border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-[#0969DA]"
            >
              <option value="2024-2025">2024-2025</option>
              <option value="2023-2024">2023-2024</option>
            </select>
          </div>
        </div>

        <div className="text-slate-500">
          Sĩ số mẫu đánh giá: <strong>{stats.total}</strong> học sinh
        </div>
      </div>

      {/* 4 Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Điểm TB kiểm tra</span>
            <BarChart3 className="w-4 h-4 text-[#0969DA]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#073B7A] font-mono">
            {stats.avgExam} <span className="text-xs font-normal text-slate-400">/ 10</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Đánh giá thường xuyên</div>
        </div>

        <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Điểm TB thực hành</span>
            <TrendingUp className="w-4 h-4 text-[#00B8D9]" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#00B8D9] font-mono">
            {stats.avgPrac} <span className="text-xs font-normal text-slate-400">/ 10</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Lập trình HTML & Python</div>
        </div>

        <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Tỷ lệ Đạt (≥ 5.0)</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono">
            {stats.passRate}%
          </div>
          <div className="text-[11px] text-emerald-600 mt-1 font-semibold">
            {stats.excellentCount} học sinh Giỏi ({((stats.excellentCount / (stats.total || 1)) * 100).toFixed(0)}%)
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Cần hỗ trợ</span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
            {atRiskStudents.length} <span className="text-xs font-normal text-slate-400">em</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Cần củng cố thêm kiến thức</div>
        </div>
      </div>

      {/* Charts row: Left = Bar chart comparison, Right = Rating distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Comparison Bar Chart (lg:col-span-7) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#DBE8F7] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF5FC]">
            <h3 className="font-bold text-base text-[#073B7A] font-serif">
              So sánh điểm kiểm tra & thực hành theo các lớp khối 12
            </h3>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-xs text-slate-600 font-serif">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#0969DA] rounded-xs" />
              <span>Điểm kiểm tra</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#00B8D9] rounded-xs" />
              <span>Điểm thực hành</span>
            </div>
          </div>

          {/* Bar Chart Visual */}
          <div className="relative h-52 flex pt-3">
            <div className="w-8 flex flex-col justify-between text-[11px] text-slate-400 font-mono pr-2">
              <span>10</span>
              <span>8</span>
              <span>6</span>
              <span>4</span>
              <span>2</span>
              <span>0</span>
            </div>
            <div className="flex-1 border-l border-b border-slate-300 grid grid-cols-3 items-end px-3 gap-6">
              {classComparison.map((item) => (
                <div key={item.name} className="flex flex-col items-center h-full justify-end">
                  <div className="flex items-end justify-center gap-2 w-full h-[160px]">
                    {/* Exam Bar */}
                    <div className="flex flex-col items-center flex-1 max-w-[32px] h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700 mb-1 tabular-nums">
                        {item.avgExam}
                      </span>
                      <div
                        style={{ height: `${(item.avgExam / 10) * 100}%` }}
                        className="w-full bg-[#0969DA] rounded-t-xs transition-all duration-300"
                      />
                    </div>
                    {/* Practical Bar */}
                    <div className="flex flex-col items-center flex-1 max-w-[32px] h-full justify-end">
                      <span className="text-[10px] font-bold text-slate-700 mb-1 tabular-nums">
                        {item.avgPrac}
                      </span>
                      <div
                        style={{ height: `${(item.avgPrac / 10) * 100}%` }}
                        className="w-full bg-[#00B8D9] rounded-t-xs transition-all duration-300"
                      />
                    </div>
                  </div>
                  <span className="mt-2 text-xs font-bold text-[#073B7A]">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Score Distribution (lg:col-span-5) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#DBE8F7] p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EEF5FC]">
            <h3 className="font-bold text-base text-[#073B7A] font-serif">
              Phân bố xếp loại học tập
            </h3>
          </div>

          <div className="space-y-3 pt-2 font-serif text-xs">
            {/* Giỏi */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span className="text-emerald-800">Giỏi (≥ 8.0)</span>
                <span>
                  {stats.excellentCount} học sinh ({((stats.excellentCount / (stats.total || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(stats.excellentCount / (stats.total || 1)) * 100}%` }}
                  className="bg-emerald-500 h-full rounded-full transition-all"
                />
              </div>
            </div>

            {/* Khá */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span className="text-sky-800">Khá (6.5 – 7.9)</span>
                <span>
                  {stats.goodCount} học sinh ({((stats.goodCount / (stats.total || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(stats.goodCount / (stats.total || 1)) * 100}%` }}
                  className="bg-sky-500 h-full rounded-full transition-all"
                />
              </div>
            </div>

            {/* Trung bình */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span className="text-amber-800">Trung bình (5.0 – 6.4)</span>
                <span>
                  {stats.averageCount} học sinh ({((stats.averageCount / (stats.total || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(stats.averageCount / (stats.total || 1)) * 100}%` }}
                  className="bg-amber-400 h-full rounded-full transition-all"
                />
              </div>
            </div>

            {/* Yếu */}
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span className="text-rose-800">Cần cố gắng (&lt; 5.0)</span>
                <span>
                  {stats.weakCount} học sinh ({((stats.weakCount / (stats.total || 1)) * 100).toFixed(0)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                <div
                  style={{ width: `${(stats.weakCount / (stats.total || 1)) * 100}%` }}
                  className="bg-rose-500 h-full rounded-full transition-all"
                />
              </div>
            </div>
          </div>

          {/* Teacher guidance recommendation */}
          <div className="bg-[#F4F9FF] border border-[#DBE8F7] p-3 rounded-xl text-xs text-[#073B7A] font-serif leading-relaxed">
            <strong>Gợi ý sư phạm:</strong> Kết quả thực hành HTML/CSS nhìn chung rất khả quan. Cô nên dành 1 tiết phụ đạo bổ trợ cho các học sinh nhóm Trung bình về vòng lặp và câu lệnh truy vấn CSDL.
          </div>
        </div>
      </div>

      {/* At-risk students section if any */}
      {atRiskStudents.length > 0 && (
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4 shadow-xs">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm font-serif mb-2">
            <AlertCircle className="w-4 h-4 text-amber-600" />
            <span>Danh sách học sinh cần giáo viên quan tâm, hỗ trợ thêm:</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {atRiskStudents.map((st) => (
              <div
                key={st.id}
                className="bg-white p-2.5 rounded-lg border border-amber-200 text-xs font-serif flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-slate-800">{st.name}</div>
                  <div className="text-[11px] text-slate-500">Lớp {st.class} · Mã: {st.id}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-amber-700">
                    TB: {((st.examScore + st.practicalScore) / 2).toFixed(1)}
                  </div>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded-full font-semibold">
                    {st.rating}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
