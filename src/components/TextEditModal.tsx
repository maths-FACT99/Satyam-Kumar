import React, { useState, useEffect } from 'react';
import { X, Check, Edit3, Type } from 'lucide-react';

interface TextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  label?: string;
  fieldKey: string;
  currentValue: string;
  isMultiline?: boolean;
  onSave: (newValue: string) => Promise<void> | void;
  helperText?: string;
}

export const TextEditModal: React.FC<TextEditModalProps> = ({
  isOpen,
  onClose,
  title,
  label,
  fieldKey,
  currentValue,
  isMultiline = false,
  onSave,
  helperText,
}) => {
  const displayTitle = title || label || 'Edit Text Content';
  const [value, setValue] = useState(currentValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await onSave(value);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save text.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      id="text-edit-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-lg rounded-2xl bg-[#121622] border border-zinc-700 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#0E121B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Type className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">{displayTitle}</h3>
              <p className="text-[11px] text-zinc-400">Edit text displayed across the website</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/80 border border-red-600/50 text-xs text-red-200">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1.5 flex items-center justify-between">
                <span>Text Content</span>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {value.length} characters
                </span>
              </label>

              {isMultiline ? (
                <textarea
                  rows={5}
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter content..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 leading-relaxed font-sans"
                  autoFocus
                />
              ) : (
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="Enter text..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#0D1017] border border-zinc-700 text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400"
                  autoFocus
                />
              )}

              {helperText && (
                <p className="text-[11px] text-zinc-500 mt-1.5">{helperText}</p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-3.5 border-t border-zinc-800 bg-[#0E121B] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-black bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-950/50 flex items-center gap-1.5 transition-all disabled:opacity-50"
            >
              <Check className="w-3.5 h-3.5" />
              <span>{saving ? 'Updating...' : 'Save Text Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
