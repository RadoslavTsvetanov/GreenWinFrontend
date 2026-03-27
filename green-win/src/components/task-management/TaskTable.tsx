import Link from "next/link";
import { ManagedTask } from "@/lib/task-management/types";
import { TaskStatusBadge } from "./TaskStatusBadge";

function formatRuntime(value: ManagedTask["runtimeType"]) {
  return value === "lambda_code" ? "Lambda code" : "Docker image";
}

function formatMode(value: ManagedTask["executionMode"]) {
  return value === "deadline" ? "Run by deadline" : "Immediate";
}

function formatRegion(provider: ManagedTask["provider"], region: ManagedTask["region"]) {
  if (provider && region) return `${provider}:${region}`;
  if (provider) return provider;
  if (region) return region;
  return "N/A";
}

export function TaskTable({ tasks }: { tasks: ManagedTask[] }) {
  if (tasks.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        No tasks found for the selected filters.
      </section>
    );
  }

  return (
    <section className="space-y-4">
      {tasks.map((task) => (
        <Link
          key={task.id}
          href={`/tasks/${task.id}`}
          className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-emerald-200 sm:p-5"
        >
          <article>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="min-w-0">
                <h3 className="truncate text-base font-semibold text-slate-900 sm:text-lg">
                  {task.name}
                </h3>
                <p className="mt-1 truncate text-xs text-slate-500">ID: {task.id}</p>
              </div>
              <TaskStatusBadge status={task.status} />
            </div>

            <div className="mt-4 grid gap-x-6 gap-y-3 text-sm text-slate-700 sm:grid-cols-2 xl:grid-cols-5">
              <MetaItem label="Project" value={task.projectName ?? "Unassigned"} />
              <MetaItem label="Runtime" value={formatRuntime(task.runtimeType)} />
              <MetaItem label="Mode" value={formatMode(task.executionMode)} />
              <MetaItem label="Region" value={formatRegion(task.provider, task.region)} />
              <MetaItem
                label="Saved"
                value={
                  task.estimatedCo2SavedGrams === null
                    ? "N/A"
                    : `${task.estimatedCo2SavedGrams} g CO2`
                }
              />
            </div>

          </article>
        </Link>
      ))}
    </section>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <p className="truncate">
      <span className="text-slate-500">{label}:</span> {value}
    </p>
  );
}
