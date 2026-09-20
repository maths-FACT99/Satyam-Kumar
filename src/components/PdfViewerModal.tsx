import React, { useState } from 'react';
import {
  X,
  Download,
  Printer,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  FileText,
  Sparkles,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

interface PdfViewerModalProps {
  isOpen: boolean;
  title: string;
  fileUrl: string;
  sampleContent?: string[];
  onClose: () => void;
}

export const PdfViewerModal: React.FC<PdfViewerModalProps> = ({
  isOpen,
  title,
  fileUrl,
  sampleContent = [],
  onClose,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 3;

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate text/pdf simulation download
    const element = document.createElement('a');
    const content = `==========================================================\n` +
      `MATHS FACT EDUCATIONAL INSTITUTE\n` +
      `Faculty: Satyam Sir (PG, B.Ed, CTET) | Helpline: 7004995470\n` +
      `Email: mathsfact.99@gmail.com\n` +
      `==========================================================\n\n` +
      `DOCUMENT: ${title}\n` +
      `DATE GENERATED: ${new Date().toLocaleDateString()}\n\n` +
      `CONTENT & PROBLEMS:\n` +
      sampleContent.map((c, i) => `${i + 1}. ${c}`).join('\n\n') +
      `\n\n==========================================================\n` +
      `Join Maths Fact for concept-based learning & 1 Week Free Demo.\n` +
      `==========================================================\n`;

    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_mathsfact.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div
      id="pdf-viewer-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
    >
      <div
        className={`relative w-full rounded-2xl bg-[#0F131C] border border-red-900/50 flex flex-col shadow-2xl overflow-hidden transition-all duration-300 ${
          isFullscreen ? 'h-full max-w-full rounded-none' : 'max-w-4xl h-[90vh]'
        }`}
      >
        {/* PDF Viewer Header Toolbar */}
        <div className="bg-[#141926] border-b border-zinc-800 p-3 sm:p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-red-950/90 border border-red-800/60 flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-red-400" />
            </div>
            <div className="truncate">
              <h3 className="text-sm sm:text-base font-bold text-white truncate">{title}</h3>
              <div className="text-[11px] text-zinc-400 flex items-center gap-2">
                <span>Maths Fact Official Study Repository</span>
                <span>•</span>
                <span className="text-amber-400">Satyam Sir</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrint}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title="Print Document"
            >
              <Printer className="w-4 h-4" />
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-semibold text-white transition-colors shadow"
              title="Download PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-zinc-800 hover:bg-red-900/60 text-zinc-400 hover:text-white transition-colors ml-1"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* PDF Document Canvas / Preview Area */}
        <div className="flex-1 bg-[#1A1E29] p-4 sm:p-8 overflow-y-auto flex justify-center">
          <div className="relative w-full max-w-2xl bg-white text-zinc-900 rounded-xl shadow-2xl p-6 sm:p-10 min-h-[600px] flex flex-col justify-between select-text">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none rotate-[-25deg]">
              <span className="text-6xl sm:text-7xl font-extrabold tracking-widest text-zinc-900 text-center uppercase">
                MATHS FACT<br />SATYAM SIR
              </span>
            </div>

            {/* Document Header */}
            <div>
              <div className="flex items-center justify-between border-b-2 border-red-700 pb-4 mb-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-black tracking-tight text-zinc-900">
                    MATHS FACT
                  </h1>
                  <p className="text-xs font-semibold text-zinc-600">
                    Concept-Based Coaching • Class III to XII
                  </p>
                  <p className="text-[11px] text-zinc-500">
                    Faculty: Satyam Sir (PG, B.Ed, CTET) • Ph: 7004995470
                  </p>
                </div>

                <div className="text-right">
                  <span className="inline-block px-2.5 py-1 rounded bg-red-100 text-red-800 text-[10px] font-extrabold uppercase">
                    Official Coursework
                  </span>
                  <div className="text-[11px] text-zinc-500 mt-1">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-6">
                <h2 className="text-lg font-bold text-zinc-800 border-l-4 border-red-600 pl-3">
                  {title}
                </h2>
              </div>

              {/* Page Content */}
              {currentPage === 1 && (
                <div className="space-y-4 text-sm text-zinc-800 leading-relaxed">
                  <div className="p-3 bg-zinc-50 rounded-lg border border-zinc-200">
                    <span className="font-bold text-xs text-zinc-700 block mb-1">
                      SECTION A: Key Concepts &amp; Formulas
                    </span>
                    <ul className="text-xs space-y-1.5 list-disc pl-4 text-zinc-700">
                      <li>Always read every problem statement twice and identify all given values.</li>
                      <li>Write down the governing formula and coordinate geometry / algebraic relation.</li>
                      <li>Double check units (cm, m, km, degrees, radians) before calculating.</li>
                      <li>Verify final values against boundary limits and conceptual sanity tests.</li>
                    </ul>
                  </div>

                  <div className="pt-2">
                    <h4 className="font-bold text-xs text-zinc-900 uppercase tracking-wider mb-2">
                      Practice Problems &amp; High-Frequency Questions
                    </h4>
                    <div className="space-y-3">
                      {(sampleContent.length > 0 ? sampleContent : [
                        'Find the roots of the quadratic equation using both factorization and the quadratic formula, and verify with discriminant analysis.',
                        'Prove that the perpendicular bisector of a chord passes through the center of a circle.',
                        'Calculate the surface area and volume ratio of a composite solid cylinder mounted on a hemisphere.',
                        'Solve the linear equations system graphically and determine the coordinates of the triangle vertices formed with the x-axis.'
                      ]).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded bg-zinc-50 border border-zinc-100">
                          <span className="font-bold text-red-600 text-xs shrink-0">Q{idx + 1}.</span>
                          <span className="text-xs font-medium text-zinc-800">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 2 && (
                <div className="space-y-4 text-sm text-zinc-800 leading-relaxed">
                  <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                    <span className="font-bold text-xs text-amber-900 block mb-1">
                      SECTION B: Step-by-Step Solutions &amp; Working Notes
                    </span>
                    <p className="text-xs text-amber-800">
                      Carefully follow the logical breakdown for maximum board exam marks credit:
                    </p>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
                      <div className="font-bold text-zinc-900 mb-1">Step 1: State Given Parameters</div>
                      <p className="text-zinc-600">Clearly define all known variables and state the required unknown.</p>
                    </div>
                    <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
                      <div className="font-bold text-zinc-900 mb-1">Step 2: Theorem Application</div>
                      <p className="text-zinc-600">Cite the governing mathematical theorem by name (e.g. Pythagoras Theorem, Thales Theorem, Binomial Expansion).</p>
                    </div>
                    <div className="p-3 rounded bg-zinc-50 border border-zinc-200">
                      <div className="font-bold text-zinc-900 mb-1">Step 3: Algebraic Substitution</div>
                      <p className="text-zinc-600">Show step-by-step arithmetic without skipping intermediate terms to avoid calculation errors.</p>
                    </div>
                  </div>
                </div>
              )}

              {currentPage === 3 && (
                <div className="space-y-4 text-sm text-zinc-800 leading-relaxed">
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
                    <Sparkles className="w-6 h-6 text-red-600 mx-auto mb-2" />
                    <h3 className="font-bold text-sm text-red-900">Want Personalized Mentorship?</h3>
                    <p className="text-xs text-zinc-700 mt-1 max-w-md mx-auto">
                      Satyam Sir conducts personal doubt-clearing sessions and regular testing to ensure every student masters these problem types.
                    </p>
                    <div className="mt-3 text-xs font-bold text-red-700">
                      Book Your 1-Week Free Demo Class: Call 7004995470
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Document Footer */}
            <div className="pt-6 border-t border-zinc-200 flex items-center justify-between text-[11px] text-zinc-500">
              <span>Maths Fact Institute • Satyam Sir</span>
              <span>mathsfact.99@gmail.com</span>
              <span>Strictly for enrolled &amp; demo students</span>
            </div>
          </div>
        </div>

        {/* PDF Viewer Bottom Pagination Toolbar */}
        <div className="bg-[#141926] border-t border-zinc-800 px-4 py-3 flex items-center justify-between text-xs text-zinc-300">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-zinc-300"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span>
              Page <strong className="text-white">{currentPage}</strong> of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 disabled:opacity-30 disabled:pointer-events-none text-zinc-300"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="text-[11px] text-zinc-400 hidden sm:block">
            Use Print or Download button above to save a copy.
          </div>
        </div>
      </div>
    </div>
  );
};
