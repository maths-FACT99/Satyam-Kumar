import React, { useState } from 'react';
import { Sparkles, TrendingUp, Calculator, BookOpen, Check, Clock, Users, ArrowRight, X } from 'lucide-react';
import { Course } from '../types';

interface CoursesSectionProps {
  courses: Course[];
  onEnrollCourse: (course: Course) => void;
}

export const CoursesSection: React.FC<CoursesSectionProps> = ({ courses, onEnrollCourse }) => {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const getCourseIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className="w-6 h-6 text-amber-400" />;
      case 'TrendingUp':
        return <TrendingUp className="w-6 h-6 text-red-400" />;
      case 'Calculator':
        return <Calculator className="w-6 h-6 text-amber-400" />;
      default:
        return <BookOpen className="w-6 h-6 text-red-400" />;
    }
  };

  return (
    <section id="courses" className="py-16 md:py-24 relative bg-[#0B0D11]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-950/80 border border-red-800/40 text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
            <span>Tailored Academic Excellence</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Courses We Offer
          </h2>
          <p className="text-zinc-400 text-sm sm:text-base mt-3">
            Structured grade-by-grade curriculum designed to develop intuitive mathematical thinking, build rigorous problem-solving skills, and secure top marks.
          </p>
        </div>

        {/* 3 Main Course Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {courses.map((course) => (
            <div
              key={course.id}
              id={`course-card-${course.id}`}
              className="group relative rounded-2xl bg-[#121622] border border-zinc-800 hover:border-red-500/50 p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:shadow-red-950/40 hover:-translate-y-1.5"
            >
              {/* Optional Badge */}
              {course.badge && (
                <div className="absolute -top-3 right-6 bg-gradient-to-r from-red-600 to-amber-500 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-md">
                  {course.badge}
                </div>
              )}

              <div>
                {/* Icon & Title */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-800/50 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {getCourseIcon(course.icon)}
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-zinc-800/90 text-zinc-300 border border-zinc-700">
                    {course.classes}
                  </span>
                </div>

                <h3 className="text-2xl font-bold text-white group-hover:text-red-400 transition-colors mb-2">
                  {course.title}
                </h3>

                <div className="text-sm font-semibold text-amber-400/90 mb-3">
                  {course.subjects}
                </div>

                <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
                  {course.description}
                </p>

                {/* Key feature bullets */}
                <div className="space-y-2 mb-6 pt-4 border-t border-zinc-800/80">
                  {course.features.slice(0, 3).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <Check className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-zinc-800/80 flex items-center gap-3">
                <button
                  id={`btn-view-course-${course.id}`}
                  onClick={() => setSelectedCourse(course)}
                  className="flex-1 py-2.5 px-4 rounded-xl text-xs font-bold text-zinc-200 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-700 hover:text-white transition-colors"
                >
                  View Details
                </button>
                <button
                  id={`btn-enroll-course-${course.id}`}
                  onClick={() => onEnrollCourse(course)}
                  className="py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-md shadow-red-950/50 transition-colors flex items-center gap-1"
                >
                  <span>Enroll</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div
          id="course-details-modal"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl rounded-2xl bg-[#121622] border border-red-600/40 p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedCourse(null)}
              className="absolute top-5 right-5 p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-xl bg-red-950 border border-red-800/60 flex items-center justify-center">
                {getCourseIcon(selectedCourse.icon)}
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Curriculum &amp; Batch Overview
                </span>
                <h3 className="text-2xl font-extrabold text-white">{selectedCourse.title}</h3>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 mb-5">
              <div className="text-xs text-zinc-400">Subjects Covered:</div>
              <div className="text-sm font-semibold text-white mt-0.5">{selectedCourse.subjects}</div>
            </div>

            <p className="text-sm text-zinc-300 leading-relaxed mb-6">
              {selectedCourse.description}
            </p>

            <div className="mb-6">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                Key Highlights of this Course
              </h4>
              <div className="grid grid-cols-1 gap-2.5">
                {selectedCourse.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#0E121B] border border-zinc-800 text-xs text-zinc-200">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6 p-3.5 rounded-xl bg-red-950/30 border border-red-900/40 text-xs">
              <div className="flex items-center gap-2 text-zinc-300">
                <Clock className="w-4 h-4 text-red-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500">Timings</div>
                  <div className="font-semibold text-white">{selectedCourse.timing || 'Flexible Batches'}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <Users className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <div className="text-[10px] text-zinc-500">Batch Size</div>
                  <div className="font-semibold text-white">{selectedCourse.batchSize || 'Personal Attention'}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
              <button
                onClick={() => setSelectedCourse(null)}
                className="px-5 py-2.5 text-xs font-semibold text-zinc-400 hover:text-white"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const course = selectedCourse;
                  setSelectedCourse(null);
                  onEnrollCourse(course);
                }}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-950/60 flex items-center gap-2"
              >
                <span>Book 1-Week Free Demo</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
