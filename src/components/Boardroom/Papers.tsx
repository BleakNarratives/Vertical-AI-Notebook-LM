'use client';

import React from 'react';

interface PaperProps {
  label: string;
  title: string;
  rotation?: string;
  translateY?: string;
}

const Paper: React.FC<PaperProps> = ({ label, title, rotation = '0deg', translateY = '0px' }) => {
  return (
    <button
      type="button"
      aria-label={label}
      title={title}
      style={{ transform: `rotate(${rotation}) translateY(${translateY})` }}
      className="group relative w-12 h-16 bg-white/5 border border-grey-medium transition-all hover:rotate-0 hover:translate-y-0 hover:scale-110 hover:bg-white/10 shadow-lg focus-visible:ring-2 focus-visible:ring-neon-amber outline-none overflow-hidden"
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
  return (
    <div className="flex items-end gap-4 mb-4">
      <Paper
        label="View Source Documentation"
        title="Source Docs"
        rotation="-6deg"
      />
      <div className="relative">
        <Paper
          label="View Reference Images"
          title="Ref Images"
          rotation="3deg"
          translateY="8px"
        />
        {/* Additional stacked paper look */}
        <div className="absolute top-1 left-1 w-14 h-18 bg-white/5 border border-grey-medium rotate-1 -z-10 pointer-events-none" />
      </div>
    </div>
  );
};
