"use client"

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  { date: "1 Şub", applications: 12 },
  { date: "2 Şub", applications: 15 },
  { date: "3 Şub", applications: 18 },
  { date: "4 Şub", applications: 14 },
  { date: "5 Şub", applications: 22 },
  { date: "6 Şub", applications: 25 },
  { date: "7 Şub", applications: 28 },
]

export function ApplicationChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <XAxis
          dataKey="date"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="applications"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

