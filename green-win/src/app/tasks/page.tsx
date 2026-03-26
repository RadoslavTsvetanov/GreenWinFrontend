"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { TaskFilters } from "@/components/task-management/TaskFilters";
import { TaskStats } from "@/components/task-management/TaskStats";
import { TaskTable } from "@/components/task-management/TaskTable";
import { MOCK_TASKS } from "@/lib/task-management/mock-data";
import { TaskStatus } from "@/lib/task-management/types";

export default function TasksPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | TaskStatus>("all");

  const filteredTasks = useMemo(() => {
    return MOCK_TASKS.filter((task) => {
      const matchesQuery = task.name.toLowerCase().includes(query.trim().toLowerCase());
      const matchesStatus = status === "all" ? true : task.status === status;
      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50 to-emerald-50 p-6 sm:p-10">
      <main className="mx-auto w-full max-w-6xl space-y-4">
        <header className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
              Dashboard
            </p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-900">Task management</h1>
            <p className="mt-1 text-sm text-slate-600">Track, filter, and inspect scheduled jobs.</p>
          </div>
          <Link
            href="/tasks/new"
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            New task
          </Link>
          </div>
        </header>

        <TaskStats tasks={filteredTasks} />
        <TaskFilters
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
        />
        <TaskTable tasks={filteredTasks} />
      </main>
    </div>
  );
}
