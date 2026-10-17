import React, { useState, useRef, useEffect } from 'react';
import { useProperty } from '../../context/PropertyContext';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Sun,
  Moon,
  Laptop,
  User,
  LogOut,
  ChevronDown,
  Building,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';

interface TopBarProps {
  onToggleMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileMenu }) => {
  const {
    workspaceConfig,
    properties,
    selectedPropertyId,
    setSelectedPropertyId,
    searchQuery,
    setSearchQuery,
    currentUser,
    signOut,
    theme,
    setTheme,
    setIsAssistantOpen,
    setCurrentScreen,
    agentTasks,
    maintenanceTickets,
  } = useProperty();

  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const pendingApprovalsCount = agentTasks.filter((t) => t.status === 'AWAITING_APPROVAL').length;
  const pendingMaintCount = maintenanceTickets.filter((m) => m.status === 'AWAITING_APPROVAL').length;
  const totalAlerts = pendingApprovalsCount + pendingMaintCount;

  return (
    <header className="h-16 bg-white dark:bg-[#1B2622] border-b border-[#E2E8E5] dark:border-[#2D4039] px-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
      {/* Left side: Mobile menu toggle + Workspace context + Property filter */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          aria-label="Open mobile navigation"
          className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Portfolio / Property Selector */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 font-medium">
            <Building className="w-3.5 h-3.5 text-[#2F8A68] dark:text-[#79C8A4]" />
            <span className="truncate max-w-[140px] font-semibold text-gray-800 dark:text-gray-200">
              {workspaceConfig.workspaceName}
            </span>
            <span className="text-gray-300 dark:text-gray-600">/</span>
          </div>

          <select
            value={selectedPropertyId || ''}
            onChange={(e) => setSelectedPropertyId(e.target.value || null)}
            aria-label="Filter by property"
            className="text-xs sm:text-sm font-medium bg-[#F6F8F6] dark:bg-[#24332D] text-gray-800 dark:text-gray-200 border border-[#E2E8E5] dark:border-[#2D4039] rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
          >
            <option value="">All Properties ({properties.length})</option>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Center: Global Search */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search units, tenants (e.g. Wanjiku), M-Pesa refs..."
            className="w-full pl-9 pr-4 py-1.5 text-xs sm:text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2F8A68] transition-all"
          />
        </div>
      </div>

      {/* Right side: Ask Agent + Notifications + Theme + Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Ask the Agent Primary Action */}
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95"
          aria-label="Ask the AI Property Agent"
        >
          <Sparkles className="w-4 h-4 text-emerald-300 dark:text-[#111A17]" />
          <span className="hidden sm:inline">Ask Agent</span>
        </button>

        {/* Notifications Popover */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="View notifications"
            className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 relative transition-colors"
          >
            <Bell className="w-5 h-5" />
            {totalAlerts > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1B2622]" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#202D28] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <span className="font-semibold text-xs text-gray-900 dark:text-gray-100">Action Queue Notifications</span>
                <span className="text-[11px] font-medium bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full">
                  {totalAlerts} Pending
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-800">
                {agentTasks.filter((t) => t.status === 'AWAITING_APPROVAL').map((t) => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setCurrentScreen('agent');
                      setNotificationsOpen(false);
                    }}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      <Sparkles className="w-3.5 h-3.5" /> Agent Action Awaiting Signoff
                    </div>
                    <p className="text-xs text-gray-800 dark:text-gray-200 mt-1 line-clamp-2">{t.title}</p>
                    <span className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Requires Landlord authorization
                    </span>
                  </div>
                ))}

                {maintenanceTickets.filter((m) => m.status === 'AWAITING_APPROVAL').map((m) => (
                  <div
                    key={m.id}
                    onClick={() => {
                      setCurrentScreen('maintenance');
                      setNotificationsOpen(false);
                    }}
                    className="p-3 hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
                      <Clock className="w-3.5 h-3.5" /> High-Cost Maintenance Signoff
                    </div>
                    <p className="text-xs text-gray-800 dark:text-gray-200 mt-1">{m.title} (KES {m.estimatedCost.toLocaleString()})</p>
                  </div>
                ))}

                {totalAlerts === 0 && (
                  <div className="p-6 text-center text-xs text-gray-500 dark:text-gray-400">
                    <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
                    All items cleared! No pending approvals.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            aria-label="User profile menu"
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#173C32] dark:bg-[#79C8A4] text-white dark:text-[#111A17] flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/30">
              {currentUser.name.charAt(0)}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-gray-400 hidden sm:block" />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#202D28] border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Profile Header */}
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{currentUser.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                <span className="inline-block mt-1 text-[10px] font-semibold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded">
                  {currentUser.role}
                </span>
              </div>

              {/* Theme Selector */}
              <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Theme Appearance
                </span>
                <div className="grid grid-cols-3 gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                  <button
                    onClick={() => setTheme('light')}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-xs font-medium transition-all ${
                      theme === 'light' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <Sun className="w-3 h-3" /> Light
                  </button>
                  <button
                    onClick={() => setTheme('dark')}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-xs font-medium transition-all ${
                      theme === 'dark' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <Moon className="w-3 h-3" /> Dark
                  </button>
                  <button
                    onClick={() => setTheme('system')}
                    className={`flex items-center justify-center gap-1 py-1 rounded text-xs font-medium transition-all ${
                      theme === 'system' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-xs' : 'text-gray-500 dark:text-gray-400'
                    }`}
                  >
                    <Laptop className="w-3 h-3" /> System
                  </button>
                </div>
              </div>

              {/* Menu items */}
              <div className="py-1">
                <button
                  onClick={() => {
                    setCurrentScreen('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5"
                >
                  <User className="w-4 h-4 text-gray-400" /> Account Settings
                </button>
                <button
                  onClick={() => {
                    setCurrentScreen('onboarding');
                    setProfileOpen(false);
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2.5"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" /> Launch Onboarding Wizard
                </button>
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    signOut();
                  }}
                  className="w-full px-4 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
