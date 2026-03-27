"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { fetchExecutionsForTask } from "@/lib/task-executions/api";
import { TaskExecutionSummary } from "@/lib/task-executions/types";

export function TaskExecutionsPanel({ taskId }: { taskId: string }) {
  const [executions, setExecutions] = useState<TaskExecutionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      try {
        const result = await fetchExecutionsForTask(taskId);
        if (cancelled) return;
        setExecutions(result);
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load executions.";
          showError(message);
          setExecutions([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [showError, taskId]);

  return (
    <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
            Executions
          </p>
          <p className="mt-1 text-sm text-slate-600">
            Recent runs and their status.
          </p>
        </div>
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-emerald-700">
          Use strategy controls below to activate or invoke
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {isLoading && (
          <p className="text-xs text-slate-500">Loading executions…</p>
        )}
        {!isLoading && executions.length === 0 && (
          <p className="text-xs text-slate-500">
            No executions found for this task.
          </p>
        )}
        {executions.map((exec) => (
          <article
            key={exec.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"
          >
            <div>
              <p className="font-semibold text-slate-900">
                {exec.status.toUpperCase()}
              </p>
              <p className="mt-0.5 text-slate-500">
                {exec.provider ?? "n/a"} {exec.region ?? ""}
              </p>
            </div>
            <div className="text-right text-slate-500">
              <p>
                Started:{" "}
                {exec.startedAt
                  ? new Date(exec.startedAt).toLocaleString()
                  : "n/a"}
              </p>
              <p>
                Finished:{" "}
                {exec.finishedAt
                  ? new Date(exec.finishedAt).toLocaleString()
                  : "n/a"}
              </p>
            </div>
            {exec.errorMessage && (
              <p className="basis-full text-[11px] text-rose-600">
                Error: {exec.errorMessage}
              </p>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

