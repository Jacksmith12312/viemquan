import React, { useState, useEffect } from 'react';
import {
  Code,
  Github,
  ExternalLink,
  Briefcase,
  Layers,
  GraduationCap,
  MessageSquare,
  Lock,
  ArrowRight,
  User,
  Activity,
  ChevronRight,
  Cpu,
  Mail,
  MapPin,
  Sparkles,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CVData, MessageItem, ProjectItem } from './types';
import ContactForm from './components/ContactForm';
import AdminDashboard from './components/AdminDashboard';

// Elegant default structure if server takes a moment
const LOCAL_FALLBACK_CV: CVData = {
  about: {
    name: "Nguyễn Hữu Sơn",
    title: "Sinh viên Công nghệ học & Sáng tạo nội dung số",
    tagline: "Rèn luyện tư duy số, làm chủ công nghệ trí tuệ nhân tạo và kiến tạo sản phẩm học thuật bền vững.",
    bio: "Chào mừng đến với trang Portfolio cá nhân của em. Em là Nguyễn Hữu Sơn, sinh viên tích cực học tập và rèn luyện kỹ năng số chuyên sâu. Trang Web này là không gian ghi nhận hành trình học tập, lưu giữ tất cả bài tập lớn sáng tạo và là minh chứng rõ nét cho định hướng trở thành Một Chuyên Gia Giải Pháp Số chuẩn mực.",
    avatarUrl: "https://hololive.wiki/images/8/87/Gigi_Murin_-_Portrait.png",
    major: "Công nghệ thông tin - Định hướng Sáng tạo nội dung số và Khoa học dữ liệu",
    hobbies: "Nghiên cứu trí tuệ nhân tạo (AI Generative), lập trình giao diện người dùng, đọc sách khoa học kỹ thuật, chơi bóng rổ và sáng tạo video ngắn truyền thông xã hội.",
    learningGoals: "Thành thạo các kỹ năng số nâng cao bao gồm lập trình full-stack, phân tích & làm sạch dữ liệu lớn, làm việc nhóm đám mây an toàn, và duy trì chỉ số bảo mật cá nhân trên mạng.",
    portfolioGoals: "Minh chứng năng lực khoa học số đã học từ học phần bài bản, phục vụ tra cứu học tập, chia sẻ sản phẩm số trực quan tới thầy cô, bạn bè và nhà tuyển dụng.",
    conclusionExperience: "Hành trình xây dựng Portfolio kỹ năng số này là cơ hội đặc biệt giúp em tự phản chiếu và đúc kết năng lực thiết kế hệ thông. Việc tích hợp toàn bộ các kết quả bài tập đơn lẻ vào thành một website thống nhất đem lại cái nhìn toàn diện về kỹ năng công nghệ.",
    conclusionKnowledge: "Em đã làm chủ cơ sở máy tính và các cấu hình ngoại vi ngoại hạng; nắm vững kỹ thuật toán lọc thông tin; hiểu sâu sắc đạo đức và ứng dụng AI; thực hiện giao tiếp số tối ưu; thiết kế ấn phẩm đồ họa Canva, Figma, dựng phim thuyết trình nâng cao; và cam kết tuân thủ tuyệt đối an toàn bảo mật số cùng cơ chế trích dẫn APA liêm chính.",
    conclusionTakeaways: "Sự hài lòng cao nhất của em là kiến tạo nên một giao diện Portfolio đậm chất tối giản hình học (Geometric tech aesthetic), tốc độ tải trang cực nhanh và có hệ quản trị Admin thực thụ để cập nhật sản phẩm. Khó khăn lớn nhất ban đầu là kết cấu dữ liệu và cơ chế lưu trữ, nhưng sau khi kiên trì debug, em đã hoàn thiện dự án xuất sắc."
  },
  skills: [
    { id: "1", name: "Kỹ thuật Máy tính và Thiết bị rời", category: "Phần cứng", level: "Thành thạo" },
    { id: "2", name: "Khai thác thông tin & Tìm kiếm nâng cao", category: "Dữ liệu", level: "Xuất sắc" },
    { id: "3", name: "Trực quan hóa & Thống kê Excel", category: "Dữ liệu", level: "Thành thạo" },
    { id: "4", name: "Trí tuệ nhân tạo (Generative AI)", category: "Công nghệ", level: "Nâng cao" },
    { id: "5", name: "Làm việc nhóm Cloud & Trello", category: "Cộng tác", level: "Thành thạo" },
    { id: "6", name: "Thiết kế Đồ họa đa phương tiện Canva/Figma", category: "Sáng tạo", level: "Xuất sắc" },
    { id: "7", name: "An toàn & Liêm chính Trích dẫn APA", category: "Học thuật", level: "Tuyệt đối" }
  ],
  experience: [
    {
      id: "exp-1",
      role: "Học viên xuất sắc Học phần Kỹ năng số",
      company: "Workspace Trường Đại học Công nghệ",
      period: "01/2026 - Nay",
      description: "Nghiên cứu sâu hệ thống 6 chuyên đề kỹ năng số cốt lõi. Đại diện nhóm triển khai thiết kế các slide bài thuyết trình khoa học và biên tập video giới thiệu an toàn không gian mạng."
    },
    {
      id: "exp-2",
      role: "Thành viên Ban kỹ thuật và Đồ họa sáng tạo",
      company: "Kênh Truyền Thông Học Sinh Sinh Viên",
      period: "2024 - 2025",
      description: "Tham gia lên ý tưởng, phác họa hình ảnh infographic tuyên truyền liêm chính học thuật và hướng dẫn sử dụng công cụ AI một cách có trách nhiệm cho học sinh, sinh viên Đại học."
    }
  ],
  projects: [
    {
      id: "proj-1",
      title: "Bài tập 1 - Bài 1: Máy tính và các thiết bị ngoại vi",
      description: "Nghiên cứu nguyên lý phối hợp truyền tải dữ liệu của các bộ phận bên trong máy tính và cấu hình tối ưu của thiết bị ngoại vi tương thích.",
      githubUrl: "https://github.com",
      demoUrl: "https://example.com/computer-report.pdf",
      tags: ["Phần cứng", "Mục tiêu 1", "Sản phẩm Báo cáo PDF"],
      objective: "Tìm hiểu chi tiết các thành phận cấu trúc chính của phần cứng máy tính và cách thiết bị ngoại vi (bàn phím, chuột, màn hình, phụ kiện cổng kết nối) phối hợp tối ưu hóa hiệu năng làm việc học tập.",
      process: "Tiến hành phân tích thực trạng máy tính học tập của bản thân thông qua Task Manager và System Information, ghi nhận thông số các dòng chuột quang học, bàn phím cơ, màn hình chống lóa IPS hiện đại, từ đó thiết lập biểu đề xuất cấu hình nâng cao lý tưởng.",
      productLink: "https://example.com/computer-report.pdf",
      productType: "Báo cáo PDF & Sơ đồ tư duy"
    },
    {
      id: "proj-2",
      title: "Bài tập 2 - Bài 2: Khai thác dữ liệu và thông tin",
      description: "Làm chủ cú pháp tìm kiếm tài liệu thông minh chuyên sâu và tổ chức hệ dữ liệu thu thập khoa học thông qua bảng số liệu thống kê.",
      githubUrl: "https://github.com",
      demoUrl: "https://example.com/data-exploitation.xlsx",
      tags: ["Khai thác dữ liệu", "Mục tiêu 2", "Bảng Excel"],
      objective: "Sử dụng thành thạo các toán tử tìm kiếm thông minh từ Google (filetype, site, intitle) để loại bỏ rác thông tin, truy xuất đúng các ấn phẩm khoa học và thiết lập bảng chỉ số dữ liệu khoa học.",
      process: "Xác định chủ đề 'Chuyển đổi số trong Giáo dục học đường', dùng truy vấn nâng cao lưu trữ 20 tài liệu nghiên cứu uy tín. Sau đó thiết lập dữ liệu trong Microsoft Excel, thực hiện định dạng có điều kiện và trực quan hóa bằng biểu đồ cột xếp chồng.",
      productLink: "https://example.com/data-exploitation.xlsx",
      productType: "Bảng tính phân tích dữ liệu Excel"
    },
    {
      id: "proj-3",
      title: "Bài tập 2 - Bài 3: Tổng quan về trí tuệ nhân tạo",
      description: "Đào sâu nền móng Trí tuệ nhân tạo và những kịch bản áp dụng thực tế Generative AI có trách nhiệm đạo đức cao.",
      githubUrl: "https://github.com",
      demoUrl: "https://example.com/ai-overview.pptx",
      tags: ["Trí tuệ nhân tạo", "Mục tiêu 3", "Slide PowerPoint"],
      objective: "Nhận diện bức tranh toàn cảnh về tiến trình cách mạng AI, phân biệt các nhóm thuật toán cốt lõi, từ đó nâng tầm ứng dụng của học viên đồng thời bảo vệ chuẩn mực liêm chính chống phụ thuộc công nghệ vô ý thức.",
      process: "Trải nghiệm và đối chiếu năng lực hỗ trợ của ChatGPT và Google Gemini trong giải quyết các vấn đề logic toán. Viết tiểu luận phân tích rủi ro bóp méo thông tin của AI và phác thảo slide thuyết trình tương tác dạng câu hỏi trắc nghiệm.",
      productLink: "https://example.com/ai-overview.pptx",
      productType: "Slide thuyết trình AI sáng tạo và văn bản"
    },
    {
      id: "proj-4",
      title: "Bài tập 3 - Bài 4: Giao tiếp và hợp tác trong môi trường số",
      description: "Thực hiện đồ án đồng biên soạn, truyền thông trực tuyến an toàn và quản lý công cụ đám mây đa thiết bị mượt mà.",
      githubUrl: "https://github.com",
      demoUrl: "https://example.com/digital-communication-collab",
      tags: ["Giao tiếp số", "Mục tiêu 4", "Hợp tác Google Drive"],
      objective: "Trang bị kỷ luật giao tiếp trực tuyến chuyên nghiệp qua Teams/Zoom, thiết lập danh mục phân vai công việc trực tuyến và cùng hoàn thành dự án trên không gian mây dữ liệu bảo mật.",
      process: "Lên lịch trình Kanban trên Trello, thiết lập phiên họp nhóm Zoom có quay màn hình và tiến hành đồng biên soạn báo cáo chung trên Google Docs giúp loại bỏ xung đột phiên bản, bảo toàn dữ liệu liên tục.",
      productLink: "https://example.com/digital-communication-collab",
      productType: "Biên Bản Họp Nhóm & Cổng Tương Tác Số"
    },
    {
      id: "proj-5",
      title: "Bài tập 2 - Bài 5: Sáng tạo nội dung số",
      description: "Thiết kế truyền thông đa phương tiện trực quan có chiều sập văn hóa nghệ thuật và thuyết trình ngắn thu hút.",
      githubUrl: "https://github.com",
      demoUrl: "https://example.com/digital-creative-content.mp4",
      tags: ["Sáng tạo nội dung", "Mục tiêu 5", "Infographic Canva & Video thuyết trình"],
      objective: "Sử dụng tích hợp các phần mềm biên tập âm học và đồ họa để thiết lập tác phẩm hình ảnh sinh động (Infographic) và dựng một phim ngắn giới thiệu mục đích xây dựng Portfolio kỹ năng cá nhân.",
      process: "Lập kịch bản phân cảnh video, thiết kế cấu trúc bố cục màu sắc đối lập cao trên Canva phục vụ Infographic. Sử dụng micro ghi âm thu giọng và chỉnh sửa cắt ghép video tinh gọn bằng CapCut ghép nhạc bản quyền miễn phí.",
      productLink: "https://example.com/digital-creative-content.mp4",
      productType: "Video Thuyết trình Full HD & Infographic Canva"
    },
    {
      id: "proj-6",
      title: "Bài tập 4 - Bài 6: An toàn và liêm chính học thuật trong môi trường số",
      description: "Tuân thủ cơ chế tự bảo vệ dữ liệu, phòng chống mã độc trên mạng và tuyên ngôn trích nguồn chuẩn học thuật.",
      githubUrl: "https://github.com",
      demoUrl: "https://example.com/academic-integrity.pdf",
      tags: ["Liêm chính số", "Mục tiêu 6", "Cẩm nang hướng dẫn APA PDF"],
      objective: "Xây dựng tư duy tuyệt đối bảo mật, bảo vệ danh tính số trước mã độc độc hại và hiểu thấu thế nào là bản quyền, tác quyền kỹ thuật số và trích dẫn chuẩn khoa học APA tránh đạo văn.",
      process: "Khảo sát các rủi ro lừa đảo qua email và mã độc độc hại. Tổng hợp các nguyên lý trích dẫn tài liệu học thuật theo định dạng APA phiên bản mới nhất, tạo cẩm nang trực quan dạng bỏ túi sinh động.",
      productLink: "https://example.com/academic-integrity.pdf",
      productType: "Cẩm nang bảo mật & biểu mẫu trích dẫn APA PDF"
    }
  ]
};

