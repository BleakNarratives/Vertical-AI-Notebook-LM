'use client';

import React, { useEffect, useRef } from 'react';

interface PerspectiveWrapperProps {
  children: React.ReactNode;
}

export const PerspectiveWrapper: React.FC<PerspectiveWrapperProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || prefersReducedMotion.matches) return;

      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 10; // Max 5deg tilt
      const y = (e.clientY / innerHeight - 0.5) * -5; // Max 2.5deg tilt

      // Update CSS variables directly to avoid React re-renders
      containerRef.current.style.setProperty('--tilt-x', `${x}deg`);
      containerRef.current.style.setProperty('--tilt-y', `${20 + y}deg`);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-5xl min-h-[75vh] border-x border-grey-dark bg-gradient-to-b from-grey-dark/10 via-obsidian to-obsidian relative transition-transform duration-300 ease-out [transform:rotateX(var(--tilt-y,20deg))_rotateY(var(--tilt-x,0deg))_translateZ(0)] transform-gpu shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)]"
    >
      {/* Table Edge (Visual reinforcement of perspective) */}
      <div className="absolute -bottom-2 left-0 w-full h-4 bg-grey-dark border-t border-grey-medium skew-x-[20deg] origin-bottom shadow-2xl pointer-events-none z-30" />

      {children}
    </div>
  );
};
