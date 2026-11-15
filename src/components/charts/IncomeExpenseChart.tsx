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

interface IncomeExpenseChartProps {
  data?: {
    month: string;
    income: number;
    expenses: number;
    net: number;
  }[];
}

const defaultData = [
  { month: 'Jun', income: 540000, expenses: 84000, net: 456000 },
  { month: 'Jul', income: 550000, expenses: 95000, net: 455000 },
  { month: 'Aug', income: 555000, expenses: 78000, net: 477000 },
  { month: 'Sep', income: 572000, expenses: 112000, net: 460000 },
  { month: 'Oct', income: 485000, expenses: 68500, net: 416500 },
];

export const IncomeExpenseChart: React.FC<IncomeExpenseChartProps> = ({
  data = defaultData,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className="w-full h-56 flex items-center justify-center text-xs text-[#64736C] dark:text-[#9EB2A9]">
        No income or expense history recorded yet.
      </div>
    );
  }

  return (
    <div className="w-full h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 12, left: -10, bottom: 0 }}
        >
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
            className="text-xs text-[#64736C] dark:text-[#9EB2A9] tabular-nums"
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
              fontVariantNumeric: 'tabular-nums',
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
            wrapperStyle={{ paddingBottom: '8px', fontSize: '11px' }}
          />
          <Bar
            name="Collected Income"
            dataKey="income"
            fill="var(--accent-green)"
            radius={[4, 4, 0, 0]}
            maxBarSize={22}
          />
          <Bar
            name="Expenses"
            dataKey="expenses"
            fill="#D97706"
            radius={[4, 4, 0, 0]}
            maxBarSize={22}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
