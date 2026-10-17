import React, { useState } from 'react';
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
  Shield,
  HelpCircle,
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
  const { currentScreen, setCurrentScreen, agentTasks, maintenanceTickets, transactions, currentUser } = useProperty();

  const pendingTasksCount = agentTasks.filter((t) => t.status === 'AWAITING_APPROVAL').length;
  const unallocatedCount = transactions.filter((t) => t.status === 'UNALLOCATED').length;
  const pendingMaintCount = maintenanceTickets.filter((m) => m.status === 'AWAITING_APPROVAL' || m.status === 'NEW').length;

  const navItems: { id: ScreenId; label: string; icon: React.ElementType; badge?: number; badgeColor?: string; rolesAllowed?: string[] }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'properties', label: 'Properties', icon: Building2 },
    { id: 'tenants', label: 'Tenants', icon: Users },
    { id: 'payments', label: 'Payments', icon: Receipt, badge: unallocatedCount, badgeColor: 'bg-amber-500' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, badge: pendingMaintCount, badgeColor: 'bg-blue-500' },
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
          <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => handleNavClick('overview')}>
            <div className="w-10 h-10 rounded-xl bg-[#2F8A68] dark:bg-[#79C8A4] flex items-center justify-center shrink-0 shadow-md">
              <span className="font-extrabold text-white dark:text-[#111A17] text-lg tracking-wider">K</span>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  KEJAHUB
                  <span className="text-[10px] uppercase font-semibold bg-[#2F8A68]/60 text-emerald-200 px-1.5 py-0.5 rounded">
                    AI
                  </span>
                </span>
                <span className="text-[11px] text-emerald-200/70 truncate">Kenyan Property Agent</span>
              </div>
            )}
          </div>

          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-[#245245] hover:bg-[#2F8A68] text-white items-center justify-center transition-colors"
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1.5" aria-label="Sidebar Menu">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[#2F8A68] text-white shadow-sm font-semibold'
                    : 'text-emerald-100/80 hover:bg-[#245245] hover:text-white'
                } ${collapsed ? 'justify-center' : ''}`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />

                {!collapsed && <span className="truncate flex-1 text-left">{item.label}</span>}

                {/* Badges */}
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`${item.badgeColor || 'bg-emerald-600'} text-white text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      collapsed ? 'absolute top-1 right-2 w-2.5 h-2.5 p-0 ring-2 ring-[#173C32]' : ''
                    }`}
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
            <div
              onClick={() => handleNavClick('agent')}
              className="bg-[#245245]/70 hover:bg-[#245245] p-3 rounded-xl cursor-pointer transition-all border border-emerald-500/20"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> Agent Sentinel
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[11px] text-emerald-100/70 leading-relaxed">
                {pendingTasksCount > 0
                  ? `${pendingTasksCount} actions awaiting your review`
                  : 'Automations active & guarding portfolio'}
              </p>
            </div>
          ) : (
            <button
              onClick={() => handleNavClick('agent')}
              title="Agent Sentinel Status"
              className="w-full flex justify-center py-2 text-emerald-300 hover:text-white"
            >
              <Sparkles className="w-5 h-5" />
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
