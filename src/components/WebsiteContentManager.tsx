import React, { useState } from 'react';
import {
  Save,
  Image as ImageIcon,
  Type,
  Layout,
  UserCheck,
  Phone,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle,
  HelpCircle,
  BrainCircuit,
  GraduationCap,
  Trophy,
  Layers,
  FileSpreadsheet,
  BookOpen,
  Users,
  Target,
  Upload,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { WebsiteContent } from '../types';
import { FileUploadField } from './FileUploadField';

interface WebsiteContentManagerProps {
  content: WebsiteContent;
  onSave: (updatedContent: WebsiteContent) => Promise<void>;
  saveLoading: boolean;
}

export const WebsiteContentManager: React.FC<WebsiteContentManagerProps> = ({
  content: initialContent,
  onSave,
  saveLoading,
}) => {
  const [formData, setFormData] = useState<WebsiteContent>({
    ...initialContent,
    aboutPoints: initialContent.aboutPoints || [],
    whyChoosePoints: initialContent.whyChoosePoints || [],
    facultySubjects: initialContent.facultySubjects || [],
  });

  const [activeSubTab, setActiveSubTab] = useState<
    'all-media' | 'branding' | 'hero' | 'about' | 'faculty' | 'why-choose' | 'banner' | 'contact'
  >('all-media');

  const [newAboutPoint, setNewAboutPoint] = useState('');
  const [newFacultySubject, setNewFacultySubject] = useState('');

  const handleFieldChange = <K extends keyof WebsiteContent>(field: K, value: WebsiteContent[K]) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddAboutPoint = () => {
    if (!newAboutPoint.trim()) return;
    setFormData((prev) => ({
      ...prev,
      aboutPoints: [...prev.aboutPoints, newAboutPoint.trim()],
    }));
    setNewAboutPoint('');
  };

  const handleRemoveAboutPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      aboutPoints: prev.aboutPoints.filter((_, i) => i !== index),
    }));
  };

  const handleAddFacultySubject = () => {
    if (!newFacultySubject.trim()) return;
    setFormData((prev) => ({
      ...prev,
      facultySubjects: [...prev.facultySubjects, newFacultySubject.trim()],
    }));
    setNewFacultySubject('');
  };

  const handleRemoveFacultySubject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      facultySubjects: prev.facultySubjects.filter((_, i) => i !== index),
    }));
  };

  const handleWhyChooseChange = (index: number, field: 'title' | 'description' | 'icon', val: string) => {
    setFormData((prev) => {
      const updated = [...prev.whyChoosePoints];
      updated[index] = { ...updated[index], [field]: val };
      return { ...prev, whyChoosePoints: updated };
    });
  };

  const handleAddWhyChoosePoint = () => {
    setFormData((prev) => ({
      ...prev,
      whyChoosePoints: [
        ...prev.whyChoosePoints,
        {
          title: 'New Feature Benefit',
          description: 'Detailed explanation of why students benefit from this teaching practice.',
          icon: 'CheckCircle',
        },
      ],
    }));
  };

  const handleRemoveWhyChoosePoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      whyChoosePoints: prev.whyChoosePoints.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <span>Website Content &amp; Media Studio</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Edit all texts, headings, credentials, contact info, and replace every picture across the website.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saveLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-xs shadow-xl shadow-red-950/60 border border-red-400/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          <Save className="w-4 h-4" />
          <span>{saveLoading ? 'Saving...' : 'Save All Changes'}</span>
        </button>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
        {[
          { id: 'all-media', label: '🖼️ Pictures & Media', count: 'Photos' },
          { id: 'hero', label: '🚀 Hero Section', count: 'Main' },
          { id: 'branding', label: '🏷️ Logo & Brand', count: 'Logo' },
          { id: 'banner', label: '📢 Notice Banner', count: 'Seats' },
          { id: 'faculty', label: '👨‍🏫 Satyam Sir Profile', count: 'Faculty' },
          { id: 'about', label: '📖 About Maths Fact', count: 'About' },
          { id: 'why-choose', label: '⭐ Why Choose Us', count: `${formData.whyChoosePoints.length} Points` },
          { id: 'contact', label: '📞 Contact & Footer', count: 'Phones' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveSubTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeSubTab === tab.id
                ? 'bg-red-600 text-white shadow-lg shadow-red-950/50'
                : 'bg-[#121622] text-zinc-400 hover:text-white border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-md ${
                activeSubTab === tab.id ? 'bg-red-950/80 text-amber-300' : 'bg-zinc-800/80 text-zinc-500'
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ======================================================== */}
        {/* SUB-TAB 1: ALL PICTURES & MEDIA GALLERY                  */}
        {/* ======================================================== */}
        {activeSubTab === 'all-media' && (
          <div className="space-y-6">
            <div className="p-4 rounded-xl bg-red-950/30 border border-red-600/40 text-xs text-zinc-300">
              <span className="font-bold text-white">Direct Picture Replacer:</span> Upload any picture from your device (phone or laptop) or enter an image URL to replace the official portraits, emblems, and banners.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Satyam Sir Hero & Faculty Portrait */}
              <div className="p-5 rounded-2xl bg-[#121622] border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4" />
                      <span>Satyam Sir Portrait Photo</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Main photo shown on Hero Section, Faculty card, and Header avatar.
                    </p>
                  </div>
                  {formData.facultyPhotoUrl && formData.facultyPhotoUrl !== '/satyam_sir_real.jpg' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('facultyPhotoUrl', '/satyam_sir_real.jpg')}
                      className="text-[11px] font-semibold text-zinc-400 hover:text-red-400"
                    >
                      Reset Default Real Photo
                    </button>
                  )}
                </div>

                <FileUploadField
                  label="Upload New Teacher Photo"
                  sublabel="JPG, PNG, WebP (Vertical portrait works best)"
                  accept="image/*"
                  isImage={true}
                  currentValue={formData.facultyPhotoUrl || '/satyam_sir_real.jpg'}
                  onUploadSuccess={(url) => handleFieldChange('facultyPhotoUrl', url)}
                  placeholder="Upload portrait photo of Satyam Sir"
                  helperText="Recommended size: 800x1000px or clear selfie/portrait"
                />
              </div>

              {/* 2. Official Maths Fact Logo */}
              <div className="p-5 rounded-2xl bg-[#121622] border border-red-500/30 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider flex items-center gap-2">
                      <ImageIcon className="w-4 h-4" />
                      <span>Maths Fact Institute Logo</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Main emblem displayed in Header, Brand badges, and Footer.
                    </p>
                  </div>
                  {formData.logoUrl && formData.logoUrl !== '/maths_fact_logo.jpg' && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('logoUrl', '/maths_fact_logo.jpg')}
                      className="text-[11px] font-semibold text-zinc-400 hover:text-red-400"
                    >
                      Reset Default
                    </button>
                  )}
                </div>

                <FileUploadField
                  label="Upload Institute Emblem / Logo"
                  sublabel="Square or circular graphic (PNG or JPG)"
                  accept="image/*"
                  isImage={true}
                  currentValue={formData.logoUrl || '/maths_fact_logo.jpg'}
                  onUploadSuccess={(url) => handleFieldChange('logoUrl', url)}
                  placeholder="Upload circular Maths Fact crest"
                  helperText="If cleared, high-contrast SVG vector monogram is used automatically."
                />
              </div>

              {/* 3. Hero Background Banner */}
              <div className="p-5 rounded-2xl bg-[#121622] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                      <Layout className="w-4 h-4 text-blue-400" />
                      <span>Hero Background Banner Image</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Wide panoramic photo of classroom, math background, or study board.
                    </p>
                  </div>
                  {formData.heroBannerUrl && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('heroBannerUrl', '')}
                      className="text-[11px] font-semibold text-red-400 hover:text-red-300"
                    >
                      Remove Banner
                    </button>
                  )}
                </div>

                <FileUploadField
                  label="Upload Background Banner"
                  sublabel="Wide landscape (16:9 or 21:9)"
                  accept="image/*"
                  isImage={true}
                  currentValue={formData.heroBannerUrl || ''}
                  onUploadSuccess={(url) => handleFieldChange('heroBannerUrl', url)}
                  onClear={() => handleFieldChange('heroBannerUrl', '')}
                  placeholder="Upload wide campus or mathematical banner"
                  helperText="Displayed as subtle background backdrop behind Hero section."
                />
              </div>

              {/* 4. About Section Image */}
              <div className="p-5 rounded-2xl bg-[#121622] border border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>About Section Showcase Image</span>
                    </h3>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Optional illustration or photo displayed next to the About description.
                    </p>
                  </div>
                  {formData.aboutImageUrl && (
                    <button
                      type="button"
                      onClick={() => handleFieldChange('aboutImageUrl', '')}
                      className="text-[11px] font-semibold text-red-400 hover:text-red-300"
                    >
                      Remove
                    </button>
                  )}
                </div>

                <FileUploadField
                  label="Upload About Section Graphic"
                  sublabel="PNG or JPG"
                  accept="image/*"
                  isImage={true}
                  currentValue={formData.aboutImageUrl || ''}
                  onUploadSuccess={(url) => handleFieldChange('aboutImageUrl', url)}
                  onClear={() => handleFieldChange('aboutImageUrl', '')}
                  placeholder="Upload photo of classroom or learning concept"
                  helperText="Leaves empty to keep default core feature badges."
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 2: HERO SECTION TEXTS                            */}
        {/* ======================================================== */}
        {activeSubTab === 'hero' && (
          <div className="p-6 rounded-2xl bg-[#121622] border border-zinc-800 space-y-5">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              Hero Section Headings &amp; Offers
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Top Admissions Pill Text
                </label>
                <input
                  type="text"
                  value={formData.heroHeading}
                  onChange={(e) => handleFieldChange('heroHeading', e.target.value)}
                  placeholder="ADMISSIONS OPEN – NEW SESSION"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Hero Highlighted Word (Amber Glow)
                </label>
                <input
                  type="text"
                  value={formData.heroHighlight}
                  onChange={(e) => handleFieldChange('heroHighlight', e.target.value)}
                  placeholder="Maths"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Main Headline (Leading phrase)
                </label>
                <input
                  type="text"
                  value={formData.heroSubheading}
                  onChange={(e) => handleFieldChange('heroSubheading', e.target.value)}
                  placeholder="Unlock Your Child's Academic Excellence with"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Hero Free Demo Offer Title
                </label>
                <input
                  type="text"
                  value={formData.heroBadge}
                  onChange={(e) => handleFieldChange('heroBadge', e.target.value)}
                  placeholder="1 WEEK FREE DEMO CLASS"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Hero Free Demo Subtitle
                </label>
                <input
                  type="text"
                  value={formData.heroBadgeSubtitle}
                  onChange={(e) => handleFieldChange('heroBadgeSubtitle', e.target.value)}
                  placeholder="Experience our teaching before you enrol!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Hero Introduction Description
                </label>
                <textarea
                  rows={3}
                  value={
                    formData.heroDescription ||
                    `Welcome to MATHS FACT by ${formData.facultyName}. We build unshakeable fundamentals for Class III to XII with concept-based clarity, rigorous practice, and personal guidance.`
                  }
                  onChange={(e) => handleFieldChange('heroDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white leading-relaxed"
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 3: BRANDING & LOGO                               */}
        {/* ======================================================== */}
        {activeSubTab === 'branding' && (
          <div className="p-6 rounded-2xl bg-[#121622] border border-zinc-800 space-y-5">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">
              Institute Branding &amp; Identity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Institute Name
                </label>
                <input
                  type="text"
                  value={formData.instituteName}
                  onChange={(e) => handleFieldChange('instituteName', e.target.value)}
                  placeholder="MATHS FACT"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Institute Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => handleFieldChange('tagline', e.target.value)}
                  placeholder="Unlock Your Child's Academic Excellence with Maths"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Institute Crest / Logo Picture
              </label>
              <FileUploadField
                label="Upload Logo Picture"
                sublabel="JPG, PNG, SVG"
                accept="image/*"
                isImage={true}
                currentValue={formData.logoUrl || '/maths_fact_logo.jpg'}
                onUploadSuccess={(url) => handleFieldChange('logoUrl', url)}
                placeholder="Upload circular Maths Fact emblem"
                helperText="Used on the navbar, favicon, and brand badges."
              />
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 4: ADMISSIONS NOTICE BANNER                      */}
        {/* ======================================================== */}
        {activeSubTab === 'banner' && (
          <div className="p-6 rounded-2xl bg-[#121622] border border-zinc-800 space-y-5">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              Limited Seats Notice Banner
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Top Subtitle / Alert Text
                </label>
                <input
                  type="text"
                  value={formData.bannerSubtitle}
                  onChange={(e) => handleFieldChange('bannerSubtitle', e.target.value)}
                  placeholder="Something BIG is Coming... Be a Part of It!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Main Headline
                </label>
                <input
                  type="text"
                  value={formData.bannerTitle}
                  onChange={(e) => handleFieldChange('bannerTitle', e.target.value)}
                  placeholder="LIMITED SEATS AVAILABLE – ENROLL NOW!"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 5: FACULTY PROFILE (SATYAM SIR)                  */}
        {/* ======================================================== */}
        {activeSubTab === 'faculty' && (
          <div className="p-6 rounded-2xl bg-[#121622] border border-zinc-800 space-y-5">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-wider">
              Faculty Leadership &amp; Mentor Profile
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Faculty Name
                </label>
                <input
                  type="text"
                  value={formData.facultyName}
                  onChange={(e) => handleFieldChange('facultyName', e.target.value)}
                  placeholder="Satyam Sir"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Academic Qualifications
                </label>
                <input
                  type="text"
                  value={formData.facultyQualifications}
                  onChange={(e) => handleFieldChange('facultyQualifications', e.target.value)}
                  placeholder="PG, B.Ed, CTET"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Years of Teaching Experience
                </label>
                <input
                  type="text"
                  value={formData.facultyExperience}
                  onChange={(e) => handleFieldChange('facultyExperience', e.target.value)}
                  placeholder="7+ Years Experience"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Faculty Portrait Photo
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.facultyPhotoUrl || '/satyam_sir_real.jpg'}
                    onChange={(e) => handleFieldChange('facultyPhotoUrl', e.target.value)}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setActiveSubTab('all-media')}
                    className="px-3 py-2 rounded-xl bg-zinc-800 text-xs text-zinc-200 hover:text-white"
                  >
                    Upload
                  </button>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Faculty Bio / Teaching Mission
                </label>
                <textarea
                  rows={4}
                  value={formData.facultyBio}
                  onChange={(e) => handleFieldChange('facultyBio', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white leading-relaxed"
                />
              </div>

              {/* Core Teaching Domains */}
              <div className="sm:col-span-2 space-y-3 pt-3 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-300">
                  Core Subjects &amp; Domains Taught
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.facultySubjects.map((sub, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 border border-zinc-700 text-xs text-zinc-200 flex items-center gap-2"
                    >
                      <span>{sub}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFacultySubject(idx)}
                        className="text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2 max-w-md">
                  <input
                    type="text"
                    value={newFacultySubject}
                    onChange={(e) => setNewFacultySubject(e.target.value)}
                    placeholder="e.g. Olympiad Preparation"
                    className="flex-1 px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddFacultySubject();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddFacultySubject}
                    className="px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 6: ABOUT SECTION                                 */}
        {/* ======================================================== */}
        {activeSubTab === 'about' && (
          <div className="p-6 rounded-2xl bg-[#121622] border border-zinc-800 space-y-5">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              About Maths Fact Section
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  About Section Title
                </label>
                <input
                  type="text"
                  value={formData.aboutTitle}
                  onChange={(e) => handleFieldChange('aboutTitle', e.target.value)}
                  placeholder="About Maths Fact"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  About Narrative / Description Paragraph
                </label>
                <textarea
                  rows={4}
                  value={formData.aboutDescription}
                  onChange={(e) => handleFieldChange('aboutDescription', e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white leading-relaxed"
                />
              </div>

              {/* Bullet points list */}
              <div className="space-y-3 pt-3 border-t border-zinc-800">
                <label className="block text-xs font-semibold text-zinc-300">
                  Key Framework Bullet Points ({formData.aboutPoints.length})
                </label>
                <div className="space-y-2">
                  {formData.aboutPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0D1017] border border-zinc-800 text-xs text-zinc-200"
                    >
                      <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                      <input
                        type="text"
                        value={point}
                        onChange={(e) => {
                          const updated = [...formData.aboutPoints];
                          updated[idx] = e.target.value;
                          setFormData((prev) => ({ ...prev, aboutPoints: updated }));
                        }}
                        className="flex-1 bg-transparent border-none text-xs text-white focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveAboutPoint(idx)}
                        className="p-1 text-zinc-500 hover:text-red-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAboutPoint}
                    onChange={(e) => setNewAboutPoint(e.target.value)}
                    placeholder="Add another highlight bullet..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAboutPoint();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleAddAboutPoint}
                    className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    <span>Add Point</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 7: WHY CHOOSE US (CARDS)                         */}
        {/* ======================================================== */}
        {activeSubTab === 'why-choose' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
                  Why Choose Us Feature Cards ({formData.whyChoosePoints.length})
                </h3>
                <p className="text-xs text-zinc-400">
                  Edit the cards that highlight your teaching edge, guarantees, and methodology.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddWhyChoosePoint}
                className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white flex items-center gap-1.5 border border-zinc-700"
              >
                <Plus className="w-3.5 h-3.5 text-amber-400" />
                <span>Add Feature Card</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.whyChoosePoints.map((card, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#121622] border border-zinc-800 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">Card 0{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveWhyChoosePoint(idx)}
                      className="p-1 rounded-lg text-zinc-500 hover:text-red-400 transition-colors"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Card Title
                    </label>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) => handleWhyChooseChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Description
                    </label>
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) => handleWhyChooseChange(idx, 'description', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-zinc-300 leading-relaxed"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                      Icon Name
                    </label>
                    <select
                      value={card.icon}
                      onChange={(e) => handleWhyChooseChange(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white"
                    >
                      <option value="BrainCircuit">BrainCircuit (Concept Thinking)</option>
                      <option value="GraduationCap">GraduationCap (Mentorship)</option>
                      <option value="Trophy">Trophy (Results &amp; Marks)</option>
                      <option value="Layers">Layers (Academic Foundation)</option>
                      <option value="FileSpreadsheet">FileSpreadsheet (Practice Sheets)</option>
                      <option value="HelpCircle">HelpCircle (Doubt Clearing)</option>
                      <option value="BookOpen">BookOpen (Study Material)</option>
                      <option value="Users">Users (Individual Attention)</option>
                      <option value="Target">Target (Exam Focused)</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* SUB-TAB 8: CONTACT, PHONES & FOOTER                      */}
        {/* ======================================================== */}
        {activeSubTab === 'contact' && (
          <div className="p-6 rounded-2xl bg-[#121622] border border-zinc-800 space-y-5">
            <h3 className="text-sm font-bold text-amber-400 uppercase tracking-wider">
              Official Helpline Numbers, Address &amp; Footer
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Primary Phone Number (Satyam Sir)
                </label>
                <input
                  type="text"
                  value={formData.contactPhone1}
                  onChange={(e) => handleFieldChange('contactPhone1', e.target.value)}
                  placeholder="7004995470"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Secondary Helpline Phone
                </label>
                <input
                  type="text"
                  value={formData.contactPhone2}
                  onChange={(e) => handleFieldChange('contactPhone2', e.target.value)}
                  placeholder="8294112559"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  WhatsApp Support Number (10 digits)
                </label>
                <input
                  type="text"
                  value={formData.whatsappNumber}
                  onChange={(e) => handleFieldChange('whatsappNumber', e.target.value)}
                  placeholder="7004995470"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Official Email Address
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) => handleFieldChange('contactEmail', e.target.value)}
                  placeholder="mathsfact.99@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Physical Classroom / Coaching Center Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleFieldChange('address', e.target.value)}
                  placeholder="Main Coaching Centre & Online Virtual Classroom Portal"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-400 mb-1">
                  Google Maps Location Link
                </label>
                <input
                  type="url"
                  value={formData.googleMapsUrl || ''}
                  onChange={(e) => handleFieldChange('googleMapsUrl', e.target.value)}
                  placeholder="https://share.google/C3HdMlXd1OStDMGqf"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-blue-600/50 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-blue-400 mb-1">
                  Google Maps QR Code Image Path / URL
                </label>
                <input
                  type="text"
                  value={formData.googleMapsQrUrl || ''}
                  onChange={(e) => handleFieldChange('googleMapsQrUrl', e.target.value)}
                  placeholder="/google_maps_qr.png"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-blue-600/50 text-xs text-white font-mono"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Footer Copyright &amp; Legal Notice
                </label>
                <input
                  type="text"
                  value={formData.footerText}
                  onChange={(e) => handleFieldChange('footerText', e.target.value)}
                  placeholder="© 2026 Maths Fact. All Rights Reserved."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs text-white"
                />
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button at bottom of form */}
        <div className="pt-4 border-t border-zinc-800 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={saveLoading}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-red-950/60 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saveLoading ? 'Saving All Changes...' : 'Save Website Content & Media'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
