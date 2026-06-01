import React, { useState, useEffect } from 'react';
import {
  LogOut,
  Plus,
  Trash2,
  Edit2,
  Mail,
  MailOpen,
  X,
  Save,
  CheckCircle,
  Briefcase,
  AlertCircle,
  FolderDot,
  GraduationCap,
  Eye,
  ArrowRight,
  Sparkles,
  Inbox
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CVData, SkillItem, ExperienceItem, ProjectItem, MessageItem, AboutData } from '../types';

interface AdminDashboardProps {
  token: string;
  onLogout: () => void;
  cvData: CVData;
  onRefreshCV: () => void;
}

export default function AdminDashboard({ token, onLogout, cvData, onRefreshCV }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'about' | 'skills' | 'experience' | 'projects' | 'messages'>('messages');
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form states for items being added/edited
  const [aboutForm, setAboutForm] = useState<AboutData>({ ...cvData.about });
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // New item draft templates
  const [newSkill, setNewSkill] = useState<Partial<SkillItem>>({ name: '', category: 'Frontend', level: 'Expert' });
  const [newExp, setNewExp] = useState<Partial<ExperienceItem>>({ role: '', company: '', period: '', description: '' });
  const [newProject, setNewProject] = useState<Partial<ProjectItem>>({ title: '', description: '', githubUrl: '', demoUrl: '', tags: [] });
  const [projectTagInput, setProjectTagInput] = useState('');

  const [activeMessage, setActiveMessage] = useState<MessageItem | null>(null);

  useEffect(() => {
    fetchMessages();
  }, [token]);

  useEffect(() => {
    setAboutForm({ ...cvData.about });
  }, [cvData]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const response = await fetch('/api/messages', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        showToast('error', 'Failed to fetch recruiter inbox submissions.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Error connecting to servers.');
    } finally {
      setLoadingMessages(false);
    }
  };

  const saveAbout = async () => {
    try {
      const response = await fetch('/api/cv/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(aboutForm),
      });
      if (response.ok) {
        showToast('success', 'About summary and profile updated successfully.');
        onRefreshCV();
      } else {
        showToast('error', 'Failed to update about data.');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Error updating database.');
    }
  };

  // --- Skill Management ---
  const handleSaveSkills = async (updatedSkills: SkillItem[]) => {
    try {
      const response = await fetch('/api/cv/skills', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedSkills),
      });
      if (response.ok) {
        showToast('success', 'Skills catalog updated.');
        onRefreshCV();
      } else {
        showToast('error', 'Failed to update skills.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addSkill = () => {
    if (!newSkill.name?.trim()) return;
    const item: SkillItem = {
      id: `skill-${Date.now()}`,
      name: newSkill.name.trim(),
      category: newSkill.category || 'Frontend',
      level: newSkill.level || 'Expert',
    };
    const updated = [...cvData.skills, item];
    handleSaveSkills(updated);
    setNewSkill({ name: '', category: 'Frontend', level: 'Expert' });
  };

  const deleteSkill = (id: string) => {
    const updated = cvData.skills.filter((s) => s.id !== id);
    handleSaveSkills(updated);
  };

  const updateSkill = (skill: SkillItem) => {
    const updated = cvData.skills.map((s) => (s.id === skill.id ? skill : s));
    handleSaveSkills(updated);
    setEditingSkill(null);
  };

  // --- Experience Management ---
  const handleSaveExperience = async (updatedExps: ExperienceItem[]) => {
    try {
      const response = await fetch('/api/cv/experience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedExps),
      });
      if (response.ok) {
        showToast('success', 'Professional experiences catalog updated.');
        onRefreshCV();
      } else {
        showToast('error', 'Failed to save experience catalogue.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addExperience = () => {
    if (!newExp.role?.trim() || !newExp.company?.trim()) {
      showToast('error', 'Role and Company are required!');
      return;
    }
    const item: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: newExp.role.trim(),
      company: newExp.company.trim(),
      period: newExp.period?.trim() || '2026 - Present',
      description: newExp.description?.trim() || '',
    };
    const updated = [...cvData.experience, item];
    handleSaveExperience(updated);
    setNewExp({ role: '', company: '', period: '', description: '' });
  };

  const deleteExperience = (id: string) => {
    const updated = cvData.experience.filter((e) => e.id !== id);
    handleSaveExperience(updated);
  };

  const updateExperience = (exp: ExperienceItem) => {
    const updated = cvData.experience.map((e) => (e.id === exp.id ? exp : e));
    handleSaveExperience(updated);
    setEditingExp(null);
  };

  // --- Project Management ---
  const handleSaveProjects = async (updatedProjects: ProjectItem[]) => {
    try {
      const response = await fetch('/api/cv/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updatedProjects),
      });
      if (response.ok) {
        showToast('success', 'Projects list synchronized.');
        onRefreshCV();
      } else {
        showToast('error', 'Failed to save projects details.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const addProject = () => {
    if (!newProject.title?.trim() || !newProject.description?.trim()) {
      showToast('error', 'Project Title and Description are required!');
      return;
    }
    const tags = projectTagInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const item: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: newProject.title.trim(),
      description: newProject.description.trim(),
      demoUrl: newProject.demoUrl?.trim() || '#',
      githubUrl: newProject.githubUrl?.trim() || '#',
      tags: tags.length ? tags : ['React', 'Web'],
      objective: newProject.objective?.trim() || '',
      process: newProject.process?.trim() || '',
      productLink: newProject.productLink?.trim() || '',
      productType: newProject.productType?.trim() || '',
    };
    const updated = [...cvData.projects, item];
    handleSaveProjects(updated);
    setNewProject({ title: '', description: '', githubUrl: '', demoUrl: '', tags: [], objective: '', process: '', productLink: '', productType: '' });
    setProjectTagInput('');
  };

  const deleteProject = (id: string) => {
    const updated = cvData.projects.filter((p) => p.id !== id);
    handleSaveProjects(updated);
  };

  const updateProject = (project: ProjectItem) => {
    const updated = cvData.projects.map((p) => (p.id === project.id ? project : p));
    handleSaveProjects(updated);
    setEditingProject(null);
  };

  // --- Message Actions ---
  const toggleMessageRead = async (id: string) => {
    try {
      const response = await fetch(`/api/messages/${id}/read`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        fetchMessages();
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage({ ...activeMessage, read: !activeMessage.read });
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this recruiter submission permanently?')) return;
    try {
      const response = await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        showToast('success', 'Message deleted successfully.');
        fetchMessages();
        if (activeMessage && activeMessage.id === id) {
          setActiveMessage(null);
        }
      } else {
        showToast('error', 'Failed to erase message.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div id="admin-dashboard-container" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 20, x: '-50%' }}
            style={{ left: '50%' }}
            className={`fixed bottom-6 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-2 border text-sm font-semibold ${
              toast.type === 'success'
                ? 'bg-slate-900 border-emerald-500/30 text-emerald-300'
                : 'bg-slate-900 border-rose-500/30 text-rose-300'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin Sidebar */}
      <aside id="admin-sidebar" className="w-full md:w-64 bg-[#0D1117] border-r border-slate-800 flex flex-col justify-between shrink-0 font-sans">
        <div>
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <span id="admin-logo" className="text-sm font-bold tracking-widest text-indigo-400 font-mono">WORKSPACE_ADMIN</span>
            <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono rounded-none font-bold uppercase">// LIVE</span>
          </div>
          <div className="p-4 space-y-1">
            <button
              id="tab-messages"
              onClick={() => setActiveTab('messages')}
              className={`w-full flex items-center justify-between px-4 py-2.5 rounded-none text-sm font-medium transition-all ${
                activeTab === 'messages' ? 'bg-[#1E293B] text-indigo-400 border-l-2 border-indigo-500 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" />
                Recruiter Inbox
              </span>
              <span className={`text-xs px-1.5 py-0.5 rounded-none font-mono ${activeTab === 'messages' ? 'bg-[#0A0A0C] text-indigo-400 border border-slate-800' : 'bg-slate-800 text-slate-300'}`}>
                {messages.filter((m) => !m.read).length}
              </span>
            </button>

            <button
              id="tab-about"
              onClick={() => setActiveTab('about')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-none text-sm font-medium transition-all ${
                activeTab === 'about' ? 'bg-[#1E293B] text-indigo-400 border-l-2 border-indigo-500 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              About Profile
            </button>

            <button
              id="tab-skills"
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-none text-sm font-medium transition-all ${
                activeTab === 'skills' ? 'bg-[#1E293B] text-indigo-400 border-l-2 border-indigo-500 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <GraduationCap className="w-4 h-4" />
              Skills Catalog
            </button>

            <button
              id="tab-experience"
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-none text-sm font-medium transition-all ${
                activeTab === 'experience' ? 'bg-[#1E293B] text-indigo-400 border-l-2 border-indigo-500 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Experiences
            </button>

            <button
              id="tab-projects"
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-none text-sm font-medium transition-all ${
                activeTab === 'projects' ? 'bg-[#1E293B] text-indigo-400 border-l-2 border-indigo-500 font-semibold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <FolderDot className="w-4 h-4" />
              Projects Registry
            </button>
          </div>
        </div>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-none bg-[#0A0A0C] border border-slate-800 flex items-center justify-center font-mono text-indigo-400 text-xs font-bold">
              LA
            </div>
            <div>
              <p className="text-xs font-semibold text-white">Lead Architect</p>
              <p className="text-[10px] text-slate-400">admin@portfolio.com</p>
            </div>
          </div>
          <button
            id="admin-logout-button"
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-red-950/30 text-rose-400 border border-rose-950/40 rounded-none text-xs font-semibold hover:bg-red-950/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Admin Working Area */}
      <main id="admin-main-panel" className="flex-1 bg-[#0A0A0C] p-6 md:p-10 overflow-y-auto">
        <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 whitespace-nowrap">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white capitalize">{activeTab} Manager</h1>
            <p className="text-xs text-slate-400 font-mono mt-1">
              HOST: {window.location.host} // ENVIRONMENT: DEVELOPMENT_PREVIEW
            </p>
          </div>
          <button
            onClick={() => window.open('/', '_blank')}
            className="px-4 py-2 bg-[#0D1117] border border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-400 rounded-none text-xs font-semibold flex items-center gap-1.5 transition-colors self-start md:self-auto"
          >
            Preview Landing Page
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* --- ABOUT PROFILE MANAGER --- */}
        {activeTab === 'about' && (
          <div className="max-w-3xl bg-[#0D1117] border border-slate-800 rounded-none p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-1.5 font-mono">
              <Sparkles className="w-5 h-5 text-indigo-400" />
              Biography Info Registry
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Developer Name</label>
                <input
                  type="text"
                  value={aboutForm.name}
                  onChange={(e) => setAboutForm({ ...aboutForm, name: e.target.value })}
                  className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm py-2 px-3 rounded-none outline-none text-white font-medium transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Professional Title</label>
                <input
                  type="text"
                  value={aboutForm.title}
                  onChange={(e) => setAboutForm({ ...aboutForm, title: e.target.value })}
                  className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm py-2 px-3 rounded-none outline-none text-white font-medium transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Hero Tagline</label>
              <input
                type="text"
                value={aboutForm.tagline}
                onChange={(e) => setAboutForm({ ...aboutForm, tagline: e.target.value })}
                className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm py-2 px-3 rounded-none outline-none text-white font-medium transition-colors"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Professional Bio</label>
              <textarea
                rows={5}
                value={aboutForm.bio}
                onChange={(e) => setAboutForm({ ...aboutForm, bio: e.target.value })}
                className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm py-2 px-3 rounded-none outline-none text-white resize-none transition-colors"
              ></textarea>
            </div>

            <div>
              <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Avatar / Image URL (optional)</label>
              <input
                type="text"
                value={aboutForm.avatarUrl}
                onChange={(e) => setAboutForm({ ...aboutForm, avatarUrl: e.target.value })}
                placeholder="e.g. https://picsum.photos/seed/developer/300/300"
                className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm py-2 px-3 rounded-none outline-none text-white transition-colors"
              />
            </div>

            <div className="border-t border-slate-800 pt-6 space-y-4">
              <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">
                // THÔNG TIN BẢO CÁO HỌC PHẦN (VIETNAMESE CURRICULUM PROFILE)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Ngành Học (Major)</label>
                  <input
                    type="text"
                    value={aboutForm.major || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, major: e.target.value })}
                    className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm py-2 px-3 rounded-none outline-none text-white transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Sở Thích Cá Nhân (Hobbies)</label>
                  <input
                    type="text"
                    value={aboutForm.hobbies || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, hobbies: e.target.value })}
                    className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-sm py-2 px-3 rounded-none outline-none text-white transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Mục Tiêu Học Tập (Learning Goals)</label>
                  <textarea
                    rows={3}
                    value={aboutForm.learningGoals || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, learningGoals: e.target.value })}
                    className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-xs py-2 px-3 rounded-none outline-none text-white transition-colors resize-none"
                  ></textarea>
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">Mục Tiêu Portfolio (Portfolio Goals)</label>
                  <textarea
                    rows={3}
                    value={aboutForm.portfolioGoals || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, portfolioGoals: e.target.value })}
                    className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-xs py-2 px-3 rounded-none outline-none text-white transition-colors resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-800/50">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  Bản Đúc Kết & Kết Luận Học Phần
                </h4>

                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">1. Trải Nghiệm & Cảm Nhận</label>
                  <textarea
                    rows={3}
                    value={aboutForm.conclusionExperience || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, conclusionExperience: e.target.value })}
                    className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-xs py-2 px-3 rounded-none outline-none text-white transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">2. Tri Thức & Kỹ Năng Cốt Lõi</label>
                  <textarea
                    rows={3}
                    value={aboutForm.conclusionKnowledge || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, conclusionKnowledge: e.target.value })}
                    className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-xs py-2 px-3 rounded-none outline-none text-white transition-colors resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-mono font-semibold text-slate-400 uppercase mb-1 tracking-wider">3. Điểm Tâm Đắc & Thách Thức</label>
                  <textarea
                    rows={3}
                    value={aboutForm.conclusionTakeaways || ''}
                    onChange={(e) => setAboutForm({ ...aboutForm, conclusionTakeaways: e.target.value })}
                    className="w-full bg-[#0A0A0C] border border-slate-800 focus:border-indigo-500 text-xs py-2 px-3 rounded-none outline-none text-white transition-colors resize-none"
                  ></textarea>
                </div>
              </div>
            </div>

            <button
              onClick={saveAbout}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-none font-semibold text-xs uppercase tracking-widest flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              Save Bio Settings
            </button>
          </div>
        )}

        {/* --- SKILLS MANAGER --- */}
        {activeTab === 'skills' && (
          <div className="space-y-8">
            {/* Create Skill Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Append New Skill Badge</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="e.g. GraphQL"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white font-medium"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Backend">Backend</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Design">Design</option>
                    <option value="Methodology">Methodology</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Proficiency</label>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2.5 px-3 rounded outline-none text-white font-medium"
                  >
                    <option value="Expert">Expert</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Beginner">Beginner</option>
                  </select>
                </div>
              </div>
              <button
                onClick={addSkill}
                className="mt-4 px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 text-sky-400 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
              >
                <Plus className="w-4 h-4" />
                Add to Database
              </button>
            </div>

            {/* List Skills by Category */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-6">Database Skills Catalog</h3>
              <div className="space-y-6">
                {['Frontend', 'Backend', 'DevOps', 'Design', 'Methodology'].map((category) => {
                  const filtered = cvData.skills.filter((s) => s.category === category);
                  if (filtered.length === 0) return null;
                  return (
                    <div key={category} className="border-b border-slate-800/80 pb-4 last:border-0 last:pb-0">
                      <h4 className="text-xs font-bold text-sky-400 font-mono mb-3 uppercase tracking-widest">{category}</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {filtered.map((skill) => (
                          <div
                            key={skill.id}
                            className="flex items-center gap-2 bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg text-xs"
                          >
                            <div>
                              <span className="text-white font-medium block">{skill.name}</span>
                              <span className="text-[9px] text-slate-400 font-mono block uppercase">{skill.level}</span>
                            </div>
                            <button
                              onClick={() => deleteSkill(skill.id)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 ml-1 transition-colors"
                              title="Delete skill"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* --- EXPERIENCE MANAGER --- */}
        {activeTab === 'experience' && (
          <div className="space-y-8">
            {/* Create Exp Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Append Professional Experience</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Role Title</label>
                    <input
                      type="text"
                      value={newExp.role}
                      onChange={(e) => setNewExp({ ...newExp, role: e.target.value })}
                      placeholder="e.g. Staff Architect"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Company</label>
                    <input
                      type="text"
                      value={newExp.company}
                      onChange={(e) => setNewExp({ ...newExp, company: e.target.value })}
                      placeholder="e.g. OpenAI"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Period (Years/Months)</label>
                    <input
                      type="text"
                      value={newExp.period}
                      onChange={(e) => setNewExp({ ...newExp, period: e.target.value })}
                      placeholder="e.g. 2024 - Present"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Key Responsibilities / Impact Description</label>
                  <textarea
                    rows={3}
                    value={newExp.description}
                    onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                    placeholder="Describe main stack accomplishments and key technical deliverables..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white resize-none"
                  ></textarea>
                </div>
                <button
                  onClick={addExperience}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 text-sky-400 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Save Experience
                </button>
              </div>
            </div>

            {/* List CV Experiences */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Experiences Timeline Database</h3>
              {cvData.experience.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 font-mono text-center">No experience timeline added yet.</p>
              ) : (
                <div className="divide-y divide-slate-800">
                  {cvData.experience.map((exp) => (
                    <div key={exp.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row justify-between gap-4">
                      {editingExp?.id === exp.id ? (
                        <div className="flex-1 space-y-3 p-4 bg-slate-950 rounded border border-slate-800">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <input
                              type="text"
                              value={editingExp.role}
                              onChange={(e) => setEditingExp({ ...editingExp, role: e.target.value })}
                              className="bg-slate-900 border border-slate-700 text-xs py-1.5 px-2 rounded text-white"
                            />
                            <input
                              type="text"
                              value={editingExp.company}
                              onChange={(e) => setEditingExp({ ...editingExp, company: e.target.value })}
                              className="bg-slate-900 border border-slate-700 text-xs py-1.5 px-2 rounded text-white"
                            />
                            <input
                              type="text"
                              value={editingExp.period}
                              onChange={(e) => setEditingExp({ ...editingExp, period: e.target.value })}
                              className="bg-slate-900 border border-slate-700 text-xs py-1.5 px-2 rounded text-white"
                            />
                          </div>
                          <textarea
                            rows={3}
                            value={editingExp.description}
                            onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 text-xs py-1.5 px-2 rounded text-white resize-none"
                          ></textarea>
                          <div className="flex gap-2">
                            <button
                              onClick={() => updateExperience(editingExp)}
                              className="px-2.5 py-1 bg-sky-400 text-slate-950 text-[11px] font-bold rounded flex items-center gap-1 cursor-pointer"
                            >
                              Save Draft
                            </button>
                            <button
                              onClick={() => setEditingExp(null)}
                              className="px-2.5 py-1 bg-slate-800 text-slate-300 text-[11px] font-bold rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-white">{exp.role}</h4>
                              <span className="text-xs text-sky-400 font-mono">@ {exp.company}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-mono block mt-0.5">{exp.period}</span>
                            <p className="text-xs text-slate-300 mt-2 leading-relaxed">{exp.description}</p>
                          </div>
                          <div className="flex md:flex-col items-center gap-2 self-start md:self-auto">
                            <button
                              onClick={() => setEditingExp({ ...exp })}
                              className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 text-sky-400 text-xs border border-slate-800 rounded font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteExperience(exp.id)}
                              className="px-2.5 py-1 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 text-xs border border-rose-950/20 rounded font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- PROJECTS MANAGER --- */}
        {activeTab === 'projects' && (
          <div className="space-y-8">
            {/* Create Project Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl max-w-2xl">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Append Active Project Profile</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={newProject.title}
                      onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                      placeholder="e.g. Helix Distributed Node"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white font-medium"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Tech Tags (comma separated)</label>
                    <input
                      type="text"
                      value={projectTagInput}
                      onChange={(e) => setProjectTagInput(e.target.value)}
                      placeholder="e.g. React, Next.js, Node.js"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">GitHub Repository Link</label>
                    <input
                      type="text"
                      value={newProject.githubUrl}
                      onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                      placeholder="e.g. https://github.com/profile/repo"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Live Demo / Deployment Link</label>
                    <input
                      type="text"
                      value={newProject.demoUrl}
                      onChange={(e) => setNewProject({ ...newProject, demoUrl: e.target.value })}
                      placeholder="e.g. https://demourl.com"
                      className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Project High-Impact Summary</label>
                  <textarea
                    rows={2}
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Describe context background, architectural choices, and key deliverables..."
                    className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white resize-none"
                  ></textarea>
                </div>

                <div className="border-t border-slate-800/60 pt-4 space-y-4">
                  <h4 className="text-[10px] text-indigo-400 font-mono tracking-wider uppercase font-bold">// VIETNAMESE CURRICULUM PROJECT METADATA</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Mục Tiêu Của Bài Tập (Project Objective)</label>
                      <textarea
                        rows={2}
                        value={newProject.objective || ''}
                        onChange={(e) => setNewProject({ ...newProject, objective: e.target.value })}
                        placeholder="Nêu rõ mục tiêu học thuật hoặc kỹ năng môn học cần chứng minh..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white resize-none"
                      ></textarea>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Tóm Tắt Quá Trình Thực Hiện (Process)</label>
                      <textarea
                        rows={2}
                        value={newProject.process || ''}
                        onChange={(e) => setNewProject({ ...newProject, process: e.target.value })}
                        placeholder="Quá trình lên ý tưởng, phác thảo, thiết kế và tối ưu hoàn thiện sản phẩm..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white resize-none"
                      ></textarea>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Định Dạng Sản Phẩm Công Bố (Product Type)</label>
                      <input
                        type="text"
                        value={newProject.productType || ''}
                        onChange={(e) => setNewProject({ ...newProject, productType: e.target.value })}
                        placeholder="e.g. Báo cáo PDF, Slide thuyết trình Canva, Đường link YouTube"
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-400 mb-1">Link Sản Phẩm Cuối Cùng (Product Link)</label>
                      <input
                        type="text"
                        value={newProject.productLink || ''}
                        onChange={(e) => setNewProject({ ...newProject, productLink: e.target.value })}
                        placeholder="e.g. https://drive.google.com/..."
                        className="w-full bg-slate-950 border border-slate-800 focus:border-sky-400 text-xs py-2 px-3 rounded outline-none text-white"
                      />
                    </div>
                  </div>
                </div>

                <button
                  onClick={addProject}
                  className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-700 hover:border-sky-400 text-sky-400 rounded text-xs font-semibold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Append Project
                </button>
              </div>
            </div>

            {/* List Projects */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Projects Registry</h3>
              {cvData.projects.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 font-mono text-center">No projects registered in catalog.</p>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {cvData.projects.map((proj) => (
                    <div key={proj.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between gap-4">
                      {editingProject?.id === proj.id ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={editingProject.title}
                            onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                            className="bg-slate-900 border border-slate-700 text-xs py-1.5 px-2 rounded text-white w-full"
                          />
                          <textarea
                            rows={3}
                            value={editingProject.description || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                            className="w-full bg-slate-900 border border-slate-700 text-xs py-1.5 px-2 rounded text-white resize-none"
                          ></textarea>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              value={editingProject.githubUrl || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                              placeholder="Github Link"
                              className="bg-slate-900 border border-slate-700 text-[11px] py-1 px-2 rounded text-white"
                            />
                            <input
                              type="text"
                              value={editingProject.demoUrl || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, demoUrl: e.target.value })}
                              placeholder="Demo Link"
                              className="bg-slate-900 border border-slate-700 text-[11px] py-1 px-2 rounded text-white"
                            />
                          </div>

                          <div className="space-y-2 p-2.5 bg-slate-900 rounded border border-slate-800">
                            <label className="block text-[9px] font-mono font-bold text-indigo-400 uppercase">Mục Tiêu (Objective)</label>
                            <textarea
                              rows={2}
                              value={editingProject.objective || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, objective: e.target.value })}
                              className="bg-slate-950 border border-slate-800 text-[11px] py-1 px-1.5 rounded text-white w-full resize-none"
                            ></textarea>

                            <label className="block text-[9px] font-mono font-bold text-indigo-400 uppercase">Tiến Trình (Process)</label>
                            <textarea
                              rows={2}
                              value={editingProject.process || ''}
                              onChange={(e) => setEditingProject({ ...editingProject, process: e.target.value })}
                              className="bg-slate-950 border border-slate-800 text-[11px] py-1 px-1.5 rounded text-white w-full resize-none"
                            ></textarea>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">Định Dạng (Type)</label>
                                <input
                                  type="text"
                                  value={editingProject.productType || ''}
                                  onChange={(e) => setEditingProject({ ...editingProject, productType: e.target.value })}
                                  className="bg-slate-950 border border-slate-800 text-[11px] py-1 px-1.5 rounded text-white w-full"
                                />
                              </div>
                              <div>
                                <label className="block text-[9px] font-mono font-bold text-slate-400 uppercase">Sản Phẩm Link</label>
                                <input
                                  type="text"
                                  value={editingProject.productLink || ''}
                                  onChange={(e) => setEditingProject({ ...editingProject, productLink: e.target.value })}
                                  className="bg-slate-950 border border-slate-800 text-[11px] py-1 px-1.5 rounded text-white w-full"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => updateProject(editingProject)}
                              className="px-2 py-1 bg-sky-400 text-slate-950 text-[11px] font-bold rounded cursor-pointer"
                            >
                              Update
                            </button>
                            <button
                              onClick={() => setEditingProject(null)}
                              className="px-2 py-1 bg-slate-800 text-slate-300 text-[11px] font-bold rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div>
                            <h4 className="text-sm font-bold text-white mb-1">{proj.title}</h4>
                            <p className="text-xs text-slate-300 leading-relaxed mb-3">{proj.description}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {proj.tags.map((tag) => (
                                <span key={tag} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[9px] text-sky-400">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 pt-2 border-t border-slate-900">
                            <button
                              onClick={() => setEditingProject({ ...proj })}
                              className="px-2.5 py-1 bg-slate-900 hover:bg-slate-850 text-sky-400 text-xs border border-slate-800 rounded font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Edit2 className="w-3 h-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => deleteProject(proj.id)}
                              className="px-2.5 py-1 bg-rose-950/10 hover:bg-rose-950/20 text-rose-400 text-xs border border-rose-950/20 rounded font-semibold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              Delete
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- RECRUITER MESSAGES INBOX --- */}
        {activeTab === 'messages' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* List column */}
            <div className="lg:col-span-5 bg-[#0D1117] border border-slate-800 rounded-none p-5 shadow-xl h-[600px] flex flex-col">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2 font-mono">
                <Mail className="w-4 h-4 text-indigo-400" />
                Submissions ({messages.length})
              </h3>
              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {loadingMessages ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-2">
                    <p className="text-xs text-indigo-400 font-mono animate-pulse">Syncing inbox...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-20">
                    <Mail className="w-8 h-8 text-slate-700 mx-auto mb-2" />
                    <p className="text-xs text-slate-500 font-mono">No submissions received yet.</p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => {
                        setActiveMessage(m);
                        if (!m.read) toggleMessageRead(m.id);
                      }}
                      className={`p-3.5 rounded-none border text-left cursor-pointer transition-all duration-200 ${
                        activeMessage?.id === m.id
                          ? 'bg-indigo-500/10 border-indigo-500 text-white shadow-md'
                          : m.read
                          ? 'bg-[#0A0A0C]/65 border-slate-900 hover:border-slate-800 text-slate-400'
                          : 'bg-[#0A0A0C] border-slate-800 hover:border-slate-700 text-slate-200 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <span className="text-xs font-bold truncate max-w-[150px]">{m.name}</span>
                        <span className="text-[9px] text-slate-500 font-mono shrink-0">
                          {new Date(m.createdAt).toLocaleDateString('en', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-slate-300 truncate mb-1">{m.subject}</p>
                      <div className="flex items-center gap-1 bg-[#0A0A0C] px-1.5 py-0.5 rounded-none text-[9px] w-fit font-mono text-slate-400 truncate max-w-full">
                        🏢 {m.company}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Details Panel column */}
            <div className="lg:col-span-7 bg-[#0D1117] border border-slate-800 rounded-none p-6 shadow-xl h-[600px] flex flex-col justify-between">
              {activeMessage ? (
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    <header className="border-b border-slate-800 pb-4 mb-4 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white leading-snug">{activeMessage.subject}</h3>
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-400 mt-2 font-mono">
                          <span>Sender: <strong className="text-white font-sans">{activeMessage.name}</strong></span>
                          <span>Company: <strong className="text-white font-sans">{activeMessage.company}</strong></span>
                        </div>
                        <p className="text-xs text-indigo-400 font-mono mt-1">
                          Email: <a href={`mailto:${activeMessage.email}`} className="underline hover:text-indigo-300">{activeMessage.email}</a>
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono shrink-0 text-right">
                        {new Date(activeMessage.createdAt).toLocaleDateString()}
                        <br />
                        {new Date(activeMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </header>

                    <div className="flex-1 overflow-y-auto max-h-[300px] bg-[#0A0A0C] border border-slate-850 p-4 rounded-none">
                      <p className="text-sm text-slate-300 leading-relaxed font-sans whitespace-pre-wrap">
                        {activeMessage.message}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0A0A0C]/40 px-4 py-3 rounded-none">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleMessageRead(activeMessage.id)}
                        className="px-3 py-1.5 bg-[#0A0A0C] hover:bg-slate-850 border border-slate-850 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-none flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        {activeMessage.read ? (
                          <>
                            <Mail className="w-3.5 h-3.5 text-slate-400" />
                            Mark Unread
                          </>
                        ) : (
                          <>
                            <MailOpen className="w-3.5 h-3.5 text-indigo-400" />
                            Mark Read
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => deleteMessage(activeMessage.id)}
                        className="px-3 py-1.5 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 border border-rose-950/20 text-xs font-semibold rounded-none flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Erase Submissions
                      </button>
                    </div>
                    <a
                      href={`mailto:${activeMessage.email}?subject=RE: ${encodeURIComponent(activeMessage.subject)}`}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-none flex items-center justify-center gap-1 shrink-0 transition-colors uppercase tracking-widest"
                    >
                      Draft Reply Email
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 font-mono text-xs py-10">
                  <Mail className="w-12 h-12 text-slate-800 mb-2" />
                  Select a recruiter submission from the Inbox to review context.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
