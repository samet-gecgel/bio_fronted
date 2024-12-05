"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Pzt",
    total: 1240,
  },
  {
    name: "Sal",
    total: 1580,
  },
  {
    name: "Çar",
    total: 1850,
  },
  {
    name: "Per",
    total: 2120,
  },
  {
    name: "Cum",
    total: 2380,
  },
  {
    name: "Cmt",
    total: 1520,
  },
  {
    name: "Paz",
    total: 980,
  },
]

export function ViewStats() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
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
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-primary"
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

