import React from 'react';
import { useProperty } from '../../context/PropertyContext';
import { UserRole } from '../../types';
import { ShieldCheck, UserCheck } from 'lucide-react';

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
    <div className="bg-[#173C32]/10 dark:bg-[#79C8A4]/10 border-b border-[#173C32]/20 dark:border-[#79C8A4]/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-[#173C32] dark:text-[#79C8A4] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" /> Demo RBAC Simulator:
        </span>
        <span className="text-gray-600 dark:text-gray-300">
          Viewing workspace as: <strong className="text-gray-900 dark:text-white font-medium">{currentUser.name}</strong> ({currentUser.role})
        </span>
      </div>

      <div className="flex items-center gap-1 overflow-x-auto py-0.5">
        <span className="text-gray-500 dark:text-gray-400 mr-1 hidden sm:inline">Switch Role:</span>
        {roles.map((r) => {
          const isActive = currentUser.role === r.role;
          return (
            <button
              key={r.role}
              onClick={() => switchRole(r.role)}
              title={r.desc}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-all ${
                isActive
                  ? 'bg-[#173C32] text-white dark:bg-[#79C8A4] dark:text-[#111A17] shadow-sm font-semibold'
                  : 'bg-white/80 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
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
