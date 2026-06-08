'use client';

import React from 'react';

interface PaperProps {
  label: string;
  title: string;
  rotation?: string;
  translateY?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const Paper: React.FC<PaperProps> = ({ label, title, rotation = '0deg', translateY = '0px', isActive, onClick }) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      onClick={onClick}
      style={{
        transform: `rotateX(-20deg) rotateZ(var(--tw-rotate, ${rotation})) translateY(calc(${translateY} + ${isActive ? '-4px' : '0px'} + var(--tw-translate-y, 0px))) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))`
      }}
      className={`group relative w-12 h-16 bg-white/5 border transition-all hover:rotate-0 hover:translate-y-0 hover:scale-110 active:translate-y-1 hover:bg-white/10 shadow-lg focus-visible:ring-2 focus-visible:ring-neon-amber outline-none overflow-hidden transform-gpu ${isActive ? 'border-neon-amber shadow-[0_0_15px_rgba(255,191,0,0.2)]' : 'border-grey-medium'}`}
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

const CONTEXT_DATA: Record<ContextType, {
  p1: string; s1: string;
  p2: string; s2: string;
  p3: string; s3: string;
}> = {
  higgins: {
    p1: 'Gate Logs', s1: 'Visitor clearance: PENDING',
    p2: 'Entry Permits', s2: 'Authorized by Obelisk-4',
    p3: 'ID Samples', s3: 'Biometric mismatch in Sector B'
  },
  pytch: {
    p1: 'Story Beats', s1: 'The plot thickens in Sector 7',
    p2: 'Draft Scripts', s2: 'Dialogue needs more "bleak"',
    p3: 'Plot Graphs', s3: 'Narrative tension rising'
  },
  twoie: {
    p1: 'Op Manifest', s1: 'Execution cycle 42 initiated',
    p2: 'Exec Scripts', s2: 'Automated cleanup scheduled',
    p3: 'Task Quotas', s3: 'Efficiency at 98.4%'
  },
  zeroclaw: {
    p1: 'Hive Pulse', s1: 'Node 04 reporting heartbeat',
    p2: 'Swarm State', s2: 'Collective focus: Optimized',
    p3: 'Node Health', s3: 'Degradation detected in hive limb'
  },
  user: {
    p1: 'Source Docs', s1: 'Encrypted fragments found',
    p2: 'Ref Images', s2: 'Visualizing the obsidian shadows',
    p3: 'Local Notes', s3: "Don't trust the coffee mug"
  },
};

export const Papers: React.FC<PapersProps> = ({ context = 'user' }) => {
  const [activeInfo, setActiveInfo] = React.useState<{title: string, snippet: string} | null>(null);
  const data = CONTEXT_DATA[context];

  const handleView = (title: string, snippet: string) => {
    setActiveInfo({ title, snippet });
    setTimeout(() => setActiveInfo(null), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-6 flex items-center justify-center" aria-live="polite">
        {activeInfo && (
          <div className="text-xs font-mono text-neon-amber animate-pulse uppercase text-center max-w-[200px] leading-tight">
            {activeInfo.title}: {activeInfo.snippet}
          </div>
        )}
      </div>
      <div className="group/papers relative flex items-end justify-center w-24 h-24 mb-4">
        {/* Paper 1: Bottom Left */}
        <div className="absolute bottom-0 left-2 transition-all duration-300 group-hover/papers:-translate-x-8 group-focus-within/papers:-translate-x-8 group-hover/papers:-rotate-12 group-focus-within/papers:-rotate-12">
          <Paper
            label={`View ${data.p1}`}
            title={data.p1}
            rotation="-2deg"
            isActive={activeInfo?.title === data.p1}
            onClick={() => handleView(data.p1, data.s1)}
          />
        </div>

        {/* Paper 3: Bottom Right (added for depth) */}
        <div className="absolute bottom-0 right-2 transition-all duration-300 group-hover/papers:translate-x-8 group-focus-within/papers:translate-x-8 group-hover/papers:rotate-12 group-focus-within/papers:rotate-12">
          <Paper
            label={`View ${data.p3}`}
            title={data.p3}
            rotation="4deg"
            isActive={activeInfo?.title === data.p3}
            onClick={() => handleView(data.p3, data.s3)}
          />
        </div>

        {/* Paper 2: Center/Top */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover/papers:-translate-y-6 group-focus-within/papers:-translate-y-6 group-hover/papers:rotate-2 group-focus-within/papers:rotate-2">
          <Paper
            label={`View ${data.p2}`}
            title={data.p2}
            rotation="1deg"
            isActive={activeInfo?.title === data.p2}
            onClick={() => handleView(data.p2, data.s2)}
          />
        </div>
      </div>
    </div>
  );
};
