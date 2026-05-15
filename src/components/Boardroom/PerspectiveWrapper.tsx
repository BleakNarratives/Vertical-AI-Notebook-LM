'use client';
import React, { useEffect, useRef, useSyncExternalStore } from 'react';

/**
 * PerspectiveWrapper - Dynamic 3D parallax tilt for the boardroom.
 */
export const PerspectiveWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isReduced = useSyncExternalStore(
    (cb) => {
      const q = window.matchMedia('(prefers-reduced-motion: reduce)');
      q.addEventListener('change', cb);
      return () => q.removeEventListener('change', cb);
    },
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    () => false
  );

  useEffect(() => {
    if (isReduced) return;
    const move = (e: MouseEvent) => {
      if (!ref.current) return;
      const x = (e.clientX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
      ref.current.style.setProperty('--tx', `${y * 2}deg`);
      ref.current.style.setProperty('--ty', `${-x * 2}deg`);
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [isReduced]);

  return (
    <div ref={ref} className="relative w-full h-full transition-transform duration-300 ease-out transform-gpu"
      style={{ transform: isReduced ? 'rotateX(20deg)' : 'rotateX(calc(20deg + var(--tx, 0deg))) rotateY(var(--ty, 0deg))' }}
    >
      <div className="absolute -bottom-8 left-0 w-full h-8 bg-grey-dark/40 skew-x-[20deg] border-t border-grey-medium/20 pointer-events-none" />
      {children}
    </div>
  );
};
