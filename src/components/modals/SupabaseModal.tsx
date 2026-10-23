import React, { useState, useEffect } from 'react';
import {
  Database,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  UploadCloud,
  DownloadCloud,
  X,
  Code2,
  Server,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { testSupabaseConnection, isSupabaseConfigured, ConnectionStatus } from '../../lib/supabase';
import { SUPABASE_SETUP_SQL } from '../../lib/supabaseSql';
import { SupabaseService } from '../../lib/supabaseService';
import { useApp } from '../../context/AppContext';

interface SupabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseModal: React.FC<SupabaseModalProps> = ({ isOpen, onClose }) => {
  const { students, lessons, submissions, quizzes, schedule, notifications, showToast, refreshFromSupabase } = useApp() as any;

  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'sync'>('status');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ConnectionStatus | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wanqgoqrcegkateqavll.supabase.co';
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_6-_TCW2nKPGGVa3HuLnV0w_Hd96WNPz';

  useEffect(() => {
    if (isOpen) {
      handleTestConnection();
    }
  }, [isOpen]);

  const handleTestConnection = async () => {
    setTesting(true);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        connected: false,
        message: err.message || 'Lỗi khi kiểm tra kết nối',
      });
    } finally {
      setTesting(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    showToast('Đã sao chép mã SQL vào bộ nhớ tạm!');
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleSyncToSupabase = async () => {
    setSyncing(true);
    try {
      const res = await SupabaseService.seedAllInitialData({
        students,
        lessons,
        submissions,
        quizzes,
        schedule,
        notifications,
      });
      if (res.success) {
        showToast(res.message, 'success');
        handleTestConnection();
      } else {
        showToast(res.message, 'error');
      }
    } catch (err: any) {
      showToast(`Lỗi đồng bộ: ${err.message}`, 'error');
    } finally {
      setSyncing(false);
    }
  };

  const handleFetchFromSupabase = async () => {
    if (refreshFromSupabase) {
      await refreshFromSupabase();
      showToast('Đã tải lại dữ liệu mới nhất từ Supabase!', 'success');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-100 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200">
          <div className="flex items-center gap-3 text-[#073B7A]">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#3ECF8E]/20 to-[#3ECF8E]/40 border border-[#3ECF8E]/50 flex items-center justify-center">
              <Database className="w-5 h-5 text-[#3ECF8E]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg sm:text-xl font-bold font-serif leading-tight">
                  Kết nối Cơ sở dữ liệu Supabase
                </h3>
                <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                  PostgreSQL
                </span>
              </div>
              <p className="text-xs text-slate-500">
                TIN HỌC SỐ – BÌNH THUẬN · Trường PT DTNT THPT Bình Thuận
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 pt-3 border-b border-slate-100 text-xs sm:text-sm">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'status'
                ? 'border-[#0969DA] text-[#0969DA]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Trạng thái & Cấu hình
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'sql'
                ? 'border-[#0969DA] text-[#0969DA]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Mã khởi tạo SQL (Schema)
          </button>
          <button
            onClick={() => setActiveTab('sync')}
            className={`pb-2.5 px-3 font-semibold border-b-2 transition ${
              activeTab === 'sync'
                ? 'border-[#0969DA] text-[#0969DA]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Đồng bộ dữ liệu
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs sm:text-sm">
          {activeTab === 'status' && (
            <div className="space-y-4">
              {/* Connection Status Box */}
              <div
                className={`p-4 rounded-xl border ${
                  testResult?.connected && testResult.tablesFound && testResult.tablesFound.length > 0
                    ? 'bg-emerald-50/80 border-emerald-200'
                    : testResult?.connected
                    ? 'bg-amber-50/80 border-amber-200'
                    : 'bg-rose-50/80 border-rose-200'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    {testResult?.connected && testResult.tablesFound && testResult.tablesFound.length > 0 ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    ) : testResult?.connected ? (
                      <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4
                        className={`font-bold text-sm ${
                          testResult?.connected && testResult.tablesFound && testResult.tablesFound.length > 0
                            ? 'text-emerald-900'
                            : testResult?.connected
                            ? 'text-amber-900'
                            : 'text-rose-900'
                        }`}
                      >
                        {testing
                          ? 'Đang kiểm tra kết nối Supabase...'
                          : testResult?.connected && testResult.tablesFound && testResult.tablesFound.length > 0
                          ? 'Supabase đã kết nối và sẵn sàng hoạt động!'
                          : testResult?.connected
                          ? 'Đã kết nối máy chủ Supabase (Cần chạy mã SQL)'
                          : 'Chưa thể kết nối tới Supabase'}
                      </h4>
                      <p
                        className={`mt-1 text-xs leading-relaxed ${
                          testResult?.connected && testResult.tablesFound && testResult.tablesFound.length > 0
                            ? 'text-emerald-800'
                            : testResult?.connected
                            ? 'text-amber-800'
                            : 'text-rose-800'
                        }`}
                      >
                        {testResult?.message ||
                          'Hệ thống đang tự động kết nối và đồng bộ dữ liệu hai chiều với đám mây Supabase.'}
                      </p>

                      {testResult?.tablesFound && testResult.tablesFound.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          {testResult.tablesFound.map((tbl) => (
                            <span
                              key={tbl}
                              className="bg-emerald-100 text-emerald-800 text-[11px] font-mono px-2 py-0.5 rounded-md"
                            >
                              ✓ {tbl}
                            </span>
                          ))}
                        </div>
                      )}

                      {testResult?.missingTables && testResult.missingTables.length > 0 && (
                        <div className="mt-2.5 flex flex-wrap gap-1.5">
                          <span className="text-[11px] text-amber-800 font-medium">Chưa có bảng:</span>
                          {testResult.missingTables.map((tbl) => (
                            <span
                              key={tbl}
                              className="bg-amber-100 text-amber-800 text-[11px] font-mono px-2 py-0.5 rounded-md"
                            >
                              ✗ {tbl}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shrink-0 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                    <span>Kiểm tra lại</span>
                  </button>
                </div>
              </div>

              {/* Credentials Details */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-600">
                  Thông số kết nối đã nạp
                </h4>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">Project URL:</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      readOnly
                      value={supabaseUrl}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 select-all"
                    />
                    <a
                      href="https://supabase.com/dashboard/project/wanqgoqrcegkateqavll"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-[#0969DA] hover:bg-blue-50 rounded-lg transition"
                      title="Mở Dashboard Supabase"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-600">API Key (anon / public):</label>
                  <div className="flex items-center gap-2">
                    <input
                      type={showKey ? 'text' : 'password'}
                      readOnly
                      value={supabaseAnonKey}
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-800 select-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowKey(!showKey)}
                      className="p-1.5 text-slate-500 hover:bg-slate-200 rounded-lg transition"
                      title={showKey ? 'Ẩn key' : 'Hiện key'}
                    >
                      {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Instructions Callout */}
              <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-3.5 text-xs text-[#073B7A] space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  <Server className="w-4 h-4 text-[#0969DA]" />
                  <span>Cách hoàn tất kết nối trong 1 phút:</span>
                </div>
                <ol className="list-decimal list-inside space-y-1 text-slate-700 leading-relaxed pl-1">
                  <li>
                    Chuyển sang tab <strong>"Mã khởi tạo SQL"</strong> bên trên và nhấn{' '}
                    <strong>"Sao chép toàn bộ SQL"</strong>.
                  </li>
                  <li>
                    Mở{' '}
                    <a
                      href="https://supabase.com/dashboard/project/wanqgoqrcegkateqavll/sql"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#0969DA] font-semibold underline inline-flex items-center gap-1"
                    >
                      Supabase SQL Editor <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>Dán mã vừa sao chép và bấm nút <strong>RUN</strong> để tạo bảng.</li>
                  <li>
                    Quay lại đây nhấn <strong>"Kiểm tra lại"</strong> và sang tab{' '}
                    <strong>"Đồng bộ dữ liệu"</strong> để tải dữ liệu mẫu lên Supabase!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">
                    Mã SQL tạo bảng (Schema DDL)
                  </h4>
                  <p className="text-xs text-slate-500">
                    Tạo 7 bảng: students, lessons, practical_submissions, quizzes, quiz_attempts, notifications, schedule_events
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm ${
                    copiedSql
                      ? 'bg-emerald-600 text-white'
                      : 'bg-[#0969DA] hover:bg-[#073B7A] text-white'
                  }`}
                >
                  {copiedSql ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'Đã sao chép!' : 'Sao chép toàn bộ SQL'}</span>
                </button>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-emerald-400 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed max-h-72 overflow-y-auto border border-slate-800">
                  {SUPABASE_SETUP_SQL}
                </pre>
              </div>

              <div className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-between">
                <span>Trực tiếp mở trình soạn thảo SQL trên dự án Supabase của bạn:</span>
                <a
                  href="https://supabase.com/dashboard/project/wanqgoqrcegkateqavll/sql/new"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0969DA] font-semibold hover:underline flex items-center gap-1 shrink-0"
                >
                  Mở New Query trên Supabase <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          )}

          {activeTab === 'sync' && (
            <div className="space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                <h4 className="font-bold text-sm text-[#073B7A]">
                  Đồng bộ dữ liệu hai chiều
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Bạn có thể đẩy toàn bộ danh sách học sinh, bài học, bài nộp thực hành và câu hỏi trắc nghiệm hiện có trong hệ thống lên máy chủ Supabase chỉ với một thao tác.
                </p>

                <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                  <button
                    onClick={handleSyncToSupabase}
                    disabled={syncing}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0969DA] hover:bg-[#073B7A] text-white rounded-lg text-xs font-semibold transition cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <UploadCloud className={`w-4 h-4 ${syncing ? 'animate-bounce' : ''}`} />
                    <span>{syncing ? 'Đang tải lên Supabase...' : 'Đẩy dữ liệu mẫu lên Supabase'}</span>
                  </button>

                  <button
                    onClick={handleFetchFromSupabase}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer shadow-xs"
                  >
                    <DownloadCloud className="w-4 h-4 text-[#0969DA]" />
                    <span>Tải lại dữ liệu từ Supabase</span>
                  </button>
                </div>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                <div className="bg-blue-50/60 p-2.5 rounded-lg border border-blue-100">
                  <div className="text-lg font-bold text-[#073B7A]">{students.length}</div>
                  <div className="text-slate-500 text-[11px]">Học sinh</div>
                </div>
                <div className="bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-100">
                  <div className="text-lg font-bold text-emerald-800">{lessons.length}</div>
                  <div className="text-slate-500 text-[11px]">Bài giảng</div>
                </div>
                <div className="bg-purple-50/60 p-2.5 rounded-lg border border-purple-100">
                  <div className="text-lg font-bold text-purple-800">{submissions.length}</div>
                  <div className="text-slate-500 text-[11px]">Bài thực hành</div>
                </div>
                <div className="bg-amber-50/60 p-2.5 rounded-lg border border-amber-100">
                  <div className="text-lg font-bold text-amber-800">{quizzes.length}</div>
                  <div className="text-slate-500 text-[11px]">Đề kiểm tra</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Kết nối bảo mật qua SSL & Anon Token</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
