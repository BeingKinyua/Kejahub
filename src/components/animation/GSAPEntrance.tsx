'use client';

import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface GSAPEntranceProps {
  children: React.ReactNode;
  selector?: string;
  stagger?: number;
  delay?: number;
  className?: string;
}

export const GSAPEntrance: React.FC<GSAPEntranceProps> = ({
  children,
  selector = '.bento-card',
  stagger = 0.025,
  delay = 0,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Respect reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const elements = containerRef.current?.querySelectorAll(selector);
      if (elements && elements.length > 0) {
        gsap.fromTo(
          elements,
          {
            opacity: 0,
            y: 8,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.24,
            stagger,
            delay,
            ease: 'power2.out',
            clearProps: 'opacity,transform',
          }
        );
      }
    }, containerRef);

    return () => ctx.revert();
  }, [selector, stagger, delay]);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
