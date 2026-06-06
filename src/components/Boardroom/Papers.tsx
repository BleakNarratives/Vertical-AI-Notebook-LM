'use client';

import React from 'react';

interface PaperProps {
  label: string;
  title: string;
  rotation?: string;
  translateY?: string;
  onClick?: () => void;
  isActive?: boolean;
}

const Paper: React.FC<PaperProps> = ({ label, title, rotation = '0deg', translateY = '0px', onClick, isActive }) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      onClick={onClick}
      style={{
        transform: `rotateX(-20deg) rotateZ(var(--tw-rotate, ${rotation})) translateY(calc(${translateY} + var(--tw-translate-y, 0px) + ${isActive ? '-4px' : '0px'})) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))`
      }}
      className={`group relative w-12 h-16 transition-all hover:rotate-0 hover:translate-y-0 hover:scale-110 active:translate-y-1 shadow-lg focus-visible:ring-2 focus-visible:ring-neon-amber outline-none overflow-hidden transform-gpu
        ${isActive ? 'bg-white/20 border-neon-amber shadow-[0_0_15px_rgba(255,191,0,0.2)]' : 'bg-white/5 border-grey-medium hover:bg-white/10'}
        border
      `}
    >
      {/* Paper Content Simulation */}
      <div className="absolute inset-2 flex flex-col gap-1 opacity-20 group-hover:opacity-40 group-focus-visible:opacity-40 transition-opacity">
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
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
        {title}
      </span>
    </button>
  );
};

type ContextType = 'higgins' | 'pytch' | 'twoie' | 'zeroclaw' | 'user';

interface PapersProps {
  context?: ContextType;
}

const CONTEXT_DATA: Record<ContextType, { p1: string; p2: string; p3: string }> = {
  higgins: { p1: 'Gate Logs', p2: 'Entry Permits', p3: 'Roster' },
  pytch: { p1: 'Story Beats', p2: 'Draft Scripts', p3: 'World Bible' },
  twoie: { p1: 'Op Manifest', p2: 'Exec Scripts', p3: 'Kill Chain' },
  zeroclaw: { p1: 'Hive Pulse', p2: 'Swarm State', p3: 'Node Map' },
  user: { p1: 'Source Docs', p2: 'Ref Images', p3: 'Notes' },
};

export const Papers: React.FC<PapersProps> = ({ context = 'user' }) => {
  const [status, setStatus] = React.useState<string | null>(null);
  const data = CONTEXT_DATA[context];

  const handleView = (title: string) => {
    setStatus(`Viewing ${title}...`);
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-2 group/stack">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {status && (
          <div className="text-[10px] font-mono text-neon-amber animate-pulse uppercase tracking-tighter">
            {status}
          </div>
        )}
      </div>
      <div className="relative h-20 w-32 flex items-center justify-center mb-4">
        {/* Stacked and Sorted: Fanned out on interaction */}
        <div className="absolute transition-all duration-500 transform-gpu group-hover/stack:-translate-x-10 group-focus-within/stack:-translate-x-10 group-hover/stack:-rotate-12 group-focus-within/stack:-rotate-12 z-10">
          <Paper
            label={`View ${data.p1}`}
            title={data.p1}
            rotation="-2deg"
            onClick={() => handleView(data.p1)}
            isActive={status === `Viewing ${data.p1}...`}
          />
        </div>
        <div className="absolute transition-all duration-500 transform-gpu group-hover/stack:translate-y-[-4px] group-focus-within/stack:translate-y-[-4px] z-20">
          <Paper
            label={`View ${data.p3}`}
            title={data.p3}
            rotation="0deg"
            onClick={() => handleView(data.p3)}
            isActive={status === `Viewing ${data.p3}...`}
          />
        </div>
        <div className="absolute transition-all duration-500 transform-gpu group-hover/stack:translate-x-10 group-focus-within/stack:translate-x-10 group-hover/stack:rotate-12 group-focus-within/stack:rotate-12 z-10">
          <Paper
            label={`View ${data.p2}`}
            title={data.p2}
            rotation="2deg"
            onClick={() => handleView(data.p2)}
            isActive={status === `Viewing ${data.p2}...`}
          />
        </div>
      </div>
    </div>
  );
};
