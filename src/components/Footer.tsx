import React from 'react';
import { Phone, Mail, GraduationCap, ShieldAlert, Sparkles, ArrowUp, Heart, MapPin, ExternalLink } from 'lucide-react';
import { WebsiteContent } from '../types';
import { MathsFactLogo } from './MathsFactLogo';

interface FooterProps {
  content: WebsiteContent;
  onNavigate: (sectionId: string) => void;
  onOpenAdminLogin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ content, onNavigate, onOpenAdminLogin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="main-footer" className="bg-[#07090E] border-t border-red-950/40 text-zinc-400 text-xs">
      {/* Top Footer Banner */}
      <div className="border-b border-zinc-900 py-8 bg-[#090C12]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <span className="text-white font-bold text-sm tracking-wide">
              {content.heroHeading || 'ADMISSIONS OPEN – NEW SESSION'}
            </span>
            <span className="hidden md:inline text-zinc-500">|</span>
            <span className="hidden md:inline text-amber-400 font-medium">
              1 Week Free Demo Class Available for All Grades
            </span>
          </div>
          <button
            onClick={() => onNavigate('free-demo')}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs tracking-wider transition-colors shadow-md shadow-red-950/50"
          >
            BOOK FREE DEMO NOW
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Col 1: Brand & Bio */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <MathsFactLogo size="md" customLogoUrl={content.logoUrl} />
              <div>
                <span className="font-extrabold text-lg text-white tracking-wider block">
                  <span className="text-red-500">MATHS </span>
                  <span>FACT</span>
                </span>
                <span className="text-[11px] text-zinc-400 font-medium">
                  Concept-Based Educational Institute
                </span>
              </div>
            </div>

            <p className="text-zinc-400 text-xs leading-relaxed">
              Dedicated coaching institute founded and directed by Satyam Sir (PG, B.Ed, CTET). Empowering students with crystal-clear mathematical fundamentals, school exam mastery, and self-belief.
            </p>

            <div className="flex items-center gap-2 pt-1 text-zinc-300">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>Mentorship by Satyam Sir • 7+ Yrs Exp</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="hover:text-white transition-colors"
                >
                  About Maths Fact
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('courses')}
                  className="hover:text-white transition-colors"
                >
                  Courses Offered
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('free-demo')}
                  className="text-amber-400 hover:text-amber-300 transition-colors font-semibold"
                >
                  1 Week Free Demo
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('faculty')}
                  className="hover:text-white transition-colors"
                >
                  Faculty Profile
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('results')}
                  className="hover:text-white transition-colors"
                >
                  Student Results
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Academic Resources */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Study Downloads</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('study-material')}
                  className="hover:text-white transition-colors"
                >
                  Class III – VI Study Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('study-material')}
                  className="hover:text-white transition-colors"
                >
                  Class VII – X Science &amp; Maths Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('study-material')}
                  className="hover:text-white transition-colors"
                >
                  Class XI – XII Mathematics Bank
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('question-pdfs')}
                  className="hover:text-white transition-colors text-red-400 font-semibold"
                >
                  Quality Question PDFs &amp; Solutions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('question-pdfs')}
                  className="hover:text-white transition-colors"
                >
                  Board Exam Revision Papers
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact info */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm tracking-wide uppercase">Contact Office</h4>
            <div className="space-y-2.5">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <a href={`tel:${content.contactPhone1}`} className="text-white font-semibold hover:text-amber-400">
                    +91 {content.contactPhone1}
                  </a>
                  <span className="block text-zinc-500">+91 {content.contactPhone2}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <a
                  href={`mailto:${content.contactEmail}`}
                  className="text-zinc-300 hover:text-white break-all"
                >
                  {content.contactEmail}
                </a>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-2">
                <a
                  href={content.googleMapsUrl || 'https://share.google/C3HdMlXd1OStDMGqf'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 text-blue-300 hover:text-white border border-blue-600/40 transition-colors text-xs font-semibold"
                >
                  <MapPin className="w-3.5 h-3.5 text-blue-400" />
                  <span>Google Maps</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                </a>

                <button
                  id="footer-admin-login-link"
                  onClick={onOpenAdminLogin}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs font-semibold"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                  <span>Admin Portal</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
          <div>
            © {new Date().getFullYear()} <strong className="text-zinc-300">MATHS FACT</strong>. All rights reserved. Directed by{' '}
            <strong className="text-zinc-300">Satyam Sir</strong>.
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1 text-zinc-400 hover:text-white transition-colors"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
