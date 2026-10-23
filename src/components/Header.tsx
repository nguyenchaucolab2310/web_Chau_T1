import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, Bell, ChevronDown, Laptop, BookOpen, UserCheck, ShieldCheck, Database, LogOut } from 'lucide-react';

interface HeaderProps {
  onOpenSupabaseModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSupabaseModal }) => {
  const {
    currentRole,
    setCurrentRole,
    searchQuery,
    setSearchQuery,
    setActiveTab,
    notifications,
    markNotificationAsRead,
    showToast,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="relative bg-gradient-to-r from-[#073B7A] via-[#0957B7] to-[#0969DA] text-white shadow-md select-none overflow-visible z-30">
      {/* Decorative tech circuits and binary background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuits" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 10 10 L 30 10 L 30 30 M 50 30 L 50 50 L 30 50" fill="none" stroke="#ffffff" strokeWidth="1" />
              <circle cx="10" cy="10" r="2" fill="#00B8D9" />
              <circle cx="50" cy="50" r="2" fill="#00B8D9" />
              <circle cx="30" cy="30" r="2" fill="#ffffff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuits)" />
        </svg>
      </div>

      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 py-3 relative z-10 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left branding zone */}
        <div className="flex items-center gap-3.5 cursor-pointer" onClick={() => setActiveTab('home')}>
          {/* Laptop & Books Tech Icon Graphic */}
          <div className="relative w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00B8D9]/30 to-white/20 border border-white/30 backdrop-blur-sm flex items-center justify-center shadow-inner shrink-0">
            <Laptop className="w-6 h-6 text-white" />
            <span className="absolute -bottom-1 -right-1 bg-[#00B8D9] text-[#073B7A] text-[10px] font-bold px-1 rounded-full shadow">
              THPT
            </span>
          </div>

          <div>
            <h1 className="text-2xl lg:text-[28px] font-bold tracking-tight text-white leading-tight font-serif drop-shadow-sm">
              TIN HỌC SỐ – BÌNH THUẬN
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-blue-100 font-serif">
              <span>
                Giáo viên: <strong className="text-white font-semibold">Nguyễn Thị Châu</strong>
              </span>
              <span className="opacity-60">|</span>
              <span>
                Trường: <strong className="text-white font-semibold">PT DTNT THPT Bình Thuận</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Right tools zone */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          {/* Supabase Status Button */}
          <button
            onClick={onOpenSupabaseModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 hover:text-white text-xs font-semibold transition shrink-0 cursor-pointer shadow-sm"
            title="Quản lý và đồng bộ cơ sở dữ liệu Supabase"
          >
            <span className="w-2 h-2 rounded-full bg-[#3ECF8E] animate-pulse" />
            <Database className="w-3.5 h-3.5 text-[#3ECF8E]" />
            <span className="hidden sm:inline">Supabase</span>
          </button>

          {/* Search Bar */}
          <div className="relative w-full md:w-64 lg:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm bài học, tài liệu, học sinh..."
              className="w-full pl-9.5 pr-4 py-1.5 text-sm rounded-full bg-white text-[#12305B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00B8D9] shadow-sm transition"
            />
          </div>

          {/* Notification Button */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-full hover:bg-white/15 active:scale-95 transition text-white"
              title="Thông báo"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[11px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-[#0969DA] shadow-sm">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-[#12305B] rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="bg-[#073B7A] text-white px-4 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-sm">Thông báo của hệ thống</span>
                  <button
                    onClick={() => {
                      notifications.forEach(n => markNotificationAsRead(n.id));
                      showToast('Đã đánh dấu tất cả thông báo là đã đọc');
                    }}
                    className="text-xs text-[#00B8D9] hover:underline"
                  >
                    Đọc tất cả
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-slate-500">Chưa có thông báo nào</div>
                  ) : (
                    notifications.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => markNotificationAsRead(item.id)}
                        className={`p-3 text-sm cursor-pointer hover:bg-blue-50/70 transition ${
                          !item.isRead ? 'bg-blue-50/40 font-semibold' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                          <span className="flex items-center gap-1.5">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                item.color === 'yellow'
                                  ? 'bg-amber-400'
                                  : item.color === 'red'
                                  ? 'bg-rose-500'
                                  : item.color === 'green'
                                  ? 'bg-emerald-500'
                                  : 'bg-blue-500'
                              }`}
                            />
                            <span>Tin học THPT</span>
                          </span>
                          <span>{item.date}</span>
                        </div>
                        <p className="text-slate-800 text-xs sm:text-sm">{item.title}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full hover:bg-white/15 active:scale-95 transition text-left"
            >
              {/* Teacher Avatar Image / SVG */}
              <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white/80 bg-gradient-to-tr from-amber-200 to-amber-400 flex items-center justify-center text-slate-800 font-bold text-sm shadow">
                {currentRole === 'teacher' ? (
                  <span className="text-[#073B7A]">NC</span>
                ) : (
                  <span className="text-[#0969DA]">VA</span>
                )}
              </div>
              <div className="hidden sm:block text-left leading-tight">
                <div className="text-xs font-semibold text-white truncate max-w-[120px]">
                  {currentRole === 'teacher' ? 'Nguyễn Thị Châu' : 'Nguyễn Văn An'}
                </div>
                <div className="text-[11px] text-blue-200">
                  {currentRole === 'teacher' ? 'Giáo viên' : 'Học sinh (12A1)'}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-[#12305B] rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                <div className="p-3 bg-slate-50 border-b border-slate-100">
                  <div className="text-xs text-slate-500">Đang hoạt động với vai trò:</div>
                  <div className="font-bold text-sm text-[#073B7A]">
                    {currentRole === 'teacher' ? 'Cô giáo Nguyễn Thị Châu' : 'Học sinh: Nguyễn Văn An'}
                  </div>
                  <div className="text-xs text-slate-500">Trường PT DTNT THPT Bình Thuận</div>
                </div>

                <div className="p-2 space-y-1">
                  <button
                    onClick={() => {
                      const next = currentRole === 'teacher' ? 'student' : 'teacher';
                      setCurrentRole(next);
                      setShowUserMenu(false);
                      showToast(`Đã chuyển sang giao diện: ${next === 'teacher' ? 'Giáo viên' : 'Học sinh'}`);
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-blue-50 text-[#0969DA] transition text-left"
                  >
                    <UserCheck className="w-4 h-4" />
                    <span>
                      Chuyển sang vai: <strong>{currentRole === 'teacher' ? 'Học sinh' : 'Giáo viên'}</strong>
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      onOpenSupabaseModal();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg hover:bg-slate-100 text-slate-700 transition text-left"
                  >
                    <Database className="w-4 h-4 text-emerald-600" />
                    <span>Trạng thái kết nối Supabase</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
