import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Bell, History, ArrowRight, Plus, Trash2, CheckCircle2, FileCode, CheckSquare, Eye, Award } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    schedule,
    addScheduleEvent,
    deleteScheduleEvent,
    notifications,
    addNotification,
    deleteNotification,
    markNotificationAsRead,
    activities,
    setActiveTab,
    currentRole,
    showToast,
  } = useApp();

  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showAddNotifModal, setShowAddNotifModal] = useState(false);

  // Form states
  const [eventTitle, setEventTitle] = useState('');
  const [eventDay, setEventDay] = useState('Thứ Hai');
  const [eventDate, setEventDate] = useState('28/04/2025');
  const [eventPeriod, setEventPeriod] = useState('Tiết 1 - 2');
  const [eventClass, setEventClass] = useState('Lớp 12A1');
  const [eventColor, setEventColor] = useState<'cyan' | 'yellow' | 'red' | 'blue'>('cyan');

  const [notifTitle, setNotifTitle] = useState('');
  const [notifCategory, setNotifCategory] = useState<'lesson' | 'exam' | 'assignment' | 'material'>('lesson');

  const handleAddEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    addScheduleEvent({
      date: '2025-04-28',
      dayOfWeek: eventDay,
      formattedDate: eventDate,
      period: eventPeriod,
      class: eventClass,
      title: eventTitle,
      type: 'teaching',
      color: eventColor,
    });

    setEventTitle('');
    setShowAddEventModal(false);
  };

  const handleAddNotifSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim()) return;

    const todayStr = new Date().toLocaleDateString('vi-VN');
    const colorMap: Record<string, 'yellow' | 'red' | 'blue' | 'green'> = {
      lesson: 'yellow',
      exam: 'red',
      assignment: 'blue',
      material: 'green',
    };

    addNotification({
      title: notifTitle,
      date: todayStr,
      category: notifCategory,
      color: colorMap[notifCategory] || 'blue',
      details: notifTitle,
    });

    setNotifTitle('');
    setShowAddNotifModal(false);
  };

  return (
    <aside className="w-full lg:w-[280px] xl:w-[320px] shrink-0 space-y-4">
      {/* KHỐI 1: LỊCH HỌC – LỊCH CÔNG VIỆC */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF5FC]">
          <div className="flex items-center gap-2 text-[#073B7A]">
            <Calendar className="w-4.5 h-4.5 text-[#0969DA]" />
            <h3 className="font-bold text-[16px] tracking-tight">Lịch học - Lịch công việc</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {currentRole === 'teacher' && (
              <button
                onClick={() => setShowAddEventModal(true)}
                className="text-[#0969DA] hover:text-[#073B7A] p-0.5 rounded-sm hover:bg-blue-50 transition"
                title="Thêm lịch công việc"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => showToast('Đang hiển thị toàn bộ lịch giảng dạy và kiểm tra.')}
              className="text-[#0969DA] text-xs font-medium hover:underline flex items-center gap-0.5"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="pt-3 space-y-3.5">
          {schedule.slice(0, 5).map((item) => {
            const dotColorClass =
              item.color === 'cyan'
                ? 'bg-[#00B8D9]'
                : item.color === 'yellow'
                ? 'bg-amber-400'
                : item.color === 'red'
                ? 'bg-rose-500'
                : 'bg-[#0969DA]';

            return (
              <div key={item.id} className="group relative flex items-start gap-2.5 text-xs sm:text-[13px]">
                <span className={`w-2.5 h-2.5 rounded-full ${dotColorClass} mt-1 shrink-0 ring-2 ring-white shadow-xs`} />
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-slate-800 leading-snug">
                    {item.dayOfWeek}, {item.formattedDate}
                  </div>
                  <div className="text-slate-600 leading-snug mt-0.5">
                    {item.period ? `${item.period}: ` : ''}
                    {item.class ? `${item.class} - ` : ''}
                    <span className="font-medium text-[#12305B]">{item.title}</span>
                  </div>
                </div>
                {currentRole === 'teacher' && (
                  <button
                    onClick={() => deleteScheduleEvent(item.id)}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition p-1"
                    title="Xóa sự kiện"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KHỐI 2: THÔNG BÁO */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF5FC]">
          <div className="flex items-center gap-2 text-[#073B7A]">
            <Bell className="w-4.5 h-4.5 text-[#0969DA]" />
            <h3 className="font-bold text-[16px] tracking-tight">Thông báo</h3>
          </div>
          <div className="flex items-center gap-1.5">
            {currentRole === 'teacher' && (
              <button
                onClick={() => setShowAddNotifModal(true)}
                className="text-[#0969DA] hover:text-[#073B7A] p-0.5 rounded-sm hover:bg-blue-50 transition"
                title="Tạo thông báo mới"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => showToast('Đang xem danh sách các thông báo mới nhất.')}
              className="text-[#0969DA] text-xs font-medium hover:underline flex items-center gap-0.5"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="pt-3 space-y-3.5">
          {notifications.slice(0, 5).map((item) => {
            const dotColorClass =
              item.color === 'yellow'
                ? 'bg-amber-400'
                : item.color === 'red'
                ? 'bg-rose-500'
                : item.color === 'blue'
                ? 'bg-[#0969DA]'
                : 'bg-emerald-500';

            return (
              <div
                key={item.id}
                onClick={() => markNotificationAsRead(item.id)}
                className="group relative flex items-start gap-2.5 text-xs sm:text-[13px] cursor-pointer hover:bg-slate-50/80 p-1 -m-1 rounded-md transition"
              >
                <span className={`w-2.5 h-2.5 rounded-full ${dotColorClass} mt-1 shrink-0 ring-2 ring-white shadow-xs`} />
                <div className="flex-1 min-w-0">
                  <div className={`leading-snug ${!item.isRead ? 'font-bold text-[#073B7A]' : 'text-slate-800'}`}>
                    {item.title}
                  </div>
                  <div className="text-slate-400 text-[11px] mt-0.5">{item.date}</div>
                </div>
                {currentRole === 'teacher' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNotification(item.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 transition p-1"
                    title="Xóa thông báo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* KHỐI 3: HOẠT ĐỘNG GẦN ĐÂY */}
      <div className="bg-white rounded-xl border border-[#DBE8F7] p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF5FC]">
          <div className="flex items-center gap-2 text-[#073B7A]">
            <History className="w-4.5 h-4.5 text-[#0969DA]" />
            <h3 className="font-bold text-[16px] tracking-tight">Hoạt động gần đây</h3>
          </div>
          <button
            onClick={() => setActiveTab('students')}
            className="text-[#0969DA] text-xs font-medium hover:underline flex items-center gap-0.5"
          >
            <span>Xem tất cả</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="pt-3 space-y-3">
          {activities.slice(0, 5).map((item) => {
            let iconEl = <FileCode className="w-3.5 h-3.5 text-emerald-600" />;
            if (item.type === 'quiz') iconEl = <CheckSquare className="w-3.5 h-3.5 text-amber-600" />;
            if (item.type === 'lesson') iconEl = <Eye className="w-3.5 h-3.5 text-blue-600" />;
            if (item.type === 'grade') iconEl = <Award className="w-3.5 h-3.5 text-purple-600" />;

            return (
              <div key={item.id} className="flex items-start gap-2.5 text-xs leading-snug">
                <div className="w-6 h-6 rounded-md bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {iconEl}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="font-semibold text-slate-800">{item.studentName} </span>
                  <span className="text-slate-600">{item.action}</span>
                  <div className="text-slate-400 text-[11px] mt-0.5">{item.timeAgo}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddEventModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-[#073B7A] mb-4">Thêm lịch dạy & công việc mới</h3>
            <form onSubmit={handleAddEventSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nội dung công việc / Bài học</label>
                <input
                  type="text"
                  required
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Ví dụ: Bài 6. Hàm trong Python"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Thứ</label>
                  <select
                    value={eventDay}
                    onChange={(e) => setEventDay(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  >
                    <option value="Thứ Hai">Thứ Hai</option>
                    <option value="Thứ Ba">Thứ Ba</option>
                    <option value="Thứ Tư">Thứ Tư</option>
                    <option value="Thứ Năm">Thứ Năm</option>
                    <option value="Thứ Sáu">Thứ Sáu</option>
                    <option value="Thứ Bảy">Thứ Bảy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Ngày (dd/mm/yyyy)</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="28/04/2025"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tiết dạy</label>
                  <input
                    type="text"
                    value={eventPeriod}
                    onChange={(e) => setEventPeriod(e.target.value)}
                    placeholder="Tiết 1 - 2"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Lớp</label>
                  <select
                    value={eventClass}
                    onChange={(e) => setEventClass(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                  >
                    <option value="Lớp 12A1">Lớp 12A1</option>
                    <option value="Lớp 12A2">Lớp 12A2</option>
                    <option value="Lớp 12A3">Lớp 12A3</option>
                    <option value="Lớp 11A1">Lớp 11A1</option>
                    <option value="Lớp 10A1">Lớp 10A1</option>
                    <option value="Tổ Tin học">Tổ Tin học</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Màu đánh dấu</label>
                <div className="flex gap-4">
                  {(['cyan', 'yellow', 'red', 'blue'] as const).map((color) => (
                    <label key={color} className="flex items-center gap-1.5 cursor-pointer text-xs">
                      <input
                        type="radio"
                        name="color"
                        checked={eventColor === color}
                        onChange={() => setEventColor(color)}
                      />
                      <span
                        className={`w-3.5 h-3.5 rounded-full ${
                          color === 'cyan'
                            ? 'bg-[#00B8D9]'
                            : color === 'yellow'
                            ? 'bg-amber-400'
                            : color === 'red'
                            ? 'bg-rose-500'
                            : 'bg-[#0969DA]'
                        }`}
                      />
                      <span className="capitalize">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddEventModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0969DA] text-white rounded-lg hover:bg-[#073B7A] font-semibold"
                >
                  Lưu sự kiện
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Notification Modal */}
      {showAddNotifModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100">
            <h3 className="text-lg font-bold text-[#073B7A] mb-4">Tạo thông báo mới cho học sinh</h3>
            <form onSubmit={handleAddNotifSubmit} className="space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Tiêu đề thông báo</label>
                <textarea
                  required
                  rows={3}
                  value={notifTitle}
                  onChange={(e) => setNotifTitle(e.target.value)}
                  placeholder="Ví dụ: Nộp bài thực hành HTML số 2 trước 21h ngày 26/04..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Phân loại thông báo</label>
                <select
                  value={notifCategory}
                  onChange={(e) => setNotifCategory(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0969DA]"
                >
                  <option value="lesson">Bài học mới</option>
                  <option value="exam">Lịch kiểm tra</option>
                  <option value="assignment">Bài tập thực hành</option>
                  <option value="material">Tài liệu học tập</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddNotifModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0969DA] text-white rounded-lg hover:bg-[#073B7A] font-semibold"
                >
                  Đăng thông báo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </aside>
  );
};
