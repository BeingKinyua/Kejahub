import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import { UserRole } from '../../types';
import { ShieldCheck } from 'lucide-react';

export const DemoRoleSwitcher: React.FC = () => {
  const { currentUser, switchRole } = useProperty();

  const roles: { role: UserRole; label: string; desc: string }[] = [
    { role: 'LANDLORD', label: 'Landlord (Owner)', desc: 'Full authority & high-value approval' },
    { role: 'PROPERTY_MANAGER', label: 'Property Manager', desc: 'Ops, tenants & minor maintenance' },
    { role: 'FINANCE', label: 'Finance / Accountant', desc: 'Ledgers, reconciliation & expenses' },
    { role: 'MAINTENANCE', label: 'Maintenance Staff', desc: 'Tickets & fundi updates only' },
    { role: 'READ_ONLY', label: 'Read-Only Viewer', desc: 'Auditor inspection mode' },
  ];

  return (
    <div className="bg-[#173C32]/10 dark:bg-[#79C8A4]/10 border-b border-[#173C32]/20 dark:border-[#79C8A4]/20 px-4 py-2 text-xs flex flex-col xl:flex-row xl:items-center justify-between gap-2">
      <div className="flex flex-wrap items-center gap-2 min-w-0">
        <span className="font-semibold text-[#173C32] dark:text-[#79C8A4] flex items-center gap-1.5 whitespace-nowrap">
          <ShieldCheck className="w-3.5 h-3.5 shrink-0" aria-hidden="true" /> Demo RBAC Simulator:
        </span>
        <span className="text-[#24312D] dark:text-[#EDF5F1] min-w-0">
          Viewing as: <strong className="font-semibold">{currentUser.name}</strong> ({currentUser.role})
        </span>
      </div>

      <div
        role="group"
        aria-label="Switch demo role"
        className="flex flex-wrap items-center gap-1.5 py-0.5"
      >
        <span className="text-[#64736C] dark:text-[#9EB2A9] mr-1 hidden sm:inline">Switch Role:</span>
        {roles.map((r) => {
          const isActive = currentUser.role === r.role;
          return (
            <button
              type="button"
              key={r.role}
              onClick={() => switchRole(r.role)}
              title={r.desc}
              aria-pressed={isActive}
              className={`px-2.5 py-1 min-h-[30px] rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#173C32] text-white dark:bg-[#79C8A4] dark:text-[#111A17] shadow-sm font-semibold'
                  : 'bg-white/85 dark:bg-[#1B2622] text-[#24312D] dark:text-[#EDF5F1] hover:bg-white dark:hover:bg-[#24332D] border border-[#E2E8E5] dark:border-[#2D4039]'
              }`}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
