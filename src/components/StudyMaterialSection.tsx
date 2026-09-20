import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  Download,
  Eye,
  FileText,
  Filter,
  Calendar,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { StudyMaterial, ClassLevel, Subject, MaterialType } from '../types';
import { api } from '../services/api';

interface StudyMaterialSectionProps {
  materials: StudyMaterial[];
  onViewPdf: (title: string, fileUrl: string, sampleContent?: string[]) => void;
}

export const StudyMaterialSection: React.FC<StudyMaterialSectionProps> = ({
  materials,
  onViewPdf,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('All');
  const [selectedSubject, setSelectedSubject] = useState<string>('All');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

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

  const subjects = ['All', 'Mathematics', 'Science', 'Social Science', 'All Subjects'];

  const types: string[] = [
    'All',
    'Notes',
    'Worksheets',
    'Practice Questions',
    'Sample Papers',
    'Revision Material',
    'Important Questions',
    'Assignments',
  ];

  const filteredMaterials = useMemo(() => {
    return materials.filter((item) => {
      const matchClass = selectedClass === 'All' || item.classLevel === selectedClass;
      const matchSubject = selectedSubject === 'All' || item.subject === selectedSubject;
      const matchType = selectedType === 'All' || item.type === selectedType;
      const matchSearch =
        !searchQuery.trim() ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.subject.toLowerCase().includes(searchQuery.toLowerCase());
      return matchClass && matchSubject && matchType && matchSearch;
    });
  }, [materials, selectedClass, selectedSubject, selectedType, searchQuery]);

  const handleDownload = (item: StudyMaterial) => {
    api.trackDownload('material', item.id);
    // Open or download simulated PDF document cleanly
    onViewPdf(item.title, item.fileUrl, [
      `Official Study Material: ${item.title}`,
      `Class: ${item.classLevel} | Subject: ${item.subject}`,
      `Curated by Satyam Sir (PG, B.Ed, CTET) - Maths Fact Institute`,
      `Key Concepts Summary: ${item.description}`,
      `Practice Problems: Complete the exercises included in this document and review with teacher in doubt sessions.`,
    ]);
  };

  return (
    <section id="study-material" className="py-16 md:py-24 relative bg-[#0B0D11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Resource Library</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Study Material
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Curated chapter notes, revision cheat-sheets, high-yield practice assignments, and formula banks prepared by Satyam Sir.
          </p>
        </div>

        {/* Class Filter Horizontal Scroll Tabs */}
        <div className="mb-6 overflow-x-auto pb-2 scrollbar-none">
          <div className="flex items-center gap-2 min-w-max">
            {classList.map((cls) => (
              <button
                key={cls}
                id={`study-filter-class-${cls.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedClass(cls)}
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

        {/* Search & Sub-filters Bar */}
        <div className="p-4 rounded-xl bg-[#121622] border border-zinc-800 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="study-search-input"
              type="text"
              placeholder="Search by topic, chapter or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Subject:</span>
              <select
                id="study-subject-select"
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="bg-[#0D1017] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                {subjects.map((s) => (
                  <option key={s} value={s} className="bg-[#121622] text-white">
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <span>Type:</span>
              <select
                id="study-type-select"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="bg-[#0D1017] border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none"
              >
                {types.map((t) => (
                  <option key={t} value={t} className="bg-[#121622] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Study Materials Cards Grid */}
        {filteredMaterials.length === 0 ? (
          <div className="text-center py-16 p-6 rounded-2xl bg-[#121622] border border-zinc-800">
            <FileText className="w-12 h-12 text-zinc-600 mx-auto mb-3" />
            <h4 className="text-base font-semibold text-white">No Study Material Found</h4>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              No materials match your current filters. Try resetting the class or subject filter above.
            </p>
            <button
              onClick={() => {
                setSelectedClass('All');
                setSelectedSubject('All');
                setSelectedType('All');
                setSearchQuery('');
              }}
              className="mt-4 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((item) => (
              <div
                key={item.id}
                id={`study-material-card-${item.id}`}
                className="group rounded-2xl bg-[#121622] border border-zinc-800 hover:border-amber-500/40 p-5 flex flex-col justify-between transition-all duration-200 hover:shadow-xl hover:shadow-black/60"
              >
                <div>
                  {/* Category badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-950/80 text-red-400 border border-red-800/50">
                      {item.classLevel}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      {item.type}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors mb-2 line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-zinc-800/80">
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mb-3">
                    <span>Subject: <strong className="text-zinc-300">{item.subject}</strong></span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {item.uploadDate}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      id={`btn-view-material-${item.id}`}
                      onClick={() =>
                        onViewPdf(item.title, item.fileUrl, [
                          `Official Study Material: ${item.title}`,
                          `Class: ${item.classLevel} | Subject: ${item.subject}`,
                          `Author & Faculty: Satyam Sir (PG, B.Ed, CTET)`,
                          `Overview: ${item.description}`,
                          `This material is structured to help you revise quickly and score full marks in tests.`,
                        ])
                      }
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700 hover:text-white border border-zinc-700 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>View PDF</span>
                    </button>

                    <button
                      id={`btn-download-material-${item.id}`}
                      onClick={() => handleDownload(item)}
                      className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-sm transition-colors"
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
      </div>
    </section>
  );
};
