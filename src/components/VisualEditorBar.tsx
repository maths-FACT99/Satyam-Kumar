import React from 'react';
import { Edit3, CheckCircle2, Save, LayoutDashboard, Image as ImageIcon, Eye, Sparkles, X } from 'lucide-react';
import { User } from '../types';

interface VisualEditorBarProps {
  isEditMode: boolean;
  onToggleEditMode: () => void;
  onOpenDashboard: () => void;
  onQuickChangeImage: (field: string) => void;
  onSaveAll: () => void;
  hasUnsavedChanges?: boolean;
  currentUser: User | null;
  onOpenLogin: () => void;
}

export const VisualEditorBar: React.FC<VisualEditorBarProps> = ({
  isEditMode,
  onToggleEditMode,
  onOpenDashboard,
  onQuickChangeImage,
  onSaveAll,
  hasUnsavedChanges = false,
  currentUser,
  onOpenLogin,
}) => {
  const isAdmin = currentUser?.role === 'admin';

  return (
    <div
      id="visual-editor-top-bar"
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 pointer-events-auto"
    >
      {isEditMode ? (
        <div className="bg-gradient-to-r from-red-950 via-[#181216] to-[#0E121B] border-b border-amber-500/50 shadow-2xl px-4 py-2 sm:py-2.5">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">
            {/* Status indicator */}
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                  Visual CMS Active
                </span>
                <span className="hidden md:inline-block text-[11px] text-zinc-300 bg-black/40 px-2 py-0.5 rounded border border-zinc-700">
                  Click any text to edit • Click pictures to replace
                </span>
              </div>
            </div>

            {/* Quick Picture Selector Shortcuts */}
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-zinc-400">Quick Change:</span>
              <button
                type="button"
                onClick={() => onQuickChangeImage('facultyPhotoUrl')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="w-3 h-3 text-amber-400" />
                <span>Satyam Sir Photo</span>
              </button>
              <button
                type="button"
                onClick={() => onQuickChangeImage('logoUrl')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="w-3 h-3 text-red-400" />
                <span>Institute Logo</span>
              </button>
              <button
                type="button"
                onClick={() => onQuickChangeImage('heroBannerUrl')}
                className="px-2.5 py-1 rounded-lg bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700 text-[11px] font-semibold text-zinc-200 hover:text-white transition-colors flex items-center gap-1.5"
              >
                <ImageIcon className="w-3 h-3 text-blue-400" />
                <span>Hero Banner</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={onSaveAll}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-green-600 hover:bg-green-500 shadow-md flex items-center gap-1.5 transition-all"
                title="Save website changes"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save All</span>
              </button>

              <button
                type="button"
                onClick={onOpenDashboard}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-zinc-200 hover:text-white bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 flex items-center gap-1.5 transition-all"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Admin Dashboard</span>
              </button>

              <button
                type="button"
                onClick={onToggleEditMode}
                className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-zinc-400 hover:text-white bg-black/40 hover:bg-black/70 border border-zinc-700 flex items-center gap-1 transition-all"
                title="Close Visual Editor"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Exit</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Minimized quick launcher pill in the top right corner */
        <div className="absolute top-2 right-4 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              if (isAdmin) {
                onToggleEditMode();
              } else {
                onOpenLogin();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111520]/90 hover:bg-red-950/90 text-zinc-300 hover:text-white border border-red-500/40 shadow-xl backdrop-blur-md text-[11px] font-bold transition-all group hover:scale-105"
            title="Edit website text, photos, and branding"
          >
            <Edit3 className="w-3.5 h-3.5 text-amber-400 group-hover:rotate-12 transition-transform" />
            <span>Edit Website</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
          </button>
        </div>
      )}
    </div>
  );
};
