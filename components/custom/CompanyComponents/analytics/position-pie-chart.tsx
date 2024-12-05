"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { position: "Yazılım Geliştirici", value: 45 },
  { position: "UI/UX Tasarımcı", value: 25 },
  { position: "Proje Yöneticisi", value: 15 },
  { position: "Veri Analisti", value: 15 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']

export function PositionPieChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={100}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  )
}

