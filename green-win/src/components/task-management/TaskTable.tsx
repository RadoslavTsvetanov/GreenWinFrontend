import Link from "next/link";
import { ManagedTask } from "@/lib/task-management/types";
import { TaskStatusBadge } from "./TaskStatusBadge";

export function TaskTable({ tasks }: { tasks: ManagedTask[] }) {
  if (tasks.length === 0) {
    return (
      <section className="rounded-2xl border border-white/70 bg-white/80 p-6 text-sm text-slate-600 shadow-sm">
        No tasks found for the selected filters.
      </section>
    );
  }

  return (
    <section className="space-y-3">
      {tasks.map((task) => (
        <Link
          key={task.id}
          href={`/tasks/${task.id}`}
          className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200"
        >
          <article>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900">{task.name}</h3>
                <p className="mt-1 text-xs text-slate-500">ID: {task.id}</p>
              </div>
              <TaskStatusBadge status={task.status} />
            </div>

            <div className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2 lg:grid-cols-4">
              <p>
                <span className="text-slate-500">Runtime:</span> {task.runtimeType}
              </p>
              <p>
                <span className="text-slate-500">Mode:</span> {task.executionMode}
              </p>
              <p>
                <span className="text-slate-500">Region:</span> {task.provider}:{task.region}
              </p>
              <p>
                <span className="text-slate-500">Saved:</span> {task.estimatedCo2SavedGrams} g CO2
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <span className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
                View details
              </span>
            </div>
          </article>
        </Link>
      ))}
    </section>
  );
}
