import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

export const SCorpShieldIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path 
      d="M16 3L5 7.5V15C5 21.8 9.7 28.1 16 29.5C22.3 28.1 27 21.8 27 15V7.5L16 3Z" 
      fill="#EDF9F1" 
      stroke="#0F7A41" 
      strokeWidth="2" 
      strokeLinejoin="round"
    />
    <path 
      d="M16 7L8 10.3V15.5C8 20.3 11.4 24.8 16 25.8C20.6 24.8 24 20.3 24 15.5V10.3L16 7Z" 
      fill="#C6EDD4" 
      opacity="0.6"
    />
    <path 
      d="M12 16L15 19L21 12" 
      stroke="#0F7A41" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <circle cx="16" cy="16" r="1.5" fill="#27B665"/>
  </svg>
);

export const Solo401kVaultIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <rect x="4" y="5" width="24" height="22" rx="5" fill="#EDF9F1" stroke="#0F7A41" strokeWidth="2"/>
    <circle cx="16" cy="16" r="6.5" fill="#C6EDD4" stroke="#0F7A41" strokeWidth="1.8"/>
    <circle cx="16" cy="16" r="3" fill="#27B665"/>
    <path d="M16 9.5V12M16 20V22.5M9.5 16H12M20 16H22.5" stroke="#0F7A41" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M7 9H9M7 23H9M23 9H25M23 23H25" stroke="#8EDDA6" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

export const AccountablePlanIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <rect x="6" y="4" width="20" height="24" rx="4" fill="#EDF9F1" stroke="#0F7A41" strokeWidth="2"/>
    <path d="M10 9H22" stroke="#27B665" strokeWidth="2" strokeLinecap="round"/>
    <path d="M10 14H18" stroke="#8EDDA6" strokeWidth="1.8" strokeLinecap="round"/>
    <path d="M10 19H22" stroke="#D9F0E2" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="21" cy="22" r="5" fill="#27B665" stroke="#fff" strokeWidth="1.5"/>
    <path d="M19.5 22L20.8 23.3L23 21" stroke="#fff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export const AugustaRuleIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M4 14L16 4L28 14V26C28 27.1 27.1 28 26 28H6C4.9 28 4 27.1 4 26V14Z" fill="#EDF9F1" stroke="#0F7A41" strokeWidth="2"/>
    <path d="M12 28V18H20V28" fill="#C6EDD4" stroke="#0F7A41" strokeWidth="1.8"/>
    <rect x="13" y="10" width="6" height="5" rx="1" fill="#fff" stroke="#27B665" strokeWidth="1.5"/>
    <circle cx="16" cy="7.5" r="1.5" fill="#27B665"/>
  </svg>
);

export const SafeHarborBeaconIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M12 28L14 10H18L20 28H12Z" fill="#EDF9F1" stroke="#0F7A41" strokeWidth="2"/>
    <rect x="13" y="6" width="6" height="4" rx="1" fill="#27B665"/>
    <path d="M11 7L7 5M21 7L25 5M16 3V1M6 28H26" stroke="#0F7A41" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="16" cy="8" r="1.5" fill="#fff"/>
    <path d="M13 16H19M12.5 22H19.5" stroke="#8EDDA6" strokeWidth="1.5"/>
  </svg>
);

export const QbiDiamondIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M16 3L27 12L16 29L5 12L16 3Z" fill="#EDF9F1" stroke="#0F7A41" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M5 12H27M16 3L11 12L16 29L21 12L16 3Z" stroke="#8EDDA6" strokeWidth="1.5" strokeLinejoin="round"/>
    <circle cx="16" cy="16" r="3.5" fill="#27B665"/>
    <path d="M16 14.5V17.5M14.5 16H17.5" stroke="#fff" strokeWidth="1.2" strokeLinecap="round"/>
  </svg>
);

export const HealthDeductionIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="13" fill="#EDF9F1" stroke="#0F7A41" strokeWidth="2"/>
    <path d="M16 9V23M9 16H23" stroke="#27B665" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="16" cy="16" r="2.5" fill="#fff"/>
  </svg>
);

export const PtetCompassIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="13" fill="#EDF9F1" stroke="#0F7A41" strokeWidth="2"/>
    <path d="M16 6L19 13L26 16L19 19L16 26L13 19L6 16L13 13L16 6Z" fill="#C6EDD4" stroke="#0F7A41" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M16 6L19 13L16 16L13 13L16 6Z" fill="#27B665"/>
    <circle cx="16" cy="16" r="2" fill="#0C2B1C"/>
  </svg>
);

