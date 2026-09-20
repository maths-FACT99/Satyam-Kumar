import React from 'react';
import { Award, BookOpen, GraduationCap, CheckCircle, Phone, MessageSquare, Star, Sparkles } from 'lucide-react';
import { WebsiteContent } from '../types';
import { EditableText, EditableImage } from './EditableElements';

interface FacultySectionProps {
  content: WebsiteContent;
  onBookDemo: () => void;
  onOpenAiChat?: () => void;
  isEditMode?: boolean;
  onEditText?: (fieldKey: string, label: string, currentValue: string, isMultiline?: boolean) => void;
  onEditImage?: (fieldKey: string, label: string, currentUrl: string, fallbackUrl?: string) => void;
}

export const FacultySection: React.FC<FacultySectionProps> = ({
  content,
  onBookDemo,
  onOpenAiChat,
  isEditMode = false,
  onEditText,
  onEditImage,
}) => {
  const teacherImage = content.facultyPhotoUrl || '/satyam_sir_real.jpg';

  return (
    <section id="faculty" className="py-16 md:py-24 relative bg-[#090C12]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
            <span>Master Mentorship</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Meet Your Faculty
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Passionate educator dedicated to transforming mathematical fear into supreme confidence and top academic grades.
          </p>
        </div>

        {/* Profile Feature Card */}
        <div className="max-w-4xl mx-auto rounded-3xl bg-[#121622] border border-red-900/40 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-12">
            {/* Left: Photo column */}
            <div className="md:col-span-5 relative bg-[#0E121B] min-h-[350px]">
              <EditableImage
                isEditMode={isEditMode}
                src={teacherImage}
                alt={content.facultyName}
                fieldKey="facultyPhotoUrl"
                label="Faculty Profile Picture"
                fallbackUrl="/satyam_sir.jpg"
                onEdit={onEditImage}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121622] via-transparent to-transparent md:hidden pointer-events-none" />
              <div className="absolute top-4 left-4 bg-red-950/90 border border-red-600/50 px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                Lead Mentor
              </div>
            </div>

            {/* Right: Info and credentials */}
            <div className="md:col-span-7 p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <EditableText
                    isEditMode={isEditMode}
                    value={content.facultyName || 'Satyam Sir'}
                    fieldKey="facultyName"
                    label="Faculty Name"
                    onEdit={onEditText}
                    className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight"
                  >
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                      {content.facultyName || 'Satyam Sir'}
                    </h3>
                  </EditableText>
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <EditableText
                    isEditMode={isEditMode}
                    value={content.facultyQualifications || 'PG, B.Ed, CTET'}
                    fieldKey="facultyQualifications"
                    label="Faculty Qualifications"
                    onEdit={onEditText}
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-red-950/80 text-red-300 border border-red-800/60"
                  >
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-red-950/80 text-red-300 border border-red-800/60">
                      {content.facultyQualifications || 'PG, B.Ed, CTET'}
                    </span>
                  </EditableText>
                  <EditableText
                    isEditMode={isEditMode}
                    value={content.facultyExperience || '7+ Years Experience'}
                    fieldKey="facultyExperience"
                    label="Experience Label"
                    onEdit={onEditText}
                    className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-800/60"
                  >
                    <span className="text-xs font-bold px-3 py-1 rounded-lg bg-amber-950/70 text-amber-300 border border-amber-800/60">
                      {content.facultyExperience || '7+ Years Experience'}
                    </span>
                  </EditableText>
                </div>

                <EditableText
                  isEditMode={isEditMode}
                  value={content.facultyBio}
                  fieldKey="facultyBio"
                  label="Faculty Bio"
                  isMultiline={true}
                  onEdit={onEditText}
                  className="block mb-6"
                >
                  <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed mb-6">
                    {content.facultyBio}
                  </p>
                </EditableText>

                {/* Areas taught */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Core Teaching Domains
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {content.facultySubjects.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-2 rounded-lg bg-[#0E121B] border border-zinc-800 text-xs text-zinc-200"
                      >
                        <CheckCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span className="truncate">{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact actions */}
              <div className="pt-5 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${content.contactPhone1}`}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-amber-400" />
                    <span>Call Sir</span>
                  </a>
                  <a
                    href={`https://wa.me/91${content.whatsappNumber}?text=${encodeURIComponent(
                      'Hello Satyam Sir, I would like to know more about your courses and 1-week free demo class.'
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-green-700 hover:bg-green-600 text-xs font-semibold text-white transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  {onOpenAiChat && (
                    <button
                      onClick={onOpenAiChat}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-red-600/20 hover:from-amber-600 hover:to-red-600 border border-amber-400/40 text-xs font-bold text-amber-300 hover:text-white transition-all"
                      title="Ask Maths Expert AI a question"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ask Maths Expert</span>
                    </button>
                  )}
                </div>

                <button
                  onClick={onBookDemo}
                  className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-xs font-bold text-white shadow-md shadow-red-950/60"
                >
                  Book Demo with Sir
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
