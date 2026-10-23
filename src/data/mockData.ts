import { Student, Lesson, PracticalExercise, PracticalSubmission, Quiz, ScheduleEvent, NotificationItem, ActivityItem } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'HS1201',
    name: 'Nguyễn Văn An',
    class: '12A1',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 8.5,
    practicalScore: 9.0,
    rating: 'Giỏi',
    teacherNotes: 'Tư duy thuật toán tốt, tích cực phát biểu, hỗ trợ bạn học.',
    email: 'vanan.ptdtnt@gmail.com',
  },
  {
    id: 'HS1202',
    name: 'Trần Thị Bích Ngọc',
    class: '12A1',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 7.0,
    practicalScore: 8.0,
    rating: 'Khá',
    teacherNotes: 'Chăm chỉ, thực hành HTML/CSS cẩn thận, cần luyện thêm vòng lặp Python.',
    email: 'bichngoc.ptdtnt@gmail.com',
  },
  {
    id: 'HS1203',
    name: 'Lê Minh Khang',
    class: '12A2',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 9.0,
    practicalScore: 8.5,
    rating: 'Giỏi',
    teacherNotes: 'Kỹ năng lập trình web sáng tạo, nộp bài đúng hạn.',
    email: 'minhkhang.ptdtnt@gmail.com',
  },
  {
    id: 'HS1204',
    name: 'Phạm Thị Yến Nhi',
    class: '12A2',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 6.5,
    practicalScore: 7.0,
    rating: 'Khá',
    teacherNotes: 'Nắm chắc kiến thức cơ bản, cần tăng tốc độ làm bài trắc nghiệm.',
    email: 'yennhi.ptdtnt@gmail.com',
  },
  {
    id: 'HS1205',
    name: 'Hoàng Gia Bảo',
    class: '12A3',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 8.0,
    practicalScore: 9.5,
    rating: 'Giỏi',
    teacherNotes: 'Rất xuất sắc phần thực hành CSS và thiết kế giao diện web.',
    email: 'giabao.ptdtnt@gmail.com',
  },
  {
    id: 'HS1206',
    name: 'Đặng Thanh Tùng',
    class: '12A1',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 7.5,
    practicalScore: 8.0,
    rating: 'Khá',
    teacherNotes: 'Có tiến bộ rõ rệt trong kỹ năng viết hàm Python.',
    email: 'thanhtung.ptdtnt@gmail.com',
  },
  {
    id: 'HS1207',
    name: 'Võ Mai Phương',
    class: '12A2',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 8.8,
    practicalScore: 9.0,
    rating: 'Giỏi',
    teacherNotes: 'Cẩn thận, bài thực hành có bố cục đẹp và đúng chuẩn chuẩn SEO/Accessibility.',
    email: 'maiphuong.ptdtnt@gmail.com',
  },
  {
    id: 'HS1208',
    name: 'Ngô Quốc Huy',
    class: '12A3',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 6.0,
    practicalScore: 6.5,
    rating: 'Trung bình',
    teacherNotes: 'Cần kèm cặp thêm về câu lệnh truy vấn SQL SELECT lồng nhau.',
    email: 'quochuy.ptdtnt@gmail.com',
  },
  {
    id: 'HS1101',
    name: 'Bùi Anh Tuấn',
    class: '11A1',
    grade: 11,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 8.5,
    practicalScore: 8.5,
    rating: 'Giỏi',
    teacherNotes: 'Học sinh giỏi cấp trường bộ môn Tin học, tư duy logic cao.',
    email: 'anhtuan.ptdtnt@gmail.com',
  },
  {
    id: 'HS1102',
    name: 'Lương Thu Trang',
    class: '11A1',
    grade: 11,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 7.5,
    practicalScore: 7.5,
    rating: 'Khá',
    teacherNotes: 'Nắm vững kiến thức hệ điều hành và an toàn thông tin.',
    email: 'thutrang.ptdtnt@gmail.com',
  },
  {
    id: 'HS1001',
    name: 'Nguyễn Hữu Đạt',
    class: '10A1',
    grade: 10,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 9.0,
    practicalScore: 9.0,
    rating: 'Giỏi',
    teacherNotes: 'Đam mê lập trình từ cấp 2, thao tác máy tính rất nhanh nhẹn.',
    email: 'huudat.ptdtnt@gmail.com',
  },
  {
    id: 'HS1002',
    name: 'Trương Khánh Linh',
    class: '10A1',
    grade: 10,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 7.0,
    practicalScore: 8.0,
    rating: 'Khá',
    teacherNotes: 'Chủ động trong giờ học, tích cực đóng góp cho hoạt động nhóm.',
    email: 'khanhlinh.ptdtnt@gmail.com',
  },
  {
    id: 'HS1209',
    name: 'Đỗ Minh Trí',
    class: '12A1',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 8.0,
    practicalScore: 8.5,
    rating: 'Giỏi',
    teacherNotes: 'Làm bài tập lớn xây dựng website cá nhân rất ấn tượng.',
    email: 'minhtri.ptdtnt@gmail.com',
  },
  {
    id: 'HS1210',
    name: 'Dương Thảo My',
    class: '12A3',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 7.2,
    practicalScore: 8.2,
    rating: 'Khá',
    teacherNotes: 'Có năng khiếu mỹ thuật và thẩm mỹ phối màu trong CSS.',
    email: 'thaomy.ptdtnt@gmail.com',
  },
  {
    id: 'HS1211',
    name: 'Lâm Hải Đăng',
    class: '12A2',
    grade: 12,
    academicYear: '2024-2025',
    status: 'Đang học',
    examScore: 8.2,
    practicalScore: 8.8,
    rating: 'Giỏi',
    teacherNotes: 'Hoàn thành bài tập nâng cao về API và cấu trúc dữ liệu.',
    email: 'haidang.ptdtnt@gmail.com',
  }
];