export const DocumentAuditIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <path d="M7 5C7 3.9 7.9 3 9 3H20L27 10V27C27 28.1 26.1 29 25 29H9C7.9 29 7 28.1 7 27V5Z" fill="#EDF9F1" stroke="#0F7A41" strokeWidth="2"/>
    <path d="M20 3V10H27" stroke="#0F7A41" strokeWidth="2" strokeLinejoin="round"/>
    <path d="M11 15H17M11 19H15" stroke="#27B665" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="21" cy="21" r="5" fill="#fff" stroke="#0F7A41" strokeWidth="1.8"/>
    <path d="M25 25L28 28" stroke="#0F7A41" strokeWidth="2" strokeLinecap="round"/>
    <circle cx="21" cy="21" r="2" fill="#8EDDA6"/>
  </svg>
);

export const CertifiedStampIcon: React.FC<IconProps> = ({ className = 'w-6 h-6', size }) => (
  <svg 
    viewBox="0 0 32 32" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    <circle cx="16" cy="16" r="13" stroke="#0F7A41" strokeWidth="2" strokeDasharray="3 2"/>
    <circle cx="16" cy="16" r="10" fill="#EDF9F1" stroke="#27B665" strokeWidth="1.5"/>
    <path d="M12 16.5L14.8 19.3L20.5 13" stroke="#0F7A41" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* User Image 1: Document Sheet with Calculator and Angled Pencil */
export const DocumentCalculatorPencilIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size }) => (
  <svg 
    viewBox="0 0 100 84" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: (size * 84) / 100 } : undefined}
    aria-hidden="true"
  >
    {/* Document sheet with folded top-right corner and rolled bottom curl */}
    <path 
      d="M26 6H64L76 18V64C76 68.4 72.4 72 68 72H24C21 72 21 65 24 65H70" 
      stroke="currentColor" 
      strokeWidth="2.8" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    />
    <path 
      d="M64 6V18H76" 
      stroke="currentColor" 
      strokeWidth="2.8" 
      strokeLinejoin="round"
    />
    <path 
      d="M26 6V65" 
      stroke="currentColor" 
      strokeWidth="2.8" 
      strokeLinecap="round"
    />
    <path 
      d="M21 65C21 69 24 72 28 72H70C74 72 76 69 76 65" 
      stroke="currentColor" 
      strokeWidth="2.8" 
      strokeLinecap="round"
    />

    {/* Calculator on left side */}
    <rect 
      x="14" 
      y="24" 
      width="24" 
      height="35" 
      rx="5" 
      fill="white" 
      stroke="currentColor" 
      strokeWidth="2.8"
    />
    {/* Calculator LCD display */}
    <rect 
      x="17.5" 
      y="27.5" 
      width="17" 
      height="6" 
      rx="1.5" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.2"
    />
    {/* 3x3 rounded keys */}
    <rect x="17.5" y="37" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="23.8" y="37" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="30" y="37" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>
    
    <rect x="17.5" y="44" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="23.8" y="44" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="30" y="44" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>
    
    <rect x="17.5" y="51" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="23.8" y="51" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>
    <rect x="30" y="51" width="4.5" height="4.5" rx="1.2" stroke="currentColor" strokeWidth="2" fill="none"/>

    {/* Pencil angled on right side */}
    <g transform="rotate(34 68 45)">
      <rect x="52" y="22" width="9" height="24" fill="white" stroke="currentColor" strokeWidth="2.8" />
      <rect x="52" y="17" width="9" height="5" rx="1" fill="none" stroke="currentColor" strokeWidth="2.8" />
      <line x1="52" y1="20" x2="61" y2="20" stroke="currentColor" strokeWidth="2" />
      <line x1="56.5" y1="22" x2="56.5" y2="46" stroke="currentColor" strokeWidth="2" />
      <polygon points="52,46 61,46 56.5,56" fill="white" stroke="currentColor" strokeWidth="2.8" strokeLinejoin="round" />
      <polygon points="54.5,52 58.5,52 56.5,56" fill="currentColor" />
    </g>
  </svg>
);

/* User Image 2: Financial Dashboard Screen with Dollar Badge, Bar Chart, and Pie Chart */
export const FinancialDashboardReportIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size }) => (
  <svg 
    viewBox="0 0 100 70" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: (size * 70) / 100 } : undefined}
    aria-hidden="true"
  >
    {/* Outer Monitor / Dashboard Frame */}
    <rect 
      x="20" 
      y="8" 
      width="68" 
      height="48" 
      rx="7" 
      fill="white" 
      stroke="currentColor" 
      strokeWidth="3.2"
    />

    {/* Left Dollar Badge Circle */}
    <circle cx="21" cy="30" r="11" fill="white" stroke="currentColor" strokeWidth="3.2" />
    <text 
      x="21" 
      y="36" 
      fontFamily="sans-serif" 
      fontSize="16" 
      fontWeight="900" 
      textAnchor="middle" 
      fill="currentColor"
    >
      $
    </text>

    {/* Horizontal Dotted Financial Data Lines */}
    <circle cx="33" cy="18" r="1.8" fill="currentColor" />
    <line x1="37" y1="18" x2="82" y2="18" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    
    <circle cx="40" cy="24" r="1.8" fill="currentColor" />
    <line x1="44" y1="24" x2="82" y2="24" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    
    <circle cx="46" cy="30" r="1.8" fill="currentColor" />
    <line x1="50" y1="30" x2="82" y2="30" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />

    <circle cx="51" cy="36" r="1.8" fill="currentColor" />
    <line x1="55" y1="36" x2="82" y2="36" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />

    {/* Bottom-left Bar Chart */}
    <line x1="32" y1="48" x2="56" y2="48" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <line x1="32" y1="38" x2="32" y2="48" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    <rect x="36" y="42" width="3" height="6" fill="currentColor" />
    <rect x="41" y="38" width="3" height="10" fill="currentColor" />
    <rect x="46" y="44" width="3" height="4" fill="currentColor" />
    <rect x="51" y="39" width="3" height="9" fill="currentColor" />

    {/* Bottom-right Pie Chart with pull-out wedge */}
    <g transform="translate(71, 46)">
      <circle cx="0" cy="0" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <path 
        d="M0,0 L6,-3 A7.5,7.5 0 1,1 0,-7.5 Z" 
        fill="currentColor" 
      />
      <path 
        d="M2,-2 L7,-2 A7.5,7.5 0 0,0 2,-7.5 Z" 
        fill="currentColor" 
        transform="translate(1, -1)"
      />
    </g>
  </svg>
);

