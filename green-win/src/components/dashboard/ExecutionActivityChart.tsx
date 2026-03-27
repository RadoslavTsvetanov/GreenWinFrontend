"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { SERIES_FILL, SERIES_STROKE } from "@/components/dashboard/chartTheme";

type Point = { day: string; count: number };

type Props = {
  data: Point[];
};

function formatTick(day: string) {
  const d = new Date(`${day}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) return day;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function ExecutionActivityChart({ data }: Props) {
  const empty = data.length === 0 || data.every((d) => d.count === 0);

  return (
    <ChartCard
      title="Execution activity"
      subtitle="Runs per day by start, creation, or schedule time (UTC day buckets)."
    >
      <div className="h-[260px] w-full min-h-[200px]">
        {empty ? (
          <p className="flex h-full items-center justify-center text-sm text-slate-500">
            No executions in this range.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="execFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={SERIES_FILL} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={SERIES_FILL} stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
              <XAxis
                dataKey="day"
                tickFormatter={formatTick}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                minTickGap={24}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "#64748b" }}
                axisLine={false}
                tickLine={false}
                width={36}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "12px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 40px -24px rgba(15,23,42,0.35)",
                }}
                labelFormatter={(label) =>
                  new Date(`${String(label)}T00:00:00.000Z`).toLocaleDateString(undefined, {
                    weekday: "short",
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                }
                formatter={(value: number) => [`${value}`, "Executions"]}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Executions"
                stroke={SERIES_STROKE}
                strokeWidth={2}
                fill="url(#execFill)"
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </ChartCard>
  );
}
