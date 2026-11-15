'use client';

import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface PropertyPerformanceChartProps {
  data?: {
    name: string;
    collectionRate: number;
    occupancyRate: number;
  }[];
}

const defaultData = [
  { name: 'Kilimani Hts', collectionRate: 88, occupancyRate: 100 },
  { name: 'Westlands Rdg', collectionRate: 75, occupancyRate: 80 },
  { name: 'Parklands Hts', collectionRate: 65, occupancyRate: 75 },
];

export const PropertyPerformanceChart: React.FC<PropertyPerformanceChartProps> = ({
  data = defaultData,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-56 flex items-center justify-center text-xs text-[#64736C] dark:text-[#9EB2A9]">
        Add properties to compare collection and occupancy velocity.
      </div>
    );
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 16, left: 4, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200 dark:text-[#2D4039]"
            horizontal={false}
          />
          <XAxis
            type="number"
            domain={[0, 100]}
            unit="%"
            stroke="currentColor"
            className="text-xs text-[#64736C] dark:text-[#9EB2A9] tabular-nums"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={92}
            stroke="currentColor"
            className="text-xs text-[#24312D] dark:text-[#EDF5F1] font-medium"
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-color)',
              borderRadius: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '12px',
              fontVariantNumeric: 'tabular-nums',
            }}
            formatter={(value: any) => [`${value}%`, '']}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
          />
          <Bar
            name="Collection Rate"
            dataKey="collectionRate"
            fill="var(--accent-green)"
            radius={[0, 4, 4, 0]}
            maxBarSize={14}
          />
          <Bar
            name="Occupancy"
            dataKey="occupancyRate"
            fill="var(--chart-5)"
            radius={[0, 4, 4, 0]}
            maxBarSize={14}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
