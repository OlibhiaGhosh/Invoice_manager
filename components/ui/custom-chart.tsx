"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { z } from "zod";

// 1. Define the props schema for the component using Zod.
// This schema will be used by Tambo to validate the props provided by the AI.
export const customChartSchema = z.object({
  data: z.array(z.object({
    name: z.string(),
    value: z.number(),
  })).describe("An array of data points for the chart."),
  title: z.string().optional().describe("The optional title for the chart."),
});

// Infer the TypeScript type from the Zod schema.
type CustomChartProps = z.infer<typeof customChartSchema>;

// 2. Create the React component.
// This is a standard React component that will be rendered by Tambo.
export function CustomChart({ data, title }: CustomChartProps) {
  return (
    <div className="p-4 border rounded-lg">
      {title && <h3 className="text-lg font-medium mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
