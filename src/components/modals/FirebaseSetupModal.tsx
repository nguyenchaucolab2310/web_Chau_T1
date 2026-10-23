import React from 'react';
import { Database, ShieldCheck, CheckCircle2, Cloud, HardDrive, X, Server } from 'lucide-react';

interface FirebaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSetupModal: React.FC<FirebaseSetupModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 font-serif space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2.5 text-[#073B7A]">
            <Database className="w-6 h-6 text-emerald-600" />
            <div>
              <h3 className="text-xl font-bold font-serif leading-tight">
                Trạng thái lưu trữ & Cơ sở dữ liệu
              </h3>
              <p className="text-xs text-slate-500">
                TIN HỌC SỐ – BÌNH THUẬN · Trường PT DTNT THPT Bình Thuận
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current status banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
            <span>Chế độ trải nghiệm hoàn chỉnh (LocalStorage Persistence)</span>
          </div>
          <p className="text-emerald-900 leading-relaxed font-serif">
            Hệ thống đang lưu trữ toàn bộ danh sách học sinh, bài học số, bài thực hành HTML/CSS, bài kiểm tra và lịch sử điểm số trực tiếp trên trình duyệt của Quý Thầy/Cô. Mọi thao tác thêm, sửa, xóa, nộp bài đều được ghi nhận tức thì và không bị mất khi tải lại trang!
          </p>
        </div>

        {/* Architecture schemas ready for Firebase Cloud Sync */}
        <div className="space-y-2">
          <h4 className="font-bold text-sm text-[#073B7A]">
            Cấu trúc phân hệ dữ liệu (Sẵn sàng đồng bộ Firebase Firestore):
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-[#0969DA]">users / roles</span>
              <p className="text-slate-500 text-[11px]">Tài khoản Giáo viên & Học sinh (Firebase Auth)</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-[#0969DA]">students & classes</span>
              <p className="text-slate-500 text-[11px]">Hồ sơ học sinh khối 10, 11, 12, mã định danh</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-[#0969DA]">lessons & practicals</span>
              <p className="text-slate-500 text-[11px]">Bài giảng số, bài thực hành HTML/CSS, bài nộp</p>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              <span className="font-bold text-[#0969DA]">quizzes & attempts</span>
              <p className="text-slate-500 text-[11px]">Đề kiểm tra trắc nghiệm, điểm tự động chấm</p>
            </div>
          </div>
        </div>

        {/* Security rules reassurance */}
        <div className="bg-[#F4F9FF] border border-[#DBE8F7] rounded-xl p-3 text-xs text-[#073B7A] space-y-1">
          <div className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-[#0969DA]" />
            <span>Quy tắc bảo mật và phân quyền học sinh:</span>
          </div>
          <p className="text-slate-600 leading-relaxed font-serif">
            Học sinh chỉ được phép xem bài học, làm bài tập và xem kết quả của chính mình; không thể xem hay chỉnh sửa thông tin hoặc điểm số của các bạn khác trong lớp.
          </p>
        </div>

        <div className="flex justify-end pt-3 border-t border-slate-100">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#0969DA] hover:bg-[#073B7A] text-white rounded-lg text-xs font-semibold"
          >
            Đã hiểu & Tiếp tục trải nghiệm
          </button>
        </div>
      </div>
    </div>
  );
};
