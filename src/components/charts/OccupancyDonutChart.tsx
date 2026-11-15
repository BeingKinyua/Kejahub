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
    <div className="w-full flex flex-col items-center">
      <div className="relative w-full h-44">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={54}
              outerRadius={74}
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
                fontVariantNumeric: 'tabular-nums',
              }}
              formatter={(value: any, name: any) => [
                `${value} units (${total > 0 ? Math.round((Number(value) / total) * 100) : 0}%)`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Central percentage overlay centered strictly on donut ring */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-extrabold tabular-nums text-[#24312D] dark:text-[#EDF5F1] leading-none">
            {occupancyRate}%
          </span>
          <span className="text-[11px] font-medium text-[#64736C] dark:text-[#9EB2A9] mt-1">
            Occupancy
          </span>
        </div>
      </div>

      {/* Legend below */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs mt-2">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
              aria-hidden="true"
            />
            <span className="text-[#64736C] dark:text-[#9EB2A9] tabular-nums">
              {item.name}: <strong className="text-[#24312D] dark:text-[#EDF5F1]">{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
