import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Gemini AI Assistant Endpoint
app.post('/api/gemini/chat', async (req, res) => {
  try {
    const { message, systemInstruction, history, role } = req.body;

    if (!message || typeof message !== 'string') {
      res.status(400).json({ error: 'Nội dung tin nhắn không hợp lệ' });
      return;
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      res.status(503).json({
        error: 'Chưa cấu hình GEMINI_API_KEY trong hệ thống. Vui lòng kiểm tra mục Settings > Secrets.',
        isConfigured: false,
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    const defaultSystem = `Bạn là "TRỢ LÝ AI – TIN HỌC SỐ", trợ lý giáo dục môn Tin học THPT (Lớp 10, 11, 12) của Trường PT DTNT THPT Bình Thuận, đồng hành cùng Cô giáo Nguyễn Thị Châu.
Quy tắc:
1. Trả lời bằng tiếng Việt chuẩn mực, sư phạm, truyền cảm hứng, dễ hiểu, sử dụng thuật ngữ chính xác trong chương trình Tin học THPT (HTML, CSS, Python, CSDL SQL, Mạng máy tính, Trí tuệ nhân tạo).
2. Khi người dùng là Giáo viên: Hỗ trợ soạn giáo án, câu hỏi trắc nghiệm kèm đáp án và giải thích, bài tập thực hành, đề kiểm tra, gợi ý phân hóa học sinh.
3. Khi người dùng là Học sinh: Giải thích ngắn gọn khái niệm, hướng dẫn phương pháp giải, chỉ ra lỗi sai trong cú pháp code (HTML/CSS/Python) kèm gợi ý sửa đổi.
4. QUAN TRỌNG: Tuyệt đối KHÔNG trực tiếp tiết lộ đáp án của các bài kiểm tra đang diễn ra nếu học sinh hỏi đề kiểm tra.
5. Định dạng câu trả lời rõ ràng bằng Markdown, có khối mã code đẹp mắt và chú thích từng dòng.`;

    const effectiveInstruction = systemInstruction || defaultSystem;

    // Build contents for gemini
    const contents: any[] = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const item of history.slice(-8)) {
        if (item.sender === 'user') {
          contents.push({ role: 'user', parts: [{ text: item.text }] });
        } else if (item.sender === 'ai' || item.sender === 'model') {
          contents.push({ role: 'model', parts: [{ text: item.text }] });
        }
      }
    }
    contents.push({ role: 'user', parts: [{ text: message }] });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction: effectiveInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'Xin lỗi, tôi chưa nhận được phản hồi phù hợp. Vui lòng thử lại câu hỏi.';
    res.json({ reply, isConfigured: true });
  } catch (error: any) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({
      error: error?.message || 'Có lỗi xảy ra khi kết nối tới Trợ lý AI.',
      isConfigured: true,
    });
  }
});

async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server TIN HỌC SỐ - BÌNH THUẬN running at http://localhost:${PORT}`);
  });
}

startServer();
