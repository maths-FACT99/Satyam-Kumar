import React from 'react';
import {
  BrainCircuit,
  GraduationCap,
  Trophy,
  Layers,
  FileSpreadsheet,
  HelpCircle,
  BookOpen,
  Users,
  Target,
  CheckCircle2,
} from 'lucide-react';
import { WebsiteContent } from '../types';

interface WhyChooseUsProps {
  content: WebsiteContent;
}

export const WhyChooseUs: React.FC<WhyChooseUsProps> = ({ content }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'BrainCircuit':
        return <BrainCircuit className="w-5 h-5 text-amber-400" />;
      case 'GraduationCap':
        return <GraduationCap className="w-5 h-5 text-red-400" />;
      case 'Trophy':
        return <Trophy className="w-5 h-5 text-amber-400" />;
      case 'Layers':
        return <Layers className="w-5 h-5 text-red-400" />;
      case 'FileSpreadsheet':
        return <FileSpreadsheet className="w-5 h-5 text-amber-400" />;
      case 'HelpCircle':
        return <HelpCircle className="w-5 h-5 text-red-400" />;
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-amber-400" />;
      case 'Users':
        return <Users className="w-5 h-5 text-red-400" />;
      case 'Target':
      default:
        return <Target className="w-5 h-5 text-red-400" />;
    }
  };

  return (
    <section id="why-choose-us" className="py-16 md:py-24 relative bg-[#090C12]">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-red-900/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Proven Methodology</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Choose Us?
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            At Maths Fact, we combine experienced mentoring, structured practice drills, and deep conceptual clarity to turn potential into peak academic performance.
          </p>
        </div>

        {/* 9 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {content.whyChoosePoints.map((point, index) => (
            <div
              key={index}
              id={`why-choose-card-${index}`}
              className="group p-5 sm:p-6 rounded-2xl bg-[#121622]/90 border border-zinc-800/80 hover:border-red-500/40 hover:bg-[#161B29] transition-all duration-200 shadow-md hover:shadow-xl hover:shadow-red-950/30 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#181D2B] border border-zinc-700/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getIcon(point.icon)}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-500 tracking-wider">
                    0{index + 1}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-white group-hover:text-amber-400 transition-colors mb-2">
                  {point.title}
                </h3>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                  {point.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] text-red-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Maths Fact Standard</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
