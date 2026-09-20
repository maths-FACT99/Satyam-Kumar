import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Phone,
  ArrowUp,
  Sparkles,
  ShieldAlert,
  GraduationCap,
  CheckCircle2,
} from 'lucide-react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { AdmissionsBanner } from './components/AdmissionsBanner';
import { CoursesSection } from './components/CoursesSection';
import { FreeDemoSection } from './components/FreeDemoSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { AboutSection } from './components/AboutSection';
import { FacultySection } from './components/FacultySection';
import { StudyMaterialSection } from './components/StudyMaterialSection';
import { QuestionPdfSection } from './components/QuestionPdfSection';
import { ResultsSection } from './components/ResultsSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { PdfViewerModal } from './components/PdfViewerModal';
import { StudentAuthModal } from './components/StudentAuthModal';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { AiChatModal } from './components/AiChatModal';
import { FloatingAiChatButton } from './components/FloatingAiChatButton';
import { VisualEditorBar } from './components/VisualEditorBar';
import { TextEditModal } from './components/TextEditModal';
import { ImageReplacerModal } from './components/ImageReplacerModal';
import { api } from './services/api';
import {
  WebsiteContent,
  Course,
  StudyMaterial,
  QuestionPDF,
  Announcement,
  Achievement,
  User,
} from './types';
import { INITIAL_WEBSITE_CONTENT } from './data/initialData';

