'use client';

import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface RentCollectionTrendChartProps {
  data?: {
    month: string;
    expected: number;
    collected: number;
  }[];
}

const defaultData = [
  { month: 'May', expected: 540000, collected: 535000 },
  { month: 'Jun', expected: 540000, collected: 540000 },
  { month: 'Jul', expected: 560000, collected: 550000 },
  { month: 'Aug', expected: 560000, collected: 555000 },
  { month: 'Sep', expected: 580000, collected: 572000 },
  { month: 'Oct (Current)', expected: 615000, collected: 485000 },
];

export const RentCollectionTrendChart: React.FC<RentCollectionTrendChartProps> = ({
  data = defaultData,
}) => {
  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2F8A68" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#2F8A68" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#173C32" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#173C32" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="currentColor"
            className="text-gray-200 dark:text-[#2D4039]"
            vertical={false}
          />
          <XAxis
            dataKey="month"
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
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              color: 'var(--text-primary)',
              fontSize: '12px',
            }}
            formatter={(value: any) => [
              `KES ${Number(value).toLocaleString()}`,
              '',
            ]}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <Area
            type="monotone"
            name="Collected Rent"
            dataKey="collected"
            stroke="#2F8A68"
            strokeWidth={2.5}
            fillOpacity={1}
            fill="url(#colorCollected)"
          />
          <Area
            type="monotone"
            name="Expected Rent"
            dataKey="expected"
            stroke="#173C32"
            strokeWidth={1.5}
            strokeDasharray="4 4"
            fillOpacity={1}
            fill="url(#colorExpected)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
