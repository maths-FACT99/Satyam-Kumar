import React from 'react';
import { BookOpen, CheckCircle, Award, Target, Users, Sparkles, BrainCircuit } from 'lucide-react';
import { WebsiteContent } from '../types';
import { MathsFactLogo } from './MathsFactLogo';
import { EditableText } from './EditableElements';

interface AboutSectionProps {
  content: WebsiteContent;
  onBookDemo: () => void;
  isEditMode?: boolean;
  onEditText?: (fieldKey: string, label: string, currentValue: string, isMultiline?: boolean) => void;
  onEditImage?: (fieldKey: string, label: string, currentUrl: string, fallbackUrl?: string) => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({
  content,
  onBookDemo,
  isEditMode = false,
  onEditText,
}) => {
  return (
    <section id="about" className="py-16 md:py-24 relative bg-[#0B0D11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Visual feature summary */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative">
              {/* Outer decorative card frame */}
              <div className="rounded-2xl bg-gradient-to-br from-[#161B29] to-[#0E121B] border border-red-900/40 p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center gap-3 border-b border-zinc-800 pb-5">
                  <MathsFactLogo size="md" customLogoUrl={content.logoUrl} />
                  <div>
                    <h3 className="text-lg font-extrabold text-white">The Maths Fact Core</h3>
                    <p className="text-xs text-zinc-400">Concept-Based Learning Framework</p>
                  </div>
                </div>

                <div className="space-y-3.5">
                  {content.aboutPoints.map((point, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-zinc-300 font-medium">{point}</span>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-red-950/40 border border-red-900/50 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-zinc-400">Faculty Leadership</div>
                    <div className="text-sm font-bold text-white">{content.facultyName}</div>
                    <div className="text-[11px] text-amber-400">{content.facultyQualifications}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-zinc-400">Experience</div>
                    <div className="text-sm font-bold text-red-400">{content.facultyExperience}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Narrative */}
          <div className="lg:col-span-7 order-1 lg:order-2 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/50 text-red-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Building Strong Academic Foundations</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
              About <span className="text-red-500">Maths Fact</span>
            </h2>

            <EditableText
              isEditMode={isEditMode}
              value={content.aboutDescription}
              fieldKey="aboutDescription"
              label="About Us Description"
              isMultiline={true}
              onEdit={onEditText}
              className="block"
            >
              <p className="text-base sm:text-lg text-zinc-300 leading-relaxed">
                {content.aboutDescription}
              </p>
            </EditableText>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#121622] border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-800/40 flex items-center justify-center text-red-400 mb-2">
                  <Target className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">For Students</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-normal">
                  Demystify difficult mathematics, clear school &amp; board exams with confidence, and enjoy learning.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#121622] border border-zinc-800">
                <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-800/40 flex items-center justify-center text-amber-400 mb-2">
                  <Users className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white">For Parents</h4>
                <p className="text-xs text-zinc-400 mt-1 leading-normal">
                  Transparent progress reports, timely doubt-clearing, and reliable mentorship from a certified educator.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onBookDemo}
                className="px-6 py-3 rounded-xl font-bold text-xs tracking-wide text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-lg shadow-red-950/50 transition-all inline-flex items-center gap-2"
              >
                <span>Book 1-Week Free Demo</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
