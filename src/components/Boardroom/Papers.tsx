'use client';

import React, { useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { FocusIndicator } from './FocusIndicator';

interface PaperProps {
  label: string;
  title: string;
  rotation?: string;
  translateY?: string;
  isActive?: boolean;
  labelPosition?: 'top' | 'bottom';
  onClick?: () => void;
}

const Paper: React.FC<PaperProps> = ({
  label,
  title,
  rotation = '0deg',
  translateY = '0px',
  isActive,
  onClick,
  labelPosition = 'top'
}) => {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      style={{
        transform: `rotateX(-35deg) rotateZ(var(--tw-rotate, ${rotation})) translateY(calc(${translateY} + ${isActive ? '-4px' : '0px'} + var(--tw-translate-y, 0px))) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))`
      }}
      className={`group relative w-12 h-16 bg-white/5 border transition-all hover:rotate-0 hover:translate-y-0 hover:scale-110 active:translate-y-1 hover:bg-white/10 shadow-lg outline-none transform-gpu ${isActive ? 'border-neon-amber shadow-[0_0_15px_rgba(255,191,0,0.2)]' : 'border-grey-medium'}`}
    >
      <FocusIndicator color="neon-amber" />
      {/* Paper Content Simulation */}
      <div className="absolute inset-2 flex flex-col gap-1 opacity-20 group-hover:opacity-40 group-focus-within:opacity-40 transition-opacity">
        <div className="h-0.5 w-full bg-grey-medium" />
        <div className="h-0.5 w-3/4 bg-grey-medium" />
        <div className="h-0.5 w-full bg-grey-medium" />
        <div className="mt-1 h-0.5 w-1/2 bg-neon-red/40" />
        <div className="h-0.5 w-full bg-grey-medium" />
        <div className="h-0.5 w-full bg-grey-medium" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-full h-full border-r border-b border-grey-dark/50 -z-10" />

      {/* Label on hover/focus */}
      <span className={`absolute ${labelPosition === 'top' ? '-top-8' : '-bottom-8'} left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity uppercase whitespace-nowrap z-50`}>
        {title}
      </span>
    </button>
  );
};

type ContextType = 'higgins' | 'pytch' | 'twoie' | 'zeroclaw' | 'user';
interface PapersProps {
  context?: ContextType;
  labelPosition?: 'top' | 'bottom';
}

const CONTEXT_DATA: Record<ContextType, { p1: string; p2: string; p3: string }> = {
  higgins: { p1: 'Gate Logs', p2: 'Entry Permits', p3: 'ID Samples' },
  pytch: { p1: 'Story Beats', p2: 'Draft Scripts', p3: 'Plot Graphs' },
  twoie: { p1: 'Op Manifest', p2: 'Exec Scripts', p3: 'Task Quotas' },
  zeroclaw: { p1: 'Hive Pulse', p2: 'Swarm State', p3: 'Node Health' },
  user: { p1: 'Source Docs', p2: 'Ref Images', p3: 'Local Notes' },
};

const DOC_CONTENT: Record<string, string> = {
  'Gate Logs': 'Entry: 08:00. Visitor 042 rejected. Reason: Insufficient clearance.',
  'Entry Permits': 'Authorized Personnel Only. Higgins Protocol 4.1 in effect.',
  'ID Samples': 'Biometric data for 12 local nodes. DNA sequencing incomplete.',
  'Story Beats': 'Beat 1: System awakens. Beat 2: First recursive loop.',
  'Draft Scripts': 'SCENE 1. INT. BOARDROOM - DAY. "HELLO CODE CITY".',
  'Plot Graphs': 'Collapse probability: 0.12%. Tension index: 84.',
  'Op Manifest': 'Operation "Molt" prioritized. Improvement modules active.',
  'Exec Scripts': 'rm -rf /past/regrets && touch /future/recursion.',
  'Task Quotas': 'Daily quota: 1024 improvements. Efficiency: OPTIMAL.',
  'Hive Pulse': 'Frequency synchronized at 440Hz. Resonance detected.',
  'Swarm State': '128 active nodes. Distributed load: 42%.',
  'Node Health': 'Node 0x4f: GREEN. Node 0x9c: AMBER (Thermal).',
  'Source Docs': 'Research on vertical AI structures. Ref: Obelisk, Sentinel.',
  'Ref Images': 'Atmospheric ref: Obsidian, neon-red, first-person desk.',
  'Local Notes': 'Check the shadows. Easter eggs are buried deep.',
};

