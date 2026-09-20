import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MessageSquare,
  MapPin,
  Send,
  CheckCircle2,
  Clock,
  Navigation,
  ExternalLink,
  QrCode,
  Copy,
  Check,
  Sparkles,
  Compass,
  Building,
} from 'lucide-react';
import { WebsiteContent } from '../types';
import { api } from '../services/api';
import { EditableText, EditableImage } from './EditableElements';

interface ContactSectionProps {
  content: WebsiteContent;
  isEditMode?: boolean;
  onEditText?: (fieldKey: string, label: string, currentValue: string, isMultiline?: boolean) => void;
  onEditImage?: (fieldKey: string, label: string, currentUrl: string) => void;
  onBookDemo?: () => void;
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  content,
  isEditMode = false,
  onEditText,
  onEditImage,
  onBookDemo,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    classLevel: 'Class X',
    subject: 'Course & Admission Inquiry',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedMapLink, setCopiedMapLink] = useState(false);

  const googleMapsUrl = content.googleMapsUrl || 'https://share.google/C3HdMlXd1OStDMGqf';
  const googleMapsQrUrl = content.googleMapsQrUrl || '/google_maps_qr.png';

  const handleCopyMapLink = () => {
    navigator.clipboard.writeText(googleMapsUrl);
    setCopiedMapLink(true);
    setTimeout(() => setCopiedMapLink(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.name.trim() || !formData.phone.trim() || !formData.message.trim()) {
        throw new Error('Please fill in your Name, Phone Number, and Message.');
      }

      await api.submitContactEnquiry(formData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again or call directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 relative bg-[#0B0D11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Guidance &amp; Visit</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Contact Maths Fact
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Speak directly with Satyam Sir to discuss your child’s academic roadmap, attend offline classes, or scan our Google Maps QR code below.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* GOOGLE MAPS & GOOGLE BUSINESS PROFILE QR SHOWCASE (Requested by user)    */}
        {/* ========================================================================= */}
        <div
          id="google-maps-showcase"
          className="rounded-3xl bg-gradient-to-br from-[#111522] via-[#0E121E] to-[#151928] border-2 border-red-900/40 p-6 sm:p-8 lg:p-10 shadow-2xl relative overflow-hidden"
        >
          {/* Ambient Glows */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10">
            {/* Showcase Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/60 border border-blue-600/40 text-blue-300 text-xs font-bold mb-2">
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Official Google Maps Location &amp; Profile</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2 flex-wrap">
                  <span>Locate</span>
                  <span className="text-amber-400">Maths Fact</span>
                  <span>on Google Maps</span>
                </h3>
                <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                  Scan the Google Business QR code with your phone camera or click to open driving directions.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-950/50 flex items-center gap-2 transition-all"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Open Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5 text-blue-200" />
                </a>

                <button
                  onClick={handleCopyMapLink}
                  className="p-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Copy Google Maps Link"
                >
                  {copiedMapLink ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Showcase Grid: QR Card + Location Information */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-8 items-center">
              {/* Google Business Profile QR Card (Recreation of official handout) */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="w-full max-w-sm rounded-2xl bg-white p-6 sm:p-7 shadow-2xl border border-zinc-200 text-center flex flex-col items-center relative group">
                  {/* Google Logo text */}
                  <div className="flex items-center gap-1.5 justify-center mb-1">
                    <span className="text-2xl font-bold font-sans tracking-tight">
                      <span className="text-[#4285F4]">G</span>
                      <span className="text-[#EA4335]">o</span>
                      <span className="text-[#FBBC05]">o</span>
                      <span className="text-[#4285F4]">g</span>
                      <span className="text-[#34A853]">l</span>
                      <span className="text-[#EA4335]">e</span>
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-zinc-700 mb-4 tracking-wide uppercase">
                    Check us out on Google
                  </p>

                  {/* QR Code Container with 4-Color Google Border */}
                  <div className="relative p-2 rounded-2xl bg-gradient-to-tr from-[#4285F4] via-[#FBBC05] to-[#34A853] shadow-lg">
                    <div className="p-1 rounded-xl bg-gradient-to-br from-[#EA4335] via-[#4285F4] to-[#34A853]">
                      <div className="bg-white p-3 rounded-lg flex items-center justify-center">
                        <EditableImage
                          isEditMode={isEditMode}
                          src={googleMapsQrUrl}
                          fieldKey="googleMapsQrUrl"
                          label="Google Maps QR Code"
                          onEdit={onEditImage}
                          className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                          fallbackUrl="/google_maps_qr.png"
                        >
                          <img
                            src={googleMapsQrUrl}
                            alt="Maths Fact Google Maps QR Code"
                            className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                            referrerPolicy="no-referrer"
                          />
                        </EditableImage>
                      </div>
                    </div>
                  </div>

                  {/* Institution Label */}
                  <div className="mt-4">
                    <h4 className="text-lg font-black text-zinc-900 tracking-tight">
                      Maths Fact
                    </h4>
                    <p className="text-[11px] text-zinc-500 font-medium">
                      Satyam Sir’s Premier Educational Coaching
                    </p>
                  </div>

                  {/* QR helper caption & action */}
                  <div className="mt-4 pt-3 border-t border-zinc-100 w-full flex items-center justify-between text-xs text-zinc-600">
                    <span className="flex items-center gap-1 font-medium">
                      <QrCode className="w-3.5 h-3.5 text-[#4285F4]" />
                      Point camera to scan
                    </span>
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#4285F4] hover:underline flex items-center gap-0.5"
                    >
                      <span>Direct link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Location Details & Center Information */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="p-5 rounded-2xl bg-[#080B12] border border-zinc-800 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-950/80 border border-blue-500/50 flex items-center justify-center shrink-0">
                      <Building className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white uppercase tracking-wider">
                        Coaching Center Address
                      </h4>
                      <p className="text-sm text-zinc-300 mt-1 font-medium">
                        {content.address || 'Main Coaching Centre & Online Virtual Classroom Portal'}
                      </p>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                        Easily accessible from major bus stops and transit points. Dedicated classroom spaces, concept whiteboard setups, and air-conditioned discussion chambers.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Center Timings */}
                  <div className="p-4 rounded-xl bg-[#080B12] border border-zinc-800 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-amber-950/60 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase">Operating Hours</h5>
                      <p className="text-xs text-zinc-300 mt-0.5">
                        Mon – Sat: 7:00 AM – 8:30 PM
                      </p>
                      <p className="text-[11px] text-amber-400 font-medium">
                        Sunday: Special Doubt Batches
                      </p>
                    </div>
                  </div>

                  {/* Transport & Access */}
                  <div className="p-4 rounded-xl bg-[#080B12] border border-zinc-800 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center shrink-0">
                      <Compass className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-white uppercase">Batches Covered</h5>
                      <p className="text-xs text-zinc-300 mt-0.5">
                        Class III to XII (CBSE &amp; ICSE)
                      </p>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        Offline Classroom &amp; Virtual Live
                      </p>
                    </div>
                  </div>
                </div>

                {/* Google Maps Action Bar */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/40 to-blue-950/40 border border-zinc-700/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-left">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Planning to visit for admission or counselling?</span>
                    </div>
                    <p className="text-[11px] text-zinc-400 mt-0.5">
                      Schedule a 1-Week Free Demo beforehand to reserve your seat in the classroom.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 sm:flex-none text-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate</span>
                    </a>

                    {onBookDemo && (
                      <button
                        onClick={onBookDemo}
                        className="flex-1 sm:flex-none px-4 py-2 rounded-lg bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white text-xs font-bold transition-all"
                      >
                        Book Free Demo
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* DIRECT ENQUIRY & CONTACT FORM GRID                                        */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Contact Info & Action Buttons */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl bg-[#121622] border border-red-900/40 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold text-red-400 uppercase tracking-widest block mb-1">
                  Coaching Institute
                </span>
                <EditableText
                  isEditMode={isEditMode}
                  value={content.instituteName}
                  fieldKey="instituteName"
                  label="Institute Name"
                  onEdit={onEditText}
                  className="text-2xl font-extrabold text-white block"
                >
                  <h3 className="text-2xl font-extrabold text-white">{content.instituteName}</h3>
                </EditableText>
                <p className="text-xs text-zinc-400 mt-1">
                  Guided by <strong className="text-amber-400 font-semibold">{content.facultyName}</strong> ({content.facultyQualifications})
                </p>
                <div className="text-xs text-zinc-400 mt-0.5">
                  Experience: <span className="text-white font-medium">{content.facultyExperience}</span>
                </div>
              </div>

              {/* Direct Info List */}
              <div className="space-y-4 pt-4 border-t border-zinc-800">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-semibold uppercase">Contact Numbers</div>
                    <div className="text-sm font-bold text-white mt-0.5 flex flex-wrap gap-x-3">
                      <EditableText
                        isEditMode={isEditMode}
                        value={content.contactPhone1}
                        fieldKey="contactPhone1"
                        label="Primary Phone Number"
                        onEdit={onEditText}
                      >
                        <a href={`tel:${content.contactPhone1}`} className="hover:text-amber-400 transition-colors">
                          +91 {content.contactPhone1}
                        </a>
                      </EditableText>
                      <span className="text-zinc-600">•</span>
                      <EditableText
                        isEditMode={isEditMode}
                        value={content.contactPhone2}
                        fieldKey="contactPhone2"
                        label="Secondary Phone Number"
                        onEdit={onEditText}
                      >
                        <a href={`tel:${content.contactPhone2}`} className="hover:text-amber-400 transition-colors">
                          +91 {content.contactPhone2}
                        </a>
                      </EditableText>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-semibold uppercase">Email Address</div>
                    <EditableText
                      isEditMode={isEditMode}
                      value={content.contactEmail}
                      fieldKey="contactEmail"
                      label="Contact Email"
                      onEdit={onEditText}
                    >
                      <a
                        href={`mailto:${content.contactEmail}`}
                        className="text-sm font-semibold text-white hover:text-amber-400 transition-colors block mt-0.5"
                      >
                        {content.contactEmail}
                      </a>
                    </EditableText>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-red-950/80 border border-red-800/60 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-xs text-zinc-500 font-semibold uppercase">Classroom &amp; Virtual Batches</div>
                    <div className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                      Physical Coaching Center &amp; Online Virtual Classroom with Dedicated Doubt Desks
                    </div>
                  </div>
                </div>
              </div>

              {/* Instant Action CTA Buttons */}
              <div className="pt-2 grid grid-cols-3 gap-2">
                <a
                  id="btn-contact-call"
                  href={`tel:${content.contactPhone1}`}
                  className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors border border-zinc-700"
                >
                  <Phone className="w-4 h-4 text-red-400 mb-1" />
                  <span>Call Now</span>
                </a>

                <a
                  id="btn-contact-whatsapp"
                  href={`https://wa.me/91${content.whatsappNumber}?text=${encodeURIComponent(
                    'Hello Maths Fact, I would like to know more about the courses and free demo class.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-green-700 hover:bg-green-600 text-white text-xs font-semibold transition-colors shadow"
                >
                  <MessageSquare className="w-4 h-4 mb-1" />
                  <span>WhatsApp</span>
                </a>

                <a
                  id="btn-contact-email"
                  href={`mailto:${content.contactEmail}`}
                  className="flex flex-col items-center justify-center py-3 px-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold transition-colors border border-zinc-700"
                >
                  <Mail className="w-4 h-4 text-amber-400 mb-1" />
                  <span>Email Us</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-2xl bg-[#121622] border border-zinc-800 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-2">Send an Enquiry</h3>
              <p className="text-xs text-zinc-400 mb-6">
                Have a question regarding batch timings, syllabus coverage or individual doubt sessions? Leave a note and we will reply promptly.
              </p>

              {submitted ? (
                <div className="text-center py-10 space-y-3 animate-in fade-in">
                  <div className="w-14 h-14 rounded-full bg-red-950 border border-red-500/60 flex items-center justify-center mx-auto text-amber-400">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">Enquiry Sent Successfully!</h4>
                  <p className="text-xs text-zinc-300 max-w-md mx-auto">
                    Thank you, {formData.name}. Satyam Sir will review your inquiry and connect with you at{' '}
                    <span className="text-amber-400 font-semibold">{formData.phone}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: '',
                        phone: '',
                        email: '',
                        classLevel: 'Class X',
                        subject: 'Course & Admission Inquiry',
                        message: '',
                      });
                    }}
                    className="mt-4 px-4 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 text-white"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form id="contact-enquiry-form" onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-950/80 border border-red-600/50 text-xs text-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Your Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="contact-form-name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Student / Parent Full Name"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="contact-form-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        id="contact-form-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="yourname@gmail.com"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Student's Class
                      </label>
                      <select
                        id="contact-form-class"
                        value={formData.classLevel}
                        onChange={(e) => setFormData({ ...formData, classLevel: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        <option value="Class III">Class III</option>
                        <option value="Class IV">Class IV</option>
                        <option value="Class V">Class V</option>
                        <option value="Class VI">Class VI</option>
                        <option value="Class VII">Class VII</option>
                        <option value="Class VIII">Class VIII</option>
                        <option value="Class IX">Class IX</option>
                        <option value="Class X">Class X</option>
                        <option value="Class XI">Class XI</option>
                        <option value="Class XII">Class XII</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Subject / Query Topic
                    </label>
                    <input
                      id="contact-form-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Class 10 batch timings and fee structure"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Message <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      id="contact-form-message"
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Type your message or questions here..."
                      className="w-full px-3.5 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    id="contact-form-submit-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-xs sm:text-sm text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/60 border border-red-400/40 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Sending...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>Send Enquiry</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
