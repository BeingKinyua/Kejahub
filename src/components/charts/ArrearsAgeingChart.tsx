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
  Cell,
} from 'recharts';

interface ArrearsAgeingChartProps {
  buckets: {
    current: number;
    days6to30: number;
    days31to60: number;
    days60plus: number;
  };
}

export const ArrearsAgeingChart: React.FC<ArrearsAgeingChartProps> = ({
  buckets,
}) => {
  const data = [
    { range: '0-5 Days', amount: buckets.current, color: '#2F8A68' },
    { range: '6-30 Days', amount: buckets.days6to30, color: '#D97706' },
    { range: '31-60 Days', amount: buckets.days31to60, color: '#E11D48' },
    { range: '60+ Days', amount: buckets.days60plus, color: '#991B1B' },
  ];

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200 dark:text-[#2D4039]"
            vertical={false}
          />
          <XAxis
            dataKey="range"
            stroke="currentColor"
            className="text-xs text-[#64736C] dark:text-[#9EB2A9]"
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="currentColor"
            className="text-xs text-[#64736C] dark:text-[#9EB2A9]"
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--surface)',
              borderColor: 'var(--border-color)',
              borderRadius: '0.75rem',
              color: 'var(--text-primary)',
              fontSize: '12px',
            }}
            formatter={(value: any) => [
              `KES ${Number(value).toLocaleString()}`,
              'Arrears Total',
            ]}
          />
          <Bar dataKey="amount" radius={[6, 6, 0, 0]} maxBarSize={45}>
            {data.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
