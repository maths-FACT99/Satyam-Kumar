import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, Check, Loader2, Link2 } from 'lucide-react';
import { api } from '../services/api';

interface FileUploadFieldProps {
  label: string;
  sublabel?: string;
  accept?: string;
  currentValue?: string;
  currentFileName?: string;
  currentFileSize?: string;
  isImage?: boolean;
  onUploadSuccess: (url: string, fileName: string, fileSize: string) => void;
  onClear?: () => void;
  placeholder?: string;
  helperText?: string;
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({
  label,
  sublabel,
  accept = 'image/*',
  currentValue = '',
  currentFileName = '',
  currentFileSize = '',
  isImage = false,
  onUploadSuccess,
  onClear,
  placeholder = 'Choose a file or drag & drop here',
  helperText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState(currentValue);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileProcess = async (file: File) => {
    setErrorMsg(null);
    setIsUploading(true);
    try {
      const result = await api.uploadFile(file);
      onUploadSuccess(result.url, result.fileName, result.size);
      setManualUrl(result.url);
    } catch (err: any) {
      console.error('File upload error:', err);
      setErrorMsg(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileProcess(file);
    }
  };

  const handleManualUrlApply = () => {
    if (manualUrl.trim()) {
      const deducedName = manualUrl.split('/').pop() || 'file';
      onUploadSuccess(manualUrl.trim(), deducedName, 'External Link');
      setShowUrlInput(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-zinc-300">
          {label} {sublabel && <span className="text-[11px] font-normal text-zinc-400">({sublabel})</span>}
        </label>
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium transition-colors"
        >
          <Link2 className="w-3 h-3" />
          <span>{showUrlInput ? 'Switch to file upload' : 'Enter URL instead'}</span>
        </button>
      </div>

      {showUrlInput ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://example.com/image.jpg or /uploads/..."
            className="flex-1 px-3 py-2 rounded-lg bg-[#0D1017] border border-zinc-700 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="button"
            onClick={handleManualUrlApply}
            className="px-3 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 transition-colors"
          >
            Apply
          </button>
        </div>
      ) : (
        <div>
          {currentValue ? (
            /* Uploaded Preview Card */
            <div className="p-3 rounded-xl bg-[#0D1017] border border-zinc-700 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-hidden">
                {isImage ? (
                  <div className="w-12 h-12 rounded-lg overflow-hidden border border-zinc-700 bg-black shrink-0">
                    <img
                      src={currentValue}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-red-950/80 border border-red-800/60 flex items-center justify-center text-red-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                )}
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate max-w-[200px] sm:max-w-[280px]">
                    {currentFileName || currentValue.split('/').pop() || 'Uploaded file'}
                  </div>
                  <div className="text-[10px] text-zinc-400 flex items-center gap-2 mt-0.5">
                    {currentFileSize && <span>{currentFileSize}</span>}
                    <span className="text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-2.5 h-2.5" /> Ready
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-medium transition-colors"
                >
                  Change
                </button>
                {onClear && (
                  <button
                    type="button"
                    onClick={onClear}
                    className="p-1.5 rounded-lg bg-red-950/80 hover:bg-red-900 text-red-400 border border-red-800/50 transition-colors"
                    title="Remove file"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* Upload Dropzone */
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-amber-400 bg-amber-500/10'
                  : 'border-zinc-700/80 bg-[#0D1017]/60 hover:border-zinc-500 hover:bg-[#0D1017]'
              }`}
            >
              <div className="flex flex-col items-center justify-center gap-1.5">
                {isUploading ? (
                  <>
                    <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
                    <span className="text-xs font-semibold text-zinc-300">Uploading file...</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-full bg-zinc-800/80 flex items-center justify-center text-zinc-400">
                      {isImage ? <ImageIcon className="w-4 h-4" /> : <UploadCloud className="w-4 h-4" />}
                    </div>
                    <div className="text-xs text-zinc-300">
                      <span className="font-semibold text-amber-400 hover:underline">Click to browse</span> or drag and drop
                    </div>
                    <div className="text-[10px] text-zinc-500">
                      {placeholder}
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>
      )}

      {errorMsg && (
        <p className="text-[11px] text-red-400 mt-1">{errorMsg}</p>
      )}

      {helperText && !errorMsg && (
        <p className="text-[11px] text-zinc-500 mt-0.5">{helperText}</p>
      )}
    </div>
  );
};
