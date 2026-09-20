import React from 'react';
import { Edit3, Camera } from 'lucide-react';

interface EditableTextProps {
  isEditMode: boolean;
  value: string;
  fieldKey: string;
  label: string;
  isMultiline?: boolean;
  onEdit?: (fieldKey: string, label: string, currentValue: string, isMultiline?: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  isEditMode,
  value,
  fieldKey,
  label,
  isMultiline = false,
  onEdit,
  className = '',
  children,
}) => {
  if (!isEditMode) {
    return <>{children || value}</>;
  }

  return (
    <span
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onEdit) {
          onEdit(fieldKey, label, value, isMultiline);
        }
      }}
      className={`relative group/edit inline-block cursor-pointer outline outline-1 outline-dashed outline-amber-400/50 hover:outline-amber-400 hover:bg-amber-400/10 rounded px-1 transition-all ${className}`}
      title={`Click to edit "${label}"`}
    >
      {children || value}
      <span className="absolute -top-3 -right-2 bg-amber-400 text-black p-0.5 rounded shadow text-[9px] font-bold opacity-0 group-hover/edit:opacity-100 transition-opacity z-20 flex items-center gap-0.5 pointer-events-none">
        <Edit3 className="w-2.5 h-2.5" />
      </span>
    </span>
  );
};

interface EditableImageProps {
  isEditMode: boolean;
  fieldKey: string;
  label: string;
  currentUrl?: string;
  src?: string;
  alt?: string;
  fallbackUrl?: string;
  onEdit?: (fieldKey: string, label: string, currentUrl: string, fallbackUrl?: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  isEditMode,
  fieldKey,
  label,
  currentUrl,
  src,
  alt = '',
  fallbackUrl,
  onEdit,
  className = '',
  children,
}) => {
  const effectiveUrl = currentUrl || src || fallbackUrl || '';

  const defaultImageElement = (
    <img
      src={effectiveUrl}
      alt={alt || label}
      className={className}
      referrerPolicy="no-referrer"
      onError={(e) => {
        if (fallbackUrl) {
          (e.target as HTMLImageElement).src = fallbackUrl;
        }
      }}
    />
  );

  const content = children || defaultImageElement;

  if (!isEditMode) {
    return <>{content}</>;
  }

  return (
    <div className={`relative group/img-edit inline-block ${className}`}>
      {content}
      {/* Overlay trigger button */}
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img-edit:opacity-100 transition-opacity flex items-center justify-center rounded-[inherit] z-20 pointer-events-auto">
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (onEdit) {
              onEdit(fieldKey, label, effectiveUrl, fallbackUrl);
            }
          }}
          className="px-3 py-1.5 rounded-full bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-xl flex items-center gap-1.5 transform scale-90 group-hover/img-edit:scale-100 transition-all border border-white/40"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Change Picture</span>
        </button>
      </div>
      {/* Small badge always visible in edit mode */}
      <div className="absolute top-2 left-2 z-10 bg-black/80 text-amber-400 border border-amber-400/50 px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 pointer-events-none shadow-md">
        <Camera className="w-3 h-3" />
        <span>Editable</span>
      </div>
    </div>
  );
};
