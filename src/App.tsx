/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { LessonsModule } from './components/modules/LessonsModule';
import { PracticalModule } from './components/modules/PracticalModule';
import { QuizzesModule } from './components/modules/QuizzesModule';
import { StudentsModule } from './components/modules/StudentsModule';
import { ResultsModule } from './components/modules/ResultsModule';
import { AIAssistantModule } from './components/modules/AIAssistantModule';
import { FirebaseSetupModal } from './components/modals/FirebaseSetupModal';
import { Database, RotateCcw, CheckCircle, Info, AlertCircle } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toast, resetAllDemoData } = useApp();
  const [isFirebaseModalOpen, setIsFirebaseModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F9FF] text-[#12305B] flex flex-col font-serif selection:bg-[#0969DA] selection:text-white">
      {/* 1. Header (Brand, search, notifications, profile) */}
      <Header onOpenFirebaseModal={() => setIsFirebaseModalOpen(true)} />

      {/* 2. Horizontal Navbar (6 tabs matching reference) */}
      <Navbar />

      {/* 3. Demo / Persistence Notice Ribbon */}
      <div className="bg-[#E6F4FF] border-b border-[#BFDBFE] text-[#073B7A] py-1.5 px-4 text-xs font-serif shadow-2xs">
        <div className="max-w-[1520px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <span>
              <strong>Chế độ trải nghiệm trực tiếp</strong> – Dữ liệu học sinh, bài thực hành và điểm số được lưu trên trình duyệt (LocalStorage).
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsFirebaseModalOpen(true)}
              className="hover:underline flex items-center gap-1 font-semibold text-[#0969DA]"
            >
              <Database className="w-3.5 h-3.5" />
              <span>Cấu trúc Firebase Cloud</span>
            </button>
            <span className="text-slate-300">|</span>
            <button
              onClick={resetAllDemoData}
              className="hover:text-rose-600 transition flex items-center gap-1 text-slate-500"
              title="Khôi phục lại dữ liệu mẫu gốc"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Khôi phục dữ liệu mẫu</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Main Viewport Area (Left Sidebar + Right Module Content) */}
      <main className="flex-1 max-w-[1520px] w-full mx-auto px-3 sm:px-6 py-5">
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          {/* LEFT SIDEBAR: Strictly positioned on the left (23% width) as requested */}
          <Sidebar />

          {/* RIGHT CONTENT REGION: Switches according to activeTab */}
          <div className="flex-1 w-full min-w-0">
            {activeTab === 'home' && <Dashboard />}
            {activeTab === 'lessons' && <LessonsModule />}
            {activeTab === 'practical' && <PracticalModule />}
            {activeTab === 'quizzes' && <QuizzesModule />}
            {activeTab === 'students' && <StudentsModule />}
            {activeTab === 'results' && <ResultsModule />}
            {activeTab === 'ai-assistant' && <AIAssistantModule />}
          </div>
        </div>
      </main>

      {/* 5. Footer */}
      <footer className="bg-white border-t border-[#DBE8F7] py-6 px-4 text-center text-xs text-slate-500 font-serif space-y-1.5 mt-8 no-print">
        <div className="max-w-[1520px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="text-slate-700">
            <strong>TIN HỌC SỐ – BÌNH THUẬN</strong> · Trường Phổ thông Dân tộc Nội trú THPT Tỉnh Bình Thuận
          </div>
          <div>
            Giáo viên phụ trách chuyên môn: <strong className="text-[#073B7A]">Nguyễn Thị Châu</strong>
          </div>
        </div>
        <div className="text-[11px] text-slate-400">
          Chương trình giáo dục môn Tin học THPT – Khối 10, 11, 12 · Tích hợp Trợ lý Trí tuệ Nhân tạo Gemini
        </div>
      </footer>

      {/* Toast Alert Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm font-serif font-semibold border ${
              toast.type === 'success'
                ? 'bg-emerald-600 text-white border-emerald-500'
                : toast.type === 'error'
                ? 'bg-rose-600 text-white border-rose-500'
                : 'bg-[#073B7A] text-white border-[#0969DA]'
            }`}
          >
            {toast.type === 'success' ? (
              <CheckCircle className="w-4 h-4 shrink-0" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 shrink-0" />
            ) : (
              <Info className="w-4 h-4 shrink-0" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Firebase Information Modal */}
      <FirebaseSetupModal
        isOpen={isFirebaseModalOpen}
        onClose={() => setIsFirebaseModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
