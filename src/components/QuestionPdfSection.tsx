import React, { useState, useMemo } from 'react';
import {
  FileCode,
  Search,
  Download,
  Eye,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  HelpCircle,
  Tag,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { QuestionPDF, ClassLevel, Subject, DifficultyLevel, ExamType } from '../types';
import { api } from '../services/api';

interface QuestionPdfSectionProps {
  questionPdfs: QuestionPDF[];
  onViewPdf: (title: string, fileUrl: string, sampleQuestions?: string[]) => void;
}

export const QuestionPdfSection: React.FC<QuestionPdfSectionProps> = ({
  questionPdfs,
  onViewPdf,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [selectedExamType, setSelectedExamType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const classList = [
    'All',
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
  ];

  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];
  const examTypes = ['All', 'School Practice', 'Board Exam', 'Competitive', 'Olympiad', 'Revision Test'];

  const filteredPdfs = useMemo(() => {
    return questionPdfs.filter((item) => {
      const matchClass = selectedClass === 'All' || item.classLevel === selectedClass;
      const matchSubject = selectedSubject === 'All' || item.subject === selectedSubject;
      const matchDiff = selectedDifficulty === 'All' || item.difficulty === selectedDifficulty;
      const matchExam = selectedExamType === 'All' || item.examType === selectedExamType;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.chapter.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());

      return matchClass && matchSubject && matchDiff && matchExam && matchSearch;
    });
  }, [questionPdfs, selectedClass, selectedSubject, selectedDifficulty, selectedExamType, searchQuery]);

  const totalPages = Math.ceil(filteredPdfs.length / itemsPerPage) || 1;
  const paginatedPdfs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPdfs.slice(start, start + itemsPerPage);
  }, [filteredPdfs, currentPage]);

  const handleDownload = (item: QuestionPDF) => {
    api.trackDownload('pdf', item.id);
    onViewPdf(item.title, item.fileUrl, item.sampleQuestions);
  };

  const getDifficultyBadge = (diff: DifficultyLevel) => {
    switch (diff) {
      case 'Easy':
        return 'bg-emerald-950/70 text-emerald-400 border-emerald-800/50';
      case 'Medium':
        return 'bg-amber-950/70 text-amber-400 border-amber-800/50';
      case 'Hard':
        return 'bg-red-950/80 text-red-400 border-red-800/60';
      default:
        return 'bg-zinc-800 text-zinc-300';
    }
  };

  return (
    <section id="question-pdfs" className="py-16 md:py-24 relative bg-[#090C12]">
      {/* Glow highlight */}
      <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/50 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>High-Yield Problem Repository</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Question PDFs
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Practice graded questions, board exam boosters, theorem proofs, and competitive problem sheets with verified solutions.
          </p>
        </div>

        {/* Horizontal Class Selector */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {classList.map((cls) => (
              <button
                key={cls}
                id={`pdf-class-${cls.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => {
                  setSelectedClass(cls);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  selectedClass === cls
                    ? 'bg-red-600 text-white shadow-lg shadow-red-950/60 border border-red-500'
                    : 'bg-[#121622] text-zinc-300 hover:text-white hover:bg-zinc-800 border border-zinc-800'
                }`}
              >
                {cls}
              </button>
            ))}
          </div>
        </div>

        {/* Detailed Search and Filter Controls */}
        <div className="p-4 rounded-xl bg-[#121622] border border-zinc-800 mb-8 flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="pdf-search-input"
              type="text"
              placeholder="Search by chapter, topic or title (e.g. Algebra, Trigonometry)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Exam Type:</span>
              <select
                id="pdf-examtype-select"
                value={selectedExamType}
                onChange={(e) => {
                  setSelectedExamType(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#0D1017] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                {examTypes.map((et) => (
                  <option key={et} value={et} className="bg-[#121622] text-white">
                    {et}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Difficulty:</span>
              <select
                id="pdf-diff-select"
                value={selectedDifficulty}
                onChange={(e) => {
                  setSelectedDifficulty(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-[#0D1017] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                {difficulties.map((d) => (
                  <option key={d} value={d} className="bg-[#121622] text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* PDF Cards Grid */}
        {paginatedPdfs.length === 0 ? (
          <div className="text-center py-16 p-6 rounded-2xl bg-[#121622] border border-zinc-800">
            <HelpCircle className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-white">No Question PDFs Found</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              We couldn’t find any PDFs matching your exact filter criteria. Try clearing search or selecting "All".
            </p>
            <button
              onClick={() => {
                setSelectedClass('All');
                setSelectedDifficulty('All');
                setSelectedExamType('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPdfs.map((pdf) => (
              <div
                key={pdf.id}
                id={`qpdf-card-${pdf.id}`}
                className="group rounded-2xl bg-[#121622] border border-zinc-800 hover:border-red-500/50 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/30"
              >
                <div>
                  {/* Top Meta Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/90 text-red-400 border border-red-800/60">
                      {pdf.classLevel}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getDifficultyBadge(
                          pdf.difficulty
                        )}`}
                      >
                        {pdf.difficulty}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {pdf.examType}
                      </span>
                    </div>
                  </div>

                  {/* Title & Chapter */}
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2 leading-snug">
                    {pdf.title}
                  </h3>

                  <div className="p-2.5 rounded-lg bg-[#0E121B] border border-zinc-800/80 mb-3 space-y-1">
                    <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                      <span>Chapter:</span>
                      <span className="font-semibold text-white truncate max-w-[170px]">{pdf.chapter}</span>
                    </div>
                    <div className="text-[11px] text-zinc-400 flex items-center justify-between">
                      <span>Topic:</span>
                      <span className="font-medium text-amber-400/90 truncate max-w-[170px]">{pdf.topic}</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                    {pdf.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-3">
                    <span>{pdf.questionsCount || 20} Questions Included</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {pdf.uploadDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`btn-view-pdf-${pdf.id}`}
                      onClick={() => onViewPdf(pdf.title, pdf.fileUrl, pdf.sampleQuestions)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-zinc-200 bg-zinc-800/90 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>View PDF</span>
                    </button>

                    <button
                      id={`btn-download-pdf-${pdf.id}`}
                      onClick={() => handleDownload(pdf)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/40 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg bg-[#121622] border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === i + 1
                    ? 'bg-red-600 text-white font-bold'
                    : 'bg-[#121622] text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg bg-[#121622] border border-zinc-800 text-zinc-400 hover:text-white disabled:opacity-30 disabled:pointer-events-none"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
