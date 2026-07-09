'use client';

import React from 'react';
import { FocusIndicator } from './FocusIndicator';

interface PaperProps {
  label: string;
  title: string;
  rotation?: string;
  translateY?: string;
  isActive?: boolean;
  labelPosition?: 'top' | 'bottom';
  onClick?: () => void;
  labelPosition?: 'top' | 'bottom';
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
      <FocusIndicator color="amber" />
      {/* Paper Content Simulation */}
      <div className="absolute inset-2 flex flex-col gap-1 opacity-20 group-hover/paper:opacity-40 group-focus-visible/paper:opacity-40 transition-opacity">
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
      <span className={`absolute ${labelPosition === 'top' ? '-top-8' : '-bottom-8'} left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap z-50`}>
        {title}
      </span>

      <FocusIndicator color="amber" />
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

export const Papers: React.FC<PapersProps> = ({ context = 'user', labelPosition = 'top' }) => {
  const [activeTitle, setActiveTitle] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);
  const data = CONTEXT_DATA[context];

  // Default labelPosition based on context if not provided
  const resolvedLabelPosition = labelPosition || (context === 'user' ? 'top' : 'bottom');

  const handleView = (title: string) => {
    setActiveTitle(title);
    window.dispatchEvent(new CustomEvent('sentinel-boardroom-action', {
      detail: { source: `DOCS_${context.toUpperCase()}`, action: 'VIEW', payload: title }
    }));
    setTimeout(() => setActiveTitle(null), 2000);
  };

  const labelClass = labelPosition === 'top' ? '-top-8' : '-bottom-8';

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`h-4 flex items-center justify-center ${labelPosition === 'bottom' ? 'order-last' : ''}`} aria-live="polite">
        {activeTitle && (
          <div className="text-xs font-mono text-neon-amber animate-pulse uppercase tracking-tight">
            Viewing {activeTitle}...
          </div>
        )}
      </div>
      <div className="group/papers relative flex items-end justify-center w-24 h-24">
        {/* Paper 1: Bottom Left */}
        <div className="absolute bottom-0 left-0 transition-all duration-300 group-hover/papers:-translate-x-6 group-focus-within/papers:-translate-x-6 group-hover/papers:-rotate-6 group-focus-within/papers:-rotate-6">
          <Paper
            label={`View ${data.p1}`}
            title={data.p1}
            rotation="-2deg"
            isActive={activeTitle === data.p1}
            labelPosition={labelPosition}
            onClick={() => handleView(data.p1)}
            labelPosition={labelPosition}
          />
        </div>

        {/* Paper 3: Bottom Right (added for depth) */}
        <div className="absolute bottom-0 right-0 transition-all duration-300 group-hover/papers:translate-x-6 group-focus-within/papers:translate-x-6 group-hover/papers:rotate-6 group-focus-within/papers:rotate-6">
          <Paper
            label={`View ${data.p3}`}
            title={data.p3}
            rotation="4deg"
            isActive={activeTitle === data.p3}
            labelPosition={labelPosition}
            onClick={() => handleView(data.p3)}
            labelPosition={labelPosition}
          />
        </div>

        {/* Paper 2: Center/Top */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 transition-all duration-300 group-hover/papers:-translate-y-4 group-focus-within/papers:-translate-y-4">
          <Paper
            label={`View ${data.p2}`}
            title={data.p2}
            rotation="1deg"
            isActive={activeTitle === data.p2}
            labelPosition={labelPosition}
            onClick={() => handleView(data.p2)}
            labelPosition={labelPosition}
          />
        </div>
      </div>
    </div>
  );
};
