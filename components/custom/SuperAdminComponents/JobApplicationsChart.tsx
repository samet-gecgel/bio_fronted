"use client";

import {
  ChartContainer,
  ChartTooltip,
} from "@/components/ui/chart"
import { Line, LineChart, XAxis, YAxis, ResponsiveContainer } from "recharts"

export const Overview = ({
  data,
}: {
  data: Array<{ name: string; total: number }>;
}) => {
  console.log("data", data);
  
  return (
    <ChartContainer
    config={{
      totalApplications: {
        label: "Başvuru",
        color: "hsl(var(--chart-1))",
      },
    }}
    className="h-[350px] w-full"
  >
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <XAxis
          dataKey="key"
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="hsl(var(--muted-foreground))"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <ChartTooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">

                    <div className="flex flex-col">
                      <span className="font-bold text-muted-foreground">
                        {payload[0].payload.name}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        Başvuru
                      </span>
                      <span className="font-bold">
                        {payload[0].value}
                      </span>
                    </div>

                </div>
              )
            }
            return null
          }}
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="var(--color-totalApplications)"
          strokeWidth={2}
          dot={{ r: 4, fill: "var(--color-totalApplications)" }}
          activeDot={{ r: 6, fill: "var(--color-totalApplications)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  </ChartContainer>
  );
};
