import React, { useState } from 'react';
import { Calendar, CheckCircle2, Sparkles, Send, ShieldCheck, Clock, Award } from 'lucide-react';
import { api } from '../services/api';
import { ClassLevel, Subject } from '../types';

interface FreeDemoSectionProps {
  onSuccessNotice?: () => void;
}

export const FreeDemoSection: React.FC<FreeDemoSectionProps> = ({ onSuccessNotice }) => {
  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    classLevel: 'Class X' as ClassLevel,
    schoolName: '',
    phone: '',
    email: '',
    preferredSubject: 'Mathematics' as Subject,
    preferredDate: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const classes: ClassLevel[] = [
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

  const subjects: Subject[] = ['Mathematics', 'Science', 'Social Science', 'All Subjects'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (!formData.studentName.trim() || !formData.phone.trim()) {
        throw new Error('Please fill in Student Name and Phone Number.');
      }

      await api.submitDemoEnquiry({
        ...formData,
      });

      setSubmitted(true);
      if (onSuccessNotice) onSuccessNotice();
    } catch (err: any) {
      setError(err.message || 'Failed to submit booking. Please try again or call Satyam Sir directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="free-demo" className="py-16 md:py-24 relative overflow-hidden bg-[#0A0D13]">
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-red-800/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left: Value proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>100% Free • No Obligation</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              1 WEEK FREE <span className="text-red-500">DEMO CLASS</span>
            </h2>

            <p className="text-lg text-amber-300/90 font-medium">
              Experience Our Teaching Before You Enrol!
            </p>

            <p className="text-sm text-zinc-300 leading-relaxed">
              We believe every child deserves the right mentor. Attend 7 days of live concept-building classes with Satyam Sir. Test our problem-solving methods, personalized doubt clearing, and study notes firsthand before making a final commitment.
            </p>

            {/* Feature list */}
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-950/80 border border-red-600/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Full Classroom Experience</h4>
                  <p className="text-xs text-zinc-400">Complete access to regular live sessions, class notes, and daily practice sheets.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-950/80 border border-red-600/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Diagnostic Skill Assessment</h4>
                  <p className="text-xs text-zinc-400">Identify foundational gaps and receive a personalized improvement roadmap.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-red-950/80 border border-red-600/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-red-400" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white">Direct Parent-Teacher Interaction</h4>
                  <p className="text-xs text-zinc-400">Discuss your child’s goals and specific requirements directly with Satyam Sir.</p>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-3">
              <ShieldCheck className="w-8 h-8 text-amber-400 shrink-0" />
              <div className="text-xs text-zinc-300">
                <span className="text-white font-semibold block">Confidential &amp; Secure</span>
                Student details are stored privately in our institute database and never shared.
              </div>
            </div>
          </div>

          {/* Right: The Registration Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-[#121622] border border-red-900/40 p-6 sm:p-8 shadow-2xl relative">
              <div className="border-b border-zinc-800 pb-4 mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-red-500" />
                  <span>Register for 1-Week Free Demo</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-1">
                  Fill in the details below to reserve a demo slot for the upcoming batch.
                </p>
              </div>

              {submitted ? (
                <div
                  id="demo-success-card"
                  className="py-10 px-4 text-center space-y-4 animate-in fade-in zoom-in-95 duration-300"
                >
                  <div className="w-16 h-16 rounded-full bg-red-950 border-2 border-red-500/60 text-red-400 flex items-center justify-center mx-auto shadow-lg shadow-red-900/40">
                    <CheckCircle2 className="w-8 h-8 text-amber-400" />
                  </div>
                  <h4 className="text-2xl font-bold text-white">Demo Slot Reserved!</h4>
                  <p className="text-sm text-zinc-300 max-w-md mx-auto">
                    Thank you, <span className="text-white font-semibold">{formData.studentName}</span>! Your demo request has been registered in our system. Satyam Sir or our academic counselor will contact you at{' '}
                    <span className="text-amber-400 font-semibold">{formData.phone}</span> within 24 hours with batch timings.
                  </p>
                  <div className="pt-4 flex justify-center gap-3">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          studentName: '',
                          parentName: '',
                          classLevel: 'Class X',
                          schoolName: '',
                          phone: '',
                          email: '',
                          preferredSubject: 'Mathematics',
                          preferredDate: '',
                          message: '',
                        });
                      }}
                      className="px-5 py-2.5 text-xs font-semibold text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg border border-zinc-700"
                    >
                      Book for Another Student
                    </button>
                    <a
                      href={`https://wa.me/917004995470?text=${encodeURIComponent(
                        `Hello Satyam Sir, I have booked a demo class for ${formData.studentName} (${formData.classLevel}).`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 text-xs font-semibold text-white bg-green-600 hover:bg-green-500 rounded-lg shadow"
                    >
                      Confirm on WhatsApp
                    </a>
                  </div>
                </div>
              ) : (
                <form id="free-demo-form" onSubmit={handleSubmit} className="space-y-4">
                  {error && (
                    <div className="p-3 rounded-lg bg-red-950/80 border border-red-600/50 text-xs text-red-200">
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Student Name <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="demo-student-name"
                        type="text"
                        required
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        placeholder="e.g. Aarav Sharma"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Parent / Guardian Name
                      </label>
                      <input
                        id="demo-parent-name"
                        type="text"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        placeholder="e.g. Rajesh Sharma"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Class <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="demo-class-select"
                        value={formData.classLevel}
                        onChange={(e) => setFormData({ ...formData, classLevel: e.target.value as ClassLevel })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        {classes.map((cls) => (
                          <option key={cls} value={cls} className="bg-[#121622] text-white">
                            {cls}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Preferred Subject <span className="text-red-400">*</span>
                      </label>
                      <select
                        id="demo-subject-select"
                        value={formData.preferredSubject}
                        onChange={(e) => setFormData({ ...formData, preferredSubject: e.target.value as Subject })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white focus:outline-none focus:border-red-500"
                      >
                        {subjects.map((sub) => (
                          <option key={sub} value={sub} className="bg-[#121622] text-white">
                            {sub}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        id="demo-preferred-date"
                        type="date"
                        value={formData.preferredDate}
                        onChange={(e) => setFormData({ ...formData, preferredDate: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        Phone Number <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="demo-phone"
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="10-digit mobile number"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                        School Name
                      </label>
                      <input
                        id="demo-school-name"
                        type="text"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        placeholder="Current School / Board"
                        className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Email Address (Optional)
                    </label>
                    <input
                      id="demo-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. parent@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
                      Any Specific Learning Needs / Message
                    </label>
                    <textarea
                      id="demo-message"
                      rows={2}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="e.g. Wants to improve calculation speed and overcome fear of geometry proofs..."
                      className="w-full px-3.5 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <button
                    id="submit-demo-btn"
                    type="submit"
                    disabled={loading}
                    className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 shadow-xl shadow-red-950/60 border border-red-400/40 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
                  >
                    {loading ? (
                      <span>Reserving Slot...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-amber-300" />
                        <span>BOOK MY FREE DEMO</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-zinc-400 pt-1">
                    No credit card or upfront payment needed. 100% free trial week.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
