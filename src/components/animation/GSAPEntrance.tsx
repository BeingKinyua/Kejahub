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
  stagger = 0.05,
  delay = 0.05,
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
            y: 18,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            stagger,
            delay,
            ease: 'power3.out',
            clearProps: 'transform',
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
