'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export interface BuildingBlocksLoaderProps {
  /**
   * Size presets:
   * - sm: ~30px (inline buttons, table cells, headers)
   * - md: ~64px (cards, section panels, modals)
   * - lg: ~96px (full-screen bootstrapping, workspace initialization)
   */
  size?: 'sm' | 'md' | 'lg';

  /**
   * Layout presentation variant:
   * - inline: inline-flex horizontal layout
   * - contained: centered block within a container / card
   * - fullscreen: viewport-covering splash screen
   */
  variant?: 'inline' | 'contained' | 'fullscreen';

  /**
   * Visible or accessible loading message
   */
  label?: string;

  /**
   * Whether to render the label visually
   */
  showLabel?: boolean;

  /**
   * When true, displays the fully assembled building with completion badge
   */
  completionState?: boolean;

  /**
   * Custom message shown during completionState
   */
  completionMessage?: string;

  /**
   * Additional custom CSS classes for the container
   */
  className?: string;
}

export const BuildingBlocksLoader: React.FC<BuildingBlocksLoaderProps> = ({
  size = 'md',
  variant = 'contained',
  label = 'Preparing your workspace…',
  showLabel = true,
  completionState = false,
  completionMessage = 'Your workspace is ready',
  className = '',
}) => {
  // Sizing configurations
  const sizeConfig = {
    sm: {
      box: 'w-7.5 h-7.5', // 30px
      gap: 'gap-0.5',
      roofBeamH: 'h-0.5',
      roofBeamTop: '-top-1.5',
      textSize: 'text-xs',
      subtextSize: 'text-[10px]',
      badgeSize: 'w-3 h-3',
    },
    md: {
      box: 'w-16 h-16', // 64px
      gap: 'gap-1',
      roofBeamH: 'h-1',
      roofBeamTop: '-top-2.5',
      textSize: 'text-sm font-semibold',
      subtextSize: 'text-xs',
      badgeSize: 'w-4 h-4',
    },
    lg: {
      box: 'w-24 h-24', // 96px
      gap: 'gap-1.5',
      roofBeamH: 'h-1.5',
      roofBeamTop: '-top-3.5',
      textSize: 'text-base font-bold',
      subtextSize: 'text-xs',
      badgeSize: 'w-5 h-5',
    },
  }[size];

  const effectiveLabel = completionState ? completionMessage : label;

  // The 9 modular building blocks representing the 3x3 architectural grid
  const blocks = [
    // Row 3: Top floor (Upper floor)
    { id: 1, key: 'b1', className: 'kb-block-1 bg-[var(--kb-block-primary)]' },
    { id: 2, key: 'b2', className: 'kb-block-2 bg-[var(--kb-block-accent)]' }, // Architectural accent
    { id: 3, key: 'b3', className: 'kb-block-3 bg-[var(--kb-block-primary)]' },

    // Row 2: Middle floor (Structure & Windows)
    { id: 4, key: 'b4', className: 'kb-block-4 bg-[var(--kb-block-primary)]', hasWindow: true },
    { id: 5, key: 'b5', className: 'kb-block-5 bg-[var(--kb-block-subtle)]' }, // Central structural core
    { id: 6, key: 'b6', className: 'kb-block-6 bg-[var(--kb-block-primary)]', hasWindow: true },

    // Row 1: Ground floor (Foundation & Doorway)
    { id: 7, key: 'b7', className: 'kb-block-7 bg-[var(--kb-block-primary)]' },
    { id: 8, key: 'b8', className: 'kb-block-8 bg-[var(--kb-block-accent)]', hasDoor: true }, // Entrance
    { id: 9, key: 'b9', className: 'kb-block-9 bg-[var(--kb-block-primary)]' },
  ];

  // The Building Graphic
  const BuildingGraphic = (
    <div
      className={`relative ${sizeConfig.box} shrink-0 select-none ${
        completionState ? 'kb-building-completed' : ''
      }`}
      aria-hidden="true"
    >
      {/* 3x3 Architectural Grid */}
      <div
        className={`kb-building-grid w-full h-full ${sizeConfig.gap} ${
          completionState ? 'kb-building-completed' : ''
        }`}
      >
        {/* Roofline lintel */}
        <div className="kb-roofline">
          <div className="kb-roofline-beam" />
        </div>

        {/* Shimmer sweep overlay during completion */}
        {!completionState && <div className="kb-shimmer-overlay" />}

        {/* The 9 Blocks */}
        {blocks.map((block) => (
          <div
            key={block.key}
            className={`kb-block ${block.className}`}
          >
            {/* Window inset in Middle Floor */}
            {block.hasWindow && <span className="kb-window" />}

            {/* Entrance Doorway in Ground Floor */}
            {block.hasDoor && <span className="kb-doorway" />}
          </div>
        ))}
      </div>

      {/* Completion confirmation badge */}
      {completionState && (
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#1B2622] rounded-full p-0.5 shadow-md border border-emerald-500/30 animate-in zoom-in-75 duration-300">
          <CheckCircle2 className={`${sizeConfig.badgeSize} text-emerald-600 dark:text-emerald-400`} />
        </div>
      )}
    </div>
  );

  // Accessible screen-reader announcement
  const AccessibleText = (
    <span className="sr-only" role="status" aria-live="polite">
      {effectiveLabel}
    </span>
  );

  // 1. INLINE VARIANT: Compact horizontal row for buttons & chips
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-2.5 ${className}`}>
        {BuildingGraphic}
        {AccessibleText}
        {showLabel && (
          <span className={`truncate text-[#24312D] dark:text-[#EDF5F1] ${sizeConfig.textSize}`}>
            {effectiveLabel}
          </span>
        )}
      </span>
    );
  }

  // 2. FULLSCREEN VARIANT: Full-screen branded loading experience
  if (variant === 'fullscreen') {
    return (
      <div
        role="status"
        aria-live="polite"
        className={`fixed inset-0 z-50 bg-[#F6F8F6] dark:bg-[#111A17] flex flex-col items-center justify-center p-6 text-center transition-colors duration-200 ${className}`}
      >
        {AccessibleText}

        {/* Centered building animation */}
        <div className="p-6 rounded-3xl bg-white/60 dark:bg-[#1B2622]/60 backdrop-blur-md border border-[#E2E8E5] dark:border-[#2D4039] shadow-sm flex flex-col items-center justify-center">
          {BuildingGraphic}
        </div>

        {/* Brand identity & typography */}
        <div className="mt-5 space-y-1">
          <div className="flex items-center justify-center gap-2">
            <span className="w-6 h-6 rounded-lg bg-[#173C32] dark:bg-[#79C8A4] flex items-center justify-center text-white dark:text-[#111A17] text-xs font-black tracking-wider">
              K
            </span>
            <span className="text-base font-extrabold tracking-tight text-[#24312D] dark:text-[#EDF5F1]">
              KEJAHUB
            </span>
          </div>

          {showLabel && (
            <p className="text-xs sm:text-sm font-medium text-[#64736C] dark:text-[#9EB2A9] mt-1">
              {effectiveLabel}
            </p>
          )}

          <p className="text-[11px] text-[#64736C]/60 dark:text-[#9EB2A9]/60 font-mono tracking-tight pt-1">
            Kenya Property AI Operations
          </p>
        </div>
      </div>
    );
  }

  // 3. CONTAINED VARIANT (Default): Panel, card, or sectional loader
  return (
    <div
      role="status"
      aria-live="polite"
      className={`w-full py-8 px-4 flex flex-col items-center justify-center text-center ${className}`}
    >
      {AccessibleText}
      {BuildingGraphic}
      {showLabel && (
        <p className={`mt-3 text-[#64736C] dark:text-[#9EB2A9] ${sizeConfig.textSize}`}>
          {effectiveLabel}
        </p>
      )}
    </div>
  );
};
