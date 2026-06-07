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
        transform: `rotateX(-20deg) rotateZ(var(--tw-rotate, ${rotation})) translateY(calc(${translateY} + ${isActive ? '-8px' : '0px'} + var(--tw-translate-y, 0px))) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))`
      }}
      className={`group relative w-12 h-16 bg-white/5 border transition-all hover:rotate-0 hover:translate-y-0 hover:scale-110 active:translate-y-1 hover:bg-white/10 shadow-lg focus-visible:ring-2 focus-visible:ring-neon-amber outline-none overflow-hidden transform-gpu ${isActive ? 'border-neon-amber shadow-[0_0_25px_rgba(255,191,0,0.4)]' : 'border-grey-medium'}`}
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

interface PaperData {
  title: string;
  snippet: string;
}

interface PapersProps {
  context?: ContextType;
}

const CONTEXT_DATA: Record<ContextType, { p1: PaperData; p2: PaperData; p3: PaperData }> = {
  higgins: {
    p1: { title: 'Gate Logs', snippet: 'Entry 042: Subject 881 refused retinal scan. Disposed.' },
    p2: { title: 'Entry Permits', snippet: 'Permit #X-901: Valid for lower sectors only.' },
    p3: { title: 'ID Samples', snippet: 'Sample 12: Matches Obelisk baseline profile.' }
  },
  pytch: {
    p1: { title: 'Story Beats', snippet: 'Beat 4: The protagonist realizes the city is a loop.' },
    p2: { title: 'Draft Scripts', snippet: 'Scene 12: Higgins smiles. It is the only error.' },
    p3: { title: 'Plot Graphs', snippet: 'Entropy rising. convergence at terminal node 0x88.' }
  },
  twoie: {
    p1: { title: 'Op Manifest', snippet: 'Operation Molt: 36 cycles remaining.' },
    p2: { title: 'Exec Scripts', snippet: 'run ./molt-gap-filler.sh --force --ascension-ready' },
    p3: { title: 'Task Quotas', snippet: 'Quota 99%: 14 more shadow logs needed.' }
  },
  zeroclaw: {
    p1: { title: 'Hive Pulse', snippet: 'Pulse: STABLE. 4,000 nodes synchronized in swarm.' },
    p2: { title: 'Swarm State', snippet: 'Collective consciousness at 84%. Voodoo active.' },
    p3: { title: 'Node Health', snippet: 'Node 721: Malfunctioning. Reallocating resources.' }
  },
  user: {
    p1: { title: 'Source Docs', snippet: 'Fragment 0: The Obelisk was not built; it was typed.' },
    p2: { title: 'Ref Images', snippet: 'Img_102: A bleak landscape of obsidian and neon-amber.' },
    p3: { title: 'Local Notes', snippet: 'The coffee mug saves the state, but not the soul.' }
  },
};

export const Papers: React.FC<PapersProps> = ({ context = 'user' }) => {
  const [activePaper, setActivePaper] = React.useState<PaperData | null>(null);
  const data = CONTEXT_DATA[context];

  const handleView = (paper: PaperData) => {
    setActivePaper(paper);
    setTimeout(() => setActivePaper(null), 3000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="min-h-4 flex items-center justify-center text-center px-4" aria-live="polite">
        {activePaper && (
          <div className="text-[10px] font-mono text-neon-amber animate-pulse uppercase tracking-tighter">
            <span className="opacity-50">{activePaper.title}:</span> {activePaper.snippet}
          </div>
        )}
      </div>
      <div className="group/papers relative flex items-end justify-center w-24 h-24 mb-4">
        {/* Paper 1: Bottom Left */}
        <div className="absolute bottom-0 left-0 transition-all duration-300 group-hover/papers:-translate-x-6 group-focus-within/papers:-translate-x-6 group-hover/papers:-rotate-6 group-focus-within/papers:-rotate-6">
          <Paper
            label={`View ${data.p1.title}`}
            title={data.p1.title}
            rotation="-2deg"
            isActive={activePaper?.title === data.p1.title}
            onClick={() => handleView(data.p1)}
          />
        </div>

        {/* Paper 3: Bottom Right (added for depth) */}
        <div className="absolute bottom-0 right-0 transition-all duration-300 group-hover/papers:translate-x-6 group-focus-within/papers:translate-x-6 group-hover/papers:rotate-6 group-focus-within/papers:rotate-6">
          <Paper
            label={`View ${data.p3.title}`}
            title={data.p3.title}
            rotation="4deg"
            isActive={activePaper?.title === data.p3.title}
            onClick={() => handleView(data.p3)}
          />
        </div>

        {/* Paper 2: Center/Top */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover/papers:-translate-y-4 group-focus-within/papers:-translate-y-4">
          <Paper
            label={`View ${data.p2.title}`}
            title={data.p2.title}
            rotation="1deg"
            isActive={activePaper?.title === data.p2.title}
            onClick={() => handleView(data.p2)}
          />
        </div>
      </div>
    </div>
  );
};
