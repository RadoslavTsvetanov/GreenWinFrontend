"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import {
  fetchExecutionsForTask,
  invokeTaskNow,
} from "@/lib/task-executions/api";
import { TaskExecutionSummary } from "@/lib/task-executions/types";

export function TaskExecutionsPanel({ taskId }: { taskId: string }) {
  const [executions, setExecutions] = useState<TaskExecutionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInvoking, setIsInvoking] = useState(false);
  const { showError, showSuccess } = useToast();

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

  const handleInvoke = async () => {
    setIsInvoking(true);
    try {
      const result = await invokeTaskNow(taskId);
      showSuccess("Task invoked.");
      setExecutions((prev) => [
        {
          id: String(result["id"] ?? `exec-${Date.now()}`),
          status: "pending",
          provider: typeof result["provider"] === "string" ? result["provider"] : null,
          region: typeof result["region"] === "string" ? result["region"] : null,
          startedAt:
            typeof result["startedAt"] === "string"
              ? result["startedAt"]
              : typeof result["startDate"] === "string"
                ? result["startDate"]
                : null,
          finishedAt: null,
          logsUri: typeof result["logsUri"] === "string" ? result["logsUri"] : null,
          errorMessage:
            typeof result["errorMessage"] === "string"
              ? result["errorMessage"]
              : null,
        },
        ...prev,
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to invoke task.";
      showError(message);
    } finally {
      setIsInvoking(false);
    }
  };

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
        <button
          type="button"
          onClick={handleInvoke}
          disabled={isInvoking}
          className="rounded-lg bg-emerald-700 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isInvoking ? "Invoking..." : "Invoke now"}
        </button>
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

