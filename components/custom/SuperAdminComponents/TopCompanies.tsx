"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { IMostAppliedCompanies } from "@/types/dashboard"

export const TopCompanies = ( {data} : {data: IMostAppliedCompanies[]}) => {
  return (
    <ChartContainer
    config={{
      totalApplications: {
        label: "Toplam Başvuru",
        color: "hsl(var(--chart-1))",
      },
    }}
    className="h-[300px] w-full"
  >
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 5, right: 30, left: 30, bottom: 5 }}
    >
      <XAxis type="number" />
      <YAxis type="category" dataKey="companyName" />
      <ChartTooltip content={<ChartTooltipContent />} />
      <Bar
        dataKey="totalApplications"
        fill="currentColor"
        radius={[4, 4, 0, 0]}
         />
    </BarChart>
  </ChartContainer>
  )
}
