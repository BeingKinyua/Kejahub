import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  X,
  ArrowRight,
} from 'lucide-react';

interface TopBarProps {
  onToggleMobileMenu: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({ onToggleMobileMenu }) => {
  const {
    workspaceConfig,
    properties,
    units,
    tenants,
    transactions,
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileOpen(false);
        setNotificationsOpen(false);
        setSearchFocused(false);
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const quickResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const results: { id: string; title: string; subtitle: string; screen: 'properties' | 'tenants' | 'payments' }[] = [];

    tenants
      .filter((t) => t.name.toLowerCase().includes(q) || t.phone.toLowerCase().includes(q))
      .slice(0, 3)
      .forEach((t) => {
        const u = units.find((unit) => unit.id === t.assignedUnitId);
        results.push({
          id: `ten-${t.id}`,
          title: t.name,
          subtitle: `Tenant • ${u ? `Unit ${u.unitNumber}` : t.phone}`,
          screen: 'tenants',
        });
      });

    transactions
      .filter(
        (tx) =>
          tx.referenceNumber.toLowerCase().includes(q) ||
          (tx.senderName && tx.senderName.toLowerCase().includes(q))
      )
      .slice(0, 3)
      .forEach((tx) => {
        results.push({
          id: `tx-${tx.id}`,
          title: `${tx.referenceNumber} • KES ${tx.amount.toLocaleString()}`,
          subtitle: `${tx.channel} • ${tx.senderName || 'Unmatched'}`,
          screen: 'payments',
        });
      });

    properties
      .filter((p) => !p.archived && (p.name.toLowerCase().includes(q) || p.location.toLowerCase().includes(q)))
      .slice(0, 2)
      .forEach((p) => {
        results.push({
          id: `prop-${p.id}`,
          title: p.name,
          subtitle: `Property • ${p.location}`,
          screen: 'properties',
        });
      });

    return results.slice(0, 6);
  }, [searchQuery, tenants, units, transactions, properties]);

  const pendingApprovalsCount = agentTasks.filter((t) => t.status === 'AWAITING_APPROVAL').length;
  const pendingMaintCount = maintenanceTickets.filter((m) => m.status === 'AWAITING_APPROVAL').length;
  const totalAlerts = pendingApprovalsCount + pendingMaintCount;

