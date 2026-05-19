'use client';
import React, { useEffect, useRef, useSyncExternalStore } from 'react';

/**
 * PerspectiveWrapper - Dynamic 3D parallax tilt for the boardroom.
 */
const motionQuery = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

export const PerspectiveWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const isReduced = useSyncExternalStore(
    (cb) => {
      motionQuery?.addEventListener('change', cb);
      return () => motionQuery?.removeEventListener('change', cb);
    },
    () => motionQuery?.matches ?? false,
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

    const handleFocus = (e: FocusEvent) => {
      if (!ref.current || !(e.target instanceof Element) || !ref.current.contains(e.target)) return;
      const rect = e.target.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = (centerX - window.innerWidth / 2) / (window.innerWidth / 2);
      const y = (centerY - window.innerHeight / 2) / (window.innerHeight / 2);

      ref.current.style.setProperty('--tx', `${y * 2}deg`);
      ref.current.style.setProperty('--ty', `${-x * 2}deg`);
      ref.current.style.setProperty('--tz', '20px');
    };

    const handleFocusOut = (e: FocusEvent) => {
      if (!ref.current || (e.relatedTarget instanceof Element && ref.current.contains(e.relatedTarget))) return;
      ref.current.style.setProperty('--tz', '0px');
    };

    window.addEventListener('mousemove', move);
    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleFocusOut);
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleFocusOut);
    };
  }, [isReduced]);

  return (
    <div ref={ref} className="relative w-full h-full transition-transform duration-300 ease-out transform-gpu"
      style={{ transform: isReduced ? 'rotateX(20deg)' : 'rotateX(calc(20deg + var(--tx, 0deg))) rotateY(var(--ty, 0deg)) translateZ(var(--tz, 0px))' }}
    >
      <div className="absolute -bottom-8 left-0 w-full h-8 bg-grey-dark/40 skew-x-[20deg] border-t border-grey-medium/20 pointer-events-none" />
      {children}
    </div>
  );
};
