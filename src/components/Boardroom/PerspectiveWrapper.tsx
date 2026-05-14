'use client';

import React, { useRef, useSyncExternalStore, useEffect } from 'react';

const subscribe = (callback: () => void) => {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  mql.addEventListener('change', callback);
  return () => mql.removeEventListener('change', callback);
};

const getSnapshot = () => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

const getServerSnapshot = () => {
  return false;
};

interface PerspectiveWrapperProps {
  children: React.ReactNode;
}

export const PerspectiveWrapper: React.FC<PerspectiveWrapperProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate tilt based on mouse position (max 2 degrees)
      const xPercent = (clientX / innerWidth - 0.5) * 2;
      const yPercent = (clientY / innerHeight - 0.5) * 2;

      const tiltX = yPercent * -2; // Tilt up/down
      const tiltY = xPercent * 2;  // Tilt left/right

      containerRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
      containerRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl min-h-[75vh] border-x border-grey-dark bg-gradient-to-b from-grey-dark/10 via-obsidian to-obsidian relative [transform:rotateX(calc(20deg_+_var(--tilt-x,0deg)))_rotateY(var(--tilt-y,0deg))_translateZ(0)] transform-gpu shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] transition-transform duration-300 ease-out"
    >
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-30" />

      {/* Perspective Background Elements - Simulated Table Surface */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [mask-image:linear-gradient(to_top,black_20%,transparent_80%)]" />

      {/* Table Edge Reinforcement */}
      <div className="absolute -bottom-2 left-0 right-0 h-4 bg-grey-dark/40 border-b border-grey-medium/20 [transform:rotateX(-40deg)_skewX(var(--tilt-y,0deg))] origin-top pointer-events-none" />

      <div className="absolute -bottom-20 -left-20 -right-20 h-40 bg-obsidian blur-3xl opacity-50 -z-10" />

      {children}
    </div>
  );
};
