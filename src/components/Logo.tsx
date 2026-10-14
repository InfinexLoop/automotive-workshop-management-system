import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showSubtitle?: boolean;
  subtitleText?: string;
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
}

export const TorqovaSymbol: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
    >
      <defs>
        <linearGradient id="tq-grad-1" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>
        <linearGradient id="tq-grad-2" x1="12" y1="6" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#2563EB" />
        </linearGradient>
      </defs>

      {/* Hex-torque foundation block */}
      <rect width="48" height="48" rx="10" fill="#111827" />

      {/* Outer engineering polygon perimeter */}
      <path
        d="M24 7L38 15V33L24 41L10 33V15L24 7Z"
        stroke="#334155"
        strokeWidth="1.5"
        strokeDasharray="2 3"
        opacity="0.6"
      />

      {/* Kinetic Torque Crossbar (Upper wing) */}
      <path
        d="M12 14C12 13.4477 12.4477 13 13 13H35C35.5523 13 36 13.4477 36 14V18.5C36 19.0523 35.5523 19.5 35 19.5H13C12.4477 19.5 12 19.0523 12 18.5V14Z"
        fill="url(#tq-grad-1)"
      />

      {/* Dynamic Mechanical Vane (Rotor stem) */}
      <path
        d="M21.5 18H26.5V31.5C26.5 32.8807 25.3807 34 24 34C22.6193 34 21.5 32.8807 21.5 31.5V18Z"
        fill="url(#tq-grad-2)"
      />

      {/* Kinetic forward arrow thrust */}
      <path d="M27 21L34 25.5L27 30V26H22V25H27V21Z" fill="#38BDF8" opacity="0.9" />

      {/* Precision center jewel */}
      <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" />
      <circle cx="24" cy="24" r="1.2" fill="#111827" />
    </svg>
  );
};

export const TorqovaLogo: React.FC<LogoProps> = ({
  size = 'md',
  showSubtitle = true,
  subtitleText = 'Workshop OS',
  className = '',
}) => {
  const symbolSize = size === 'sm' ? 28 : size === 'lg' ? 42 : 34;
  const titleSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-2xl' : 'text-xl';
  const subSize = size === 'sm' ? 'text-[10px]' : size === 'lg' ? 'text-xs' : 'text-[11px]';

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <TorqovaSymbol size={symbolSize} />
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold tracking-tight text-slate-900 dark:text-white ${titleSize}`}>
            Torqova
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-pulse" />
        </div>
        {showSubtitle && (
          <span className={`font-medium tracking-wide text-slate-500 dark:text-slate-400 mt-0.5 ${subSize}`}>
            {subtitleText}
          </span>
        )}
      </div>
    </div>
  );
};
