import React, { useEffect } from 'react';
import { useProperty } from '../../context/PropertyContext';
import { ScreenId } from '../../types';
import {
  LayoutDashboard,
  Building2,
  Users,
  Receipt,
  Wrench,
  CreditCard,
  BarChart3,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) => {
  const { currentScreen, setCurrentScreen, agentTasks, maintenanceTickets, transactions } = useProperty();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen, setMobileOpen]);

  const pendingTasksCount = agentTasks.filter((t) => t.status === 'AWAITING_APPROVAL').length;
  const unallocatedCount = transactions.filter((t) => t.status === 'UNALLOCATED').length;
  const pendingMaintCount = maintenanceTickets.filter((m) => m.status === 'AWAITING_APPROVAL' || m.status === 'NEW').length;

  const navItems: { id: ScreenId; label: string; icon: React.ElementType; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'payments', label: 'Payments', icon: Receipt, badge: unallocatedCount, badgeColor: 'bg-amber-600' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: pendingMaintCount, badgeColor: 'bg-blue-600' },
    { id: 'expenses', label: 'Expenses', icon: CreditCard },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'agent', label: 'AI Agent', icon: Bot, badge: pendingTasksCount, badgeColor: 'bg-emerald-600' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (screen: ScreenId) => {
    setCurrentScreen(screen);
    if (mobileOpen) setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-xs"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 bg-[#173C32] dark:bg-[#15221D] text-white flex flex-col transition-all duration-300 ease-in-out border-r border-[#245245] dark:border-[#22352D] ${
          collapsed ? 'w-20' : 'w-64'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
        aria-label="Main Navigation"
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-[#245245] dark:border-[#22352D]">
          <button
            type="button"
            onClick={() => handleNavClick('overview')}
            aria-label="Kejahub Overview"
            className="flex items-center gap-3 overflow-hidden text-left cursor-pointer rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79C8A4]"
          >
            <div className="w-10 h-10 rounded-xl bg-[#2F8A68] dark:bg-[#79C8A4] flex items-center justify-center shrink-0 shadow-md">
              <span className="font-extrabold text-white dark:text-[#111A17] text-lg tracking-wider" aria-hidden="true">K</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-lg tracking-tight text-white leading-tight whitespace-nowrap">
                  Kejahub
                </span>
                <span className="text-[11px] text-emerald-100/80 truncate">Kenyan Property Agent</span>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            aria-expanded={!collapsed}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-[#245245] hover:bg-[#2F8A68] text-white items-center justify-center transition-colors cursor-pointer shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79C8A4]"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" aria-hidden="true" />
            ) : (
              <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5" aria-label="Sidebar Menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            const hasBadge = item.badge !== undefined && item.badge > 0;
            const accessibleLabel = hasBadge ? `${item.label} (${item.badge} pending)` : item.label;

            return (
              <button
                type="button"
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? accessibleLabel : undefined}
                aria-label={collapsed ? accessibleLabel : undefined}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 min-h-[42px] rounded-xl text-sm font-medium transition-all group relative cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79C8A4] ${
                  isActive
                    ? 'bg-[#2F8A68] text-white shadow-sm font-semibold'
                    : 'text-emerald-100/85 hover:bg-[#245245] hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`}
                  aria-hidden="true"
                />

                {!collapsed && <span className="truncate whitespace-nowrap flex-1 text-left">{item.label}</span>}

                {hasBadge && (
                  <span
                    className={`${item.badgeColor || 'bg-emerald-600'} text-white text-[11px] font-bold tabular-nums px-1.5 py-0.5 shrink-0 ${
                      collapsed ? 'absolute top-1.5 right-2 w-2.5 h-2.5 p-0 rounded-full ring-2 ring-[#173C32]' : 'rounded-md'
                    }`}
                    aria-hidden={collapsed ? 'true' : undefined}
                  >
                    {!collapsed && item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* AI Agent Status Footer Box */}
        <div className="p-3 border-t border-[#245245] dark:border-[#22352D]">
          {!collapsed ? (
            <button
              type="button"
              onClick={() => handleNavClick('agent')}
              className="w-full text-left bg-[#245245]/70 hover:bg-[#245245] p-3 rounded-xl cursor-pointer transition-all border border-emerald-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79C8A4]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" aria-hidden="true" /> Agent Sentinel
                </span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-300/90" aria-hidden="true" />
              </div>
              <p className="text-[11px] text-emerald-100/80 leading-relaxed tabular-nums">
                {pendingTasksCount > 0
                  ? `${pendingTasksCount} actions awaiting your review`
                  : 'Automations active & guarding portfolio'}
              </p>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleNavClick('agent')}
              title="Agent Sentinel Status"
              aria-label="Open Agent Sentinel Status"
              className="w-full flex justify-center py-2.5 rounded-xl text-emerald-300 hover:text-white hover:bg-[#245245] cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#79C8A4]"
            >
              <Sparkles className="w-5 h-5" aria-hidden="true" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
