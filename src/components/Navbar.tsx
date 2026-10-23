import React from 'react';
import { useApp, ActiveTab } from '../context/AppContext';
import { Home, BookOpen, Wrench, CheckSquare, Users, BarChart3, Bot } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab } = useApp();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Trang chủ', icon: <Home className="w-4 h-4" /> },
    { id: 'lessons', label: 'Bài học', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'practical', label: 'Thực hành', icon: <Wrench className="w-4 h-4" /> },
    { id: 'quizzes', label: 'Kiểm tra', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'students', label: 'Danh sách học sinh', icon: <Users className="w-4 h-4" /> },
    { id: 'results', label: 'Kết quả học tập', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <nav className="bg-[#073B7A] border-b border-[#0D4E9B] text-white shadow-sm sticky top-0 z-20">
      <div className="max-w-[1520px] mx-auto px-4 sm:px-6 flex items-center justify-between overflow-x-auto no-scrollbar">
        {/* Main 6 navigation buttons matching the reference image */}
        <div className="flex items-center gap-1.5 py-1.5 shrink-0">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0969DA] text-white shadow-md'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* AI Assistant Quick Tab on the far right */}
        <div className="py-1.5 shrink-0 pl-3">
          <button
            onClick={() => setActiveTab('ai-assistant')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer border ${
              activeTab === 'ai-assistant'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white border-transparent shadow'
                : 'bg-white/10 text-pink-200 border-pink-400/40 hover:bg-white/20 hover:text-white'
            }`}
          >
            <Bot className="w-4 h-4 text-pink-300" />
            <span>Trợ lý AI</span>
            <span className="text-[10px] bg-pink-500/80 px-1.5 py-0.2 rounded-full uppercase tracking-wider">
              Gemini
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
};
