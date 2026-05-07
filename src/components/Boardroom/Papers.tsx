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
      style={{
        transform: `rotateX(-20deg) rotateZ(${rotation}) translateY(${translateY})`
      }}
      className="group relative w-12 h-16 bg-white/5 border border-grey-medium transition-all hover:rotate-0 hover:translate-y-0 hover:scale-110 active:scale-105 hover:bg-white/10 shadow-lg focus-visible:ring-2 focus-visible:ring-neon-amber outline-none overflow-hidden transform-gpu"
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

const CONTEXT_DATA: Record<ContextType, { p1: string; p2: string }> = {
  higgins: { p1: 'Gate Logs', p2: 'Entry Permits' },
  pytch: { p1: 'Story Beats', p2: 'Draft Scripts' },
  twoie: { p1: 'Op Manifest', p2: 'Exec Scripts' },
  zeroclaw: { p1: 'Hive Pulse', p2: 'Swarm State' },
  user: { p1: 'Source Docs', p2: 'Ref Images' },
};

export const Papers: React.FC<PapersProps> = ({ context = 'user' }) => {
  const [status, setStatus] = React.useState<string | null>(null);
  const data = CONTEXT_DATA[context];

  const handleView = (title: string) => {
    setStatus(`Viewing ${title}...`);
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {status && (
        <div aria-live="polite" className="text-xs font-mono text-neon-amber animate-pulse uppercase">
          {status}
        </div>
      )}
      <div className="flex items-end gap-4 mb-4">
        <Paper
          label={`View ${data.p1}`}
          title={data.p1}
          rotation="-6deg"
          onClick={() => handleView(data.p1)}
        />
        <div className="relative">
          <Paper
            label={`View ${data.p2}`}
            title={data.p2}
            rotation="3deg"
            translateY="8px"
            onClick={() => handleView(data.p2)}
          />
        {/* Additional stacked paper look */}
        <div className="absolute top-1 left-1 w-14 h-18 bg-white/5 border border-grey-medium rotate-1 -z-10 pointer-events-none" />
        </div>
      </div>
    </div>
  );
};