export const INITIAL_LESSONS: Lesson[] = [
  {
    id: 'lesson-python-basic',
    code: 'Bài 5',
    title: 'Lập trình Python cơ bản',
    grade: 12,
    topic: 'Lập trình có cấu trúc với Python',
    targetClasses: ['12A1', '12A2', '12A3'],
    objectives: [
      'Hiểu cú pháp khai báo biến, kiểu dữ liệu trong Python',
      'Sử dụng thành thạo cấu trúc rẽ nhánh if - elif - else',
      'Vận dụng vòng lặp for và while để giải quyết bài toán tính tổng và duyệt mảng',
      'Viết được chương trình đơn giản nhập xuất dữ liệu từ bàn phím'
    ],
    content: `## 1. Giới thiệu ngôn ngữ Python
Python là ngôn ngữ lập trình bậc cao, thông dịch, hướng đối tượng với cú pháp rõ ràng, súc tích và dễ học.
Trong chương trình Tin học 12, Python được sử dụng để phát triển tư duy thuật toán và lập trình ứng dụng.

### Cú pháp cơ bản:
- Không sử dụng dấu chấm phẩy \`;\` ở cuối câu lệnh
- Sử dụng **thụt đầu dòng (indentation)** gồm 4 khoảng trắng để xác định khối lệnh (thay cho cặp ngoặc nhọn \`{}\` trong C/Java)
- Phân biệt chữ hoa chữ thường (case-sensitive)

## 2. Kiểu dữ liệu và biến
\`\`\`python
# Khai báo biến
ho_ten = "Nguyễn Văn An"    # Kiểu chuỗi ký tự (str)
tuoi = 18                    # Kiểu số nguyên (int)
diem_tb = 8.5                # Kiểu số thực (float)
la_doan_vien = True          # Kiểu logic (bool)

print(f"Học sinh: {ho_ten}, Điểm: {diem_tb}")
\`\`\`

## 3. Cấu trúc rẽ nhánh
\`\`\`python
diem = float(input("Nhập điểm kiểm tra Tin học: "))
if diem >= 8.0:
    print("Xếp loại Giỏi")
elif diem >= 6.5:
    print("Xếp loại Khá")
elif diem >= 5.0:
    print("Xếp loại Trung bình")
else:
    print("Cần cố gắng thêm!")
\`\`\``,
    codeExamples: [
      {
        language: 'python',
        code: `def tinh_giai_thua(n):\n    if n == 0 or n == 1:\n        return 1\n    return n * tinh_giai_thua(n - 1)\n\nprint("5! =", tinh_giai_thua(5))`,
        explanation: 'Hàm tính giai thừa sử dụng đệ quy trong Python.'
      }
    ],
    attachments: [
      { name: 'Slide_Bai5_Lap_trinh_Python.pdf', type: 'pdf', url: '#' },
      { name: 'Bai_tap_thuc_hanh_Python.docx', type: 'doc', url: '#' }
    ],
    videoEmbedUrl: 'https://www.youtube-nocookie.com/embed/kqtD5dpn9C8',
    status: 'published',
    updatedAt: '2025-04-20'
  },
  {
    id: 'lesson-html-css-intro',
    code: 'Bài 3',
    title: 'Thiết kế web với HTML/CSS',
    grade: 12,
    topic: 'Phát triển trang web cá nhân',
    targetClasses: ['12A1', '12A2', '12A3'],
    objectives: [
      'Nắm vững cấu trúc cơ bản của tài liệu HTML5 (<!DOCTYPE html>, <html>, <head>, <body>)',
      'Sử dụng các thẻ định dạng tiêu đề (h1-h6), đoạn văn (p), danh sách (ul, ol, li)',
      'Chèn hình ảnh (img), liên kết (a) và bảng dữ liệu (table)',
      'Áp dụng CSS để phối màu, chỉnh phông chữ, định dạng khung và canh lề'
    ],
    content: `## 1. Cấu trúc một trang HTML chuẩn
HTML (HyperText Markup Language) là ngôn ngữ đánh dấu siêu văn bản, tạo nên khung xương của mọi website trên Internet.

\`\`\`html
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <title>Trang cá nhân của em</title>
</head>
<body>
  <h1>Xin chào thế giới!</h1>
  <p>Em là học sinh trường PT DTNT THPT Bình Thuận.</p>
</body>
</html>
\`\`\`

## 2. Các thẻ cơ bản
- \`<h1>\` đến \`<h6>\`: Thẻ tiêu đề từ lớn nhất đến nhỏ nhất
- \`<p>\`: Đoạn văn bản
- \`<a href="...">\`: Liên kết chuyển trang
- \`<img src="..." alt="...">\`: Chèn hình ảnh
- \`<ul>\` / \`<ol>\` kết hợp \`<li>\`: Danh sách không thứ tự / có thứ tự
- \`<table>\`, \`<tr>\`, \`<th>\`, \`<td>\`: Bảng dữ liệu

## 3. Định dạng bằng CSS
CSS (Cascading Style Sheets) giúp trang web có giao diện đẹp mắt, màu sắc hài hòa và bố cục chuyên nghiệp.
\`\`\`css
body {
  font-family: 'Times New Roman', serif;
  background-color: #f4f9ff;
  color: #12305b;
}
h1 {
  color: #073b7a;
  text-align: center;
}
\`\`\``,
    codeExamples: [
      {
        language: 'html',
        code: `<div class="card">\n  <h2>Lớp 12A1 - THPT Bình Thuận</h2>\n  <p>Bộ môn: Tin học Số</p>\n</div>`,
        explanation: 'Khối thẻ div chứa tiêu đề và đoạn văn bản.'
      }
    ],
    attachments: [
      { name: 'So_tay_the_HTML5_CSS3.pdf', type: 'pdf', url: '#' },
      { name: 'Mau_trang_web_ca_nhan.zip', type: 'doc', url: '#' }
    ],
    status: 'published',
    updatedAt: '2025-04-18'
  },
  {
    id: 'lesson-sql-db',
    code: 'Bài 7',
    title: 'Cơ sở dữ liệu và SQL',
    grade: 12,
    topic: 'Hệ quản trị CSDL quan hệ',
    targetClasses: ['12A1', '12A2', '12A3'],
    objectives: [
      'Hiểu khái niệm bảng (table), trường (field/column), bản ghi (record/row)',
      'Nắm vững khái niệm khóa chính (Primary Key) và khóa ngoại (Foreign Key)',
      'Viết được câu lệnh truy vấn dữ liệu SELECT với các mệnh đề WHERE, ORDER BY, GROUP BY'
    ],
    content: `## 1. Cơ sở dữ liệu quan hệ (RDBMS)
Cơ sở dữ liệu là tập hợp dữ liệu có cấu trúc được lưu trữ một cách có tổ chức trên máy tính để có thể dễ dàng truy xuất, cập nhật và quản lý.

## 2. Ngôn ngữ truy vấn SQL
SQL (Structured Query Language) là ngôn ngữ tiêu chuẩn để thao tác với cơ sở dữ liệu quan hệ.

### Ví dụ tạo bảng Học sinh:
\`\`\`sql
CREATE TABLE HocSinh (
    MaHS VARCHAR(10) PRIMARY KEY,
    HoTen NVARCHAR(50) NOT NULL,
    Lop VARCHAR(10),
    DiemTinHoc FLOAT
);
\`\`\`

### Ví dụ truy vấn lọc học sinh khá giỏi:
\`\`\`sql
SELECT MaHS, HoTen, Lop, DiemTinHoc
FROM HocSinh
WHERE DiemTinHoc >= 8.0
ORDER BY DiemTinHoc DESC;
\`\`\``,
    attachments: [
      { name: 'Giao_trinh_SQL_co_ban_THPT.pdf', type: 'pdf', url: '#' }
    ],
    status: 'published',
    updatedAt: '2025-04-15'
  },
  {
    id: 'lesson-ai-intro',
    code: 'Bài 8',
    title: 'Trí tuệ nhân tạo trong Tin học',
    grade: 12,
    topic: 'Xu hướng công nghệ số & AI',
    targetClasses: ['12A1', '12A2', '12A3'],
    objectives: [
      'Hiểu các khái niệm cơ bản về Trí tuệ nhân tạo (AI), Học máy (Machine Learning)',
      'Nhận biết ứng dụng của AI trong đời sống: thị giác máy tính, xử lý ngôn ngữ tự nhiên, trợ lý ảo',
      'Thảo luận về đạo đức và trách nhiệm khi sử dụng công nghệ số và AI'
    ],
    content: `## 1. Trí tuệ nhân tạo là gì?
Trí tuệ nhân tạo (Artificial Intelligence - AI) là ngành khoa học máy tính nghiên cứu cách làm cho máy móc có khả năng mô phỏng các hoạt động trí tuệ của con người như học hỏi, suy luận, nhận biết và giải quyết vấn đề.

## 2. Ứng dụng tiêu biểu
- **Xử lý ngôn ngữ tự nhiên**: Dịch máy, tóm tắt văn bản, trợ lý AI hỗ trợ học tập
- **Thị giác máy tính**: Nhận diện khuôn mặt, chẩn đoán hình ảnh y khoa, xe tự hành
- **Hệ thống gợi ý**: Đề xuất khóa học, sách giáo khoa, bài tập phù hợp năng lực học sinh

## 3. Trách nhiệm học sinh trong kỷ nguyên AI
- Sử dụng AI như một công cụ hỗ trợ tư duy, không sao chép nguyên văn
- Đảm bảo tính trung thực trong học tập và kiểm tra
- Bảo vệ dữ liệu cá nhân trên không gian mạng`,
    attachments: [
      { name: 'Chuyen_de_AI_va_Xa_hoi_so.pdf', type: 'pdf', url: '#' }
    ],
    status: 'published',
    updatedAt: '2025-04-12'
  },
  {
    id: 'lesson-grade11-network',
    code: 'Bài 4',
    title: 'Mạng máy tính và Internet',
    grade: 11,
    topic: 'Hạ tầng mạng & truyền thông',
    targetClasses: ['11A1'],
    objectives: [
      'Phân biệt mạng cục bộ (LAN) và mạng diện rộng (WAN)',
      'Hiểu địa chỉ IP, tên miền (Domain Name) và giao thức TCP/IP',
      'Biết cách chia sẻ tài nguyên và bảo vệ máy tính khi kết nối Internet'
    ],
    content: `Nội dung bài học về cấu trúc mạng máy tính, thiết bị mạng (Router, Switch, Modem) và các dịch vụ Internet phổ biến.`,
    status: 'published',
    updatedAt: '2025-04-10'
  },
  {
    id: 'lesson-grade10-info',
    code: 'Bài 1',
    title: 'Thông tin và xử lý thông tin',
    grade: 10,
    topic: 'Khoa học máy tính đại cương',
    targetClasses: ['10A1'],
    objectives: [
      'Phân biệt dữ liệu, thông tin và tri thức',
      'Hiểu mô hình xử lý thông tin của máy tính: Đầu vào -> Xử lý -> Đầu ra -> Lưu trữ'
    ],
    content: `Bài học mở đầu môn Tin học 10 giúp học sinh tiếp cận thế giới số một cách khoa học và hệ thống.`,
    status: 'published',
    updatedAt: '2025-04-05'
  }
];

