'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

interface OccupancyDonutChartProps {
  occupied: number;
  vacant: number;
  maintenance?: number;
}

export const OccupancyDonutChart: React.FC<OccupancyDonutChartProps> = ({
  occupied = 14,
  vacant = 2,
  maintenance = 1,
}) => {
  const total = occupied + vacant + maintenance;
  const occupancyRate = total > 0 ? Math.round((occupied / total) * 100) : 0;

  const data = [
    { name: 'Occupied', value: occupied, color: '#2F8A68' },
    { name: 'Vacant', value: vacant, color: '#D97706' },
    { name: 'Turnover/Maint', value: maintenance, color: '#64736C' },
  ];

  return (
    <div className="relative w-full h-56 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={75}
            paddingAngle={4}
            dataKey="value"
          >
            {data.map((entry, index) => (
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
              `${value} units (${Math.round((Number(value) / total) * 100)}%)`,
              name,
            ]}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Central percentage overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-extrabold text-[#24312D] dark:text-[#EDF5F1] leading-none">
          {occupancyRate}%
        </span>
        <span className="text-[10px] font-semibold text-[#64736C] dark:text-[#9EB2A9] uppercase tracking-wider mt-1">
          Occupancy
        </span>
      </div>

      {/* Legend below */}
      <div className="flex items-center justify-center gap-4 text-xs mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-[#64736C] dark:text-[#9EB2A9]">
              {item.name}: <strong className="text-[#24312D] dark:text-[#EDF5F1]">{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
