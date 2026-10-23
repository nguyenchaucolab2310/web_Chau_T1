import React, { useState, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Users,
  Search,
  Plus,
  FileSpreadsheet,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  CheckCircle2,
  AlertTriangle,
  FileDown,
  FileUp,
  X,
  Filter,
  ArrowUpDown
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const StudentsModule: React.FC = () => {
  const {
    students,
    addStudent,
    updateStudent,
    deleteStudent,
    batchImportStudents,
    currentRole,
    showToast,
    submissions,
    quizAttempts,
  } = useApp();

  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState<string>('Tất cả');
  const [filterRating, setFilterRating] = useState<string>('Tất cả');
  const [sortBy, setSortBy] = useState<'id' | 'name' | 'exam' | 'practical' | 'avg'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [deletingStudent, setDeletingStudent] = useState<Student | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);
  const [previewImportData, setPreviewImportData] = useState<Student[] | null>(null);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  // File input ref for Excel import
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form states for adding/editing student
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formClass, setFormClass] = useState('12A1');
  const [formGrade, setFormGrade] = useState(12);
  const [formYear, setFormYear] = useState('2024-2025');
  const [formStatus, setFormStatus] = useState<'Đang học' | 'Nghỉ học' | 'Chuyển trường'>('Đang học');
  const [formExam, setFormExam] = useState<number>(8.0);
  const [formPractical, setFormPractical] = useState<number>(8.5);
  const [formNotes, setFormNotes] = useState('');

  // Available classes list
  const availableClasses = useMemo(() => {
    const set = new Set(students.map((s) => s.class));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Filtered & sorted student list
  const processedStudents = useMemo(() => {
    return students
      .filter((s) => {
        const matchSearch =
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.id.toLowerCase().includes(search.toLowerCase());
        const matchClass = filterClass === 'Tất cả' || s.class === filterClass;
        const matchRating = filterRating === 'Tất cả' || s.rating === filterRating;
        return matchSearch && matchClass && matchRating;
      })
      .sort((a, b) => {
        let valA: any = a[sortBy === 'avg' ? 'examScore' : sortBy === 'exam' ? 'examScore' : sortBy === 'practical' ? 'practicalScore' : sortBy];
        let valB: any = b[sortBy === 'avg' ? 'examScore' : sortBy === 'exam' ? 'examScore' : sortBy === 'practical' ? 'practicalScore' : sortBy];

        if (sortBy === 'avg') {
          valA = (a.examScore + a.practicalScore) / 2;
          valB = (b.examScore + b.practicalScore) / 2;
        }

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        }
        return sortOrder === 'asc' ? valA - valB : valB - valA;
      });
  }, [students, search, filterClass, filterRating, sortBy, sortOrder]);

  const toggleSort = (field: 'id' | 'name' | 'exam' | 'practical' | 'avg') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setFormId(`HS12${(students.length + 1).toString().padStart(2, '0')}`);
    setFormName('');
    setFormClass('12A1');
    setFormGrade(12);
    setFormYear('2024-2025');
    setFormStatus('Đang học');
    setFormExam(8.0);
    setFormPractical(8.0);
    setFormNotes('Học sinh chăm ngoan, tích cực thực hành.');
    setShowAddModal(true);
  };

  const openEditModal = (student: Student) => {
    setEditingStudent(student);
    setFormId(student.id);
    setFormName(student.name);
    setFormClass(student.class);
    setFormGrade(student.grade);
    setFormYear(student.academicYear);
    setFormStatus(student.status);
    setFormExam(student.examScore);
    setFormPractical(student.practicalScore);
    setFormNotes(student.teacherNotes || '');
    setShowAddModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formId.trim() || !formName.trim()) {
      showToast('Vui lòng nhập đầy đủ Mã học sinh và Họ tên!', 'error');
      return;
    }

    if (editingStudent) {
      updateStudent({
        ...editingStudent,
        id: formId,
        name: formName,
        class: formClass,
        grade: formGrade,
        academicYear: formYear,
        status: formStatus,
        examScore: Number(formExam),
        practicalScore: Number(formPractical),
        teacherNotes: formNotes,
      });
    } else {
      addStudent({
        id: formId,
        name: formName,
        class: formClass,
        grade: formGrade,
        academicYear: formYear,
        status: formStatus,
        examScore: Number(formExam),
        practicalScore: Number(formPractical),
        teacherNotes: formNotes,
      });
    }
    setShowAddModal(false);
  };

  // EXCEL IMPORT & EXPORT LOGIC
  const downloadSampleExcel = () => {
    const sampleRows = [
      {
        'Mã học sinh': 'HS1220',
        'Họ và tên': 'Nguyễn Hoàng Nam',
        'Lớp': '12A1',
        'Khối': 12,
        'Năm học': '2024-2025',
        'Trạng thái': 'Đang học',
        'Điểm kiểm tra': 8.5,
        'Điểm thực hành': 9.0,
        'Ghi chú': 'Học sinh mới chuyển vào',
      },
      {
        'Mã học sinh': 'HS1221',
        'Họ và tên': 'Trần Bảo Anh',
        'Lớp': '12A2',
        'Khối': 12,
        'Năm học': '2024-2025',
        'Trạng thái': 'Đang học',
        'Điểm kiểm tra': 7.5,
        'Điểm thực hành': 8.0,
        'Ghi chú': 'Tích cực tham gia câu lạc bộ Tin học',
      },
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'MauDanhSachHocSinh');
    XLSX.writeFile(workbook, 'Mau_Danh_Sach_Hoc_Sinh_TinHocSo.xlsx');
    showToast('Đã tải xuống file mẫu Excel!');
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const workbook = XLSX.read(bstr, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet);

        if (!rawData || rawData.length === 0) {
          showToast('File Excel trống hoặc không có dữ liệu hợp lệ.', 'error');
          return;
        }

        const errors: string[] = [];
        const parsedStudents: Student[] = [];
        const seenIds = new Set<string>();

        rawData.forEach((row, index) => {
          const rowNum = index + 2;
          const id = row['Mã học sinh'] || row['MaHS'] || row['ID'] || row['Mã HS'];
          const name = row['Họ và tên'] || row['HoTen'] || row['Họ tên'] || row['Name'];
          const cls = row['Lớp'] || row['Lop'] || row['Class'] || '12A1';
          const grade = Number(row['Khối'] || row['Khoi'] || 12);
          const year = row['Năm học'] || row['NamHoc'] || '2024-2025';
          const status = row['Trạng thái'] || row['TrangThai'] || 'Đang học';
          const exam = Number(row['Điểm kiểm tra'] || row['DiemKT'] || 8.0);
          const practical = Number(row['Điểm thực hành'] || row['DiemTH'] || 8.0);
          const notes = row['Ghi chú'] || row['GhiChu'] || '';

          if (!id) {
            errors.push(`Dòng ${rowNum}: Thiếu Mã học sinh bắt buộc.`);
            return;
          }
          if (!name) {
            errors.push(`Dòng ${rowNum}: Thiếu Họ tên học sinh bắt buộc.`);
            return;
          }
          if (seenIds.has(String(id))) {
            errors.push(`Dòng ${rowNum}: Trùng lặp mã học sinh "${id}" trong file.`);
            return;
          }
          seenIds.add(String(id));

          parsedStudents.push({
            id: String(id).trim(),
            name: String(name).trim(),
            class: String(cls).trim(),
            grade: isNaN(grade) ? 12 : grade,
            academicYear: String(year).trim(),
            status: status === 'Nghỉ học' ? 'Nghỉ học' : 'Đang học',
            examScore: isNaN(exam) ? 0 : Math.min(10, Math.max(0, exam)),
            practicalScore: isNaN(practical) ? 0 : Math.min(10, Math.max(0, practical)),
            teacherNotes: notes,
          });
        });

        setImportErrors(errors);
        setPreviewImportData(parsedStudents);
      } catch (err: any) {
        showToast(`Lỗi đọc file Excel: ${err?.message}`, 'error');
      }
    };
    reader.readAsBinaryString(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmBatchImport = () => {
    if (!previewImportData || previewImportData.length === 0) return;
    batchImportStudents(previewImportData);
    setPreviewImportData(null);
    setImportErrors([]);
  };

  const exportStudentListExcel = () => {
    const data = processedStudents.map((s, idx) => ({
      STT: idx + 1,
      'Mã học sinh': s.id,
      'Họ và tên': s.name,
      'Lớp': s.class,
      'Khối': s.grade,
      'Năm học': s.academicYear,
      'Trạng thái': s.status,
      'Điểm kiểm tra': s.examScore,
      'Điểm thực hành': s.practicalScore,
      'Điểm trung bình': Number(((s.examScore + s.practicalScore) / 2).toFixed(1)),
      'Xếp loại': s.rating,
      'Ghi chú': s.teacherNotes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'DanhSachHocSinh');
    XLSX.writeFile(workbook, `Danh_Sach_Hoc_Sinh_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Đã xuất danh sách học sinh ra file Excel (.xlsx)!');
  };

  const exportGradeSheetExcel = () => {
    const data = processedStudents.map((s, idx) => ({
      STT: idx + 1,
      'Mã HS': s.id,
      'Họ tên học sinh': s.name,
      'Lớp': s.class,
      'Điểm ĐGTX (KT)': s.examScore,
      'Điểm TH Web/Python': s.practicalScore,
      'Điểm TB môn': Number(((s.examScore + s.practicalScore) / 2).toFixed(1)),
      'Đánh giá': s.rating,
      'Nhận xét': s.teacherNotes || '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'BangDiemTinHoc');
    XLSX.writeFile(workbook, `Bang_Diem_Tin_Hoc_${filterClass}_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Đã xuất bảng điểm Tin học ra file Excel (.xlsx)!');
  };

  return (
    <div className="space-y-4">
      {/* Top Banner and Summary */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-[#073B7A]">
          <Users className="w-6 h-6 text-[#722ED1]" />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold font-serif leading-tight">
                Quản lý học sinh – Tin học THPT
              </h2>
              <span className="text-[11px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                DỮ LIỆU MẪU
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hệ thống quản lý thông tin học sinh, điểm số, học bạ và nhập xuất dữ liệu Excel
            </p>
          </div>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Download Sample */}
          <button
            onClick={downloadSampleExcel}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
            title="Tải file mẫu Excel"
          >
            <FileDown className="w-4 h-4 text-slate-500" />
            <span className="hidden sm:inline">Tải file mẫu</span>
          </button>

          {/* Import Excel */}
          <label className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-[#722ED1] text-xs font-semibold rounded-lg border border-purple-200 cursor-pointer transition">
            <Upload className="w-4 h-4" />
            <span>Nhập Excel</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleExcelUpload}
              accept=".xlsx, .xls, .csv"
              className="hidden"
            />
          </label>

          {/* Export Excel */}
          <div className="flex items-center gap-1">
            <button
              onClick={exportStudentListExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              title="Xuất danh sách học sinh ra file Excel"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Xuất danh sách</span>
            </button>
            <button
              onClick={exportGradeSheetExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-semibold rounded-lg shadow-xs transition"
              title="Xuất bảng điểm ra file Excel"
            >
              <Download className="w-4 h-4" />
              <span>Xuất bảng điểm</span>
            </button>
          </div>

          {/* Add Student */}
          {currentRole === 'teacher' && (
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#722ED1] hover:bg-[#5b21a8] text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-3.5 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm theo họ tên hoặc mã học sinh..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#722ED1]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
          {/* Class filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Lớp:</span>
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white font-serif focus:outline-none focus:ring-1 focus:ring-[#722ED1]"
            >
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  {cls === 'Tất cả' ? 'Tất cả các lớp' : `Lớp ${cls}`}
                </option>
              ))}
            </select>
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-600">Xếp loại:</span>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="px-2.5 py-1 rounded-md border border-slate-200 bg-white font-serif focus:outline-none focus:ring-1 focus:ring-[#722ED1]"
            >
              <option value="Tất cả">Tất cả xếp loại</option>
              <option value="Giỏi">Giỏi</option>
              <option value="Khá">Khá</option>
              <option value="Trung bình">Trung bình</option>
              <option value="Yếu">Yếu</option>
            </select>
          </div>

          <span className="text-slate-400">|</span>
          <span className="font-semibold text-slate-700">
            Hiển thị: <strong>{processedStudents.length}</strong> học sinh
          </span>
        </div>
      </div>

      {/* Main Student Table */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm font-serif">
            <thead>
              <tr className="bg-[#F4F9FF] text-[#073B7A] border-b border-[#DBE8F7]">
                <th
                  onClick={() => toggleSort('id')}
                  className="py-3 px-3 font-bold cursor-pointer hover:bg-blue-100/50 transition w-24"
                >
                  <div className="flex items-center gap-1">
                    <span>Mã HS</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('name')}
                  className="py-3 px-3 font-bold cursor-pointer hover:bg-blue-100/50 transition"
                >
                  <div className="flex items-center gap-1">
                    <span>Họ và tên</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold text-center w-20">Lớp</th>
                <th className="py-3 px-3 font-bold text-center w-24">Khối / Năm</th>
                <th
                  onClick={() => toggleSort('exam')}
                  className="py-3 px-3 font-bold text-center cursor-pointer hover:bg-blue-100/50 transition w-24"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Điểm KT</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('practical')}
                  className="py-3 px-3 font-bold text-center cursor-pointer hover:bg-blue-100/50 transition w-24"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Điểm TH</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('avg')}
                  className="py-3 px-3 font-bold text-center cursor-pointer hover:bg-blue-100/50 transition w-24"
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>Điểm TB</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-3 font-bold text-center w-24">Xếp loại</th>
                <th className="py-3 px-3 font-bold text-center w-28">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF5FC]">
              {processedStudents.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-slate-400 font-serif">
                    Không tìm thấy học sinh nào phù hợp với bộ lọc tìm kiếm.
                  </td>
                </tr>
              ) : (
                processedStudents.map((st) => {
                  const avg = ((st.examScore + st.practicalScore) / 2).toFixed(1);
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
                      <td className="py-2.5 px-3 font-mono font-semibold text-slate-700">
                        {st.id}
                      </td>
                      <td className="py-2.5 px-3">
                        <div className="font-semibold text-[#12305B]">{st.name}</div>
                        {st.teacherNotes && (
                          <div className="text-[11px] text-slate-400 truncate max-w-xs">
                            {st.teacherNotes}
                          </div>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                        {st.class}
                      </td>
                      <td className="py-2.5 px-3 text-center text-xs text-slate-500">
                        Khối {st.grade} · {st.academicYear}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 tabular-nums">
                        {st.examScore.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-800 tabular-nums">
                        {st.practicalScore.toFixed(1)}
                      </td>
                      <td className="py-2.5 px-3 text-center font-extrabold text-[#0969DA] tabular-nums">
                        {avg}
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${ratingBadge}`}
                        >
                          {st.rating || 'Khá'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setViewingStudent(st)}
                            className="p-1 text-slate-500 hover:text-[#0969DA] hover:bg-slate-100 rounded-md transition"
                            title="Xem chi tiết học tập"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {currentRole === 'teacher' && (
                            <>
                              <button
                                onClick={() => openEditModal(st)}
                                className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition"
                                title="Chỉnh sửa thông tin"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeletingStudent(st)}
                                className="p-1 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-md transition"
                                title="Xóa học sinh"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL: Thêm / Sửa học sinh */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 font-serif">
            <h3 className="text-xl font-bold text-[#073B7A] mb-4">
              {editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới vào hệ thống'}
            </h3>

            <form onSubmit={handleFormSubmit} className="space-y-3.5 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã học sinh (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={formId}
                    onChange={(e) => setFormId(e.target.value)}
                    placeholder="HS1201"
                    disabled={!!editingStudent}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722ED1] font-mono text-xs uppercase disabled:bg-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Họ và tên (*)
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722ED1]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp</label>
                  <select
                    value={formClass}
                    onChange={(e) => setFormClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722ED1]"
                  >
                    <option value="12A1">12A1</option>
                    <option value="12A2">12A2</option>
                    <option value="12A3">12A3</option>
                    <option value="11A1">11A1</option>
                    <option value="10A1">10A1</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722ED1]"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Năm học</label>
                  <input
                    type="text"
                    value={formYear}
                    onChange={(e) => setFormYear(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722ED1] text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-[#F4F9FF] p-3 rounded-xl border border-[#DBE8F7]">
                <div>
                  <label className="block text-xs font-semibold text-[#073B7A] mb-1">
                    Điểm kiểm tra (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formExam}
                    onChange={(e) => setFormExam(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722ED1] bg-white font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#073B7A] mb-1">
                    Điểm thực hành (0 - 10)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    required
                    value={formPractical}
                    onChange={(e) => setFormPractical(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722ED1] bg-white font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhận xét của Giáo viên
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="Ghi nhận thái độ học tập, khả năng lập trình..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#722ED1]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#722ED1] hover:bg-[#5b21a8] text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Xác nhận xóa học sinh */}
      {deletingStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-100 text-center font-serif space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Xác nhận xóa học sinh</h3>
              <p className="text-xs text-slate-500 mt-1">
                Thầy/Cô có chắc chắn muốn xóa học sinh{' '}
                <strong className="text-slate-800">{deletingStudent.name}</strong> (Mã:{' '}
                {deletingStudent.id}) khỏi danh sách? Thao tác này sẽ xóa điểm số và dữ liệu bài nộp liên quan.
              </p>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeletingStudent(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs font-semibold"
              >
                Hủy bỏ
              </button>
              <button
                onClick={() => {
                  deleteStudent(deletingStudent.id);
                  setDeletingStudent(null);
                }}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Xem chi tiết học sinh & lịch sử nộp bài */}
      {viewingStudent && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 font-serif space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#073B7A] text-white flex items-center justify-center font-bold text-lg">
                  {viewingStudent.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#073B7A]">{viewingStudent.name}</h3>
                  <p className="text-xs text-slate-500">
                    Mã HS: {viewingStudent.id} · Lớp: {viewingStudent.class} · Khối {viewingStudent.grade}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewingStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Score summary cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#F4F9FF] p-3 rounded-xl border border-[#DBE8F7] text-center">
                <div className="text-xs text-slate-500">Điểm kiểm tra</div>
                <div className="text-2xl font-bold text-[#073B7A] mt-0.5">
                  {viewingStudent.examScore}
                </div>
              </div>
              <div className="bg-[#F4F9FF] p-3 rounded-xl border border-[#DBE8F7] text-center">
                <div className="text-xs text-slate-500">Điểm thực hành</div>
                <div className="text-2xl font-bold text-[#00B8D9] mt-0.5">
                  {viewingStudent.practicalScore}
                </div>
              </div>
              <div className="bg-[#F4F9FF] p-3 rounded-xl border border-[#DBE8F7] text-center">
                <div className="text-xs text-slate-500">Điểm trung bình</div>
                <div className="text-2xl font-bold text-[#0969DA] mt-0.5">
                  {((viewingStudent.examScore + viewingStudent.practicalScore) / 2).toFixed(1)}
                </div>
              </div>
            </div>

            {/* Teacher note */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <span className="font-bold text-slate-700">Nhận xét của Giáo viên: </span>
              <span className="text-slate-600">
                {viewingStudent.teacherNotes || 'Chưa có ghi chú đặc biệt.'}
              </span>
            </div>

            {/* Practical History */}
            <div>
              <h4 className="font-bold text-sm text-[#073B7A] mb-2">
                Bài tập thực hành đã nộp:
              </h4>
              <div className="space-y-1.5 text-xs">
                {submissions.filter((s) => s.studentId === viewingStudent.id).length === 0 ? (
                  <div className="p-3 text-center text-slate-400 bg-slate-50 rounded-lg">
                    Chưa có bài thực hành nào được ghi nhận.
                  </div>
                ) : (
                  submissions
                    .filter((s) => s.studentId === viewingStudent.id)
                    .map((sub) => (
                      <div
                        key={sub.id}
                        className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-slate-800">{sub.exerciseTitle}</div>
                          <div className="text-[11px] text-slate-400">Thời gian: {sub.submittedAt}</div>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-700">{sub.score ? `${sub.score} đ` : 'Chờ chấm'}</span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                onClick={() => setViewingStudent(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Xem trước & Xác nhận nhập Excel */}
      {previewImportData && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-100 font-serif space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="text-xl font-bold text-[#073B7A]">
                  Xem trước dữ liệu nhập từ Excel
                </h3>
                <p className="text-xs text-slate-500">
                  Phát hiện <strong>{previewImportData.length}</strong> dòng hợp lệ. Vui lòng kiểm tra lại trước khi lưu.
                </p>
              </div>
              <button
                onClick={() => setPreviewImportData(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Error alerts if any */}
            {importErrors.length > 0 && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 text-xs text-rose-700 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Cảnh báo dữ liệu cần lưu ý:</span>
                </div>
                <ul className="list-disc list-inside space-y-0.5">
                  {importErrors.slice(0, 4).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Preview table */}
            <div className="flex-1 overflow-y-auto border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 sticky top-0 border-b border-slate-200">
                    <th className="p-2">Mã HS</th>
                    <th className="p-2">Họ tên</th>
                    <th className="p-2 text-center">Lớp</th>
                    <th className="p-2 text-center">Điểm KT</th>
                    <th className="p-2 text-center">Điểm TH</th>
                    <th className="p-2 text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {previewImportData.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="p-2 font-mono font-bold text-slate-700">{s.id}</td>
                      <td className="p-2 font-medium">{s.name}</td>
                      <td className="p-2 text-center">{s.class}</td>
                      <td className="p-2 text-center font-bold">{s.examScore}</td>
                      <td className="p-2 text-center font-bold">{s.practicalScore}</td>
                      <td className="p-2 text-center">
                        <span className="px-2 py-0.5 bg-blue-100 text-[#073B7A] rounded-full text-[11px] font-semibold">
                          {s.rating || 'Khá'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPreviewImportData(null)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-xs"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={confirmBatchImport}
                className="px-5 py-2 bg-[#0969DA] hover:bg-[#073B7A] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Xác nhận lưu vào danh sách
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