export default function App() {
  const [content, setContent] = useState<WebsiteContent>(INITIAL_WEBSITE_CONTENT);
  const [courses, setCourses] = useState<Course[]>([]);
  const [materials, setMaterials] = useState<StudyMaterial[]>([]);
  const [questionPdfs, setQuestionPdfs] = useState<QuestionPDF[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Active section tracking
  const [activeSection, setActiveSection] = useState('home');

  // Modals state
  const [studentAuthOpen, setStudentAuthOpen] = useState(false);
  const [studentDashboardOpen, setStudentDashboardOpen] = useState(false);
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);
  const [adminDashboardOpen, setAdminDashboardOpen] = useState(false);
  const [aiChatOpen, setAiChatOpen] = useState(false);

  // Visual In-Place CMS Editor States
  const [isVisualEditMode, setIsVisualEditMode] = useState(false);
  const [textEditTarget, setTextEditTarget] = useState<{
    fieldKey: string;
    label: string;
    currentValue: string;
    isMultiline?: boolean;
  } | null>(null);

  const [imageEditTarget, setImageEditTarget] = useState<{
    fieldKey: string;
    label: string;
    currentUrl: string;
    fallbackUrl?: string;
  } | null>(null);

  const handleStartEditText = (fieldKey: string, label: string, currentValue: string, isMultiline?: boolean) => {
    setTextEditTarget({ fieldKey, label, currentValue, isMultiline });
  };

  const handleSaveEditedText = async (newValue: string) => {
    if (!textEditTarget) return;
    const updated = { ...content, [textEditTarget.fieldKey]: newValue };
    setContent(updated);
    try {
      await api.updateContent(updated);
      showToast(`Updated "${textEditTarget.label}" successfully!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save text changes');
    }
  };

  const handleStartEditImage = (fieldKey: string, label: string, currentUrl: string, fallbackUrl?: string) => {
    setImageEditTarget({ fieldKey, label, currentUrl, fallbackUrl });
  };

  const handleSaveEditedImage = async (newUrl: string) => {
    if (!imageEditTarget) return;
    const updated = { ...content, [imageEditTarget.fieldKey]: newUrl };
    setContent(updated);
    try {
      await api.updateContent(updated);
      showToast(`Updated "${imageEditTarget.label}" image successfully!`);
    } catch (err: any) {
      showToast(err.message || 'Failed to save image changes');
    }
  };

  // PDF Viewer Modal State
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfTitle, setPdfTitle] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfSampleContent, setPdfSampleContent] = useState<string[]>([]);

  // Toast Notification
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const loadData = async () => {
    try {
      const [siteContent, courseList, matList, pdfList, noticeList, achList, user] =
        await Promise.all([
          api.getContent(),
          api.getCourses(),
          api.getStudyMaterials(),
          api.getQuestionPdfs(),
          api.getAnnouncements(),
          api.getAchievements(),
          api.getCurrentUser(),
        ]);

      setContent(siteContent);
      setCourses(courseList);
      setMaterials(matList);
      setQuestionPdfs(pdfList);
      setAnnouncements(noticeList);
      setAchievements(achList);
      setCurrentUser(user);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Intersection Observer for active section navigation
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'home',
        'about',
        'courses',
        'free-demo',
        'study-material',
        'question-pdfs',
        'faculty',
        'results',
        'contact',
      ];

      const scrollPos = window.scrollY + 160;
      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewPdf = (title: string, fileUrl: string, sampleContent?: string[]) => {
    setPdfTitle(title);
    setPdfUrl(fileUrl);
    setPdfSampleContent(sampleContent || []);
    setPdfModalOpen(true);
  };

  const handleEnrollCourse = (course: Course) => {
    handleNavigate('free-demo');
    showToast(`Booking 1-Week Free Demo for ${course.classes} (${course.title})`);
  };

  const handleLogout = async () => {
    await api.logout();
    setCurrentUser(null);
    setStudentDashboardOpen(false);
    setAdminDashboardOpen(false);
    showToast('Logged out successfully.');
  };

  return (
    <div className="min-h-screen bg-[#0B0D11] text-zinc-100 font-sans selection:bg-red-600 selection:text-white flex flex-col relative">
      {/* Toast Notification Container */}
      {toastMsg && (
        <div className="fixed top-20 right-4 z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#121622] border border-amber-500/60 text-white text-xs font-semibold shadow-2xl shadow-black/80">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{toastMsg}</span>
          </div>
        </div>
      )}

      {/* Visual In-Place CMS Toolbar */}
      <VisualEditorBar
        isEditMode={isVisualEditMode}
        onToggleEditMode={() => setIsVisualEditMode((prev) => !prev)}
        onOpenDashboard={() => {
          if (currentUser?.role === 'admin') {
            setAdminDashboardOpen(true);
          } else {
            setAdminLoginOpen(true);
          }
        }}
        onQuickChangeImage={(field) => {
          if (field === 'facultyPhotoUrl') {
            handleStartEditImage(
              'facultyPhotoUrl',
              'Satyam Sir Faculty Photo',
              content.facultyPhotoUrl || '/satyam_sir_real.jpg',
              '/satyam_sir_real.jpg'
            );
          } else if (field === 'logoUrl') {
            handleStartEditImage(
              'logoUrl',
              'Institute Emblem / Logo',
              content.logoUrl || '/maths_fact_logo.jpg',
              '/maths_fact_logo.jpg'
            );
          } else if (field === 'heroBannerUrl') {
            handleStartEditImage(
              'heroBannerUrl',
              'Hero Background Banner',
              content.heroBannerUrl || '',
              ''
            );
          }
        }}
        onSaveAll={() => {
          showToast('All website changes are saved and active!');
        }}
        currentUser={currentUser}
        onOpenLogin={() => setAdminLoginOpen(true)}
      />

      {/* Main Header with Sticky Navigation */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        content={content}
        onOpenStudentLogin={() => {
          if (currentUser && currentUser.role === 'student') {
            setStudentDashboardOpen(true);
          } else {
            setStudentAuthOpen(true);
          }
        }}
        onOpenAdminLogin={() => {
          if (currentUser && currentUser.role === 'admin') {
            setAdminDashboardOpen(true);
          } else {
            setAdminLoginOpen(true);
          }
        }}
        onLogout={handleLogout}
        onOpenAiChat={() => setAiChatOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        content={content}
        onBookDemo={() => handleNavigate('free-demo')}
        onViewCourses={() => handleNavigate('courses')}
        onOpenAiChat={() => setAiChatOpen(true)}
        isEditMode={isVisualEditMode}
        onEditText={handleStartEditText}
        onEditImage={handleStartEditImage}
      />

      {/* Limited Seats Call-to-Action Banner */}
      <AdmissionsBanner
        content={content}
        onEnrollClick={() => handleNavigate('free-demo')}
        isEditMode={isVisualEditMode}
        onEditText={handleStartEditText}
      />

      {/* Courses Section */}
      <CoursesSection
        courses={courses}
        onEnrollCourse={handleEnrollCourse}
      />

      {/* 1 Week Free Demo Class Section */}
      <FreeDemoSection
        onSuccessNotice={() => {
          showToast('Free Demo Class booked! Satyam Sir will reach out shortly.');
        }}
      />

      {/* Why Choose Us Section */}
      <WhyChooseUs content={content} />

      {/* About Maths Fact Section */}
      <AboutSection
        content={content}
        onBookDemo={() => handleNavigate('free-demo')}
        isEditMode={isVisualEditMode}
        onEditText={handleStartEditText}
        onEditImage={handleStartEditImage}
      />

      {/* Faculty Profile: Satyam Sir Spotlight */}
      <FacultySection
        content={content}
        onBookDemo={() => handleNavigate('free-demo')}
        onOpenAiChat={() => setAiChatOpen(true)}
        isEditMode={isVisualEditMode}
        onEditText={handleStartEditText}
        onEditImage={handleStartEditImage}
      />

      {/* Study Material Repository */}
      <StudyMaterialSection
        materials={materials}
        onViewPdf={handleViewPdf}
      />

      {/* Question PDFs Section */}
      <QuestionPdfSection
        questionPdfs={questionPdfs}
        onViewPdf={handleViewPdf}
      />

      {/* Student Achievements / Results */}
      <ResultsSection achievements={achievements} />

      {/* Notice Board / Announcements */}
      <AnnouncementsSection
        announcements={announcements}
        onBookDemo={() => handleNavigate('free-demo')}
      />

      {/* Contact Section & Inquiry Form & Google Maps */}
      <ContactSection
        content={content}
        isEditMode={isVisualEditMode}
        onEditText={handleStartEditText}
        onEditImage={handleStartEditImage}
        onBookDemo={() => handleNavigate('free-demo')}
      />

      {/* Footer */}
      <Footer
        content={content}
        onNavigate={handleNavigate}
        onOpenAdminLogin={() => {
          if (currentUser && currentUser.role === 'admin') {
            setAdminDashboardOpen(true);
          } else {
            setAdminLoginOpen(true);
          }
        }}
      />

      {/* Floating Action Buttons: WhatsApp & Call Quick Access (Bottom Left) */}
      <div className="fixed bottom-5 left-5 z-40 flex flex-col items-start gap-2.5 pointer-events-auto">
        {/* Floating WhatsApp CTA */}
        <a
          id="floating-whatsapp-btn"
          href={`https://wa.me/91${content.whatsappNumber}?text=${encodeURIComponent(
            'Hello Satyam Sir, I visited the Maths Fact website and would like to ask a question regarding courses and the 1-week free demo.'
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-green-600 hover:bg-green-500 text-white font-bold text-xs shadow-xl shadow-green-950/60 hover:scale-105 active:scale-95 transition-all border border-green-400/40 group"
          title="Chat with Satyam Sir on WhatsApp"
        >
          <MessageSquare className="w-4 h-4 fill-white" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300">
            WhatsApp
          </span>
        </a>

        {/* Floating Call CTA */}
        <a
          id="floating-call-btn"
          href={`tel:${content.contactPhone1}`}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-xl shadow-red-950/70 border border-red-400/40 hover:scale-105 active:scale-95 transition-all"
          title={`Call Satyam Sir: ${content.contactPhone1}`}
        >
          <Phone className="w-4 h-4" />
        </a>
      </div>

      {/* Floating AI Doubt Solver Button (Bottom Right) */}
      <FloatingAiChatButton onClick={() => setAiChatOpen(true)} />

      {/* Modals */}
      {/* 1. PDF Viewer Modal */}
      <PdfViewerModal
        isOpen={pdfModalOpen}
        title={pdfTitle}
        fileUrl={pdfUrl}
        sampleContent={pdfSampleContent}
        onClose={() => setPdfModalOpen(false)}
      />

      {/* 2. Student Auth Modal */}
      <StudentAuthModal
        isOpen={studentAuthOpen}
        onClose={() => setStudentAuthOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome, ${user.name}!`);
          setStudentDashboardOpen(true);
        }}
      />

      {/* 3. Student Dashboard Modal */}
      {studentDashboardOpen && currentUser && (
        <StudentDashboard
          user={currentUser}
          materials={materials}
          questionPdfs={questionPdfs}
          onViewPdf={handleViewPdf}
          onClose={() => setStudentDashboardOpen(false)}
          onLogout={handleLogout}
        />
      )}

      {/* 4. Admin Login Modal */}
      <AdminLoginModal
        isOpen={adminLoginOpen}
        onClose={() => setAdminLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast('Admin authenticated successfully!');
          setAdminDashboardOpen(true);
        }}
      />

      {/* 5. Admin Dashboard */}
      {adminDashboardOpen && (
        <AdminDashboard
          onClose={() => setAdminDashboardOpen(false)}
          onLogout={handleLogout}
          onDataUpdated={loadData}
        />
      )}

      {/* 6. Satyam Sir AI Chat Modal */}
      <AiChatModal
        isOpen={aiChatOpen}
        onClose={() => setAiChatOpen(false)}
        onBookDemo={() => handleNavigate('free-demo')}
        studentClass={currentUser?.classLevel}
      />

      {/* In-Place Text Editing Modal */}
      {textEditTarget && (
        <TextEditModal
          isOpen={!!textEditTarget}
          fieldKey={textEditTarget.fieldKey}
          label={textEditTarget.label}
          currentValue={textEditTarget.currentValue}
          isMultiline={textEditTarget.isMultiline}
          onClose={() => setTextEditTarget(null)}
          onSave={handleSaveEditedText}
        />
      )}

      {/* In-Place Image Replacer Modal */}
      {imageEditTarget && (
        <ImageReplacerModal
          isOpen={!!imageEditTarget}
          fieldKey={imageEditTarget.fieldKey}
          label={imageEditTarget.label}
          currentUrl={imageEditTarget.currentUrl}
          fallbackUrl={imageEditTarget.fallbackUrl}
          onClose={() => setImageEditTarget(null)}
          onSave={handleSaveEditedImage}
        />
      )}
    </div>
  );
}
