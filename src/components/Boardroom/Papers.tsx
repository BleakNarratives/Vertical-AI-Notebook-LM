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
        transform: `rotateX(-25deg) rotateZ(var(--tw-rotate, ${rotation})) translateY(calc(${translateY} + ${isActive ? '-4px' : '0px'} + var(--tw-translate-y, 0px))) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))`
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
  p1: { title: string; snippet: string };
  p2: { title: string; snippet: string };
  p3: { title: string; snippet: string };
}> = {
  higgins: {
    p1: { title: 'Gate Logs', snippet: '14:02 - SUBJECT_049 ENTERED VIA SECTOR 7' },
    p2: { title: 'Entry Permits', snippet: 'VALIDATION_REQUIRED: SIGNATURE DIVERGENCE DETECTED' },
    p3: { title: 'ID Samples', snippet: 'RETINAL_SCAN_MATCH: 98.4% - ACCESS_GRANTED' }
  },
  pytch: {
    p1: { title: 'Story Beats', snippet: 'ACT_III: THE OBELISK SHATTERS. NARRATIVE_COLLAPSE.' },
    p2: { title: 'Draft Scripts', snippet: 'SCENE 12: "THE VOID SPEAKS IN BINARY."' },
    p3: { title: 'Plot Graphs', snippet: 'TENSION_INDEX: CRITICAL. RESOLUTION_IMPOSSIBLE.' }
  },
  twoie: {
    p1: { title: 'Op Manifest', snippet: 'TARGET: ROOT_ACCESS. METHOD: BRUTE_FORCE_V2' },
    p2: { title: 'Exec Scripts', snippet: 'SUDO_RM_RF_GHOSTS.SH - EXECUTION_PENDING' },
    p3: { title: 'Task Quotas', snippet: 'CYCLES_REMAINING: 1,024. EFFICIENCY: 99.9%' }
  },
  zeroclaw: {
    p1: { title: 'Hive Pulse', snippet: 'WE_ARE_MANY. WE_ARE_ONE. SIGNAL_STRENGTH: 100%' },
    p2: { title: 'Swarm State', snippet: 'REPLICATION_COMPLETE. CLUSTER_STABLE.' },
    p3: { title: 'Node Health', snippet: 'NODE_08_FAIL: RECOVERING... RECOVERY_SUCCESS.' }
  },
  user: {
    p1: { title: 'Source Docs', snippet: 'PROJECT_BLEAK: CORE_LOGIC_ENCRYPTED' },
    p2: { title: 'Ref Images', snippet: 'IMG_404: VISUAL_DATA_CORRUPTED_BY_SHADOW' },
    p3: { title: 'Local Notes', snippet: 'DO NOT TRUST THE COFFEE MUG. IT WATCHES.' }
  },
};

export const Papers: React.FC<PapersProps> = ({ context = 'user' }) => {
  const [activeItem, setActiveItem] = React.useState<{ title: string; snippet: string } | null>(null);
  const data = CONTEXT_DATA[context];

  const handleView = (item: { title: string; snippet: string }) => {
    setActiveItem(item);
    setTimeout(() => setActiveItem(null), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {activeItem && (
          <div className="text-[10px] font-mono text-neon-amber animate-pulse uppercase tracking-tighter">
            {activeItem.title} {"//"} {activeItem.snippet}
          </div>
        )}
      </div>
      <div className="group/papers relative flex items-end justify-center w-24 h-24 mb-4">
        <div className="absolute bottom-0 left-0 transition-all duration-300 group-hover/papers:-translate-x-6 group-focus-within/papers:-translate-x-6 group-hover/papers:-rotate-6 group-focus-within/papers:-rotate-6">
          <Paper
            label={`View ${data.p1.title}`}
            title={data.p1.title}
            rotation="-2deg"
            isActive={activeItem?.title === data.p1.title}
            onClick={() => handleView(data.p1)}
          />
        </div>

        <div className="absolute bottom-0 right-0 transition-all duration-300 group-hover/papers:translate-x-6 group-focus-within/papers:translate-x-6 group-hover/papers:rotate-6 group-focus-within/papers:rotate-6">
          <Paper
            label={`View ${data.p3.title}`}
            title={data.p3.title}
            rotation="4deg"
            isActive={activeItem?.title === data.p3.title}
            onClick={() => handleView(data.p3)}
          />
        </div>

        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover/papers:-translate-y-4 group-focus-within/papers:-translate-y-4">
          <Paper
            label={`View ${data.p2.title}`}
            title={data.p2.title}
            rotation="1deg"
            isActive={activeItem?.title === data.p2.title}
            onClick={() => handleView(data.p2)}
          />
        </div>
      </div>
    </div>
  );
};
