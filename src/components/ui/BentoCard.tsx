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
          ? 'hover:border-[#2F8A68] dark:hover:border-[#79C8A4] hover:shadow-md cursor-pointer'
          : ''
      } ${className}`}
    >
      {(header || title || badge || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          {header ? (
            header
          ) : (
            <div>
              {title && (
                <h3 className="text-sm font-bold text-[#24312D] dark:text-[#EDF5F1] tracking-tight">
                  {title}
                </h3>
              )}
              {subtitle && (
                <p className="mt-0.5 text-xs text-[#64736C] dark:text-[#9EB2A9]">
                  {subtitle}
                </p>
              )}
            </div>
          )}

          <div className="flex items-center gap-2 shrink-0">
            {badge}
            {action}
          </div>
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
