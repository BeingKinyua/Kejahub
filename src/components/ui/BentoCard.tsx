'use client';

import React from 'react';

interface BentoCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  header?: React.ReactNode;
  title?: string;
  subtitle?: string;
  badge?: React.ReactNode;
  action?: React.ReactNode;
  footer?: React.ReactNode;
}

export const BentoCard: React.FC<BentoCardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  header,
  title,
  subtitle,
  badge,
  action,
  footer,
}) => {
  const isClickable = Boolean(onClick);

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      className={`bento-card relative flex flex-col justify-between rounded-2xl bg-white dark:bg-[#1B2622] border border-[#E2E8E5] dark:border-[#2D4039] p-5 shadow-xs transition-all duration-200 ${
        hoverable || isClickable
          ? 'hover:border-[#2F8A68] dark:hover:border-[#79C8A4] hover:shadow-md cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F8A68] dark:focus-visible:ring-[#79C8A4]'
          : ''
      } ${className}`}
    >
      {(header || title || badge || action) && (
        <div className="mb-4 flex flex-wrap items-start justify-between gap-2.5">
          {header ? (
            header
          ) : (
            <div className="min-w-0 flex-1">
              {title && (
                <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1] tracking-tight text-balance">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-0.5 text-xs text-[#64736C] dark:text-[#9EB2A9] leading-relaxed">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {(badge || action) && (
            <div className="flex flex-wrap items-center gap-2 shrink-0 max-w-full">
              {badge}
              {action}
            </div>
          )}
        </div>
      )}

      <div className="flex-1 min-w-0">{children}</div>

      {footer && (
        <div className="mt-4 pt-3 border-t border-[#E2E8E5] dark:border-[#2D4039] text-xs">
          {footer}
        </div>
      )}
    </div>
  );
};
