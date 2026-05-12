'use client';

import React, { useEffect, useRef, useState } from 'react';

interface PerspectiveWrapperProps {
  children: React.ReactNode;
}

export const PerspectiveWrapper: React.FC<PerspectiveWrapperProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      // Calculate rotation based on mouse position (normalized -1 to 1)
      const xRot = ((clientY / innerHeight) - 0.5) * 4; // Tilt X: -2deg to 2deg
      const yRot = ((clientX / innerWidth) - 0.5) * -4; // Tilt Y: 2deg to -2deg

      containerRef.current.style.setProperty('--tilt-x', `${xRot}deg`);
      containerRef.current.style.setProperty('--tilt-y', `${yRot}deg`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion]);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl min-h-[75vh] border-x border-grey-dark bg-gradient-to-b from-grey-dark/10 via-obsidian to-obsidian relative transform-gpu shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] transition-transform duration-75 ease-out"
      style={{
        transform: reducedMotion
          ? 'rotateX(20deg)'
          : 'rotateX(calc(20deg + var(--tilt-x, 0deg))) rotateY(var(--tilt-y, 0deg)) translateZ(0)'
      }}
    >
      {/* Table Edge Reinforcement */}
      <div className="absolute -bottom-4 left-0 w-full h-4 bg-grey-dark border-x border-b border-grey-medium skew-x-[20deg] origin-top transform-gpu pointer-events-none opacity-40" />

      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-red to-transparent opacity-30" />

      {/* Perspective Background Elements - Simulated Table Surface */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,transparent_0%,rgba(10,10,10,0.8)_100%)]" />
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20 [mask-image:linear-gradient(to_top,black_20%,transparent_80%)]" />
      <div className="absolute -bottom-20 -left-20 -right-20 h-40 bg-obsidian blur-3xl opacity-50 -z-10" />

      {children}
    </div>
  );
};
