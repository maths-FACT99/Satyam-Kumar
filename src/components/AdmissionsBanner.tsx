import React from 'react';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';
import { WebsiteContent } from '../types';
import { EditableText } from './EditableElements';

interface AdmissionsBannerProps {
  content: WebsiteContent;
  onEnrollClick: () => void;
  isEditMode?: boolean;
  onEditText?: (fieldKey: string, label: string, currentValue: string, isMultiline?: boolean) => void;
}

export const AdmissionsBanner: React.FC<AdmissionsBannerProps> = ({
  content,
  onEnrollClick,
  isEditMode = false,
  onEditText,
}) => {
  return (
    <section id="admissions-banner" className="relative py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-950 via-[#1C1319] to-red-950 border border-red-500/40 p-6 sm:p-8 shadow-2xl shadow-red-950/40">
          {/* Subtle glowing lines */}
          <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col text-center md:text-left space-y-2">
              <div className="inline-flex items-center justify-center md:justify-start gap-2 text-amber-400 font-bold text-xs uppercase tracking-widest">
                <Sparkles className="w-4 h-4" />
                <EditableText
                  isEditMode={isEditMode}
                  value={content.bannerSubtitle || 'Something BIG is Coming... Be a Part of It!'}
                  fieldKey="bannerSubtitle"
                  label="Banner Subtitle"
                  onEdit={onEditText}
                >
                  <span>{content.bannerSubtitle || 'Something BIG is Coming... Be a Part of It!'}</span>
                </EditableText>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                <EditableText
                  isEditMode={isEditMode}
                  value={content.bannerTitle || 'LIMITED SEATS AVAILABLE – ENROLL NOW!'}
                  fieldKey="bannerTitle"
                  label="Banner Main Headline"
                  onEdit={onEditText}
                >
                  <span>{content.bannerTitle || 'LIMITED SEATS AVAILABLE – ENROLL NOW!'}</span>
                </EditableText>
              </h2>
              <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl">
                Small batch sizes ensure personalized focus for every child. New academic session batches for Class III to XII filling fast.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                id="banner-enroll-btn"
                onClick={onEnrollClick}
                className="flex items-center gap-2.5 px-8 py-3.5 rounded-xl font-extrabold text-sm tracking-wide text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/70 border border-red-400/40 hover:scale-105 transition-all"
              >
                <Zap className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span>ENROLL NOW</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
