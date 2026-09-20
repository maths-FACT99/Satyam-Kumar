import React from 'react';
import { Bell, Calendar, Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import { Announcement } from '../types';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
  onBookDemo: () => void;
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({
  announcements,
  onBookDemo,
}) => {
  return (
    <section id="announcements" className="py-14 relative bg-[#090C12] border-t border-b border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-red-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Bell className="w-3.5 h-3.5" />
              <span>Notice Board</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Latest Announcements &amp; Updates
            </h2>
          </div>
          <button
            onClick={onBookDemo}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1.5 self-start md:self-auto"
          >
            <span>Reserve New Session Seat</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              id={`announcement-card-${ann.id}`}
              className="p-5 rounded-2xl bg-[#121622] border border-zinc-800 hover:border-red-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="flex items-center gap-1 text-[11px] text-zinc-500">
                    <Calendar className="w-3 h-3" />
                    {ann.date}
                  </span>
                  {ann.isImportant && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800/60 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-ping" />
                      Important
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white mb-2 leading-snug">
                  {ann.title}
                </h3>

                <p className="text-xs text-zinc-400 leading-relaxed">
                  {ann.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                <span className="text-zinc-500 text-[11px]">Maths Fact Office</span>
                <button
                  onClick={onBookDemo}
                  className="text-red-400 hover:text-red-300 font-semibold text-xs flex items-center gap-1"
                >
                  <span>Inquire</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
