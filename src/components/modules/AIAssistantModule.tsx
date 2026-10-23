import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Bot,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  FileCode,
  UserCheck,
  AlertTriangle,
  RefreshCw,
  Copy,
  Check
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AIAssistantModule: React.FC = () => {
  const { currentRole, showToast } = useApp();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Xin chào Cô giáo và các bạn học sinh! Tôi là **TRỢ LÝ AI – TIN HỌC SỐ**, đồng hành cùng Trường PT DTNT THPT Bình Thuận.
Tôi có thể hỗ trợ:
- 💡 **Giáo viên**: Soạn giáo án, đề xuất câu hỏi trắc nghiệm, bài tập HTML/CSS/Python, phân tích học lực.
- 💻 **Học sinh**: Giải thích thẻ HTML, cú pháp CSS, thuật toán Python, sửa lỗi lập trình.

Hãy nhập câu hỏi bên dưới hoặc chọn một gợi ý nhanh để bắt đầu!`,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const teacherSuggestions = [
    'Soạn 3 câu hỏi trắc nghiệm về thẻ bảng <table> trong HTML5',
    'Gợi ý 1 bài tập thực hành Python về danh sách (List) cho học sinh lớp 12',
    'Đề xuất hoạt động khởi động 5 phút cho bài Cơ sở dữ liệu quan hệ SQL',
    'Phân tích cách bồi dưỡng học sinh có điểm thực hành dưới 6.5',
  ];

  const studentSuggestions = [
    'Giải thích sự khác nhau giữa thẻ <div> và thẻ <span> trong HTML',
    'Làm thế nào để căn giữa một khối hộp bằng CSS Flexbox?',
    'Cú pháp vòng lặp for trong Python duyệt qua chuỗi ký tự như thế nào?',
    'Khóa chính (Primary Key) trong SQL có tác dụng gì?',
  ];

  const activeSuggestions = currentRole === 'teacher' ? teacherSuggestions : studentSuggestions;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || inputValue).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          role: currentRole,
          history: messages.slice(-6).map((m) => ({
            sender: m.sender,
            text: m.text,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Lỗi kết nối tới Trợ lý AI.');
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.reply || 'Xin lỗi, tôi chưa thể trả lời câu hỏi này vào lúc này.',
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'ai',
        text: `⚠️ **Thông báo kết nối AI**: ${err?.message || 'Không thể kết nối đến Trợ lý AI.'}
*(Ghi chú: Đảm bảo GEMINI_API_KEY đã được cấp quyền trong hệ thống Settings > Secrets của Google AI Studio)*`,
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Đã sao chép phản hồi vào bộ nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-[#DBE8F7] shadow-xs flex flex-col h-[700px] overflow-hidden">
      {/* Top Header */}
      <div className="bg-gradient-to-r from-[#073B7A] via-[#0957B7] to-[#EB2F96] text-white p-3.5 px-5 flex items-center justify-between border-b border-[#DBE8F7]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shadow-inner">
            <Bot className="w-6 h-6 text-pink-200" />
          </div>
          <div>
            <h2 className="text-lg font-bold font-serif leading-tight">
              TRỢ LÝ AI – TIN HỌC SỐ
            </h2>
            <div className="flex items-center gap-2 text-xs text-blue-100">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Mô hình Gemini 3.8 Flash · Chế độ {currentRole === 'teacher' ? 'Giáo viên' : 'Học sinh'}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => {
            setMessages([messages[0]]);
            showToast('Đã làm mới phiên trò chuyện.');
          }}
          className="p-1.5 text-blue-100 hover:text-white hover:bg-white/10 rounded-lg transition"
          title="Bắt đầu lại cuộc hội thoại"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Suggestions Strip */}
      <div className="bg-[#F8FAFC] border-b border-slate-200 p-2.5 px-4 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] font-bold text-slate-500 whitespace-nowrap flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-pink-500" />
          Gợi ý nhanh:
        </span>
        {activeSuggestions.map((sug, i) => (
          <button
            key={i}
            disabled={isLoading}
            onClick={() => handleSend(sug)}
            className="text-xs bg-white hover:bg-blue-50 text-[#073B7A] border border-slate-200 rounded-full px-3 py-1 whitespace-nowrap transition cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 font-serif">
        {messages.map((msg) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isAi ? 'justify-start' : 'justify-end'}`}
            >
              {isAi && (
                <div className="w-8 h-8 rounded-lg bg-[#EB2F96]/10 border border-[#EB2F96]/30 text-[#EB2F96] flex items-center justify-center shrink-0 mt-0.5">
                  <Bot className="w-4.5 h-4.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 shadow-xs text-sm leading-relaxed ${
                  isAi
                    ? 'bg-[#F4F9FF] border border-[#DBE8F7] text-[#12305B]'
                    : 'bg-[#0969DA] text-white'
                }`}
              >
                <div className="whitespace-pre-line font-serif">{msg.text}</div>

                <div
                  className={`flex items-center justify-between text-[11px] mt-2 pt-1 border-t ${
                    isAi
                      ? 'border-[#DBE8F7]/60 text-slate-400'
                      : 'border-white/20 text-blue-100'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isAi && (
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="hover:text-[#0969DA] flex items-center gap-1 transition"
                      title="Sao chép câu trả lời"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600 text-[10px]">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span className="text-[10px]">Sao chép</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {!isAi && (
                <div className="w-8 h-8 rounded-lg bg-[#073B7A] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  {currentRole === 'teacher' ? 'GV' : 'HS'}
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#EB2F96]/10 border border-[#EB2F96]/30 text-[#EB2F96] flex items-center justify-center shrink-0">
              <Bot className="w-4.5 h-4.5 animate-spin" />
            </div>
            <div className="bg-[#F4F9FF] border border-[#DBE8F7] rounded-2xl p-3 text-xs text-slate-500 font-serif flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-pink-500 animate-ping" />
              <span>Trợ lý AI đang suy nghĩ và chuẩn bị nội dung sư phạm...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isLoading}
            placeholder={
              currentRole === 'teacher'
                ? 'Hỏi AI về soạn giáo án, câu hỏi trắc nghiệm Tin học, đề bài thực hành...'
                : 'Hỏi AI giải thích thẻ HTML, CSS, giải thuật Python, gỡ lỗi code...'
            }
            className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-serif text-[#12305B] focus:outline-none focus:ring-2 focus:ring-[#0969DA] shadow-xs disabled:bg-slate-100"
          />
          <button
            type="submit"
            disabled={isLoading || !inputValue.trim()}
            className="px-5 py-2.5 bg-[#0969DA] hover:bg-[#073B7A] disabled:bg-slate-300 text-white font-bold text-sm rounded-xl transition shadow-xs flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline">Gửi</span>
          </button>
        </form>
        <div className="text-[11px] text-slate-400 mt-1.5 text-center font-serif">
          Trợ lý AI tuân thủ quy tắc sư phạm: Không cung cấp sẵn đáp án bài kiểm tra đang mở. Mọi kiến thức do AI đề xuất cần giáo viên duyệt trước khi sử dụng chính thức.
        </div>
      </div>
    </div>
  );
};