  return (
    <header className="bg-white dark:bg-[#1B2622] border-b border-[#E2E8E5] dark:border-[#2D4039] sticky top-0 z-30 transition-colors">
      <div className="h-16 px-4 flex items-center justify-between gap-2">
        {/* Left side: Mobile menu toggle + Workspace context + Property filter */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label="Open mobile navigation"
            className="lg:hidden p-2.5 rounded-lg text-[#24312D] dark:text-[#EDF5F1] hover:bg-gray-100 dark:hover:bg-[#24332D] cursor-pointer shrink-0"
          >
            <Menu className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Portfolio / Property Selector */}
          <div className="flex items-center gap-2 min-w-0">
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#64736C] dark:text-[#9EB2A9] font-medium min-w-0">
              <Building className="w-3.5 h-3.5 text-[#2F8A68] dark:text-[#79C8A4] shrink-0" aria-hidden="true" />
              <span className="truncate max-w-[140px] font-semibold text-[#24312D] dark:text-[#EDF5F1]">
                {workspaceConfig.workspaceName}
              </span>
              <span className="text-[#64736C] dark:text-[#9EB2A9]" aria-hidden="true">/</span>
            </div>

            <select
              value={selectedPropertyId || ''}
              onChange={(e) => setSelectedPropertyId(e.target.value || null)}
              aria-label="Filter by property"
              className="text-xs sm:text-sm font-medium bg-[#F6F8F6] dark:bg-[#24332D] text-[#24312D] dark:text-[#EDF5F1] border border-[#E2E8E5] dark:border-[#2D4039] rounded-lg px-2.5 py-1.5 max-w-[132px] sm:max-w-xs truncate cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
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

        {/* Center: Global Search (Desktop) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative" ref={searchRef}>
          <div className="relative w-full">
            <Search className="w-4 h-4 text-[#64736C] dark:text-[#9EB2A9] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchFocused(true);
              }}
              aria-label="Global portfolio search"
              placeholder="Search units, tenants (e.g. Wanjiku), M-Pesa refs..."
              className="w-full pl-9 pr-8 py-1.5 text-xs sm:text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-lg text-[#24312D] dark:text-[#EDF5F1] placeholder-[#64736C] dark:placeholder-[#9EB2A9] focus:outline-none focus:ring-2 focus:ring-[#2F8A68] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear global search"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            )}
          </div>

          {searchFocused && searchQuery.trim().length > 0 && (
            <div
              role="region"
              aria-label="Quick search results"
              className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl shadow-xl py-1.5 z-50"
            >
              {quickResults.length > 0 ? (
                <div className="divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
                  {quickResults.map((res) => (
                    <button
                      type="button"
                      key={res.id}
                      onClick={() => {
                        setCurrentScreen(res.screen);
                        setSearchFocused(false);
                      }}
                      className="w-full px-3.5 py-2.5 text-left hover:bg-[#F6F8F6] dark:hover:bg-[#24332D] flex items-center justify-between gap-2 transition-colors cursor-pointer"
                    >
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-[#24312D] dark:text-[#EDF5F1] truncate">
                          {res.title}
                        </div>
                        <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] truncate">
                          {res.subtitle}
                        </div>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-[#267256] dark:text-[#79C8A4] shrink-0" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-3 text-xs text-[#64736C] dark:text-[#9EB2A9]">
                  No portfolio matches for &ldquo;{searchQuery}&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side: Mobile Search Toggle + Ask Agent + Notifications + Profile */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Mobile Search Toggle */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            aria-label={mobileSearchOpen ? 'Close search' : 'Open search'}
            aria-expanded={mobileSearchOpen}
            className="md:hidden p-2 rounded-lg text-[#24312D] dark:text-[#EDF5F1] hover:bg-gray-100 dark:hover:bg-[#24332D] cursor-pointer transition-colors"
          >
            <Search className="w-5 h-5" aria-hidden="true" />
          </button>

          {/* Ask the Agent Primary Action */}
          <button
            type="button"
            onClick={() => setIsAssistantOpen(true)}
            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 min-h-[36px] bg-[#173C32] hover:bg-[#245245] dark:bg-[#79C8A4] dark:hover:bg-[#93D6B7] text-white dark:text-[#111A17] rounded-lg text-xs sm:text-sm font-semibold transition-all shadow-sm active:scale-95 cursor-pointer"
            aria-label="Ask the AI Property Agent"
          >
            <Sparkles className="w-4 h-4 text-emerald-300 dark:text-[#111A17] shrink-0" aria-hidden="true" />
            <span className="sm:hidden">Ask</span>
            <span className="hidden sm:inline">Ask Agent</span>
          </button>

          {/* Notifications Popover */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setProfileOpen(false);
              }}
              aria-label={`View notifications (${totalAlerts} pending)`}
              aria-expanded={notificationsOpen}
              aria-haspopup="menu"
              className="p-2 rounded-lg text-[#24312D] dark:text-[#EDF5F1] hover:bg-gray-100 dark:hover:bg-[#24332D] relative transition-colors cursor-pointer"
            >
              <Bell className="w-5 h-5" aria-hidden="true" />
              {totalAlerts > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-[#1B2622]"
                />
              )}
            </button>

            {notificationsOpen && (
              <div
                role="menu"
                aria-label="Action Queue Notifications"
                className="absolute right-0 mt-2 w-80 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                <div className="px-4 py-2 border-b border-[#E2E8E5] dark:border-[#2D4039] flex items-center justify-between gap-2">
                  <span className="font-semibold text-xs text-[#24312D] dark:text-[#EDF5F1]">
                    Action Queue Notifications
                  </span>
                  <span className="text-[11px] font-semibold tabular-nums bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {totalAlerts} Pending
                  </span>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
                  {agentTasks
                    .filter((t) => t.status === 'AWAITING_APPROVAL')
                    .map((t) => (
                      <button
                        type="button"
                        role="menuitem"
                        key={t.id}
                        onClick={() => {
                          setCurrentScreen('agent');
                          setNotificationsOpen(false);
                        }}
                        className="w-full text-left p-3 hover:bg-[#F6F8F6] dark:hover:bg-[#24332D] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#267256] dark:text-[#79C8A4]">
                          <Sparkles className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Agent Action Awaiting Signoff
                        </div>
                        <p className="text-xs text-[#24312D] dark:text-[#EDF5F1] mt-1 line-clamp-2">{t.title}</p>
                        <span className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3 shrink-0" aria-hidden="true" /> Requires Landlord authorization
                        </span>
                      </button>
                    ))}

                  {maintenanceTickets
                    .filter((m) => m.status === 'AWAITING_APPROVAL')
                    .map((m) => (
                      <button
                        type="button"
                        role="menuitem"
                        key={m.id}
                        onClick={() => {
                          setCurrentScreen('maintenance');
                          setNotificationsOpen(false);
                        }}
                        className="w-full text-left p-3 hover:bg-[#F6F8F6] dark:hover:bg-[#24332D] cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
                          <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> High-Cost Maintenance Signoff
                        </div>
                        <p className="text-xs text-[#24312D] dark:text-[#EDF5F1] mt-1 tabular-nums">
                          {m.title} (KES {m.estimatedCost.toLocaleString()})
                        </p>
                      </button>
                    ))}

                  {totalAlerts === 0 && (
                    <div className="p-6 text-center text-xs text-[#64736C] dark:text-[#9EB2A9]">
                      <CheckCircle2 className="w-8 h-8 mx-auto text-[#2F8A68] dark:text-[#79C8A4] mb-2" aria-hidden="true" />
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
              type="button"
              onClick={() => {
                setProfileOpen(!profileOpen);
                setNotificationsOpen(false);
              }}
              aria-label="User profile menu"
              aria-expanded={profileOpen}
              aria-haspopup="menu"
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-[#24332D] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#173C32] dark:bg-[#79C8A4] text-white dark:text-[#111A17] flex items-center justify-center font-bold text-xs ring-1 ring-emerald-500/30">
                {currentUser.name.charAt(0)}
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-[#64736C] dark:text-[#9EB2A9] hidden sm:block" aria-hidden="true" />
            </button>

            {profileOpen && (
              <div
                role="menu"
                aria-label="User Profile Menu"
                className="absolute right-0 mt-2 w-64 max-w-[calc(100vw-2rem)] bg-white dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
              >
                {/* Profile Header */}
                <div className="px-4 py-2 border-b border-[#E2E8E5] dark:border-[#2D4039]">
                  <p className="font-semibold text-sm text-[#24312D] dark:text-[#EDF5F1] truncate">
                    {currentUser.name}
                  </p>
                  <p className="text-xs text-[#64736C] dark:text-[#9EB2A9] truncate wrap-anywhere">
                    {currentUser.email}
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-semibold uppercase tracking-wider bg-[#E8F5EE] dark:bg-[#213A30] text-[#173C32] dark:text-[#79C8A4] px-2 py-0.5 rounded">
                    {currentUser.role}
                  </span>
                </div>

                {/* Theme Selector */}
                <div className="px-4 py-2.5 border-b border-[#E2E8E5] dark:border-[#2D4039]">
                  <span className="text-[11px] font-semibold text-[#64736C] dark:text-[#9EB2A9] uppercase tracking-wider block mb-1.5">
                    Theme Appearance
                  </span>
                  <div className="grid grid-cols-3 gap-1 bg-[#F6F8F6] dark:bg-[#1B2622] p-1 rounded-lg border border-[#E2E8E5] dark:border-[#2D4039]">
                    <button
                      type="button"
                      onClick={() => setTheme('light')}
                      aria-pressed={theme === 'light'}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-all cursor-pointer ${
                        theme === 'light'
                          ? 'bg-[#173C32] text-white dark:bg-[#79C8A4] dark:text-[#111A17] font-semibold shadow-xs'
                          : 'text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-white'
                      }`}
                    >
                      <Sun className="w-3 h-3" aria-hidden="true" /> Light
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('dark')}
                      aria-pressed={theme === 'dark'}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-all cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-[#173C32] text-white dark:bg-[#79C8A4] dark:text-[#111A17] font-semibold shadow-xs'
                          : 'text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-white'
                      }`}
                    >
                      <Moon className="w-3 h-3" aria-hidden="true" /> Dark
                    </button>
                    <button
                      type="button"
                      onClick={() => setTheme('system')}
                      aria-pressed={theme === 'system'}
                      className={`flex items-center justify-center gap-1 py-1.5 rounded text-xs transition-all cursor-pointer ${
                        theme === 'system'
                          ? 'bg-[#173C32] text-white dark:bg-[#79C8A4] dark:text-[#111A17] font-semibold shadow-xs'
                          : 'text-[#64736C] dark:text-[#9EB2A9] hover:text-[#24312D] dark:hover:text-white'
                      }`}
                    >
                      <Laptop className="w-3 h-3" aria-hidden="true" /> System
                    </button>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setCurrentScreen('settings');
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#24312D] dark:text-[#EDF5F1] hover:bg-[#F6F8F6] dark:hover:bg-[#24332D] flex items-center gap-2.5 cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#64736C] dark:text-[#9EB2A9]" aria-hidden="true" /> Account Settings
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setCurrentScreen('onboarding');
                      setProfileOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-[#24312D] dark:text-[#EDF5F1] hover:bg-[#F6F8F6] dark:hover:bg-[#24332D] flex items-center gap-2.5 cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4 text-[#64736C] dark:text-[#9EB2A9]" aria-hidden="true" /> Launch Onboarding Wizard
                  </button>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      setProfileOpen(false);
                      signOut();
                    }}
                    className="w-full px-4 py-2 text-left text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" aria-hidden="true" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Mobile Global Search Row */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-[#E2E8E5] dark:border-[#2D4039] pt-2.5 bg-white dark:bg-[#1B2622]">
          <div className="relative">
            <Search className="w-4 h-4 text-[#64736C] dark:text-[#9EB2A9] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" aria-hidden="true" />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Global portfolio search"
              placeholder="Search units, tenants, M-Pesa refs..."
              autoFocus
              className="w-full pl-9 pr-9 py-2 text-sm bg-[#F6F8F6] dark:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl text-[#24312D] dark:text-[#EDF5F1] placeholder-[#64736C] dark:placeholder-[#9EB2A9] focus:outline-none focus:ring-2 focus:ring-[#2F8A68]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#64736C] dark:text-[#9EB2A9]"
              >
                <X className="w-4 h-4" aria-hidden="true" />
              </button>
            )}
          </div>

          {searchQuery.trim().length > 0 && quickResults.length > 0 && (
            <div className="mt-2 bg-[#F6F8F6] dark:bg-[#202D28] border border-[#E2E8E5] dark:border-[#2D4039] rounded-xl divide-y divide-[#E2E8E5] dark:divide-[#2D4039]">
              {quickResults.map((res) => (
                <button
                  type="button"
                  key={res.id}
                  onClick={() => {
                    setCurrentScreen(res.screen);
                    setMobileSearchOpen(false);
                  }}
                  className="w-full px-3 py-2 text-left flex items-center justify-between gap-2 text-xs cursor-pointer"
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-[#24312D] dark:text-[#EDF5F1] truncate">{res.title}</div>
                    <div className="text-[11px] text-[#64736C] dark:text-[#9EB2A9] truncate">{res.subtitle}</div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#267256] dark:text-[#79C8A4] shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
};
