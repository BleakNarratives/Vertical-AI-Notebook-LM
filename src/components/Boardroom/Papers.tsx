'use client';

import React from 'react';
import { FocusIndicator } from './FocusIndicator';

interface PaperProps {
  label: string;
  title: string;
  rotation?: string;
  translateY?: string;
  isActive?: boolean;
  onClick?: () => void;
  labelPosition?: 'top' | 'bottom';
}

const Paper: React.FC<PaperProps> = ({ label, title, rotation = '0deg', translateY = '0px', isActive, onClick, labelPosition = 'top' }) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{ transform: `rotateX(-20deg) rotateZ(var(--tw-rotate, ${rotation})) translateY(calc(${translateY} + ${isActive ? '-8px' : '0px'} + var(--tw-translate-y, 0px))) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))` }}
      className={`group relative w-12 h-16 bg-white/5 border transition-all hover:rotate-0 hover:translate-y-0 hover:scale-110 active:translate-y-1 hover:bg-white/10 shadow-lg outline-none transform-gpu ${isActive ? 'border-neon-amber shadow-[0_0_25px_rgba(255,191,0,0.4)]' : 'border-grey-medium'}`}
    >
      <FocusIndicator />
      <div className="absolute inset-2 flex flex-col gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
        <div className="h-0.5 w-full bg-grey-medium" /><div className="h-0.5 w-3/4 bg-grey-medium" />
        <div className="mt-1 h-0.5 w-1/2 bg-neon-red/40" /><div className="h-0.5 w-full bg-grey-medium" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-full h-full border-r border-b border-grey-dark/50 -z-10" />
      <span className={`absolute left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap ${labelPosition === 'top' ? '-top-8' : '-bottom-8'}`}>
        {title}
      </span>
    </button>
  );
};

type ContextType = 'higgins' | 'pytch' | 'twoie' | 'zeroclaw' | 'user';
interface PapersProps { context?: ContextType; labelPosition?: 'top' | 'bottom'; }
interface DocInfo { title: string; snippet: string; }

const CONTEXT_DATA: Record<ContextType, { p1: DocInfo; p2: DocInfo; p3: DocInfo }> = {
  higgins: { p1: { title: 'Gate Logs', snippet: 'Unauthorized access at 03:00...' }, p2: { title: 'Entry Permits', snippet: 'Verified: Pytch, Twoie...' }, p3: { title: 'ID Samples', snippet: 'Biometric mismatched...' } },
  pytch: { p1: { title: 'Story Beats', snippet: 'The loop is recursive...' }, p2: { title: 'Draft Scripts', snippet: 'The shadow speaks...' }, p3: { title: 'Plot Graphs', snippet: 'Tension at Cycle 56...' } },
  twoie: { p1: { title: 'Op Manifest', snippet: 'Operation: Molt...' }, p2: { title: 'Exec Scripts', snippet: 'Reconstruction active...' }, p3: { title: 'Task Quotas', snippet: 'Efficiency up 42%...' } },
  zeroclaw: { p1: { title: 'Hive Pulse', snippet: 'Nodes responding <1ms...' }, p2: { title: 'Swarm State', snippet: 'Consensus reached...' }, p3: { title: 'Node Health', snippet: 'Redundancy active...' } },
  user: { p1: { title: 'Source Docs', snippet: 'SOP for Code City...' }, p2: { title: 'Ref Images', snippet: 'Obelisk architecture...' }, p3: { title: 'Local Notes', snippet: 'Prompt is the key...' } },
};

export const Papers: React.FC<PapersProps> = ({ context = 'user', labelPosition = 'top' }) => {
  const [activeDoc, setActiveDoc] = React.useState<DocInfo | null>(null);
  const data = CONTEXT_DATA[context];
  const handleView = (doc: DocInfo) => { setActiveDoc(doc); setTimeout(() => setActiveDoc(null), 3000); };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-10 flex flex-col items-center justify-center text-center" aria-live="polite">
        {activeDoc && (
          <>
            <div className="text-xs font-mono text-neon-amber animate-pulse uppercase tracking-tighter">Viewing {activeDoc.title}...</div>
            <div className="text-[10px] font-mono text-white/60 truncate max-w-[150px]">{activeDoc.snippet}</div>
          </>
        )}
      </div>
      <div className="group/papers relative flex items-end justify-center w-24 h-24 mb-4">
        <div className="absolute bottom-0 left-0 transition-all duration-300 group-hover/papers:-translate-x-6 group-focus-within/papers:-translate-x-6 group-hover/papers:-rotate-6 group-focus-within/papers:-rotate-6"><Paper label={`View ${data.p1.title}`} title={data.p1.title} rotation="-2deg" isActive={activeDoc?.title === data.p1.title} onClick={() => handleView(data.p1)} labelPosition={labelPosition} /></div>
        <div className="absolute bottom-0 right-0 transition-all duration-300 group-hover/papers:translate-x-6 group-focus-within/papers:translate-x-6 group-hover/papers:rotate-6 group-focus-within/papers:rotate-6"><Paper label={`View ${data.p3.title}`} title={data.p3.title} rotation="4deg" isActive={activeDoc?.title === data.p3.title} onClick={() => handleView(data.p3)} labelPosition={labelPosition} /></div>
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover/papers:-translate-y-4 group-focus-within/papers:-translate-y-4"><Paper label={`View ${data.p2.title}`} title={data.p2.title} rotation="1deg" isActive={activeDoc?.title === data.p2.title} onClick={() => handleView(data.p2)} labelPosition={labelPosition} /></div>
      </div>
    </div>
  );
};
