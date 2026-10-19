import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showWordmark?: boolean;
  animated?: boolean;
}

export const RetalyyLogo: React.FC<LogoProps> = ({ 
  className = '', 
  variant = 'dark',
  size = 'md',
  showWordmark = true,
  animated = false 
}) => {
  const textColor = variant === 'light' ? '#FFFFFF' : '#0C2B1C';
  const greenAccent = '#46D279'; // High-voltage emerald green from Retalyy identity

  // Dimensions based on size
  const heights = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10',
    xl: 'h-14'
  };

  return (
    <div className={`inline-flex items-center select-none ${className}`}>
      <svg 
        viewBox="14 12 200 68" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={`${heights[size]} w-auto drop-shadow-sm transition-transform duration-200 hover:scale-[1.02]`}
        aria-label="Retalyy"
      >
        <defs>
          <filter id="retalyy-blade-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="0" stdDeviation="3.5" floodColor="#46D279" floodOpacity="0.85" />
          </filter>
        </defs>
        {/* 'r' - Unified geometric letterform */}
        <path 
          d="M18 28.5C18 27.7 18.7 27 19.5 27H27.5V36.5C29.8 30 36 27 43 27.5V37C36.8 36.6 29.5 39 27.5 44.5V59.5C27.5 60.3 26.8 61 26 61H19.5C18.7 61 18 60.3 18 59.5V28.5Z" 
          fill={textColor} 
        />

        {/* 'e' */}
        <path 
          d="M72 44.5C72 34 64.5 26.5 53.5 26.5C42.5 26.5 35 34.5 35 44.5C35 54.5 42.5 62.5 54 62.5C61.5 62.5 67.5 59 70.8 53.5L62.8 49C61 52 57.8 54 53.8 54C48 54 44.5 50.2 44.5 44.5H72ZM44.5 40.5C45.2 36.5 48.5 34 53.5 34C58.5 34 61.8 36.5 62.2 40.5H44.5Z" 
          fill={textColor} 
        />

        {/* 't' */}
        <path 
          d="M83 17V27H94V35H83V52C83 55 84.5 56 87.5 56C89.5 56 91.5 55.5 93 54.5V62C91 62.8 88.5 63.2 85.5 63.2C78.5 63.2 74 59.5 74 51.5V35H66V27H74V17H83Z" 
          fill={textColor} 
        />

        {/* 'a' */}
        <path 
          d="M125 27V61H116V55C113.5 59.5 108 62.5 101.5 62.5C92 62.5 85 55.5 85 45C85 34.5 92 26.5 101.5 26.5C108 26.5 113.5 29.5 116 34V27H125ZM105 34.5C98.5 34.5 94.5 39 94.5 44.5C94.5 50 98.5 54.5 105 54.5C111.5 54.5 115.5 50 115.5 44.5C115.5 39 111.5 34.5 105 34.5Z" 
          fill={textColor} 
        />

        {/* 'l' */}
        <rect x="132" y="15" width="9.5" height="46" rx="1.5" fill={textColor} />

        {/* first 'y' */}
        <path 
          d="M145 27L154.5 49L164 27H174L159.5 58.5L154.5 69.5C152.2 74.5 148 77 142 77H138V69.5H141C144 69.5 145.8 68 147 65.5L148.5 62L135 27H145Z" 
          fill={textColor} 
        />

        {/* second stylized 'y' with high-contrast emerald slash blade */}
        <g>
          {/* Left diagonal arm */}
          <path 
            d="M172 27L186 52.5L181 63.5L163 27H172Z" 
            fill={textColor} 
          />

          {/* Upper Right GREEN Accent Blade */}
          <path 
            d="M197.5 15.5H210L199.5 34H187L197.5 15.5Z" 
            fill={greenAccent} 
            filter={animated ? "url(#retalyy-blade-glow)" : undefined}
            className={animated ? "animate-pulse" : undefined}
          />

          {/* Lower Right / Descender sweep with 3px negative space gap */}
          <path 
            d="M185 37H196.5L174 77H164.5L185 37Z" 
            fill={textColor} 
          />
        </g>
      </svg>
    </div>
  );
};

// Standalone Logo Icon Mark (The distinctive stylized 'y' with the green blade)
export const RetalyyIconMark: React.FC<{ 
  size?: number; 
  className?: string;
  variant?: 'dark' | 'light' | 'green' | 'transparent';
}> = ({ 
  size = 36, 
  className = '',
  variant = 'dark'
}) => {
  const bgFill = 
    variant === 'dark' ? '#0C2B1C' : 
    variant === 'green' ? '#27B665' : 
    variant === 'light' ? '#F4FAF6' : 'transparent';
    
  const stemFill = 
    variant === 'light' ? '#0C2B1C' : '#FFFFFF';

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 48 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-200 hover:scale-105 ${className}`}
      aria-label="Retalyy Mark"
    >
      {variant !== 'transparent' && (
        <rect width="48" height="48" rx="12" fill={bgFill} />
      )}
      
      {/* Left arm */}
      <path 
        d="M14 15L23 31L20 37L9 15H14Z" 
        fill={stemFill} 
      />

      {/* Green Accent Slash */}
      <path 
        d="M31 7.5H39L32 20H24L31 7.5Z" 
        fill="#46D279" 
      />

      {/* Main stem with gap below blade */}
      <path 
        d="M22.5 22H30.5L17 44H11.5L22.5 22Z" 
        fill={stemFill} 
      />
    </svg>
  );
};