export const INITIAL_PRACTICAL_EXERCISES: PracticalExercise[] = [
  {
    id: 'ex-1-text-formatting',
    title: '1. Định dạng văn bản trong HTML',
    grade: 12,
    difficulty: 'Cơ bản',
    description: 'Tạo một đoạn văn bản giới thiệu bản thân sử dụng các thẻ định dạng in đậm (<b>, <strong>), in nghiêng (<i>, <em>) và gạch chân (<u>).',
    requirements: [
      'Sử dụng ít nhất một thẻ tiêu đề <h2>',
      'Có ít nhất 1 thẻ đoạn văn <p>',
      'Chứa từ in đậm bằng <strong> hoặc <b>',
      'Chứa từ in nghiêng bằng <em> hoặc <i>'
    ],
    starterHtml: `<h2>Giới thiệu bản thân</h2>\n<p>Xin chào! Em tên là <strong>Nguyễn Văn An</strong>, học sinh lớp <em>12A1</em>.</p>\n<p>Em rất đam mê môn <b>Tin học</b> và thích lập trình trang web!</p>`,
    starterCss: `body {\n  font-family: 'Times New Roman', serif;\n  padding: 16px;\n  background-color: #ffffff;\n  color: #12305b;\n}\nh2 {\n  color: #073b7a;\n  border-bottom: 2px solid #dbe8f7;\n  padding-bottom: 6px;\n}\np {\n  font-size: 16px;\n  line-height: 1.6;\n}`,
    tests: [
      { description: 'Có thẻ tiêu đề h2', checkFnCode: 'html.includes("<h2")' },
      { description: 'Có đoạn văn p', checkFnCode: 'html.includes("<p")' },
      { description: 'Có định dạng in đậm (strong hoặc b)', checkFnCode: 'html.includes("<strong") || html.includes("<b")' },
      { description: 'Có định dạng in nghiêng (em hoặc i)', checkFnCode: 'html.includes("<em") || html.includes("<i")' }
    ]
  },
  {
    id: 'ex-2-headings-paragraphs',
    title: '2. Tạo tiêu đề và đoạn văn',
    grade: 12,
    difficulty: 'Cơ bản',
    description: 'Xây dựng trang tin tức ngắn về Trường PT DTNT THPT Bình Thuận với tiêu đề cấp 1, cấp 2 và các đoạn văn miêu tả.',
    requirements: [
      'Có thẻ <h1> mang nội dung về trường',
      'Có ít nhất hai thẻ <h2> cho các mục nội dung',
      'Có ít nhất hai thẻ <p> trình bày thông tin chi tiết'
    ],
    starterHtml: `<h1>Trường PT DTNT THPT Bình Thuận</h1>\n<h2>Giới thiệu chung</h2>\n<p>Trường là cái nôi nuôi dưỡng và chắp cánh ước mơ cho con em đồng bào các dân tộc thiểu số tại tỉnh Bình Thuận.</p>\n<h2>Hoạt động Tin học</h2>\n<p>Học sinh tích cực tham gia câu lạc bộ Tin học số, học lập trình Python và thiết kế trang web.</p>`,
    starterCss: `body {\n  font-family: 'Times New Roman', serif;\n  padding: 20px;\n  background: #f8fafc;\n}\nh1 {\n  color: #073b7a;\n  text-align: center;\n}\nh2 {\n  color: #0969da;\n  margin-top: 16px;\n}\np {\n  color: #334155;\n  line-height: 1.6;\n}`,
    tests: [
      { description: 'Có thẻ h1', checkFnCode: 'html.includes("<h1")' },
      { description: 'Có từ 2 thẻ h2 trở lên', checkFnCode: '(html.match(/<h2/g) || []).length >= 2' },
      { description: 'Có từ 2 thẻ p trở lên', checkFnCode: '(html.match(/<p/g) || []).length >= 2' }
    ]
  },
  {
    id: 'ex-3-html-lists',
    title: '3. Tạo danh sách HTML',
    grade: 12,
    difficulty: 'Cơ bản',
    description: 'Tạo danh sách các môn học yêu thích (danh sách có thứ tự <ol>) và các thiết bị phần cứng máy tính (danh sách không thứ tự <ul>).',
    requirements: [
      'Sử dụng thẻ danh sách có thứ tự <ol> với ít nhất 3 mục <li>',
      'Sử dụng thẻ danh sách không thứ tự <ul> với ít nhất 3 mục <li>'
    ],
    starterHtml: `<h3>Các môn học yêu thích</h3>\n<ol>\n  <li>Tin học THPT</li>\n  <li>Toán học</li>\n  <li>Vật lý</li>\n</ol>\n\n<h3>Thiết bị máy tính</h3>\n<ul>\n  <li>Bộ xử lý CPU</li>\n  <li>Bộ nhớ RAM</li>\n  <li>Ổ cứng SSD</li>\n</ul>`,
    starterCss: `body {\n  font-family: 'Times New Roman', serif;\n  padding: 16px;\n}\nh3 {\n  color: #073b7a;\n}\nol, ul {\n  padding-left: 24px;\n  line-height: 1.8;\n}`,
    tests: [
      { description: 'Có thẻ <ol>', checkFnCode: 'html.includes("<ol")' },
      { description: 'Có thẻ <ul>', checkFnCode: 'html.includes("<ul")' },
      { description: 'Có ít nhất 6 thẻ <li>', checkFnCode: '(html.match(/<li/g) || []).length >= 6' }
    ]
  },
  {
    id: 'ex-4-images-links',
    title: '4. Chèn hình ảnh và liên kết',
    grade: 12,
    difficulty: 'Trung bình',
    description: 'Chèn hình ảnh minh họa máy tính và tạo liên kết chuyển hướng đến trang web học tập kèm thuộc tính alt đầy đủ.',
    requirements: [
      'Sử dụng thẻ <img> có thuộc tính src và alt',
      'Sử dụng thẻ <a> có thuộc tính href và target="_blank"'
    ],
    starterHtml: `<div class="container">\n  <h2>Khám phá Thế giới số</h2>\n  <img src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500" alt="Máy tính xách tay và mã lập trình" class="banner-img" />\n  <p>Nhấn vào liên kết bên dưới để tìm hiểu thêm:</p>\n  <a href="https://moet.gov.vn" target="_blank" class="btn-link">Cổng thông tin Bộ Giáo dục & Đào tạo</a>\n</div>`,
    starterCss: `body {\n  font-family: 'Times New Roman', serif;\n  padding: 16px;\n}\n.container {\n  max-width: 500px;\n  margin: 0 auto;\n  text-align: center;\n}\n.banner-img {\n  width: 100%;\n  border-radius: 8px;\n  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);\n}\n.btn-link {\n  display: inline-block;\n  margin-top: 12px;\n  padding: 8px 16px;\n  background: #0969da;\n  color: white;\n  text-decoration: none;\n  border-radius: 6px;\n}`,
    tests: [
      { description: 'Có thẻ <img> với alt', checkFnCode: 'html.includes("<img") && html.includes("alt=")' },
      { description: 'Có thẻ <a> với href', checkFnCode: 'html.includes("<a") && html.includes("href=")' }
    ]
  },
  {
    id: 'ex-5-html-table',
    title: '5. Tạo bảng HTML (Thời khóa biểu)',
    grade: 12,
    difficulty: 'Trung bình',
    description: 'Thiết kế bảng thời khóa biểu buổi sáng của lớp với các cột Thứ, Tiết, Môn học, Giáo viên giảng dạy.',
    requirements: [
      'Sử dụng thẻ <table>, <tr>, <th> và <td>',
      'Có ít nhất 1 dòng tiêu đề <th> và 3 dòng dữ liệu <tr>',
      'Định dạng viền bảng bằng CSS border-collapse'
    ],
    starterHtml: `<h2>Thời khóa biểu tuần này</h2>\n<table class="schedule-table">\n  <thead>\n    <tr>\n      <th>Thứ</th>\n      <th>Tiết</th>\n      <th>Môn học</th>\n      <th>Giáo viên</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td>Thứ Ba</td>\n      <td>1 - 2</td>\n      <td>Tin học (Python)</td>\n      <td>Nguyễn Thị Châu</td>\n    </tr>\n    <tr>\n      <td>Thứ Tư</td>\n      <td>3 - 4</td>\n      <td>Thực hành Web</td>\n      <td>Nguyễn Thị Châu</td>\n    </tr>\n    <tr>\n      <td>Thứ Năm</td>\n      <td>2</td>\n      <td>Kiểm tra giữa kỳ</td>\n      <td>Nguyễn Thị Châu</td>\n    </tr>\n  </tbody>\n</table>`,
    starterCss: `body {\n  font-family: 'Times New Roman', serif;\n  padding: 16px;\n}\n.schedule-table {\n  width: 100%;\n  border-collapse: collapse;\n  margin-top: 12px;\n}\n.schedule-table th, .schedule-table td {\n  border: 1px solid #dbe8f7;\n  padding: 10px;\n  text-align: left;\n}\n.schedule-table th {\n  background-color: #073b7a;\n  color: white;\n}\n.schedule-table tr:nth-child(even) {\n  background-color: #f4f9ff;\n}`,
    tests: [
      { description: 'Có thẻ <table>', checkFnCode: 'html.includes("<table")' },
      { description: 'Có thẻ <th>', checkFnCode: 'html.includes("<th")' },
      { description: 'Có ít nhất 3 dòng <tr> trong tbody', checkFnCode: '(html.match(/<tr/g) || []).length >= 4' }
    ]
  },
  {
    id: 'ex-6-web-layout',
    title: '6. Thiết kế trang web hoàn chỉnh bằng HTML/CSS',
    grade: 12,
    difficulty: 'Nâng cao',
    description: 'Tạo một trang web giới thiệu "Tin Học Số - Bình Thuận" gồm thanh điều hướng (header), banner chào mừng và 3 thẻ dịch vụ thông tin.',
    requirements: [
      'Có phần header chứa tiêu đề trang',
      'Có khung banner nổi bật',
      'Có bố cục lưới flexbox hoặc grid chứa 3 thẻ thông tin',
      'Sử dụng màu sắc hài hòa với CSS'
    ],
    starterHtml: `<header class="site-header">\n  <div class="logo">TIN HỌC SỐ</div>\n  <nav class="nav-links">\n    <a href="#">Trang chủ</a>\n    <a href="#">Bài học</a>\n    <a href="#">Liên hệ</a>\n  </nav>\n</header>\n\n<section class="hero">\n  <h1>Chào mừng đến với Tin học Số - Bình Thuận</h1>\n  <p>Cùng học - Cùng thực hành - Cùng khám phá thế giới số</p>\n</section>\n\n<div class="card-grid">\n  <div class="card">\n    <h3>Lập trình Python</h3>\n    <p>Thuật toán & tư duy giải quyết vấn đề</p>\n  </div>\n  <div class="card">\n    <h3>Thiết kế Web</h3>\n    <p>HTML5, CSS3 hiện đại và trực quan</p>\n  </div>\n  <div class="card">\n    <h3>Cơ sở dữ liệu</h3>\n    <p>Truy vấn SQL và hệ quản trị quan hệ</p>\n  </div>\n</div>`,
    starterCss: `body {\n  font-family: 'Times New Roman', serif;\n  margin: 0;\n  padding: 0;\n  background: #f4f9ff;\n}\n.site-header {\n  background: #073b7a;\n  color: white;\n  padding: 12px 24px;\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.site-header .logo {\n  font-weight: bold;\n  font-size: 20px;\n}\n.nav-links a {\n  color: white;\n  margin-left: 16px;\n  text-decoration: none;\n}\n.hero {\n  text-align: center;\n  padding: 30px 16px;\n  background: linear-gradient(135deg, #e6f4ff, #ffffff);\n  border-bottom: 1px solid #dbe8f7;\n}\n.hero h1 {\n  color: #073b7a;\n  margin-bottom: 8px;\n}\n.card-grid {\n  display: flex;\n  gap: 16px;\n  padding: 24px;\n  justify-content: center;\n}\n.card {\n  background: white;\n  padding: 16px;\n  border-radius: 8px;\n  border: 1px solid #dbe8f7;\n  flex: 1;\n  max-width: 250px;\n  box-shadow: 0 2px 4px rgba(0,0,0,0.05);\n}\n.card h3 {\n  color: #0969da;\n  margin-top: 0;\n}`,
    tests: [
      { description: 'Có cấu trúc header và nav', checkFnCode: 'html.includes("<header") && html.includes("<nav")' },
      { description: 'Có khu vực hero banner', checkFnCode: 'html.includes("class=\\"hero\\"") || html.includes("<section")' },
      { description: 'Có 3 thẻ card trong lưới', checkFnCode: '(html.match(/class=\\"card\\"/g) || []).length >= 3' }
    ]
  }
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-midterm-12',
    title: 'Kiểm tra giữa kỳ II – Tin học 12',
    grade: 12,
    targetClasses: ['12A1', '12A2', '12A3'],
    durationMinutes: 15,
    totalPoints: 10,
    status: 'active',
    startDate: '2025-04-20',
    endDate: '2025-04-26',
    questions: [
      {
        id: 'q1',
        type: 'single',
        question: 'Ngôn ngữ HTML được dùng để làm gì?',
        options: [
          'Định dạng cấu trúc nội dung trang web',
          'Lập trình phần cứng máy tính',
          'Quản lý hệ điều hành máy chủ',
          'Xử lý đồ họa 3D'
        ],
        correctAnswers: [0],
        points: 2,
        explanation: 'HTML (HyperText Markup Language) là ngôn ngữ đánh dấu siêu văn bản dùng để định dạng và cấu trúc nội dung trang web.'
      },
      {
        id: 'q2',
        type: 'single',
        question: 'Trong Python, để in một dòng chữ ra màn hình, ta sử dụng hàm nào?',
        options: [
          'echo()',
          'print()',
          'printf()',
          'write()'
        ],
        correctAnswers: [1],
        points: 2,
        explanation: 'Hàm print() trong Python dùng để xuất dữ liệu ra màn hình tiêu chuẩn.'
      },
      {
        id: 'q3',
        type: 'true_false',
        question: 'Khóa chính (Primary Key) trong cơ sở dữ liệu quan hệ có thể nhận giá trị trùng lặp (NULL hoặc giống nhau).',
        options: ['Đúng', 'Sai'],
        correctAnswers: [1],
        points: 2,
        explanation: 'Sai. Khóa chính phải là duy nhất (unique) và không được mang giá trị NULL để định danh mỗi bản ghi.'
      },
      {
        id: 'q4',
        type: 'multiple',
        question: 'Những thẻ nào sau đây thuộc cấu trúc bảng trong HTML? (Chọn các phương án đúng)',
        options: [
          '<table>',
          '<tr>',
          '<th>',
          '<list>'
        ],
        correctAnswers: [0, 1, 2],
        points: 2,
        explanation: '<table>, <tr>, <th>, <td> là các thẻ bảng HTML. Thẻ <list> không tồn tại trong HTML chuẩn.'
      },
      {
        id: 'q5',
        type: 'short_answer',
        question: 'Thuộc tính nào trong thẻ <img> dùng để cung cấp văn bản thay thế khi hình ảnh không tải được?',
        correctAnswers: 'alt',
        points: 2,
        explanation: 'Thuộc tính alt (alternative text) cung cấp văn bản mô tả thay thế khi ảnh bị lỗi hoặc cho trình đọc màn hình.'
      }
    ]
  },
  {
    id: 'quiz-15m-html',
    title: 'Kiểm tra 15 phút – Cú pháp HTML/CSS cơ bản',
    grade: 12,
    targetClasses: ['12A1', '12A2'],
    durationMinutes: 10,
    totalPoints: 10,
    status: 'active',
    startDate: '2025-04-18',
    endDate: '2025-04-28',
    questions: [
      {
        id: 'q15_1',
        type: 'single',
        question: 'Thẻ HTML nào có kích thước tiêu đề lớn nhất mặc định?',
        options: ['<h6>', '<head>', '<h1>', '<header>'],
        correctAnswers: [2],
        points: 3.5,
        explanation: '<h1> là thẻ tiêu đề cấp 1 có kích thước mặc định lớn nhất trong các thẻ h1-h6.'
      },
      {
        id: 'q15_2',
        type: 'single',
        question: 'Trong CSS, thuộc tính nào dùng để đổi màu chữ của phần tử?',
        options: ['font-color', 'color', 'text-color', 'background-color'],
        correctAnswers: [1],
        points: 3.5,
        explanation: 'Thuộc tính color trong CSS quy định màu chữ của phần tử văn bản.'
      },
      {
        id: 'q15_3',
        type: 'true_false',
        question: 'Tập tin HTML phải luôn luôn được lưu với phần mở rộng .html hoặc .htm.',
        options: ['Đúng', 'Sai'],
        correctAnswers: [0],
        points: 3,
        explanation: 'Đúng, để trình duyệt nhận diện và render trang web.'
      }
    ]
  }
];

