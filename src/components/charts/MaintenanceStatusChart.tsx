'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface MaintenanceStatusChartProps {
  tickets?: {
    status: string;
    count: number;
    color: string;
  }[];
}

const defaultTickets = [
  { status: 'Resolved / Paid', count: 8, color: '#2F8A68' },
  { status: 'In Progress', count: 3, color: '#3B82F6' },
  { status: 'Awaiting Landlord Signoff', count: 2, color: '#E11D48' },
  { status: 'New Reported', count: 1, color: '#D97706' },
];

export const MaintenanceStatusChart: React.FC<MaintenanceStatusChartProps> = ({
  tickets = defaultTickets,
}) => {
  const total = tickets.reduce((acc, t) => acc + t.count, 0);

  if (total === 0) {
    return (
      <div className="w-full h-56 flex items-center justify-center text-xs text-[#64736C] dark:text-[#9EB2A9]">
        No maintenance tickets logged yet.
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full h-40">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tickets}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={68}
              paddingAngle={4}
              dataKey="count"
            >
              {tickets.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border-color)',
                borderRadius: '0.75rem',
                color: 'var(--text-primary)',
                fontSize: '12px',
                fontVariantNumeric: 'tabular-nums',
              }}
              formatter={(value: any, name: any) => [
                `${value} tickets`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-extrabold tabular-nums text-[#24312D] dark:text-[#EDF5F1] leading-none">
            {total}
          </span>
          <span className="text-[11px] font-medium text-[#64736C] dark:text-[#9EB2A9] mt-0.5">
            Tickets
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] mt-2 w-full max-w-xs px-2">
        {tickets.map((item) => (
          <div key={item.status} className="flex items-center gap-1.5 truncate">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-[#64736C] dark:text-[#9EB2A9] truncate tabular-nums">
              {item.status}: <strong className="text-[#24312D] dark:text-[#EDF5F1]">{item.count}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
