import React, { useState, useRef } from 'react';
import { X, Upload, Link as LinkIcon, RefreshCw, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

interface ImageReplacerModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  label?: string;
  fieldKey: string;
  currentValue?: string;
  currentUrl?: string;
  defaultFallbackUrl?: string;
  fallbackUrl?: string;
  onSave: (newUrl: string) => Promise<void> | void;
  helperText?: string;
}

export const ImageReplacerModal: React.FC<ImageReplacerModalProps> = ({
  isOpen,
  onClose,
  title,
  label,
  fieldKey,
  currentValue,
  currentUrl,
  defaultFallbackUrl = '',
  fallbackUrl = '',
  onSave,
  helperText,
}) => {
  const displayTitle = title || label || 'Replace Image';
  const effectiveCurrentValue = currentUrl || currentValue || '';
  const effectiveFallback = fallbackUrl || defaultFallbackUrl;

  const [activeTab, setActiveTab] = useState<'upload' | 'url' | 'samples'>('upload');
  const [selectedUrl, setSelectedUrl] = useState(effectiveCurrentValue);
  const [urlInput, setUrlInput] = useState(effectiveCurrentValue.startsWith('http') ? effectiveCurrentValue : '');
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (JPG, PNG, WebP, SVG).');
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const res = await api.uploadFile(file);
      setSelectedUrl(res.url);
    } catch (err: any) {
      setError(err.message || 'Failed to process and upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleSave = async () => {
    try {
      await onSave(selectedUrl);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save updated image.');
    }
  };

  const handleResetToDefault = () => {
    setSelectedUrl(defaultFallbackUrl);
    setUrlInput('');
    setError(null);
  };

  // Educational presets if user wants high-res stock alternatives
  const educationalPresets = [
    {
      name: 'Satyam Sir Real Photograph (Official)',
      url: '/satyam_sir_real.jpg',
      category: 'Faculty',
    },
    {
      name: 'Satyam Sir Portrait',
      url: '/satyam_sir.jpg',
      category: 'Faculty',
    },
    {
      name: 'Google Maps Business QR Code',
      url: '/google_maps_qr.png',
      category: 'Maps',
    },
    {
      name: 'Maths Fact Emblem Logo',
      url: '/maths_fact_logo.jpg',
      category: 'Logo',
    },
    {
      name: 'Modern Classroom / Study Center',
      url: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1200&q=80',
      category: 'Campus',
    },
    {
      name: 'Mathematics Formulas Chalkboard',
      url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=1200&q=80',
      category: 'Banner',
    },
    {
      name: 'Geometry & Compass Tools',
      url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1200&q=80',
      category: 'Banner',
    },
    {
      name: 'Student Top Achiever (Boy)',
      url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=600&q=80',
      category: 'Student',
    },
    {
      name: 'Student Top Achiever (Girl)',
      url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
      category: 'Student',
    },
  ];

  return (
    <div
      id="image-replacer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-xl rounded-2xl bg-[#121622] border border-zinc-700 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-[#0E121B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400">
              <ImageIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">{displayTitle}</h3>
              <p className="text-[11px] text-zinc-400">Update or upload replacement picture</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-zinc-800/80 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 bg-[#0A0D14] px-6 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'upload'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Device File</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'url'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Web Image URL</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('samples')}
            className={`flex items-center gap-1.5 py-2.5 px-4 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'samples'
                ? 'border-red-500 text-red-400'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Presets &amp; Library</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-red-950/80 border border-red-600/50 text-xs text-red-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* TAB 1: UPLOAD FROM DEVICE */}
          {activeTab === 'upload' && (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-3 ${
                  isDragOver
                    ? 'border-red-500 bg-red-950/20'
                    : 'border-zinc-700 hover:border-zinc-500 bg-[#0E121B]'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400">
                  <Upload className="w-6 h-6 animate-pulse" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">
                    {uploading ? 'Uploading & Processing Image...' : 'Click to Browse or Drag & Drop Image'}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-1">
                    Supports PNG, JPG, WebP, SVG (Auto-compressed and saved)
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: WEB IMAGE URL */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-zinc-300">
                Direct Image Link (HTTPS)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  className="flex-1 px-3.5 py-2.5 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (urlInput.trim()) {
                      setSelectedUrl(urlInput.trim());
                      setError(null);
                    }
                  }}
                  className="px-4 py-2.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-xs font-bold text-white transition-colors"
                >
                  Preview
                </button>
              </div>
              <p className="text-[11px] text-zinc-500">
                Paste any image link from Unsplash, Google Drive (direct), or your hosting service.
              </p>
            </div>
          )}

          {/* TAB 3: SAMPLES & PRESETS */}
          {activeTab === 'samples' && (
            <div className="space-y-3">
              <p className="text-xs text-zinc-400">
                Choose a pre-configured photo asset or reset to the institute default.
              </p>
              <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                {educationalPresets.map((preset, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSelectedUrl(preset.url);
                      setUrlInput(preset.url);
                    }}
                    className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all flex items-center gap-3 ${
                      selectedUrl === preset.url
                        ? 'bg-red-950/40 border-red-500'
                        : 'bg-[#0E121B] border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg bg-zinc-900 border border-zinc-800 overflow-hidden shrink-0">
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[10px] uppercase font-bold text-amber-400 block">
                        {preset.category}
                      </span>
                      <span className="text-xs font-semibold text-white block truncate">
                        {preset.name}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Current / New Image Live Preview */}
          <div className="p-3.5 rounded-xl bg-[#0A0D14] border border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-16 h-16 rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden shrink-0 flex items-center justify-center">
                {selectedUrl ? (
                  <img
                    src={selectedUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={() => setError('Could not load image preview from this URL.')}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-zinc-600" />
                )}
              </div>
              <div className="min-w-0">
                <span className="text-[10px] uppercase font-bold text-zinc-400 block">
                  Current Selected Image
                </span>
                <span className="text-xs font-mono text-zinc-300 block truncate max-w-xs">
                  {selectedUrl || 'No image specified (vector fallback)'}
                </span>
                {helperText && <p className="text-[10px] text-zinc-500 mt-0.5">{helperText}</p>}
              </div>
            </div>

            {defaultFallbackUrl && selectedUrl !== defaultFallbackUrl && (
              <button
                type="button"
                onClick={handleResetToDefault}
                className="text-[11px] font-bold text-amber-400 hover:text-amber-300 px-2 py-1 rounded bg-amber-500/10 border border-amber-500/30 shrink-0"
              >
                Reset Default
              </button>
            )}
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-3.5 border-t border-zinc-800 bg-[#0E121B] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={uploading}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-950/50 flex items-center gap-1.5 transition-all"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply &amp; Save Picture</span>
          </button>
        </div>
      </div>
    </div>
  );
};
