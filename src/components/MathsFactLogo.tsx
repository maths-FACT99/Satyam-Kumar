import React, { useState } from 'react';

interface MathsFactLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  useImage?: boolean;
  customLogoUrl?: string;
}

export const MathsFactLogo: React.FC<MathsFactLogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  useImage = true,
  customLogoUrl,
}) => {
  const [imageError, setImageError] = useState(false);

  // Pixel sizing mapping
  const sizeMap = {
    sm: { dimension: 36, text: 'text-sm', subtext: 'text-[9px]' },
    md: { dimension: 44, text: 'text-base sm:text-lg', subtext: 'text-[10px]' },
    lg: { dimension: 64, text: 'text-xl sm:text-2xl', subtext: 'text-xs' },
    xl: { dimension: 96, text: 'text-3xl', subtext: 'text-sm' },
  };

  const { dimension } = sizeMap[size];

  // SVG representation matching the official circular Maths Fact emblem
  const renderVectorBadge = () => (
    <svg
      viewBox="0 0 200 200"
      width={dimension}
      height={dimension}
      className="drop-shadow-lg"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Background Radial Gradient */}
        <radialGradient id="badgeBg" cx="50%" cy="50%" r="50%" fx="50%" fy="35%">
          <stop offset="0%" stopColor="#1E222D" />
          <stop offset="70%" stopColor="#0B0D12" />
          <stop offset="100%" stopColor="#050608" />
        </radialGradient>

        {/* Outer Ring Gradient */}
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="50%" stopColor="#CBD5E1" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#EF4444" floodOpacity="0.4" />
        </filter>
      </defs>

      {/* Outer Circular Rim */}
      <circle cx="100" cy="100" r="95" fill="url(#badgeBg)" stroke="url(#ringGrad)" strokeWidth="5" />
      <circle cx="100" cy="100" r="91" stroke="#FFFFFF" strokeOpacity="0.15" strokeWidth="1.5" />

      {/* Monogram 'MF' */}
      <g id="mf-initials" transform="translate(100, 88)">
        {/* Letter M in pure white */}
        <text
          x="-14"
          y="12"
          textAnchor="end"
          fontFamily="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif"
          fontWeight="900"
          fontSize="56"
          fill="#FFFFFF"
          letterSpacing="-1"
        >
          M
        </text>

        {/* Letter F in bold vibrant red */}
        <text
          x="12"
          y="12"
          textAnchor="start"
          fontFamily="'Arial Black', 'Trebuchet MS', 'Impact', sans-serif"
          fontWeight="900"
          fontSize="56"
          fill="#EF4444"
          filter="url(#glow)"
        >
          F
        </text>
      </g>

      {/* Divider Accent Line */}
      <line x1="45" y1="120" x2="155" y2="120" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" opacity="0.85" />

      {/* Lower Label: MATHS FACT */}
      <g id="maths-fact-text" transform="translate(100, 142)">
        {/* 'MATHS' in bright red */}
        <text
          x="-4"
          y="0"
          textAnchor="end"
          fontFamily="'Arial Black', 'Trebuchet MS', sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="1.5"
          fill="#EF4444"
        >
          MATHS
        </text>

        {/* 'FACT' in white */}
        <text
          x="4"
          y="0"
          textAnchor="start"
          fontFamily="'Arial Black', 'Trebuchet MS', sans-serif"
          fontWeight="900"
          fontSize="18"
          letterSpacing="1.5"
          fill="#FFFFFF"
        >
          FACT
        </text>
      </g>

      {/* Subtext 'BY SATYAM SIR' */}
      <text
        x="100"
        y="164"
        textAnchor="middle"
        fontFamily="sans-serif"
        fontWeight="700"
        fontSize="10"
        letterSpacing="2.5"
        fill="#F59E0B"
      >
        BY SATYAM SIR
      </text>
    </svg>
  );

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Emblem Icon / Image */}
      <div
        className="relative shrink-0 rounded-full overflow-hidden flex items-center justify-center bg-[#0B0D12] border border-white/20 shadow-xl shadow-red-950/40"
        style={{ width: dimension, height: dimension }}
      >
        {useImage && !imageError ? (
          <img
            src={customLogoUrl || "/maths_fact_logo.jpg"}
            alt="Maths Fact Official Logo"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
            onError={() => setImageError(true)}
          />
        ) : (
          renderVectorBadge()
        )}
      </div>

      {/* Optional Side Label */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span className="font-extrabold text-xl tracking-tight text-white">
              <span className="text-red-500">MATHS </span>
              <span className="text-white">FACT</span>
            </span>
            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-red-950/90 text-amber-400 border border-red-700/60 rounded">
              CBSE • ICSE
            </span>
          </div>
          <span className="text-[11px] text-zinc-400 font-medium tracking-wide">
            Concept-Based Coaching • By Satyam Sir
          </span>
        </div>
      )}
    </div>
  );
};
