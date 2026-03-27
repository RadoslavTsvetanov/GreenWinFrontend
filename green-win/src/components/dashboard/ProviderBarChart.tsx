"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { ACCENT_SECONDARY } from "@/components/dashboard/chartTheme";

type Row = { name: string; value: number };

type Props = {
  data: Row[];
};

export function ProviderBarChart({ data }: Props) {
  const top = data.slice(0, 8);
  const empty = top.length === 0 || top.every((d) => d.value === 0);

  return (
    <ChartCard
      title="Cloud provider"
      subtitle="Where filtered executions are targeted (backend provider field)."
    >
      <div className="h-[260px] w-full min-h-[200px]">
        {empty ? (
          <p className="flex h-full items-center justify-center text-sm text-slate-500">
            No provider data for these executions.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={top}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
              <XAxis type="number" allowDecimals={false} hide />
              <YAxis
                type="category"
                dataKey="name"
                width={88}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: "rgba(15,23,42,0.04)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 40px -24px rgba(15,23,42,0.35)",
                }}
                formatter={(value: number) => [`${value}`, "Executions"]}
              />
              <Bar
                dataKey="value"
                name="Executions"
                fill={ACCENT_SECONDARY}
                radius={[0, 6, 6, 0]}
                animationDuration={600}
                barSize={18}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
