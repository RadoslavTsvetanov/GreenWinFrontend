"use client";

import Link from "next/link";
import type { TaskExecutionListItem } from "@/lib/task-executions/api";
import { executionInstant } from "@/lib/dashboard/aggregate";
import { Card } from "@/components/ui/primitives";

type Props = {
  rows: TaskExecutionListItem[];
};

function formatWhen(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RecentExecutionsTable({ rows }: Props) {
  return (
    <Card>
      <div className="mb-3">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">Recent activity</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Latest filtered runs. Open a task for full execution history.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[520px] text-left text-sm">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2.5">Task</th>
              <th className="px-3 py-2.5">Status</th>
              <th className="px-3 py-2.5">Provider</th>
              <th className="px-3 py-2.5">When</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-3 py-8 text-center text-slate-500">
                  No executions match the current filters.
                </td>
              </tr>
            ) : (
              rows.map((row) => {
                const when = formatWhen(executionInstant(row));
                const href = row.taskId ? `/tasks/${row.taskId}` : "/tasks";
                return (
                  <tr
                    key={row.id}
                    className="transition-colors hover:bg-emerald-50/40"
                  >
                    <td className="px-3 py-2.5 font-medium text-slate-900">
                      <Link
                        href={href}
                        className="text-emerald-800 underline-offset-2 hover:underline"
                      >
                        {row.taskName?.trim() || "Untitled task"}
                      </Link>
                    </td>
                    <td className="px-3 py-2.5 capitalize text-slate-700">
                      {row.status.replace(/_/g, " ")}
                    </td>
                    <td className="px-3 py-2.5 text-slate-600">
                      {row.provider?.trim() || "—"}
                    </td>
                    <td className="px-3 py-2.5 tabular-nums text-slate-600">{when}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