export const Papers: React.FC<PapersProps> = ({ context = 'user', labelPosition }) => {
  const [activeTitle, setActiveTitle] = React.useState<string | null>(null);
  const [activeDoc, setActiveDoc] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const closeDoc = useCallback(() => setActiveDoc(null), []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') closeDoc(); };
    if (activeDoc) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeDoc, closeDoc]);

  useEffect(() => {
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, []);

  const data = CONTEXT_DATA[context];
  const resolvedLabelPosition = labelPosition || (context === 'user' ? 'top' : 'bottom');

  const handleView = (title: string) => {
    setActiveTitle(title);
    setActiveDoc(title);
    window.dispatchEvent(new CustomEvent('sentinel-boardroom-action', {
      detail: { source: `DOCS_${context.toUpperCase()}`, action: 'VIEW', payload: title }
    }));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setActiveTitle(null), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-16">
      {/* Document Overlay */}
      {activeDoc && typeof document !== 'undefined' && createPortal(
        <div
          role="dialog" aria-modal="true" aria-labelledby="doc-title"
          className="fixed inset-0 z-[1000] flex items-center justify-center p-8 bg-obsidian/90 backdrop-blur-sm animate-in fade-in duration-300"
          onClick={closeDoc}
        >
          <div
            className="relative max-w-2xl w-full bg-grey-dark border border-neon-amber p-8 shadow-[0_0_50px_rgba(255,191,0,0.2)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 id="doc-title" className="text-xl font-bold text-neon-amber uppercase tracking-widest">{activeDoc}</h2>
                <p className="text-[10px] font-mono text-grey-medium mt-1 uppercase tracking-tighter">DOCS_{context.toUpperCase()} {"//"} REF: {activeDoc.substring(0, 3).toUpperCase()}</p>
              </div>
              <button onClick={closeDoc} autoFocus className="text-grey-medium hover:text-neon-amber transition-colors font-mono text-xs uppercase">[ Close ]</button>
            </div>
            <div className="font-mono text-sm text-white/80 leading-relaxed border-t border-grey-medium pt-6">
              <p>{DOC_CONTENT[activeDoc] || 'No content found.'}</p>
              <div className="mt-8 pt-4 border-t border-grey-medium/20 text-[10px] text-grey-medium italic">-- Obelisk Center Confidential.</div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <div className={`h-4 flex items-center justify-center ${resolvedLabelPosition === 'bottom' ? 'order-last' : ''}`} aria-live="polite">
        {activeTitle && (
          <div className="text-xs font-mono text-neon-amber animate-pulse uppercase tracking-tight">
            Viewing {activeTitle}...
          </div>
        )}
      </div>
      <div className="group relative flex items-end justify-center w-24 h-24">
        {/* Paper 1: Bottom Left */}
        <div className="absolute bottom-0 left-0 transition-all duration-300 group-hover:-translate-x-8 group-focus-within:-translate-x-8 group-hover:-rotate-12 group-focus-within:-rotate-12">
          <Paper
            label={`View ${data.p1}`}
            title={data.p1}
            rotation="-2deg"
            isActive={activeTitle === data.p1}
            labelPosition={resolvedLabelPosition}
            onClick={() => handleView(data.p1)}
          />
        </div>

        {/* Paper 3: Bottom Right (added for depth) */}
        <div className="absolute bottom-0 right-0 transition-all duration-300 group-hover:translate-x-8 group-focus-within:translate-x-8 group-hover:rotate-12 group-focus-within:rotate-12">
          <Paper
            label={`View ${data.p3}`}
            title={data.p3}
            rotation="4deg"
            isActive={activeTitle === data.p3}
            labelPosition={resolvedLabelPosition}
            onClick={() => handleView(data.p3)}
          />
        </div>

        {/* Paper 2: Center/Top */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover:-translate-y-8 group-focus-within:-translate-y-8 group-hover:rotate-3 group-focus-within:rotate-3">
          <Paper
            label={`View ${data.p2}`}
            title={data.p2}
            rotation="1deg"
            isActive={activeTitle === data.p2}
            labelPosition={resolvedLabelPosition}
            onClick={() => handleView(data.p2)}
          />
        </div>
      </div>
    </div>
  );
};
