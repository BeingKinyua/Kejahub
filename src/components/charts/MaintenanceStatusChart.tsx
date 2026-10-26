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

  return (
    <div className="relative w-full h-56 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={tickets}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={70}
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
            }}
            formatter={(value: any, name: any) => [
              `${value} tickets`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-xl font-extrabold text-[#24312D] dark:text-[#EDF5F1]">
          {total}
        </span>
        <span className="text-[10px] font-semibold text-[#64736C] dark:text-[#9EB2A9] uppercase tracking-wider">
          Tickets
        </span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] mt-1 w-full max-w-xs px-2">
        {tickets.map((item) => (
          <div key={item.status} className="flex items-center gap-1.5 truncate">
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#64736C] dark:text-[#9EB2A9] truncate">
              {item.status}: <strong className="text-[#24312D] dark:text-[#EDF5F1]">{item.count}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
