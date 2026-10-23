import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lesson } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  CheckCircle,
  FileText,
  PlayCircle,
  Download,
  Trash2,
  Edit3,
  ExternalLink,
  Code2
} from 'lucide-react';

export const LessonsModule: React.FC = () => {
  const {
    lessons,
    activeLessonId,
    setActiveLessonId,
    addLesson,
    updateLesson,
    deleteLesson,
    currentRole,
    showToast,
  } = useApp();

  const [selectedGrade, setSelectedGrade] = useState<number | 'all'>('all');
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  // Filter lessons
  const filteredLessons = lessons.filter((l) => {
    const matchGrade = selectedGrade === 'all' || l.grade === selectedGrade;
    const matchSearch =
      l.title.toLowerCase().includes(search.toLowerCase()) ||
      l.code.toLowerCase().includes(search.toLowerCase()) ||
      l.topic.toLowerCase().includes(search.toLowerCase());
    return matchGrade && matchSearch;
  });

  const activeLesson =
    lessons.find((l) => l.id === activeLessonId) || filteredLessons[0] || lessons[0];

  // Form states for creating/editing lesson
  const [formCode, setFormCode] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formGrade, setFormGrade] = useState<number>(12);
  const [formTopic, setFormTopic] = useState('');
  const [formObjectives, setFormObjectives] = useState('');
  const [formContent, setFormContent] = useState('');

  const openCreateModal = () => {
    setEditingLesson(null);
    setFormCode(`Bài ${lessons.length + 1}`);
    setFormTitle('');
    setFormGrade(12);
    setFormTopic('');
    setFormObjectives('Hiểu lý thuyết trọng tâm\nThực hành được ví dụ minh họa');
    setFormContent('## 1. Nội dung trọng tâm\n\nNội dung bài học...');
    setShowCreateModal(true);
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setFormCode(lesson.code);
    setFormTitle(lesson.title);
    setFormGrade(lesson.grade);
    setFormTopic(lesson.topic);
    setFormObjectives(lesson.objectives.join('\n'));
    setFormContent(lesson.content);
    setShowCreateModal(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const objectivesArr = formObjectives
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    if (editingLesson) {
      updateLesson({
        ...editingLesson,
        code: formCode,
        title: formTitle,
        grade: formGrade,
        topic: formTopic,
        objectives: objectivesArr,
        content: formContent,
      });
    } else {
      addLesson({
        code: formCode,
        title: formTitle,
        grade: formGrade,
        topic: formTopic,
        targetClasses: [`${formGrade}A1`],
        objectives: objectivesArr,
        content: formContent,
        status: 'published',
      });
    }
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-[#073B7A]">
          <BookOpen className="w-6 h-6 text-[#0969DA]" />
          <div>
            <h2 className="text-xl font-bold font-serif leading-tight">Bài học số – Tin học THPT</h2>
            <p className="text-xs text-slate-500">
              Quản lý bài giảng, lý thuyết, tài liệu và mã mẫu cho khối 10, 11 và 12
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Grade filter tabs */}
          <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
            {(['all', 10, 11, 12] as const).map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGrade(g)}
                className={`px-3 py-1.5 rounded-md transition ${
                  selectedGrade === g
                    ? 'bg-[#0969DA] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {g === 'all' ? 'Tất cả khối' : `Khối ${g}`}
              </button>
            ))}
          </div>

          {currentRole === 'teacher' && (
            <button
              onClick={openCreateModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#0969DA] hover:bg-[#073B7A] text-white text-xs font-semibold rounded-lg shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo bài học mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Lesson Directory List (lg:col-span-4) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#DBE8F7] p-3.5 shadow-xs space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm bài học..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0969DA]"
            />
          </div>

          <div className="space-y-2 max-h-[620px] overflow-y-auto pr-1">
            {filteredLessons.map((item) => {
              const isSelected = activeLesson?.id === item.id;
              return (
                <div
                  key={item.id}
                  onClick={() => setActiveLessonId(item.id)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-[#0969DA] bg-blue-50/70 shadow-xs'
                      : 'border-[#EEF5FC] hover:border-blue-200 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                    <span className="font-bold text-[#073B7A]">
                      {item.code} · Khối {item.grade}
                    </span>
                    <span className="text-[11px] text-slate-400">{item.updatedAt}</span>
                  </div>
                  <h4 className="font-bold text-sm text-[#12305B] font-serif leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.topic}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Detailed Lesson Viewer (lg:col-span-8) */}
        <div className="lg:col-span-8 bg-white rounded-xl border border-[#DBE8F7] p-5 shadow-xs space-y-5">
          {activeLesson ? (
            <>
              {/* Lesson header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#EEF5FC] gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#0969DA] font-semibold">
                    <span>{activeLesson.code}</span>
                    <span>·</span>
                    <span>Khối {activeLesson.grade}</span>
                    <span>·</span>
                    <span>Chủ đề: {activeLesson.topic}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-[#073B7A] font-serif mt-1">
                    {activeLesson.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('Đã đánh dấu đã hoàn thành bài học này!')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 text-xs font-semibold rounded-lg transition"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Đã học</span>
                  </button>

                  {currentRole === 'teacher' && (
                    <>
                      <button
                        onClick={() => openEditModal(activeLesson)}
                        className="p-1.5 text-slate-600 hover:text-[#0969DA] hover:bg-slate-100 rounded-lg transition"
                        title="Chỉnh sửa bài học"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteLesson(activeLesson.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                        title="Xóa bài học"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Objectives box */}
              {activeLesson.objectives && activeLesson.objectives.length > 0 && (
                <div className="bg-[#F4F9FF] border border-[#DBE8F7] rounded-xl p-4">
                  <h4 className="font-bold text-sm text-[#073B7A] mb-2 font-serif">
                    Mục tiêu bài học:
                  </h4>
                  <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700">
                    {activeLesson.objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-[#0969DA] font-bold">✓</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Theory Content (Markdown-like formatting) */}
              <div className="prose max-w-none text-slate-800 space-y-3 text-sm sm:text-base leading-relaxed font-serif">
                <div className="whitespace-pre-line bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                  {activeLesson.content}
                </div>
              </div>

              {/* Code Examples if available */}
              {activeLesson.codeExamples && activeLesson.codeExamples.length > 0 && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-2 text-[#073B7A] font-bold text-sm">
                    <Code2 className="w-4 h-4 text-[#0969DA]" />
                    <span>Mã nguồn ví dụ minh họa:</span>
                  </div>
                  {activeLesson.codeExamples.map((ex, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-900 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto shadow-inner"
                    >
                      <div className="flex items-center justify-between text-slate-400 text-[11px] pb-2 border-b border-slate-800 mb-2">
                        <span>{ex.language.toUpperCase()}</span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(ex.code);
                            showToast('Đã sao chép mã nguồn vào bộ nhớ tạm!');
                          }}
                          className="hover:text-white transition"
                        >
                          Sao chép mã
                        </button>
                      </div>
                      <pre className="text-emerald-400">{ex.code}</pre>
                      <div className="text-slate-400 text-xs mt-2 italic font-serif">
                        // {ex.explanation}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Attachments / Resources */}
              {activeLesson.attachments && activeLesson.attachments.length > 0 && (
                <div className="pt-2">
                  <h4 className="font-bold text-sm text-[#073B7A] mb-2 font-serif">
                    Tài liệu đính kèm & slide bài giảng:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeLesson.attachments.map((att, idx) => (
                      <div
                        key={idx}
                        onClick={() => showToast(`Đang tải tài liệu: ${att.name}`)}
                        className="flex items-center justify-between p-3 rounded-lg border border-[#DBE8F7] hover:border-[#0969DA] bg-white cursor-pointer transition"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <FileText className="w-4 h-4 text-[#0969DA] shrink-0" />
                          <span className="text-xs font-semibold text-slate-800 truncate">
                            {att.name}
                          </span>
                        </div>
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center text-slate-500">
              Chưa có bài học nào được chọn.
            </div>
          )}
        </div>
      </div>

      {/* Modal tạo / sửa bài học */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-[#073B7A] font-serif mb-4">
              {editingLesson ? 'Chỉnh sửa bài học' : 'Tạo bài học số mới'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4 text-sm font-serif">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã bài</label>
                  <input
                    type="text"
                    required
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="Bài 6"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tên bài học</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Hàm và lời gọi hàm trong Python"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Khối lớp</label>
                  <select
                    value={formGrade}
                    onChange={(e) => setFormGrade(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  >
                    <option value={10}>Khối 10</option>
                    <option value={11}>Khối 11</option>
                    <option value={12}>Khối 12</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Chủ đề bài học</label>
                  <input
                    type="text"
                    required
                    value={formTopic}
                    onChange={(e) => setFormTopic(e.target.value)}
                    placeholder="Lập trình có cấu trúc"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mục tiêu cần đạt (Mỗi mục 1 dòng)
                </label>
                <textarea
                  rows={3}
                  value={formObjectives}
                  onChange={(e) => setFormObjectives(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nội dung lý thuyết (Hỗ trợ Markdown)
                </label>
                <textarea
                  rows={6}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA] font-mono text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0969DA] text-white rounded-lg hover:bg-[#073B7A] font-semibold"
                >
                  Lưu bài học
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