/* User Image 3: Clipboard with Analytics Charts and Modern Front-Facing Calculator */
export const ClipboardAnalyticsCalculatorIcon: React.FC<IconProps> = ({ className = 'w-10 h-10', size }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    className={className} 
    style={size ? { width: size, height: size } : undefined}
    aria-hidden="true"
  >
    {/* Dark Clipboard Base */}
    <rect x="14" y="10" width="56" height="78" rx="8" fill="#3A4D59" stroke="#25343F" strokeWidth="2" />
    
    {/* Top Clip Bracket and Ring */}
    <rect x="34" y="5" width="16" height="8" rx="3" fill="#D9E2E8" stroke="#3A4D59" strokeWidth="1.5" />
    <circle cx="42" cy="9" r="2.5" fill="#3A4D59" />
    <rect x="28" y="9" width="28" height="6" rx="2" fill="#9AAAB5" />

    {/* White Paper Sheet on Clipboard */}
    <rect x="20" y="18" width="44" height="64" rx="3" fill="#FFFFFF" />

    {/* Blue Bar Chart on Paper */}
    <g transform="translate(25, 26)">
      <rect x="0" y="8" width="4.5" height="12" fill="#2D7CF6" rx="1" />
      <rect x="6.5" y="14" width="4.5" height="6" fill="#64B5F6" rx="1" />
      <rect x="13" y="4" width="4.5" height="16" fill="#1E65D6" rx="1" />
      <rect x="19.5" y="8" width="4.5" height="12" fill="#42A5F5" rx="1" />
    </g>

    {/* Dual-Tone Pie Chart on Paper */}
    <g transform="translate(36, 62)">
      <path d="M0,0 L0,-11 A11,11 0 1,1 9,0 Z" fill="#2E7D32" />
      <path d="M0,0 L0,-11 A11,11 0 0,0 -9,0 Z" fill="#C0CA33" />
      <path d="M0,0 L-9,0 A11,11 0 0,0 0,11 Z" fill="#7CB342" />
    </g>

    {/* Calculator in Foreground */}
    <g transform="translate(46, 42)">
      {/* Calculator Body */}
      <rect x="0" y="0" width="41" height="52" rx="7" fill="#46494C" stroke="#2D3033" strokeWidth="1.5" />
      
      {/* Green LCD Display */}
      <rect x="4.5" y="4.5" width="32" height="11" rx="2.5" fill="#A5D6A7" stroke="#81C784" strokeWidth="1" />
      {/* Digital Cursor */}
      <rect x="30" y="7" width="3.5" height="6" rx="0.5" fill="#2E7D32" />

      {/* Calculator Keypad */}
      {/* Row 1 */}
      <rect x="5.5" y="19" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="13.5" y="19" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="21.5" y="19" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      {/* Red Reset Key */}
      <rect x="29.5" y="19" width="6.5" height="5.5" rx="1.5" fill="#E53935" />

      {/* Row 2 */}
      <rect x="5.5" y="26.5" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="13.5" y="26.5" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="21.5" y="26.5" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="29.5" y="26.5" width="6.5" height="5.5" rx="1.5" fill="#BDBDBD" />

      {/* Row 3 */}
      <rect x="5.5" y="34" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="13.5" y="34" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="21.5" y="34" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="29.5" y="34" width="6.5" height="5.5" rx="1.5" fill="#BDBDBD" />

      {/* Row 4 */}
      <rect x="5.5" y="41.5" width="14.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="21.5" y="41.5" width="6.5" height="5.5" rx="1.5" fill="#E0E0E0" />
      <rect x="29.5" y="41.5" width="6.5" height="5.5" rx="1.5" fill="#66BB6A" />
    </g>
  </svg>
);

