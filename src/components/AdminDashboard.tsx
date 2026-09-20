import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Users,
  FileCode,
  BookOpen,
  Bell,
  Trophy,
  Settings,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  X,
  Phone,
  Mail,
  Calendar,
  Layers,
  Save,
  RefreshCw,
  ExternalLink,
  UploadCloud,
  Download,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import {
  DemoEnquiry,
  ContactEnquiry,
  QuestionPDF,
  StudyMaterial,
  Announcement,
  Achievement,
  WebsiteContent,
  ClassLevel,
  Subject,
  DifficultyLevel,
  ExamType,
  MaterialType,
} from '../types';
import { api } from '../services/api';
import { MathsFactLogo } from './MathsFactLogo';
import { FileUploadField } from './FileUploadField';
import { WebsiteContentManager } from './WebsiteContentManager';

interface AdminDashboardProps {
  onClose: () => void;
  onLogout: () => void;
  onDataUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onLogout,
  onDataUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'demos' | 'enquiries' | 'qpdfs' | 'materials' | 'notices' | 'results' | 'settings'
  >('overview');

  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  // Loaded data
  const [demoEnquiries, setDemoEnquiries] = useState<DemoEnquiry[]>([]);
  const [contactEnquiries, setContactEnquiries] = useState<ContactEnquiry[]>([]);
  const [questionPdfs, setQuestionPdfs] = useState<QuestionPDF[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [content, setContent] = useState<WebsiteContent | null>(null);

  // New item modal forms
  const [showAddPdfModal, setShowAddPdfModal] = useState(false);
  const [showAddMaterialModal, setShowAddMaterialModal] = useState(false);
  const [showAddNoticeModal, setShowAddNoticeModal] = useState(false);
  const [showAddAchievementModal, setShowAddAchievementModal] = useState(false);

  // New PDF state
  const [newPdf, setNewPdf] = useState({
    title: '',
    classLevel: 'Class X' as ClassLevel,
    subject: 'Mathematics' as Subject,
    chapter: '',
    topic: '',
    difficulty: 'Medium' as DifficultyLevel,
    examType: 'Board Exam' as ExamType,
    description: '',
    questionsCount: 25,
    sampleQuestions: '',
    fileUrl: '',
    fileName: '',
    fileSize: '',
  });

  // New Study Material state
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    classLevel: 'Class X' as ClassLevel,
    subject: 'Mathematics' as Subject,
    type: 'Notes' as MaterialType,
    description: '',
    fileUrl: '',
    fileName: '',
    fileSize: '',
  });

  // New Notice state
  const [newNotice, setNewNotice] = useState({
    title: '',
    description: '',
    isImportant: true,
    fileUrl: '',
  });

  // New Achievement state
  const [newAchievement, setNewAchievement] = useState({
    studentName: '',
    classLevel: 'Class X' as ClassLevel,
    achievement: '',
    year: '2024',
    scoreOrRank: '98% in CBSE Mathematics',
    photoUrl: '',
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [demos, contacts, qpdfs, mats, notices, achs, siteContent] = await Promise.all([
        api.getDemoEnquiries(),
        api.getContactEnquiries(),
        api.getQuestionPdfs(),
        api.getStudyMaterials(),
        api.getAnnouncements(),
        api.getAchievements(),
        api.getContent(),
      ]);

      setDemoEnquiries(demos);
      setContactEnquiries(contacts);
      setQuestionPdfs(qpdfs);
      setMaterials(mats);
      setAnnouncements(notices);
      setAchievements(achs);
      setContent(siteContent);
    } catch (err: any) {
      console.error('Failed to load admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showToast = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(null), 3500);
  };

  // Demo status update
  const handleUpdateDemoStatus = async (id: string, status: DemoEnquiry['status']) => {
    try {
      await api.updateDemoStatus(id, status);
      setDemoEnquiries((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      );
      showToast('Enquiry status updated successfully.');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status');
    }
  };

  // Delete confirmation modal state
  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState<{
    type: 'pdf' | 'material' | 'notice' | 'achievement' | 'demo' | 'contact';
    id: string;
    title: string;
  } | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Perform confirmed deletion
  const handleConfirmDelete = async () => {
    if (!deleteConfirmTarget) return;
    setDeleteLoading(true);
    const { type, id, title } = deleteConfirmTarget;
    try {
      if (type === 'pdf') {
        await api.deleteQuestionPdf(id);
        setQuestionPdfs((prev) => prev.filter((p) => p.id !== id));
        showToast(`Question PDF "${title}" deleted.`);
      } else if (type === 'material') {
        await api.deleteStudyMaterial(id);
        setMaterials((prev) => prev.filter((m) => m.id !== id));
        showToast(`Study Material "${title}" deleted.`);
      } else if (type === 'notice') {
        await api.deleteAnnouncement(id);
        setAnnouncements((prev) => prev.filter((a) => a.id !== id));
        showToast(`Announcement "${title}" removed.`);
      } else if (type === 'achievement') {
        await api.deleteAchievement(id);
        setAchievements((prev) => prev.filter((a) => a.id !== id));
        showToast(`Student achievement record removed.`);
      } else if (type === 'demo') {
        await api.deleteDemoEnquiry(id);
        setDemoEnquiries((prev) => prev.filter((d) => d.id !== id));
        showToast(`Demo enquiry removed.`);
      } else if (type === 'contact') {
        await api.deleteContactEnquiry(id);
        setContactEnquiries((prev) => prev.filter((c) => c.id !== id));
        showToast(`Contact enquiry removed.`);
      }
      setDeleteConfirmTarget(null);
      onDataUpdated();
    } catch (err: any) {
      console.error('Delete failed:', err);
      showToast(`Delete failed: ${err.message || 'Error occurred'}`);
    } finally {
      setDeleteLoading(false);
    }
  };

  // Add Question PDF
  const handleCreatePdf = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPdf.title || !newPdf.chapter) return;
    setSaveLoading(true);
    try {
      const created = await api.createQuestionPdf({
        title: newPdf.title,
        classLevel: newPdf.classLevel,
        subject: newPdf.subject,
        chapter: newPdf.chapter,
        topic: newPdf.topic || newPdf.chapter,
        difficulty: newPdf.difficulty,
        examType: newPdf.examType,
        description: newPdf.description,
        fileUrl: newPdf.fileUrl || '/question_pdfs/sample.pdf',
        fileName: newPdf.fileName || `${newPdf.title}.pdf`,
        fileSize: newPdf.fileSize || '1.2 MB',
        questionsCount: Number(newPdf.questionsCount) || 20,
        sampleQuestions: newPdf.sampleQuestions
          ? newPdf.sampleQuestions.split('\n').filter(Boolean)
          : undefined,
      });

      setQuestionPdfs([created, ...questionPdfs]);
      setShowAddPdfModal(false);
      setNewPdf({
        title: '',
        classLevel: 'Class X',
        subject: 'Mathematics',
        chapter: '',
        topic: '',
        difficulty: 'Medium',
        examType: 'Board Exam',
        description: '',
        questionsCount: 25,
        sampleQuestions: '',
        fileUrl: '',
        fileName: '',
        fileSize: '',
      });
      showToast('Question PDF created and published!');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to create PDF');
    } finally {
      setSaveLoading(false);
    }
  };

  // Trigger Delete Question PDF
  const handleDeletePdf = (id: string, title: string) => {
    setDeleteConfirmTarget({ type: 'pdf', id, title });
  };

  // Add Material
  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterial.title) return;
    setSaveLoading(true);
    try {
      const created = await api.createStudyMaterial({
        ...newMaterial,
        fileUrl: newMaterial.fileUrl || '/materials/sample.pdf',
        fileName: newMaterial.fileName || `${newMaterial.title}.pdf`,
        fileSize: newMaterial.fileSize || '1.5 MB',
        isPublished: true,
      });
      setMaterials([created, ...materials]);
      setShowAddMaterialModal(false);
      setNewMaterial({
        title: '',
        classLevel: 'Class X',
        subject: 'Mathematics',
        type: 'Notes',
        description: '',
        fileUrl: '',
        fileName: '',
        fileSize: '',
      });
      showToast('Study Material published!');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to create material');
    } finally {
      setSaveLoading(false);
    }
  };

  // Trigger Delete Material
  const handleDeleteMaterial = (id: string, title: string) => {
    setDeleteConfirmTarget({ type: 'material', id, title });
  };

  // Add Notice
  const handleCreateNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNotice.title) return;
    setSaveLoading(true);
    try {
      const created = await api.createAnnouncement({
        title: newNotice.title,
        description: newNotice.description,
        isImportant: newNotice.isImportant,
        fileUrl: newNotice.fileUrl || undefined,
      });
      setAnnouncements([created, ...announcements]);
      setShowAddNoticeModal(false);
      setNewNotice({ title: '', description: '', isImportant: true, fileUrl: '' });
      showToast('Announcement posted!');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to create announcement');
    } finally {
      setSaveLoading(false);
    }
  };

  // Trigger Delete Notice
  const handleDeleteNotice = (id: string, title: string) => {
    setDeleteConfirmTarget({ type: 'notice', id, title });
  };

  // Add Achievement
  const handleCreateAchievement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAchievement.studentName) return;
    setSaveLoading(true);
    try {
      const created = await api.createAchievement({
        studentName: newAchievement.studentName,
        classLevel: newAchievement.classLevel,
        achievement: newAchievement.achievement,
        year: newAchievement.year,
        scoreOrRank: newAchievement.scoreOrRank,
        photoUrl: newAchievement.photoUrl || undefined,
      });
      setAchievements([created, ...achievements]);
      setShowAddAchievementModal(false);
      setNewAchievement({
        studentName: '',
        classLevel: 'Class X',
        achievement: '',
        year: '2024',
        scoreOrRank: '98% in CBSE Mathematics',
        photoUrl: '',
      });
      showToast('Student achievement added!');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to add achievement');
    } finally {
      setSaveLoading(false);
    }
  };

  // Trigger Delete Achievement
  const handleDeleteAchievement = (id: string, title: string) => {
    setDeleteConfirmTarget({ type: 'achievement', id, title });
  };

  // Save Website Content
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content) return;
    setSaveLoading(true);
    try {
      const updated = await api.updateContent(content);
      setContent(updated);
      showToast('Institute website content saved successfully!');
      onDataUpdated();
    } catch (err: any) {
      showToast(err.message || 'Failed to save settings');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div
      id="admin-dashboard-full"
      className="fixed inset-0 z-50 flex flex-col bg-[#090C12] text-zinc-200 overflow-hidden animate-in fade-in duration-200"
    >
      {/* Top Bar */}
      <header className="bg-[#0F131C] border-b border-red-900/40 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MathsFactLogo size="sm" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold text-white">MATHS FACT Administration</h1>
              <span className="text-[10px] px-2 py-0.5 rounded bg-red-900/80 text-red-200 font-bold uppercase">
                Director Mode
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">Direct Faculty Management • Satyam Sir</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {statusMsg && (
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-green-950 border border-green-700/60 text-xs text-green-300 animate-in fade-in">
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{statusMsg}</span>
            </div>
          )}

          <button
            onClick={loadAllData}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white"
          >
            Return to Site
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-xs font-bold text-white shadow"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-60 bg-[#0C0F17] border-r border-zinc-800/80 p-3 space-y-1 shrink-0 overflow-x-auto md:overflow-y-auto">
          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider px-3 py-2">
            Modules
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'overview'
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4" />
              <span>Overview</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('demos')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'demos'
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span>1-Week Demo Bookings</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              {demoEnquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'enquiries'
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-red-400" />
              <span>Contact Enquiries</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
              {contactEnquiries.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('qpdfs')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'qpdfs'
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>Question PDFs</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
              {questionPdfs.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('materials')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'materials'
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <BookOpen className="w-4 h-4 text-red-400" />
              <span>Study Material</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
              {materials.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('notices')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'notices'
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Bell className="w-4 h-4 text-amber-400" />
              <span>Notice Board</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
              {announcements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('results')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'results'
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Student Results</span>
            </div>
            <span className="px-1.5 py-0.2 rounded-full bg-zinc-800 text-zinc-300 text-[10px]">
              {achievements.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'bg-red-600 text-white font-bold'
                : 'text-zinc-400 hover:bg-zinc-800/60 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>Website CMS &amp; Media</span>
            </div>
            <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold">
              Photos &amp; Text
            </span>
          </button>
        </aside>

        {/* Workspace Panels */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto bg-[#090C12]">
          {loading ? (
            <div className="flex items-center justify-center h-64 text-zinc-400 text-sm">
              Loading administration datasets...
            </div>
          ) : (
            <>
              {/* TAB: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-2xl bg-[#121622] border border-amber-500/30">
                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Free Demo Requests</span>
                        <Calendar className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-3xl font-extrabold text-white mt-2">
                        {demoEnquiries.length}
                      </div>
                      <span className="text-[11px] text-amber-400 font-semibold">
                        {demoEnquiries.filter((d) => d.status === 'New').length} Pending Callbacks
                      </span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121622] border border-red-800/40">
                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Contact Enquiries</span>
                        <Mail className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="text-3xl font-extrabold text-white mt-2">
                        {contactEnquiries.length}
                      </div>
                      <span className="text-[11px] text-zinc-400">Total Admission Inquiries</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121622] border border-zinc-800">
                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Question PDFs</span>
                        <FileCode className="w-4 h-4 text-amber-400" />
                      </div>
                      <div className="text-3xl font-extrabold text-white mt-2">
                        {questionPdfs.length}
                      </div>
                      <span className="text-[11px] text-zinc-400">Class III to XII Repository</span>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#121622] border border-zinc-800">
                      <div className="flex items-center justify-between text-zinc-400 text-xs">
                        <span>Study Notes &amp; Sheets</span>
                        <BookOpen className="w-4 h-4 text-red-400" />
                      </div>
                      <div className="text-3xl font-extrabold text-white mt-2">
                        {materials.length}
                      </div>
                      <span className="text-[11px] text-zinc-400">Active Materials</span>
                    </div>
                  </div>

                  {/* Recent Demo Bookings Section */}
                  <div className="p-6 rounded-2xl bg-[#121622] border border-zinc-800">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        <span>Recent 1-Week Free Demo Registrations</span>
                      </h3>
                      <button
                        onClick={() => setActiveTab('demos')}
                        className="text-xs font-semibold text-red-400 hover:text-red-300"
                      >
                        View All
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs text-zinc-300">
                        <thead className="bg-[#0C0F17] text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                          <tr>
                            <th className="p-3">Student Name</th>
                            <th className="p-3">Class</th>
                            <th className="p-3">Subject</th>
                            <th className="p-3">Phone</th>
                            <th className="p-3">Registered On</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800">
                          {demoEnquiries.slice(0, 5).map((d) => (
                            <tr key={d.id} className="hover:bg-zinc-800/40">
                              <td className="p-3 font-semibold text-white">{d.studentName}</td>
                              <td className="p-3">{d.classLevel}</td>
                              <td className="p-3">{d.preferredSubject}</td>
                              <td className="p-3 font-mono text-amber-300">{d.phone}</td>
                              <td className="p-3">{new Date(d.createdAt).toLocaleDateString()}</td>
                              <td className="p-3">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    d.status === 'New'
                                      ? 'bg-red-950 text-red-300 border border-red-700'
                                      : 'bg-green-950 text-green-300 border border-green-700'
                                  }`}
                                >
                                  {d.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: 1-WEEK FREE DEMO REQUESTS */}
              {activeTab === 'demos' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">1-Week Free Demo Inquiries</h2>
                      <p className="text-xs text-zinc-400">
                        All student registrations for the trial session with Satyam Sir.
                      </p>
                    </div>
                  </div>

                  <div className="overflow-x-auto rounded-2xl bg-[#121622] border border-zinc-800">
                    <table className="w-full text-left text-xs text-zinc-300">
                      <thead className="bg-[#0C0F17] text-zinc-400 uppercase font-semibold border-b border-zinc-800">
                        <tr>
                          <th className="p-3">Student &amp; Parent</th>
                          <th className="p-3">Class &amp; Subject</th>
                          <th className="p-3">School</th>
                          <th className="p-3">Phone &amp; Email</th>
                          <th className="p-3">Preferred Date</th>
                          <th className="p-3">Status</th>
                          <th className="p-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800">
                        {demoEnquiries.map((d) => (
                          <tr key={d.id} className="hover:bg-zinc-800/40">
                            <td className="p-3">
                              <div className="font-bold text-white">{d.studentName}</div>
                              {d.parentName && (
                                <div className="text-[11px] text-zinc-400">Parent: {d.parentName}</div>
                              )}
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-red-400">{d.classLevel}</span>
                              <div className="text-[11px] text-zinc-400">{d.preferredSubject}</div>
                            </td>
                            <td className="p-3">{d.schoolName || '—'}</td>
                            <td className="p-3 font-mono">
                              <a href={`tel:${d.phone}`} className="text-amber-300 hover:underline block">
                                {d.phone}
                              </a>
                              {d.email && <span className="text-[10px] text-zinc-400">{d.email}</span>}
                            </td>
                            <td className="p-3">{d.preferredDate || 'Earliest Batch'}</td>
                            <td className="p-3">
                              <select
                                value={d.status}
                                onChange={(e) =>
                                  handleUpdateDemoStatus(d.id, e.target.value as DemoEnquiry['status'])
                                }
                                className="bg-[#0D1017] border border-zinc-700 rounded px-2 py-1 text-xs text-white"
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Closed">Closed / Enrolled</option>
                              </select>
                            </td>
                            <td className="p-3">
                              <a
                                href={`https://wa.me/91${d.phone}?text=${encodeURIComponent(
                                  `Hello ${d.studentName}, Satyam Sir from Maths Fact here regarding your 1-Week Free Demo class booking.`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-block px-2.5 py-1 rounded bg-green-700 hover:bg-green-600 text-white text-[11px] font-semibold"
                              >
                                WhatsApp
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB: CONTACT ENQUIRIES */}
              {activeTab === 'enquiries' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">General Contact Inquiries</h2>
                      <p className="text-xs text-zinc-400">Questions submitted through the contact page.</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {contactEnquiries.map((enq) => (
                      <div
                        key={enq.id}
                        className="p-4 rounded-xl bg-[#121622] border border-zinc-800 flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{enq.name}</span>
                            <span className="text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {enq.classLevel}
                            </span>
                            <span className="text-[11px] text-zinc-500">• {new Date(enq.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="text-xs font-semibold text-amber-400">{enq.subject}</div>
                          <p className="text-xs text-zinc-300 leading-relaxed bg-[#0D1017] p-2.5 rounded-lg mt-2">
                            {enq.message}
                          </p>
                        </div>

                        <div className="flex flex-col items-start md:items-end justify-between gap-2 shrink-0">
                          <div className="flex items-center gap-2">
                            <a
                              href={`tel:${enq.phone}`}
                              className="px-3 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs text-white"
                            >
                              Call: {enq.phone}
                            </a>
                            <a
                              href={`https://wa.me/91${enq.phone}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 rounded-lg bg-green-700 hover:bg-green-600 text-xs text-white"
                            >
                              WhatsApp
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: QUESTION PDFS */}
              {activeTab === 'qpdfs' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Question PDFs Management</h2>
                      <p className="text-xs text-zinc-400">
                        Upload or delete problem sheets and question banks.
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddPdfModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add New Question PDF</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {questionPdfs.map((pdf) => (
                      <div
                        key={pdf.id}
                        className="p-4 rounded-xl bg-[#121622] border border-zinc-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] mb-2">
                            <span className="font-bold text-red-400">{pdf.classLevel}</span>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {pdf.difficulty}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">{pdf.title}</h4>
                          <div className="text-xs text-amber-400 mb-2">
                            {pdf.chapter} • {pdf.topic}
                          </div>
                          <p className="text-xs text-zinc-400 line-clamp-2">{pdf.description}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between">
                          <span className="text-[11px] text-zinc-500">
                            {pdf.questionsCount} Questions
                          </span>
                          <button
                            onClick={() => handleDeletePdf(pdf.id, pdf.title)}
                            className="p-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800/60"
                            title="Delete PDF"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: STUDY MATERIAL */}
              {activeTab === 'materials' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Study Materials</h2>
                      <p className="text-xs text-zinc-400">Notes, worksheets, sample papers.</p>
                    </div>
                    <button
                      onClick={() => setShowAddMaterialModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Study Material</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {materials.map((mat) => (
                      <div
                        key={mat.id}
                        className="p-4 rounded-xl bg-[#121622] border border-zinc-800 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between text-[10px] mb-2">
                            <span className="font-bold text-amber-400">{mat.classLevel}</span>
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                              {mat.type}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mb-1">{mat.title}</h4>
                          <div className="text-xs text-zinc-400 mb-2">{mat.subject}</div>
                          <p className="text-xs text-zinc-400 line-clamp-2">{mat.description}</p>
                        </div>

                        <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between">
                          <span className="text-[11px] text-zinc-500">{mat.uploadDate}</span>
                          <button
                            onClick={() => handleDeleteMaterial(mat.id, mat.title)}
                            className="p-1.5 rounded bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800/60"
                            title="Delete Material"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: NOTICES */}
              {activeTab === 'notices' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Notice Board Announcements</h2>
                      <p className="text-xs text-zinc-400">Broadcast important admission or exam notices.</p>
                    </div>
                    <button
                      onClick={() => setShowAddNoticeModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Post New Notice</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {announcements.map((ann) => (
                      <div
                        key={ann.id}
                        className="p-4 rounded-xl bg-[#121622] border border-zinc-800 flex items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-white">{ann.title}</span>
                            {ann.isImportant && (
                              <span className="text-[10px] bg-red-950 text-red-300 font-bold px-1.5 py-0.2 rounded border border-red-700">
                                Important
                              </span>
                            )}
                            <span className="text-[11px] text-zinc-500">• {ann.date}</span>
                          </div>
                          <p className="text-xs text-zinc-400">{ann.description}</p>
                        </div>

                        <button
                          onClick={() => handleDeleteNotice(ann.id, ann.title)}
                          className="p-2 rounded bg-red-950 hover:bg-red-900 text-red-400 shrink-0"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: RESULTS */}
              {activeTab === 'results' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-white">Student Achievements</h2>
                      <p className="text-xs text-zinc-400">Add verified board and Olympiad milestones.</p>
                    </div>
                    <button
                      onClick={() => setShowAddAchievementModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Achievement</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {achievements.map((ach) => (
                      <div
                        key={ach.id}
                        className="p-4 rounded-xl bg-[#121622] border border-zinc-800 flex flex-col justify-between"
                      >
                        <div>
                          <span className="text-xs font-semibold text-red-400">{ach.classLevel}</span>
                          <h4 className="text-base font-bold text-white mt-1">{ach.studentName}</h4>
                          <div className="text-xs text-amber-400 font-bold mt-1">{ach.scoreOrRank}</div>
                          <p className="text-xs text-zinc-400 mt-2">{ach.achievement}</p>
                        </div>
                        <div className="pt-3 mt-3 border-t border-zinc-800 flex items-center justify-between">
                          <span className="text-xs text-zinc-500">Year: {ach.year}</span>
                          <button
                            onClick={() => handleDeleteAchievement(ach.id, ach.studentName)}
                            className="p-1.5 rounded bg-red-950 hover:bg-red-900 text-red-400"
                            title="Delete Achievement"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: SETTINGS & WEBSITE CONTENT STUDIO */}
              {activeTab === 'settings' && content && (
                <div className="max-w-5xl">
                  <WebsiteContentManager
                    content={content}
                    onSave={async (updated) => {
                      setSaveLoading(true);
                      try {
                        const res = await api.updateContent(updated);
                        setContent(res);
                        showToast('Website content & pictures saved successfully!');
                        onDataUpdated();
                      } catch (err: any) {
                        showToast(err.message || 'Failed to save changes');
                      } finally {
                        setSaveLoading(false);
                      }
                    }}
                    saveLoading={saveLoading}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Modal: Add Question PDF */}
      {showAddPdfModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#121622] border border-red-900/60 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowAddPdfModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-bold text-white mb-4">Add New Question PDF</h3>

            <form onSubmit={handleCreatePdf} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">PDF Title</label>
                <input
                  type="text"
                  required
                  value={newPdf.title}
                  onChange={(e) => setNewPdf({ ...newPdf, title: e.target.value })}
                  placeholder="e.g. Class 10 Trigonometry High-Yield Board Drill"
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Class</label>
                  <select
                    value={newPdf.classLevel}
                    onChange={(e) => setNewPdf({ ...newPdf, classLevel: e.target.value as ClassLevel })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  >
                    {[
                      'Class III',
                      'Class IV',
                      'Class V',
                      'Class VI',
                      'Class VII',
                      'Class VIII',
                      'Class IX',
                      'Class X',
                      'Class XI',
                      'Class XII',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Subject</label>
                  <select
                    value={newPdf.subject}
                    onChange={(e) => setNewPdf({ ...newPdf, subject: e.target.value as Subject })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Social Science">Social Science</option>
                    <option value="All Subjects">All Subjects</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Chapter</label>
                  <input
                    type="text"
                    required
                    value={newPdf.chapter}
                    onChange={(e) => setNewPdf({ ...newPdf, chapter: e.target.value })}
                    placeholder="e.g. Chapter 8 - Trigonometry"
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Topic</label>
                  <input
                    type="text"
                    value={newPdf.topic}
                    onChange={(e) => setNewPdf({ ...newPdf, topic: e.target.value })}
                    placeholder="e.g. Trigonometric Identities"
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Difficulty</label>
                  <select
                    value={newPdf.difficulty}
                    onChange={(e) =>
                      setNewPdf({ ...newPdf, difficulty: e.target.value as DifficultyLevel })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Exam Type</label>
                  <select
                    value={newPdf.examType}
                    onChange={(e) => setNewPdf({ ...newPdf, examType: e.target.value as ExamType })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  >
                    <option value="School Practice">School Practice</option>
                    <option value="Board Exam">Board Exam</option>
                    <option value="Competitive">Competitive</option>
                    <option value="Olympiad">Olympiad</option>
                    <option value="Revision Test">Revision Test</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newPdf.description}
                  onChange={(e) => setNewPdf({ ...newPdf, description: e.target.value })}
                  placeholder="Key concepts and problem types included..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              {/* Upload PDF File */}
              <div className="pt-1">
                <FileUploadField
                  label="Question PDF Document File"
                  sublabel=".pdf, .doc, .docx"
                  accept=".pdf,.doc,.docx"
                  isImage={false}
                  currentValue={newPdf.fileUrl}
                  currentFileName={newPdf.fileName}
                  currentFileSize={newPdf.fileSize}
                  onUploadSuccess={(url, fileName, fileSize) =>
                    setNewPdf({ ...newPdf, fileUrl: url, fileName, fileSize })
                  }
                  onClear={() => setNewPdf({ ...newPdf, fileUrl: '', fileName: '', fileSize: '' })}
                  placeholder="Upload question bank PDF or assignment sheet"
                  helperText="Students will be able to download and solve this file directly."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Sample Questions (one per line)
                </label>
                <textarea
                  rows={3}
                  value={newPdf.sampleQuestions}
                  onChange={(e) => setNewPdf({ ...newPdf, sampleQuestions: e.target.value })}
                  placeholder="Prove that (sin A + cosec A)^2 + (cos A + sec A)^2 = 7 + tan^2 A + cot^2 A&#10;Find the value of tan 30 / cot 60"
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddPdfModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Publish PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Study Material */}
      {showAddMaterialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#121622] border border-zinc-800 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddMaterialModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Add Study Material</h3>

            <form onSubmit={handleCreateMaterial} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Material Title</label>
                <input
                  type="text"
                  required
                  value={newMaterial.title}
                  onChange={(e) => setNewMaterial({ ...newMaterial, title: e.target.value })}
                  placeholder="e.g. Complete Algebra Formula Sheet"
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Class</label>
                  <select
                    value={newMaterial.classLevel}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, classLevel: e.target.value as ClassLevel })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  >
                    {[
                      'Class III',
                      'Class IV',
                      'Class V',
                      'Class VI',
                      'Class VII',
                      'Class VIII',
                      'Class IX',
                      'Class X',
                      'Class XI',
                      'Class XII',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Type</label>
                  <select
                    value={newMaterial.type}
                    onChange={(e) =>
                      setNewMaterial({ ...newMaterial, type: e.target.value as MaterialType })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  >
                    <option value="Notes">Notes</option>
                    <option value="Worksheets">Worksheets</option>
                    <option value="Practice Questions">Practice Questions</option>
                    <option value="Sample Papers">Sample Papers</option>
                    <option value="Revision Material">Revision Material</option>
                    <option value="Important Questions">Important Questions</option>
                    <option value="Assignments">Assignments</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newMaterial.description}
                  onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
                  placeholder="Summary of concepts covered..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              {/* Upload Material Document */}
              <div className="pt-1">
                <FileUploadField
                  label="Upload Material Document File"
                  sublabel=".pdf, .doc, .docx, .ppt"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  isImage={false}
                  currentValue={newMaterial.fileUrl}
                  currentFileName={newMaterial.fileName}
                  currentFileSize={newMaterial.fileSize}
                  onUploadSuccess={(url, fileName, fileSize) =>
                    setNewMaterial({ ...newMaterial, fileUrl: url, fileName, fileSize })
                  }
                  onClear={() => setNewMaterial({ ...newMaterial, fileUrl: '', fileName: '', fileSize: '' })}
                  placeholder="Upload study notes or formula sheet"
                  helperText="Enrolled students will download this file."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddMaterialModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Save Material
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Notice */}
      {showAddNoticeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#121622] border border-zinc-800 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddNoticeModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Post Announcement</h3>

            <form onSubmit={handleCreateNotice} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Notice Headline</label>
                <input
                  type="text"
                  required
                  value={newNotice.title}
                  onChange={(e) => setNewNotice({ ...newNotice, title: e.target.value })}
                  placeholder="e.g. Special Sunday Doubt Clearing Session"
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Description</label>
                <textarea
                  rows={3}
                  required
                  value={newNotice.description}
                  onChange={(e) => setNewNotice({ ...newNotice, description: e.target.value })}
                  placeholder="Details for students and parents..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="notice-important-check"
                  checked={newNotice.isImportant}
                  onChange={(e) => setNewNotice({ ...newNotice, isImportant: e.target.checked })}
                  className="rounded border-zinc-700 text-red-600 focus:ring-0"
                />
                <label htmlFor="notice-important-check" className="text-xs text-zinc-300">
                  Highlight as Important / Urgent
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddNoticeModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Post Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Achievement */}
      {showAddAchievementModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md rounded-2xl bg-[#121622] border border-zinc-800 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddAchievementModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-zinc-800 text-zinc-400"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-lg font-bold text-white mb-4">Add Student Achievement</h3>

            <form onSubmit={handleCreateAchievement} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={newAchievement.studentName}
                  onChange={(e) =>
                    setNewAchievement({ ...newAchievement, studentName: e.target.value })
                  }
                  placeholder="e.g. Rohit Verma"
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Class</label>
                  <select
                    value={newAchievement.classLevel}
                    onChange={(e) =>
                      setNewAchievement({
                        ...newAchievement,
                        classLevel: e.target.value as ClassLevel,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  >
                    {[
                      'Class III',
                      'Class IV',
                      'Class V',
                      'Class VI',
                      'Class VII',
                      'Class VIII',
                      'Class IX',
                      'Class X',
                      'Class XI',
                      'Class XII',
                    ].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-300 mb-1">Year</label>
                  <input
                    type="text"
                    value={newAchievement.year}
                    onChange={(e) =>
                      setNewAchievement({ ...newAchievement, year: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Score / Rank</label>
                <input
                  type="text"
                  required
                  value={newAchievement.scoreOrRank}
                  onChange={(e) =>
                    setNewAchievement({ ...newAchievement, scoreOrRank: e.target.value })
                  }
                  placeholder="e.g. 98/100 in Board Examination"
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Achievement Detail</label>
                <textarea
                  rows={2}
                  value={newAchievement.achievement}
                  onChange={(e) =>
                    setNewAchievement({ ...newAchievement, achievement: e.target.value })
                  }
                  placeholder="School topper in Mathematics..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">Student Photo (Optional)</label>
                <FileUploadField
                  label="Upload Achiever Photo"
                  sublabel="JPG, PNG, WebP"
                  accept="image/*"
                  isImage={true}
                  currentValue={newAchievement.photoUrl}
                  onUploadSuccess={(url) => setNewAchievement({ ...newAchievement, photoUrl: url })}
                  onClear={() => setNewAchievement({ ...newAchievement, photoUrl: '' })}
                  placeholder="Upload picture of achiever student"
                  helperText="Displayed next to student's score and school rank."
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddAchievementModal(false)}
                  className="px-4 py-2 rounded-lg bg-zinc-800 text-xs text-zinc-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* In-App Delete Confirmation Modal (Avoids window.confirm blocked by iframe sandbox) */}
      {deleteConfirmTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#121622] border border-red-500/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-950/80 border border-red-700/60 flex items-center justify-center text-red-400 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Confirm Deletion</h3>
                <p className="text-xs text-zinc-400">
                  Are you sure you want to permanently delete this item?
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#090C12] border border-zinc-800 text-xs">
              <div className="text-zinc-500 text-[10px] uppercase font-semibold">
                Item to delete:
              </div>
              <div className="text-white font-bold text-sm mt-0.5 break-words">
                {deleteConfirmTarget.title}
              </div>
              <div className="text-amber-400 text-[11px] mt-1.5 capitalize font-medium">
                Category:{' '}
                {deleteConfirmTarget.type === 'pdf'
                  ? 'Question PDF'
                  : deleteConfirmTarget.type === 'material'
                  ? 'Study Material'
                  : deleteConfirmTarget.type === 'notice'
                  ? 'Notice Board'
                  : deleteConfirmTarget.type === 'achievement'
                  ? 'Student Achievement'
                  : 'Record'}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                disabled={deleteLoading}
                onClick={() => setDeleteConfirmTarget(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-300 hover:bg-zinc-800/80 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={deleteLoading}
                onClick={handleConfirmDelete}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 transition-colors shadow-lg shadow-red-950/50 disabled:opacity-50"
              >
                {deleteLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Permanently</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