export const INITIAL_SCHEDULE: ScheduleEvent[] = [
  {
    id: 'ev-1',
    date: '2025-04-22',
    dayOfWeek: 'Thứ Ba',
    formattedDate: '22/04/2025',
    period: 'Tiết 1 - 2',
    class: 'Lớp 12A1',
    title: 'Bài 5. Lập trình Python',
    type: 'teaching',
    color: 'cyan'
  },
  {
    id: 'ev-2',
    date: '2025-04-23',
    dayOfWeek: 'Thứ Tư',
    formattedDate: '23/04/2025',
    period: 'Tiết 3 - 4',
    class: 'Lớp 12A2',
    title: 'Thực hành HTML/CSS',
    type: 'teaching',
    color: 'yellow'
  },
  {
    id: 'ev-3',
    date: '2025-04-24',
    dayOfWeek: 'Thứ Năm',
    formattedDate: '24/04/2025',
    period: 'Kiểm tra giữa kỳ',
    class: 'Lớp 12A3',
    title: 'Kiểm tra giữa kỳ - Lớp 12A3',
    type: 'exam',
    color: 'red'
  },
  {
    id: 'ev-4',
    date: '2025-04-25',
    dayOfWeek: 'Thứ Sáu',
    formattedDate: '25/04/2025',
    period: 'Sinh hoạt',
    class: 'Tổ Tin học',
    title: 'Sinh hoạt chuyên môn tổ Tin học',
    type: 'meeting',
    color: 'blue'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Cập nhật bài học mới: Bài 6. Hàm trong Python',
    date: '21/04/2025',
    category: 'lesson',
    isRead: false,
    color: 'yellow',
    details: 'Đã bổ sung tài liệu bài giảng slide và 5 bài tập thực hành về hàm def trong Python 12.'
  },
  {
    id: 'notif-2',
    title: 'Đã có lịch kiểm tra giữa kỳ học kỳ II',
    date: '20/04/2025',
    category: 'exam',
    isRead: false,
    color: 'red',
    details: 'Lịch kiểm tra trực tuyến trên hệ thống dành cho toàn bộ các khối 10, 11 và 12.'
  },
  {
    id: 'notif-3',
    title: 'Nộp bài thực hành HTML/CSS trước 25/04',
    date: '19/04/2025',
    category: 'assignment',
    isRead: false,
    color: 'blue',
    details: 'Học sinh các lớp 12A1, 12A2, 12A3 hoàn thành bài thực hành số 5 và bấm Nộp bài trên website.'
  },
  {
    id: 'notif-4',
    title: 'Tài liệu ôn tập đã được cập nhật',
    date: '18/04/2025',
    category: 'material',
    isRead: true,
    color: 'green',
    details: 'Cô giáo Nguyễn Thị Châu đã tải lên bộ câu hỏi trắc nghiệm ôn tập Cơ sở dữ liệu và Mạng máy tính.'
  }
];

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    studentName: 'Nguyễn Văn An',
    action: 'đã nộp bài thực hành HTML',
    timeAgo: '2 giờ trước',
    type: 'practical'
  },
  {
    id: 'act-2',
    studentName: 'Trần Thị Bích Ngọc',
    action: 'hoàn thành bài kiểm tra',
    timeAgo: '5 giờ trước',
    type: 'quiz'
  },
  {
    id: 'act-3',
    studentName: 'Lê Minh Khang',
    action: 'đã xem bài học mới',
    timeAgo: '8 giờ trước',
    type: 'lesson'
  },
  {
    id: 'act-4',
    studentName: 'Phạm Thị Yến Nhi',
    action: 'đã nộp bài thực hành CSS',
    timeAgo: '12 giờ trước',
    type: 'practical'
  }
];

