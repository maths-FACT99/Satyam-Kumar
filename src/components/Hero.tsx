import React from 'react';
import { ArrowRight, Sparkles, CheckCircle2, Award, BookOpen, Star, Calendar } from 'lucide-react';
import { WebsiteContent } from '../types';
import { EditableText, EditableImage } from './EditableElements';

interface HeroProps {
  content: WebsiteContent;
  onBookDemo: () => void;
  onViewCourses: () => void;
  onOpenAiChat: () => void;
  isEditMode?: boolean;
  onEditText?: (fieldKey: string, label: string, currentValue: string, isMultiline?: boolean) => void;
  onEditImage?: (fieldKey: string, label: string, currentUrl: string, fallbackUrl?: string) => void;
}

export const Hero: React.FC<HeroProps> = ({
  content,
  onBookDemo,
  onViewCourses,
  onOpenAiChat,
  isEditMode = false,
  onEditText,
  onEditImage,
}) => {
  const teacherImage = content.facultyPhotoUrl || '/satyam_sir_real.jpg';

  const mathSymbols = [
    { text: 'π', top: '15%', left: '8%', delay: '0s', size: 'text-3xl' },
    { text: '√x', top: '35%', left: '4%', delay: '1.5s', size: 'text-2xl' },
    { text: '∑', top: '75%', left: '12%', delay: '2.5s', size: 'text-3xl' },
    { text: '∫ f(x)dx', top: '80%', left: '45%', delay: '3.5s', size: 'text-xl' },
    { text: 'x² + y²', top: '20%', left: '48%', delay: '1s', size: 'text-xl' },
    { text: 'θ', top: '65%', left: '38%', delay: '2s', size: 'text-2xl' },
    { text: '÷', top: '12%', left: '85%', delay: '0.8s', size: 'text-3xl' },
    { text: '∆', top: '82%', left: '90%', delay: '1.2s', size: 'text-2xl' },
  ];

  return (
    <section id="home" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background ambient lighting and gradients */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Deep red radial glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-700/15 rounded-full blur-[120px]" />
        {/* Subtle amber/gold ambient glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-[140px]" />
        {/* Bottom edge fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0B0D11] to-transparent" />
      </div>

      {/* Floating subtle mathematical symbols */}
      <div className="absolute inset-0 pointer-events-none select-none opacity-20 hidden md:block">
        {mathSymbols.map((item, idx) => (
          <div
            key={idx}
            style={{ top: item.top, left: item.left, animationDelay: item.delay }}
            className={`absolute ${item.size} font-serif font-bold text-red-300/60 animate-float tracking-widest`}
          >
            {item.text}
          </div>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Information & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            {/* Admissions Open Announcement Badge */}
            <div
              id="hero-admissions-pill"
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-950/90 via-red-900/60 to-black border border-red-500/50 shadow-lg shadow-red-950/40 mb-5"
            >
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <EditableText
                isEditMode={isEditMode}
                value={content.heroHeading || 'ADMISSIONS OPEN – NEW SESSION'}
                fieldKey="heroHeading"
                label="Admissions Banner Text"
                onEdit={onEditText}
                className="text-xs sm:text-sm font-bold tracking-wider text-red-200 uppercase"
              >
                <span className="text-xs sm:text-sm font-bold tracking-wider text-red-200 uppercase">
                  {content.heroHeading || 'ADMISSIONS OPEN – NEW SESSION'}
                </span>
              </EditableText>
            </div>

            {/* Main Hero Headline */}
            <h1
              id="hero-title"
              className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.15] mb-5"
            >
              <EditableText
                isEditMode={isEditMode}
                value={content.heroSubheading || "Unlock Your Child's Academic Excellence with"}
                fieldKey="heroSubheading"
                label="Main Headline Phrase"
                onEdit={onEditText}
              >
                <span>{content.heroSubheading || "Unlock Your Child's Academic Excellence with"}</span>
              </EditableText>{' '}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500">
                <EditableText
                  isEditMode={isEditMode}
                  value={content.heroHighlight || 'Maths'}
                  fieldKey="heroHighlight"
                  label="Highlighted Keyword"
                  onEdit={onEditText}
                >
                  <span>{content.heroHighlight || 'Maths'}</span>
                </EditableText>
                <span className="absolute -bottom-1 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-amber-400 to-red-600 rounded-full opacity-80" />
              </span>
            </h1>

            {/* Sub-paragraph */}
            <p className="text-base sm:text-lg text-zinc-300 max-w-2xl mb-8 leading-relaxed">
              Welcome to <span className="text-white font-semibold">MATHS FACT</span> by{' '}
              <EditableText
                isEditMode={isEditMode}
                value={content.facultyName}
                fieldKey="facultyName"
                label="Teacher Name"
                onEdit={onEditText}
                className="text-amber-400 font-semibold"
              >
                <span className="text-amber-400 font-semibold">{content.facultyName}</span>
              </EditableText>
              . We build unshakeable fundamentals for Class III to XII with concept-based clarity, rigorous
              practice, and personal guidance.
            </p>

            {/* 1 WEEK FREE DEMO CLASS BADGE */}
            <div
              id="hero-free-demo-badge"
              className="w-full sm:w-auto p-4 rounded-xl bg-gradient-to-r from-[#171B26] via-[#1F1722] to-[#171B26] border border-amber-500/30 mb-8 shadow-xl shadow-black/40"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <EditableText
                      isEditMode={isEditMode}
                      value={content.heroBadge || '1 WEEK FREE DEMO CLASS'}
                      fieldKey="heroBadge"
                      label="Free Demo Offer Title"
                      onEdit={onEditText}
                      className="text-sm font-bold text-amber-300 uppercase tracking-wide"
                    >
                      <span className="text-sm font-bold text-amber-300 uppercase tracking-wide">
                        {content.heroBadge || '1 WEEK FREE DEMO CLASS'}
                      </span>
                    </EditableText>
                    <span className="text-[10px] uppercase font-bold bg-red-600 text-white px-2 py-0.5 rounded-full">
                      Free Access
                    </span>
                  </div>
                  <EditableText
                    isEditMode={isEditMode}
                    value={content.heroBadgeSubtitle || 'Experience our teaching before you enrol!'}
                    fieldKey="heroBadgeSubtitle"
                    label="Free Demo Offer Subtitle"
                    onEdit={onEditText}
                    className="text-xs text-zinc-300 mt-0.5 block"
                  >
                    <p className="text-xs text-zinc-300 mt-0.5">
                      {content.heroBadgeSubtitle || 'Experience our teaching before you enrol!'}
                    </p>
                  </EditableText>
                </div>
              </div>
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                id="hero-book-demo-btn"
                onClick={onBookDemo}
                className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm tracking-wide text-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/60 border border-red-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>BOOK FREE DEMO</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                id="hero-ai-chat-btn"
                onClick={onOpenAiChat}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-bold text-sm text-amber-300 hover:text-white bg-gradient-to-r from-amber-500/20 via-red-900/40 to-amber-500/20 hover:from-amber-600 hover:to-red-600 border border-amber-500/50 shadow-lg shadow-amber-950/40 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:text-white animate-pulse" />
                <span>ASK MATHS EXPERT AI</span>
              </button>

              <button
                id="hero-view-courses-btn"
                onClick={onViewCourses}
                className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-zinc-300 hover:text-white bg-[#151922] hover:bg-[#1C2230] border border-zinc-700/80 hover:border-zinc-600 shadow-md transition-all"
              >
                <BookOpen className="w-4 h-4 text-zinc-400" />
                <span>COURSES</span>
              </button>
            </div>

            {/* Trust highlights checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-8 pt-6 border-t border-zinc-800/80 w-full text-xs text-zinc-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Concept-Based</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>7+ Years Exp</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Quality Question PDFs</span>
              </div>
            </div>
          </div>

          {/* Right Column: Faculty Visual & Credential Spotlight Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md">
              {/* Outer decorative glowing border */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-b from-red-600/50 via-amber-500/20 to-red-900/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity" />

              <div className="relative rounded-2xl bg-[#111520] border border-red-900/50 overflow-hidden shadow-2xl">
                {/* Faculty Portrait Image */}
                <div className="relative h-96 sm:h-[420px] w-full bg-[#0E121B] overflow-hidden">
                  <EditableImage
                    isEditMode={isEditMode}
                    src={teacherImage}
                    alt={`${content.facultyName} - Maths Fact Faculty`}
                    fieldKey="facultyPhotoUrl"
                    label="Satyam Sir Faculty Picture"
                    fallbackUrl="/satyam_sir.jpg"
                    onEdit={onEditImage}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />

                  {/* Gradient shadow over photo */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111520] via-transparent to-black/20 pointer-events-none" />

                  {/* Floating Experience Badge */}
                  <div className="absolute top-4 right-4 bg-[#0B0D11]/90 backdrop-blur-md border border-amber-500/40 px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-400" />
                    <div>
                      <EditableText
                        isEditMode={isEditMode}
                        value={content.facultyExperience || '7+ Years'}
                        fieldKey="facultyExperience"
                        label="Years of Experience"
                        onEdit={onEditText}
                        className="text-xs font-bold text-white block leading-none"
                      >
                        <span className="text-xs font-bold text-white block leading-none">
                          {content.facultyExperience || '7+ Years'}
                        </span>
                      </EditableText>
                      <span className="text-[10px] text-amber-300/80 font-medium">Experience</span>
                    </div>
                  </div>

                  {/* Verification Tag */}
                  <div className="absolute top-4 left-4 bg-red-950/90 backdrop-blur-md border border-red-500/50 px-2.5 py-1 rounded-lg text-[10px] font-bold text-red-300 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                    Maths Specialist
                  </div>

                  {/* Interactive AI Doubt Solver Trigger on Photo */}
                  <button
                    onClick={onOpenAiChat}
                    className="absolute bottom-3 left-3 right-3 bg-black/85 hover:bg-black/95 backdrop-blur-md border border-red-500/60 hover:border-amber-400/80 p-2.5 rounded-xl shadow-2xl flex items-center justify-between text-left transition-all group z-10"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <div>
                        <div className="text-xs font-black text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                          <span>Ask Maths Expert AI</span>
                          <Sparkles className="w-3 h-3 text-amber-400" />
                        </div>
                        <div className="text-[10px] text-zinc-400">Click to ask any math concept doubt</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      Ask →
                    </span>
                  </button>
                </div>

                {/* Faculty Information Card */}
                <div className="p-5 bg-gradient-to-b from-[#111520] to-[#0A0D14] border-t border-zinc-800">
                  <div className="flex items-center justify-between mb-1.5">
                    <EditableText
                      isEditMode={isEditMode}
                      value={content.facultyName || 'Satyam Sir'}
                      fieldKey="facultyName"
                      label="Faculty Name"
                      onEdit={onEditText}
                      className="text-xl font-extrabold text-white tracking-wide"
                    >
                      <h3 className="text-xl font-extrabold text-white tracking-wide">
                        {content.facultyName || 'Satyam Sir'}
                      </h3>
                    </EditableText>
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <EditableText
                      isEditMode={isEditMode}
                      value={content.facultyQualifications || 'PG, B.Ed, CTET'}
                      fieldKey="facultyQualifications"
                      label="Faculty Qualifications"
                      onEdit={onEditText}
                      className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700"
                    >
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                        {content.facultyQualifications || 'PG, B.Ed, CTET'}
                      </span>
                    </EditableText>
                    <span className="text-xs text-red-400 font-medium">
                      Founder &amp; Chief Mentor
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-zinc-800/80">
                    <div className="text-zinc-400">
                      <span className="text-zinc-500 block text-[10px]">Teaching:</span>
                      <span className="text-zinc-200 font-medium">Class III – XII</span>
                    </div>
                    <div className="text-zinc-400">
                      <span className="text-zinc-500 block text-[10px]">Direct Contact:</span>
                      <EditableText
                        isEditMode={isEditMode}
                        value={content.contactPhone1}
                        fieldKey="contactPhone1"
                        label="Direct Contact Number"
                        onEdit={onEditText}
                        className="text-amber-400 font-semibold"
                      >
                        <span className="text-amber-400 font-semibold">{content.contactPhone1}</span>
                      </EditableText>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
