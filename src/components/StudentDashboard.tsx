import React from 'react';
import {
  User as UserIcon,
  GraduationCap,
  BookOpen,
  FileCode,
  Download,
  Eye,
  MessageSquare,
  Sparkles,
  CheckCircle,
  X,
  Phone,
} from 'lucide-react';
import { User, StudyMaterial, QuestionPDF } from '../types';

interface StudentDashboardProps {
  user: User;
  materials: StudyMaterial[];
  questionPdfs: QuestionPDF[];
  onViewPdf: (title: string, fileUrl: string, sampleContent?: string[]) => void;
  onClose: () => void;
  onLogout: () => void;
}

export const StudentDashboard: React.FC<StudentDashboardProps> = ({
  user,
  materials,
  questionPdfs,
  onViewPdf,
  onClose,
  onLogout,
}) => {
  const studentMaterials = materials.filter(
    (m) => m.classLevel === user.classLevel || user.classLevel === undefined
  );
  const studentPdfs = questionPdfs.filter(
    (p) => p.classLevel === user.classLevel || user.classLevel === undefined
  );

  return (
    <div
      id="student-dashboard-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
    >
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0F131C] border border-red-900/40 p-6 sm:p-8 shadow-2xl my-auto max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dashboard Header Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-amber-500 p-0.5 shadow-lg shadow-red-950/50">
              <div className="w-full h-full bg-[#121622] rounded-[14px] flex items-center justify-center">
                <GraduationCap className="w-7 h-7 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{user.name}</h2>
                <span className="px-2 py-0.5 rounded-full bg-red-950 text-red-300 text-[10px] font-bold border border-red-800/60">
                  Student
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Enrolled Class: <strong className="text-amber-400">{user.classLevel || 'Class X'}</strong> • Mentor: Satyam Sir
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://wa.me/917004995470?text=Hello%20Satyam%20Sir%2C%20I%20have%20a%20doubt%20in%20today%27s%20class."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-green-700 hover:bg-green-600 text-xs font-semibold text-white shadow"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask Sir on WhatsApp</span>
            </a>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 hover:text-white border border-zinc-700"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
          <div className="p-4 rounded-xl bg-[#141926] border border-zinc-800">
            <span className="text-xs text-zinc-400">Class Materials Available</span>
            <div className="text-2xl font-extrabold text-white mt-1">{studentMaterials.length} Modules</div>
            <span className="text-[11px] text-amber-400">Tailored for {user.classLevel || 'Your Grade'}</span>
          </div>

          <div className="p-4 rounded-xl bg-[#141926] border border-zinc-800">
            <span className="text-xs text-zinc-400">Assigned Practice Sheets</span>
            <div className="text-2xl font-extrabold text-white mt-1">{studentPdfs.length} Sets</div>
            <span className="text-[11px] text-red-400">Exam-Focused Drills</span>
          </div>

          <div className="p-4 rounded-xl bg-[#141926] border border-zinc-800">
            <span className="text-xs text-zinc-400">Academic Help Desk</span>
            <div className="text-sm font-bold text-white mt-1">Direct Satyam Sir Support</div>
            <span className="text-[11px] text-zinc-400">Call / WhatsApp: 7004995470</span>
          </div>
        </div>

        {/* Class Specific Question PDFs */}
        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-red-500" />
              <span>Recommended Question Sheets for Your Grade</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(studentPdfs.length > 0 ? studentPdfs : questionPdfs.slice(0, 4)).map((pdf) => (
              <div
                key={pdf.id}
                className="p-4 rounded-xl bg-[#141926] border border-zinc-800 hover:border-red-500/40 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-1">
                    <span className="text-red-400 font-bold">{pdf.classLevel}</span>
                    <span>•</span>
                    <span>{pdf.examType}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{pdf.title}</h4>
                  <p className="text-[11px] text-zinc-400 truncate">{pdf.chapter}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => onViewPdf(pdf.title, pdf.fileUrl, pdf.sampleQuestions)}
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400"
                    title="View Online"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onViewPdf(pdf.title, pdf.fileUrl, pdf.sampleQuestions)}
                    className="p-2 rounded-lg bg-red-600 hover:bg-red-500 text-white"
                    title="Download PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Study Notes & Chapter Materials */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-400" />
            <span>Chapter Notes &amp; Formula Sheets</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(studentMaterials.length > 0 ? studentMaterials : materials.slice(0, 4)).map((mat) => (
              <div
                key={mat.id}
                className="p-4 rounded-xl bg-[#141926] border border-zinc-800 hover:border-amber-500/40 flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-[10px] text-zinc-400 mb-1">
                    <span className="text-amber-400 font-bold">{mat.classLevel}</span>
                    <span>•</span>
                    <span>{mat.type}</span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-white truncate">{mat.title}</h4>
                  <p className="text-[11px] text-zinc-400 truncate">{mat.description}</p>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() =>
                      onViewPdf(mat.title, mat.fileUrl, [
                        `Study Material: ${mat.title}`,
                        `Grade: ${mat.classLevel} | ${mat.subject}`,
                        `Description: ${mat.description}`,
                        `Faculty: Satyam Sir - Maths Fact Institute`,
                      ])
                    }
                    className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
