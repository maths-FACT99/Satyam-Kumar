import React, { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, ShieldAlert, GraduationCap, Phone, Sparkles, BookOpen } from 'lucide-react';
import { User, WebsiteContent } from '../types';
import { MathsFactLogo } from './MathsFactLogo';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  currentUser: User | null;
  content?: WebsiteContent;
  onOpenStudentLogin: () => void;
  onOpenAdminLogin: () => void;
  onLogout: () => void;
  onOpenAiChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeSection,
  onNavigate,
  currentUser,
  content,
  onOpenStudentLogin,
  onOpenAdminLogin,
  onLogout,
  onOpenAiChat,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'courses', label: 'Courses' },
    { id: 'free-demo', label: 'Free Demo', highlight: true },
    { id: 'study-material', label: 'Study Material' },
    { id: 'question-pdfs', label: 'Question PDFs' },
    { id: 'faculty', label: 'Faculty' },
    { id: 'results', label: 'Results' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header
      id="main-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0D11]/95 backdrop-blur-md border-b border-red-900/30 shadow-2xl py-3'
          : 'bg-[#0B0D11]/80 backdrop-blur-sm border-b border-white/5 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Logo */}
        <div
          id="brand-logo"
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <MathsFactLogo size="md" customLogoUrl={content?.logoUrl} />

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-red-400 transition-colors">
                <span className="text-red-500">MATHS </span>
                <span>FACT</span>
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold bg-red-950/80 text-amber-400 border border-red-800/60 rounded">
                CBSE • ICSE
              </span>
            </div>
            <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
              By Satyam Sir • Concept-Based Coaching
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav id="desktop-nav" className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-link-${item.id}`}
              onClick={() => handleNavClick(item.id)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                item.highlight
                  ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 shadow-sm shadow-amber-900/20'
                  : activeSection === item.id
                  ? 'text-white bg-red-600/20 text-red-400 border border-red-500/30'
                  : 'text-zinc-300 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
              {activeSection === item.id && !item.highlight && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-red-500 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right side: Login, AI Chat, and Quick Actions */}
        <div className="hidden sm:flex items-center gap-2.5">
          {/* Ask Maths Expert AI Quick Button */}
          <button
            onClick={onOpenAiChat}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-amber-300 hover:text-white bg-gradient-to-r from-amber-500/15 via-red-500/20 to-amber-500/15 hover:from-red-600 hover:to-amber-600 border border-amber-500/40 rounded-lg transition-all shadow-sm group"
            title="Ask Maths Expert AI Math & Concept Doubt Solver"
          >
            <div className="w-5 h-5 rounded-full overflow-hidden border border-amber-400 bg-black shrink-0">
              <img
                src={content?.facultyPhotoUrl || "/satyam_sir_real.jpg"}
                alt="Satyam Sir"
                className="w-full h-full object-cover object-top"
                referrerPolicy="no-referrer"
              />
            </div>
            <span>Maths Expert AI</span>
            <Sparkles className="w-3 h-3 text-amber-400 group-hover:text-white animate-pulse" />
          </button>

          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900/90 border border-zinc-700/60 text-xs text-zinc-200">
                {currentUser.role === 'admin' ? (
                  <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
                ) : (
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span className="font-semibold text-white max-w-[120px] truncate">{currentUser.name}</span>
                {currentUser.role === 'admin' && (
                  <span className="bg-red-900/60 text-red-300 text-[10px] px-1.5 py-0.2 rounded font-bold uppercase">
                    Admin
                  </span>
                )}
              </div>
              <button
                id="header-logout-btn"
                onClick={onLogout}
                className="px-3 py-1.5 text-xs font-semibold text-zinc-400 hover:text-red-400 bg-zinc-900/60 hover:bg-red-950/40 border border-zinc-800 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          ) : (
            <>
              <button
                id="btn-student-login"
                onClick={onOpenStudentLogin}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-zinc-200 hover:text-white bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/70 rounded-lg transition-all shadow-sm"
              >
                <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span>Student Login</span>
              </button>

              <button
                id="btn-admin-login"
                onClick={onOpenAdminLogin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 border border-red-500/50 rounded-lg transition-all shadow-md shadow-red-900/30"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                <span>Admin Login</span>
              </button>
            </>
          )}

          <a
            id="header-call-btn"
            href="tel:7004995470"
            className="flex items-center justify-center p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 transition-colors"
            title="Call Satyam Sir: 7004995470"
          >
            <Phone className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 hover:text-white"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-drawer"
          className="lg:hidden bg-[#0F131C] border-b border-red-900/40 px-4 pt-3 pb-6 space-y-2 mt-3 shadow-2xl animate-in slide-in-from-top-2 duration-200"
        >
          <div className="grid grid-cols-2 gap-2 mb-4">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => handleNavClick(item.id)}
                className={`text-left px-3 py-2 text-xs font-medium rounded-md transition-colors ${
                  item.highlight
                    ? 'text-amber-300 bg-amber-500/10 border border-amber-500/30'
                    : activeSection === item.id
                    ? 'bg-red-600/30 text-red-300 border border-red-500/40'
                    : 'text-zinc-300 hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-zinc-800 flex flex-col gap-2">
            {/* Mobile Ask Maths Expert AI */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAiChat();
              }}
              className="flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-bold text-xs shadow-md border border-amber-400/40"
            >
              <div className="w-5 h-5 rounded-full overflow-hidden border border-white bg-black shrink-0">
                <img
                  src={content?.facultyPhotoUrl || "/satyam_sir_real.jpg"}
                  alt="Satyam Sir"
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span>Ask Maths Expert AI</span>
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            </button>

            {currentUser ? (
              <div className="flex items-center justify-between bg-zinc-900 p-2.5 rounded-lg border border-zinc-800">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-medium text-white">{currentUser.name}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-xs text-red-400 hover:underline font-semibold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  id="mobile-student-login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenStudentLogin();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-zinc-200 bg-zinc-900 border border-zinc-700 rounded-lg"
                >
                  <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                  Student Login
                </button>
                <button
                  id="mobile-admin-login"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-red-700 hover:bg-red-600 border border-red-500/50 rounded-lg"
                >
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
                  Admin Login
                </button>
              </div>
            )}

            <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
              <span>Helpline: 7004995470</span>
              <span className="text-amber-400 font-medium">1 Week Free Demo Open</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
