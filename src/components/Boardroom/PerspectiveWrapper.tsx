'use client';
import React, { useEffect, useRef, useSyncExternalStore } from 'react';

const sub = (cb: () => void) => {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getSnap = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const PerspectiveWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useSyncExternalStore(sub, getSnap, () => false);

  useEffect(() => {
    if (reduced) return;
    const handleMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      ref.current?.style.setProperty('--tilt-x', `${20 - y * 2}deg`);
      ref.current?.style.setProperty('--tilt-y', `${x * 2}deg`);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [reduced]);

  return (
    <div
      ref={ref}
      style={{
        transform: reduced ? 'rotateX(20deg)' : 'rotateX(var(--tilt-x, 20deg)) rotateY(var(--tilt-y, 0deg))',
        transition: 'transform 0.1s ease-out'
      } as React.CSSProperties}
      className="w-full max-w-5xl min-h-[75vh] border-x border-grey-dark bg-gradient-to-b from-grey-dark/10 via-obsidian to-obsidian relative transform-gpu shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
    >
      <div className="absolute -bottom-4 left-0 w-full h-8 bg-grey-dark border-t border-grey-medium skew-x-[20deg] origin-bottom opacity-40 pointer-events-none" />
      {children}
    </div>
  );
};
