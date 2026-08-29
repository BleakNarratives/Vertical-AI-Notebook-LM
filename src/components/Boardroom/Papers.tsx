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
      aria-pressed={isActive}
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

interface DocumentPreviewProps {
  title: string;
  content: string;
  onClose: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({ title, content, onClose }) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const previousFocusRef = React.useRef<HTMLElement | null>(null);
  const onCloseRef = React.useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    // Capture previous focus
    if (typeof document !== 'undefined') {
      previousFocusRef.current = document.activeElement as HTMLElement;
    }

    // Shift focus to close button
    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCloseRef.current();
        return;
      }

      if (e.key === 'Tab' && modalRef.current) {
        const focusables = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      // Restore previous focus on unmount
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === 'function') {
        previousFocusRef.current.focus();
      }
    };
  }, []);

  return createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center bg-obsidian/90 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-title"
      aria-describedby="preview-content"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-lg p-8 bg-obsidian border border-neon-amber/30 shadow-[0_0_50px_rgba(255,191,0,0.2)] transition-transform duration-500 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-amber/50 to-transparent" />

        <header className="flex justify-between items-start mb-8">
          <div className="space-y-1">
            <h2 id="preview-title" className="text-neon-amber font-mono text-lg tracking-widest uppercase">{title}</h2>
            <div className="text-[10px] font-mono text-grey-medium uppercase tracking-tighter">Classification: Restricted / Obelisk-Internal</div>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="text-neon-amber/60 hover:text-neon-amber transition-colors font-mono text-xs uppercase cursor-pointer focus-visible:ring-2 focus-visible:ring-neon-amber outline-none p-1"
            aria-label="Close Preview"
          >
            [ ESC ]
          </button>
        </header>

        <div id="preview-content" className="space-y-4 font-mono text-xs text-grey-medium leading-relaxed">
          {content.split('\n').map((line, i) => (
            <p key={i} className={line.startsWith('>') ? 'text-neon-red/80' : ''}>
              {line}
            </p>
          ))}
        </div>

        <div className="mt-12 flex justify-between items-end">
          <div className="text-[8px] font-mono text-grey-medium/40">
            SYSTEM_LINK_ACTIVE // PORTAL_RENDERED_V0.1
          </div>
          <div className="w-16 h-16 border border-grey-medium/20 opacity-20 relative overflow-hidden">
             <div className="absolute top-2 left-2 right-2 h-0.5 bg-grey-medium" />
             <div className="absolute top-4 left-2 right-4 h-0.5 bg-grey-medium" />
             <div className="absolute bottom-2 right-2 w-4 h-4 border border-neon-red/40" />
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-amber/50 to-transparent" />
      </div>
    </div>,
    document.body
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
  const [statusTitle, setStatusTitle] = React.useState<string | null>(null);
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

  const handleView = useCallback((title: string) => {
    setStatusTitle(title);
    setActiveDoc(title);
    window.dispatchEvent(new CustomEvent('sentinel-boardroom-action', {
      detail: { source: `DOCS_${context.toUpperCase()}`, action: 'VIEW', payload: title, timestamp: new Date().toISOString() }
    }));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => setStatusTitle(null), 2000);
  }, [context]);

  return (
    <div className="flex flex-col items-center gap-16">
      {/* Document Overlay */}
      {activeDoc && (
        <DocumentPreview
          title={activeDoc}
          content={DOC_CONTENT[activeDoc] || 'No content found.'}
          onClose={closeDoc}
        />
      )}

      <div className={`h-4 flex items-center justify-center ${resolvedLabelPosition === 'bottom' ? 'order-last' : ''}`} aria-live="polite">
        {statusTitle && (
          <div className="text-xs font-mono text-neon-amber animate-pulse uppercase tracking-tight">
            Viewing {statusTitle}...
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
            isActive={statusTitle === data.p1 || activeDoc === data.p1}
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
            isActive={statusTitle === data.p3 || activeDoc === data.p3}
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
            isActive={statusTitle === data.p2 || activeDoc === data.p2}
            labelPosition={resolvedLabelPosition}
            onClick={() => handleView(data.p2)}
          />
        </div>
      </div>
    </div>
  );
};
