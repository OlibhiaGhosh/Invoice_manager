"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Jan", income: 1200 },
  { name: "Feb", income: 980 },
  { name: "Mar", income: 1500 },
  { name: "Apr", income: 1100 },
  { name: "May", income: 1900 },
  { name: "Jun", income: 1250 },
  { name: "Jul", income: 1700 },
  { name: "Aug", income: 2100 },
  { name: "Sep", income: 1400 },
  { name: "Oct", income: 2200 },
  { name: "Nov", income: 1800 },
  { name: "Dec", income: 2400 },
]

export function IncomeChart() {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="income" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
              <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="income" stroke="var(--color-chart-1)" fill="url(#income)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
