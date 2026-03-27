"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { EXECUTION_STATUS_COLORS } from "@/components/dashboard/chartTheme";

type Slice = { name: string; value: number };

type Props = {
  data: Slice[];
};

function colorForStatus(name: string) {
  return EXECUTION_STATUS_COLORS[name] ?? "#64748b";
}

export function ExecutionStatusDonut({ data }: Props) {
  const filtered = data.filter((d) => d.value > 0);
  const empty = filtered.length === 0;

  return (
    <ChartCard
      title="Execution outcomes"
      subtitle="Distribution of execution statuses in the current filters."
    >
      <div className="h-[260px] w-full min-h-[200px]">
        {empty ? (
          <p className="flex h-full items-center justify-center text-sm text-slate-500">
            No executions to chart.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filtered}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={68}
                outerRadius={92}
                paddingAngle={2}
                animationDuration={500}
              >
                {filtered.map((entry) => (
                  <Cell key={entry.name} fill={colorForStatus(entry.name)} stroke="none" />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 40px -24px rgba(15,23,42,0.35)",
                }}
                formatter={(value: number, _n, item) => {
                  const total = filtered.reduce((acc, d) => acc + d.value, 0);
                  const pct = total ? Math.round((value / total) * 1000) / 10 : 0;
                  return [`${value} (${pct}%)`, String(item.payload?.name ?? "status")];
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      {!empty && (
        <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 border-t border-slate-100 pt-3 text-xs text-slate-600">
          {filtered.map((d) => (
            <li key={d.name} className="inline-flex items-center gap-1.5">
              <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: colorForStatus(d.name) }}
              />
              <span className="capitalize">{d.name.replace(/_/g, " ")}</span>
              <span className="tabular-nums text-slate-400">({d.value})</span>
            </li>
          ))}
        </ul>
      )}
    </ChartCard>
  );
}