export default function App() {
  const [cvData, setCvData] = useState<CVData>(LOCAL_FALLBACK_CV);
  const [path, setPath] = useState(window.location.pathname);
  
  // Auth state
  const [adminToken, setAdminToken] = useState<string | null>(localStorage.getItem('adminToken'));
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  useEffect(() => {
    fetchCV();

    // Setup router state listener
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const fetchCV = async () => {
    try {
      const response = await fetch('/api/cv');
      if (response.ok) {
        const data = await response.json();
        // Check if data is populated
        if (data.about && data.about.name) {
          setCvData(data);
        }
      }
    } catch (err) {
      console.warn('Backend server database reading did not complete yet, loading fallback data.', err);
    }
  };

  const navigateTo = (newPath: string) => {
    window.history.pushState({}, '', newPath);
    window.dispatchEvent(new Event('popstate'));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: adminEmail, password: adminPassword }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setAdminToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setAdminEmail('');
        setAdminPassword('');
      } else {
        setLoginError(data.error || 'Invalid username or credentials');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Error connecting to Server API.');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    setAdminToken(null);
    localStorage.removeItem('adminToken');
    navigateTo('/');
  };

  // Render the Admin workspace
  if (path === '/admin') {
    if (!adminToken) {
      return (
        <div id="login-barrier" className="min-h-screen bg-[#0A0A0C] text-slate-100 flex items-center justify-center p-6 font-sans relative overflow-hidden">
          {/* Decorative ambient gradients */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl -z-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-slate-800/10 blur-3xl -z-10"></div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-[#0D1117] border border-slate-800 rounded-none p-8 shadow-2xl relative"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <Code className="w-5 h-5 text-indigo-400" />
                <span className="font-mono text-sm font-bold tracking-widest text-white">ADMIN_PORTAL</span>
              </div>
              <button
                onClick={() => navigateTo('/')}
                className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-mono hover:text-indigo-400"
              >
                ← Back to public Site
              </button>
            </div>

            <h1 className="text-xl font-bold text-white mb-2">Workspace Verification Required</h1>
            <p className="text-xs text-slate-400 mb-6">Login to CRUD portfolio catalogs and manage secure submissions.</p>

            {loginError && (
              <div className="mb-4 p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 rounded-none text-xs font-mono flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 shrink-0" />
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Account
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. admin@portfolio.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm px-4 py-2.5 rounded-none text-white font-mono outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Secure Access Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm px-4 py-2.5 rounded-none text-white font-mono outline-none transition-colors"
                />
                <span className="text-[10px] text-slate-500 font-mono block mt-1">Default credentials: admin@portfolio.com / admin</span>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-none font-bold text-[10px] uppercase tracking-[0.2em] cursor-pointer transition-colors mt-6 flex items-center justify-center gap-2"
              >
                {loginLoading ? 'Decrypting Access keys...' : 'Authenticate Access'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        </div>
      );
    }

    return (
      <AdminDashboard
        token={adminToken}
        onLogout={handleLogout}
        cvData={cvData}
        onRefreshCV={fetchCV}
      />
    );
  }

  // Extract initials for the logo initials badge
  const logoInitials = cvData.about.name ? cvData.about.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().substring(0, 2) : 'AR';

  // Else, Render the Public Portfolio Frontend in the Geometric Balance style
  return (
    <div id="portfolio-app-root" className="min-h-screen bg-[#0A0A0C] text-slate-300 font-sans relative selection:bg-indigo-500/10 selection:text-indigo-400 border-4 border-[#1E293B]">
      {/* Visual Ambient Background Accents */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full -z-10"></div>
      <div className="absolute top-[800px] left-10 w-[400px] h-[400px] bg-indigo-600/5 blur-[100px] rounded-full -z-10"></div>

      {/* Primary Header Navbar */}
      <header id="main-header" className="sticky top-0 z-40 bg-[#0F172A]/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 md:px-12 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 flex items-center justify-center font-bold text-white rounded shadow-lg">
              {logoInitials}
            </div>
            <div>
              <span id="header-brand" className="font-mono text-sm font-bold text-white tracking-widest block">{cvData.about.name.toUpperCase()}</span>
              <span className="text-[10px] text-indigo-400 font-mono tracking-wider block">// GEOMETRIC_BALANCE_CORE</span>
            </div>
          </div>

          <nav id="header-navigation" className="hidden md:flex items-center gap-7 text-xs font-mono uppercase tracking-widest">
            <a href="#about" className="hover:text-indigo-400 transition-colors">Giới Thiệu</a>
            <a href="#projects" className="hover:text-indigo-400 transition-colors">Dự Án</a>
            <a href="#summary" className="hover:text-indigo-400 transition-colors">Tổng Kết</a>
            <a href="#skills" className="hover:text-indigo-400 transition-colors">Kỹ Năng Số</a>
            <a href="#experience" className="hover:text-indigo-400 transition-colors">Hành Trình</a>
            <a href="#contact" className="hover:text-indigo-400 transition-colors">Liên Hệ</a>
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('/admin')}
              className="px-4 py-2 bg-[#0D1117] hover:bg-[#151b23] text-indigo-400 hover:text-indigo-300 border border-slate-800 rounded-none text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5" />
              ADMIN_PORTAL
            </button>
          </div>
        </div>
      </header>

      {/* HERO HERO HERO */}
      <section id="about" className="max-w-7xl mx-auto px-6 md:px-12 pt-16 md:pt-28 pb-20 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-indigo-500/5 border border-indigo-500/10 rounded-none w-fit">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-[11px] font-mono text-indigo-400 font-bold uppercase tracking-wider">Hồ sơ cá nhân chính thức</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
              Xin chào, mình tên là <span className="text-indigo-400 font-mono block mt-2">{cvData.about.name}</span>
            </h2>

            <p className="text-lg md:text-xl font-semibold text-slate-100 leading-relaxed font-sans max-w-2xl">
              {cvData.about.tagline || cvData.about.title}
            </p>

            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl font-sans">
              {cvData.about.bio}
            </p>

            {/* Bento matrix for specific educational attributes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-900/60 font-sans">
              <div className="bg-[#0D1117] border border-slate-800 p-4 relative group hover:border-[#6366f1]/35 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <GraduationCap className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Ngành Học</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{cvData.about.major || LOCAL_FALLBACK_CV.about.major}</p>
              </div>

              <div className="bg-[#0D1117] border border-slate-800 p-4 relative group hover:border-[#6366f1]/35 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <User className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Sở Thích Cá Nhân</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{cvData.about.hobbies || LOCAL_FALLBACK_CV.about.hobbies}</p>
              </div>

              <div className="bg-[#0D1117] border border-slate-800 p-4 relative group hover:border-[#6366f1]/35 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <Cpu className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Mục Tiêu Học Tập</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{cvData.about.learningGoals || LOCAL_FALLBACK_CV.about.learningGoals}</p>
              </div>

              <div className="bg-[#0D1117] border border-slate-800 p-4 relative group hover:border-[#6366f1]/35 transition-all duration-300">
                <div className="flex items-center gap-2 mb-2 text-indigo-400">
                  <Award className="w-4 h-4 shrink-0 text-indigo-400" />
                  <span className="text-[10px] font-mono uppercase tracking-widest font-bold">Mục Tiêu Portfolio</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">{cvData.about.portfolioGoals || LOCAL_FALLBACK_CV.about.portfolioGoals}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="#contact"
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:gap-3 cursor-pointer transition-all"
              >
                Gửi Tin Nhắn Đồng Hành
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#projects"
                className="px-6 py-3 border border-slate-800 hover:border-slate-700 text-white font-semibold text-sm rounded-none transition-all hover:text-indigo-400 hover:border-indigo-500/55"
              >
                Xem Các Dự Án Môn Học
              </a>
            </div>
          </div>

          {/* Profile photo with professional border card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-indigo-600 rounded-none blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
              <div className="relative bg-[#0F172A] border-4 border-[#1E293B] p-4 rounded-none shadow-2xl group-hover:border-indigo-500/30 transition-all duration-300">
                <img
                  src={cvData.about.avatarUrl || "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=300&h=300&fit=crop"}
                  alt={cvData.about.name}
                  referrerPolicy="no-referrer"
                  className="w-64 h-64 md:w-72 md:h-72 rounded-none object-cover border-2 border-slate-800 filter grayscale contrast-115 hover:grayscale-0 transition-all duration-500"
                />
                
                <div className="absolute -bottom-3 -right-3 bg-[#0A0A0C] border border-slate-800 px-4 py-1.5 rounded-none shadow-xl shrink-0 font-mono text-[10px] text-indigo-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  HỆ_THỐNG_HOẠT_ĐỘNG
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS PROJECTS PROJECTS */}
      <section id="projects" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-1">
              <Layers className="w-4 h-4 text-indigo-400" />
              // DANH_MỤC_DỰ_ÁN
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Danh Sách Sản Phẩm & Dự Án Môn Học</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm font-sans mt-1">
            Tổng hợp đầy đủ các bài tập lớn thực hành đã hoàn thành xuất sắc đi kèm mục tiêu chi tiết, tiến trình thực thi và sản phẩm công bố cuối cùng.
          </p>
        </div>

        {cvData.projects.length === 0 ? (
          <p className="text-sm text-slate-400 py-10 font-mono text-center">Chưa có dự án nào được nhập vào hệ thống.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cvData.projects.map((project, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                key={project.id}
                className="bg-[#0D1117] border border-slate-800 rounded-none p-6 group hover:border-[#6366f1]/40 hover:-translate-y-1 hover:bg-[#111827] transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-mono text-indigo-400 font-bold bg-indigo-400/5 px-2 py-0.5 rounded-none">
                      BÀI TẬP 0{idx + 1}
                    </span>
                    <div className="flex items-center gap-3 text-slate-400">
                      {(project.productLink || project.demoUrl) && (
                        <a 
                          href={project.productLink || project.demoUrl} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="hover:text-indigo-400 transition-colors"
                          title="Mở đường link sản phẩm trực tiếp"
                        >
                          <ExternalLink className="w-4.5 h-4.5" />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="text-base font-bold text-white mb-2 tracking-tight group-hover:text-indigo-400 transition-colors font-sans">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4 font-sans line-clamp-3">
                    {project.description}
                  </p>

                  {/* Elegant Geometric Balance Progress Indicators */}
                  <div className="flex space-x-2 mb-4">
                    <div className="bg-indigo-500 h-1 transition-all group-hover:bg-indigo-400" style={{ width: idx % 3 === 0 ? '64px' : idx % 3 === 1 ? '40px' : '48px' }}></div>
                    <div className="bg-slate-800 h-1" style={{ width: idx % 3 === 0 ? '32px' : idx % 3 === 1 ? '56px' : '48px' }}></div>
                  </div>

                  <button
                    onClick={() => setSelectedProject(project)}
                    className="w-full mb-4 py-2 bg-slate-950/40 hover:bg-slate-950 hover:text-indigo-400 border border-slate-800 hover:border-indigo-500 text-[10px] font-mono font-bold tracking-wider text-slate-350 transition-all flex items-center justify-center gap-1.5 cursor-pointer uppercase"
                  >
                    <span>Xem Chi Tiết & Sản Phẩm</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-905">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 bg-[#0a0a0c] border border-slate-800 rounded-none font-mono text-[9px] text-slate-400">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* SUMMARY / CONCLUSION SECTION */}
      <section id="summary" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-900 font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-1">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              // TỔNG_KẾT_HỌC_PHẦN
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Bản Đúc Kết & Tổng Kết Học Tập</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm font-sans mt-1">
            Đúc kết trải nghiệm thực tế xây dựng Portfolio, ghi nhận tri thức thu được và suy ngẫm về thách thức học thuật.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Experience & Feelings */}
          <div className="bg-[#0D1117] border border-slate-800 p-6 relative group hover:border-[#6366f1]/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            <h3 className="text-xs font-bold text-white tracking-wider font-mono uppercase border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>1. Trải Nghiệm & Cảm Nhận</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
              {cvData.about.conclusionExperience || LOCAL_FALLBACK_CV.about.conclusionExperience}
            </p>
          </div>

          {/* Card 2: Knowledge & Core Skills */}
          <div className="bg-[#0D1117] border border-slate-800 p-6 relative group hover:border-[#6366f1]/30 transition-all duration-300 col-span-1">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            <h3 className="text-xs font-bold text-white tracking-wider font-mono uppercase border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>2. Tri Thức & Kỹ Năng Cốt Lõi</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
              {cvData.about.conclusionKnowledge || LOCAL_FALLBACK_CV.about.conclusionKnowledge}
            </p>
          </div>

          {/* Card 3: Takeaways & Challenges */}
          <div className="bg-[#0D1117] border border-slate-800 p-6 relative group hover:border-[#6366f1]/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
            <h3 className="text-xs font-bold text-white tracking-wider font-mono uppercase border-b border-slate-800 pb-3 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-400" />
              <span>3. Điểm Tâm Đắc & Thách Thức</span>
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
              {cvData.about.conclusionTakeaways || LOCAL_FALLBACK_CV.about.conclusionTakeaways}
            </p>
          </div>
        </div>
      </section>

      {/* SELECTED PROJECT DETAILS MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            {/* Backdrop click closer */}
            <div 
              className="absolute inset-0 cursor-default" 
              onClick={() => setSelectedProject(null)}
            ></div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#0D1117] border border-slate-850 p-6 md:p-8 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 text-slate-450 hover:text-white transition-colors cursor-pointer text-[10px] font-mono tracking-wider px-2 py-1 bg-[#0A0A0C] border border-slate-800"
              >
                [ĐÓNG/CLOSE]
              </button>

              <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-indigo-400 font-mono tracking-widest block mb-1">
                    BÁO CÁO CHI TIẾT SẢN PHẨM HOÀN THÀNH
                  </span>
                  <h3 className="text-lg font-extrabold text-white leading-tight font-sans">
                    {selectedProject.title}
                  </h3>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed font-sans font-medium border-l-2 border-indigo-500 pl-3 py-1 bg-indigo-500/5">
                  {selectedProject.description}
                </div>

                {/* 1. MỤC TIÊU BÀI TẬP */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-indigo-400">
                    <Sparkles className="w-3.5 h-3.5" />
                    1. Mục Tiêu Của Bài Tập
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedProject.objective || "Mục tiêu bài tập đang được đồng bộ và cập nhật bổ sung."}
                  </p>
                </div>

                {/* 2. QUÁ TRÌNH THỰC HIỆN */}
                <div className="space-y-1.5">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5 border-b border-slate-800 pb-1.5 text-indigo-400">
                    <Cpu className="w-3.5 h-3.5" />
                    2. Tóm Tắt Quá Trình Thực Hiện
                  </h4>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {selectedProject.process || "Xây dựng sườn tiến trình, nghiên cứu lý thuyết hệ thống chuyên sâu và hoàn thiện sản phẩm."}
                  </p>
                </div>

                {/* 3. ĐÍNH KÈM SẢN PHẨM CUỐI CÙNG */}
                <div className="space-y-3 bg-[#0A0A0C] p-4 border border-slate-800">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span className="text-[8px] text-slate-500 font-mono block">ĐỊNH DẠNG SẢN PHẨM CÔNG BỐ</span>
                      <strong className="text-xs text-white uppercase font-mono tracking-wider">
                        📂 {selectedProject.productType || "Sản Phẩm Đính Kèm"}
                      </strong>
                    </div>

                    <a
                      href={selectedProject.productLink || selectedProject.demoUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-[10px] font-bold tracking-widest shrink-0 transition-colors cursor-pointer uppercase text-center justify-center"
                    >
                      <span>Mở Quy Chuẩn Sản Phẩm</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>

                {/* Footnote */}
                <div className="text-[9px] text-slate-500 font-mono pt-4 border-t border-slate-900 flex items-center justify-between">
                  <span>Trạng Thái: ĐÃ THỰC HIỆN & ĐIỂM SỐ KHÁ TRÊN LỚP</span>
                  <span>Nguyễn Hữu Sơn &copy; 2026</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TECH STACK STACK STACK */}
      <section id="skills" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-900">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-1">
              <Cpu className="w-4 h-4 text-indigo-400" />
              // MA TRẬN_NĂNG_LỰC
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Danh Mục Kỹ Năng & Công Cụ Số</h2>
          </div>
          <p className="text-xs text-slate-400 max-w-sm font-sans mt-1">
            Phân loại rõ ràng từ các công cụ lập trình, xử lý dữ liệu lớn đến thiết kế đa phương tiện tiên tiến.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {['Frontend', 'Backend', 'DevOps / Design'].map((columnTitle, cIdx) => {
            // Split skills into columns
            const categories = columnTitle.includes('/') 
              ? columnTitle.replace(' / ', ',').split(',')
              : [columnTitle];
            
            const columnSkills = cvData.skills.filter((s) => 
              categories.some(cat => s.category.toLowerCase() === cat.trim().toLowerCase())
            );

            if (columnSkills.length === 0) return null;

            // Display title in Vietnamese
            const headerVN = columnTitle === 'Frontend' ? 'Phát triển Giao diện'
                             : columnTitle === 'Backend' ? 'Hệ thống & An ninh'
                             : 'Công cụ Thiết kế & Đồ họa';

            return (
              <div key={columnTitle} className="bg-[#0D1117] border border-slate-800 rounded-none p-6 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-indigo-500 to-transparent"></div>
                <h3 className="text-xs font-bold text-white tracking-widest font-mono uppercase border-b border-slate-800 pb-3 mb-4 flex items-center justify-between">
                  <span>{headerVN}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400" />
                </h3>

                <div className="space-y-3">
                  {columnSkills.map((skill) => (
                    <div key={skill.id} className="flex items-center justify-between border-b border-slate-900/50 pb-2.5 last:border-0 last:pb-0">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>
                        <span className="text-xs font-semibold text-slate-200">{skill.name}</span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[9px]">
                        <span className="px-1.5 py-0.5 bg-[#0A0A0C] text-slate-400 rounded-none border border-slate-800">
                          {skill.category}
                        </span>
                        <span className="text-indigo-400 font-semibold uppercase">{skill.level}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PROFESSIONAL EXPERIENCES TIMELINE */}
      <section id="experience" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-900 font-sans">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-1.5 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-2 mx-auto">
            <Briefcase className="w-4 h-4 text-indigo-400" />
            // HÀNH_TRÌNH_HỌC_PHẦN
          </div>
          <h2 className="text-3xl font-extrabold text-white">Hành Trình Học Tập & Phát Triển</h2>
          <p className="text-xs text-slate-400 mt-2 font-sans max-w-md mx-auto">
            Ghi nhận các mốc lịch sử hoàn thành xuất sắc các chứng chỉ, bài luận và các thành tựu thi đua số trong năm vừa qua.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative border-l border-slate-800 pl-6 md:pl-10 space-y-12">
          {cvData.experience.map((exp, idx) => (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.15 }}
              key={exp.id}
              className="relative"
            >
              {/* Vertical timeline customized connector dot */}
              <div className="absolute -left-[31px] md:-left-[47px] top-1.5 w-[9px] h-[9px] rounded-full bg-[#0A0A0C] border-2 border-indigo-500 flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse"></div>
              </div>

              <div className="bg-[#0D1117] border border-slate-800 p-6 rounded-none hover:border-indigo-500/20 transition-all duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <span className="text-sm font-bold text-white block">{exp.role}</span>
                    <span className="text-xs text-indigo-400 font-mono">@ {exp.company}</span>
                  </div>
                  <span className="px-3 py-1 bg-[#0A0A0C] border border-slate-850 rounded-none text-[10px] font-mono font-bold text-slate-300 self-start sm:self-auto">
                    {exp.period}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-3 font-sans leading-relaxed">
                  {exp.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CONTACT PORTAL */}
      <section id="contact" className="max-w-7xl mx-auto px-6 md:px-12 py-20 border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-12 xl:col-span-5 space-y-6">
            <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs uppercase tracking-widest font-bold mb-1">
              <MessageSquare className="w-4 h-4 text-indigo-400" />
              // LIÊN_HỆ_HỢP_TÁC
            </div>
            
            <h2 className="text-3xl font-extrabold text-white tracking-tight">
              Gửi Tin Nhắn Đồng Hành
            </h2>

            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Em luôn vui lòng đón nhận những thắc mắc học tập, góp ý từ thầy cô, bạn bè hoặc mong muốn hợp tác nghiên cứu ứng dụng công cụ AI bền vững. Vui lòng để lại tin nhắn ngắn gọn phía đối diện.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0D1117] border border-slate-800 rounded-none flex items-center justify-center text-indigo-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Địa Chỉ Email Cá Nhân</span>
                  <a href={`mailto:nguyenhuuson862007@gmail.com`} className="text-xs text-white hover:text-indigo-400 transition-colors font-mono">
                    nguyenhuuson862007@gmail.com
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0D1117] border border-slate-800 rounded-none flex items-center justify-center text-indigo-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Địa Điểm Học Tập & Hoạt Động</span>
                  <span className="text-xs text-white">Hà Nội, Việt Nam / Trực tiếp hoặc Từ xa</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0D1117] border border-slate-800 rounded-none flex items-center justify-center text-indigo-400 shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Đạo Đức Số Sáng Tạo</span>
                  <span className="text-xs text-white mt-0.5 block">Sáng tạo có trách nhiệm & Đảm bảo trích dẫn APA</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-12 xl:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="main-footer" className="bg-[#0F172A] border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs text-slate-500 font-mono">
          <div>
            <span className="text-slate-400 font-sans block font-semibold mb-1">Không Gian Portfolio: {cvData.about.name}</span>
            <span>&copy; 2026. Thiết kế và vận hành với công nghệ tối giản, hiệu năng cao.</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigateTo('/admin')}
              className="hover:text-indigo-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              ADMIN_ACCESS
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