export const INITIAL_SUBMISSIONS: PracticalSubmission[] = [
  {
    id: 'sub-1',
    studentId: 'HS1201',
    studentName: 'Nguyễn Văn An',
    class: '12A1',
    exerciseId: 'ex-1-text-formatting',
    exerciseTitle: '1. Định dạng văn bản trong HTML',
    submittedAt: '2025-04-23 10:15',
    htmlCode: `<h2>Giới thiệu bản thân</h2>\n<p>Xin chào! Em tên là <strong>Nguyễn Văn An</strong>, học sinh lớp <em>12A1</em>.</p>`,
    cssCode: `body { font-family: 'Times New Roman', serif; color: #12305b; }`,
    score: 9.0,
    teacherComment: 'Làm tốt, sử dụng chuẩn thẻ semantic HTML5!',
    status: 'Đã chấm'
  },
  {
    id: 'sub-2',
    studentId: 'HS1204',
    studentName: 'Phạm Thị Yến Nhi',
    class: '12A2',
    exerciseId: 'ex-2-headings-paragraphs',
    exerciseTitle: '2. Tạo tiêu đề và đoạn văn',
    submittedAt: '2025-04-23 08:30',
    htmlCode: `<h1>Trường PT DTNT THPT Bình Thuận</h1>\n<h2>Giới thiệu chung</h2>\n<p>Trường nuôi dưỡng ước mơ...</p>`,
    cssCode: `h1 { color: #073b7a; }`,
    score: 8.0,
    teacherComment: 'Đúng yêu cầu, chú ý căn lề đoạn văn đẹp hơn.',
    status: 'Đã chấm'
  }
];
