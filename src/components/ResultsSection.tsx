import React from 'react';
import { Trophy, Award, Star, Medal, CheckCircle2 } from 'lucide-react';
import { Achievement } from '../types';

interface ResultsSectionProps {
  achievements: Achievement[];
}

export const ResultsSection: React.FC<ResultsSectionProps> = ({ achievements }) => {
  return (
    <section id="results" className="py-16 md:py-24 relative bg-[#0B0D11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Trophy className="w-3.5 h-3.5" />
            <span>Excellence in Numbers</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Student Achievements
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-2">
            Celebrating the milestones of our students guided by Satyam Sir. Verified board examination top scores and Olympiad rankings.
          </p>
        </div>

        {achievements.length === 0 ? (
          <div className="text-center py-12 p-6 rounded-2xl bg-[#121622] border border-zinc-800">
            <p className="text-zinc-400 text-sm">New session student records are currently being updated.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {achievements.map((ach) => (
              <div
                key={ach.id}
                id={`achievement-card-${ach.id}`}
                className="group p-6 rounded-2xl bg-[#121622] border border-zinc-800 hover:border-amber-500/40 p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-xl hover:shadow-red-950/20 hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {ach.photoUrl ? (
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-amber-400 shadow-md bg-zinc-900">
                        <img
                          src={ach.photoUrl}
                          alt={ach.studentName}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                        <Medal className="w-5 h-5" />
                      </div>
                    )}
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300">
                      {ach.year}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-red-400 uppercase tracking-wider mb-1">
                    {ach.classLevel}
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">
                    {ach.studentName}
                  </h3>

                  <div className="p-2.5 rounded-lg bg-[#0E121B] border border-zinc-800/80 mb-3 text-amber-300 font-bold text-sm">
                    {ach.scoreOrRank}
                  </div>

                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {ach.achievement}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-800/60 flex items-center gap-1.5 text-[11px] text-zinc-500">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span>Verified Score</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
