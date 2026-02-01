"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"

const data = [
  { name: "Jan", income: 1200 },
  { name: "Feb", income: 900 },
  { name: "Mar", income: 1800 },
  { name: "Apr", income: 1400 },
  { name: "May", income: 2200 },
  { name: "Jun", income: 1600 },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-sm opacity-80">Overview of balances and recent activity</p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <Metric title="Balance" value="$8,420.00" />
        <Metric title="Overdue" value="$540.00" />
        <Metric title="Income (30d)" value="$3,200.00" />
      </section>

      <Card className="border-0 bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Income Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(0,0,0,0.05)" />
              <XAxis dataKey="name" stroke="currentColor" />
              <YAxis stroke="currentColor" />
              <Tooltip />
              <Area type="monotone" dataKey="income" stroke="var(--color-secondary)" fill="url(#colorIncome)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

function Metric({ title, value }: { title: string; value: string }) {
  return (
    <Card className="border-0 bg-card text-card-foreground">
      <CardContent className="p-5">
        <p className="text-xs text-muted-foreground">{title}</p>
        <p className="mt-1 text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  )
}
