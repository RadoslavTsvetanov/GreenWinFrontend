"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { TASK_STATUS_COLORS } from "@/components/dashboard/chartTheme";

type Row = { name: string; value: number };

type Props = {
  data: Row[];
};

function color(name: string) {
  return TASK_STATUS_COLORS[name] ?? "#64748b";
}

export function TaskStatusBarChart({ data }: Props) {
  const filtered = data.filter((d) => d.value > 0);
  const empty = filtered.length === 0;

  return (
    <ChartCard
      title="Task lifecycle"
      subtitle="Tasks in scope by workflow status from the API."
    >
      <div className="h-[260px] w-full min-h-[200px]">
        {empty ? (
          <p className="flex h-full items-center justify-center text-sm text-slate-500">
            No tasks in this project filter.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={filtered} margin={{ top: 8, right: 8, left: -8, bottom: 48 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                interval={0}
                angle={-24}
                textAnchor="end"
                height={48}
                tickFormatter={(v: string) => v.replace(/_/g, " ")}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                cursor={{ fill: "rgba(15,23,42,0.04)" }}
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 40px -24px rgba(15,23,42,0.35)",
                }}
                formatter={(value: number, _n, item) => [
                  `${value}`,
                  String(item.payload?.name ?? "").replace(/_/g, " "),
                ]}
              />
              <Bar dataKey="value" animationDuration={600} radius={[6, 6, 0, 0]}>
                {filtered.map((entry) => (
                  <Cell key={entry.name} fill={color(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
