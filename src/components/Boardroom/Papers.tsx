'use client';

import React from 'react';

interface PaperProps {
  label: string;
  title: string;
  rotation?: string;
  translateY?: string;
  onClick?: () => void;
}

const Paper: React.FC<PaperProps> = ({ label, title, rotation = '0deg', translateY = '0px', onClick }) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      onClick={onClick}
      style={{ '--rotation': rotation, '--translate-y': translateY } as React.CSSProperties}
      className="group relative w-12 h-16 bg-white/5 border border-grey-medium transition-all rotate-[var(--rotation)] translate-y-[var(--translate-y)] hover:rotate-0 hover:translate-y-0 hover:scale-110 active:scale-105 hover:bg-white/10 shadow-lg focus-visible:ring-2 focus-visible:ring-neon-amber outline-none overflow-hidden"
    >
      {/* Paper Content Simulation */}
      <div className="absolute inset-2 flex flex-col gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="h-0.5 w-full bg-grey-medium" />
        <div className="h-0.5 w-3/4 bg-grey-medium" />
        <div className="h-0.5 w-full bg-grey-medium" />
        <div className="mt-1 h-0.5 w-1/2 bg-neon-red/40" />
        <div className="h-0.5 w-full bg-grey-medium" />
        <div className="h-0.5 w-full bg-grey-medium" />
      </div>

      {/* Stack effect shadow */}
      <div className="absolute -bottom-1 -right-1 w-full h-full border-r border-b border-grey-dark/50 -z-10" />

      {/* Label on hover/focus */}
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
        {title}
      </span>
    </button>
  );
};

export const Papers: React.FC = () => {
  const [status, setStatus] = React.useState<string | null>(null);

  const handleView = (title: string) => {
    setStatus(`Viewing ${title}...`);
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {status && (
        <div aria-live="polite" className="text-[8px] font-mono text-neon-amber animate-pulse uppercase">
          {status}
        </div>
      )}
      <div className="flex items-end gap-4 mb-4">
        <Paper
          label="View Source Documentation"
          title="Source Docs"
          rotation="-6deg"
          onClick={() => handleView('Source Docs')}
        />
        <div className="relative">
          <Paper
            label="View Reference Images"
            title="Ref Images"
            rotation="3deg"
            translateY="8px"
            onClick={() => handleView('Ref Images')}
          />
        {/* Additional stacked paper look */}
        <div className="absolute top-1 left-1 w-14 h-18 bg-white/5 border border-grey-medium rotate-1 -z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
