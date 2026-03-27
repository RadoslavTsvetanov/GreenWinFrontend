"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { TaskStatusBadge } from "@/components/task-management/TaskStatusBadge";
import { TaskExecutionsPanel } from "@/components/task-management/TaskExecutionsPanel";
import { useToast } from "@/components/ui/Toast";
import { fetchTaskById } from "@/lib/task-management/api";
import {
  fetchTaskStrategies,
  TaskStrategySummary,
} from "@/lib/task-strategies/api";
import { fetchCheckpointsByTask, TaskCheckpoint } from "@/lib/checkpoints/api";
import {
  BackLink,
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
  PageShell,
} from "@/components/ui/primitives";
import { mapTaskStatusToManaged } from "@/lib/task-management/adapters";

type BackendTask = {
  id: string;
  name: string;
  status: "draft" | "queued" | "running" | "succeeded" | "failed" | "postponed";
  codeType?: "lambda" | "docker";
  allowedCloudProviders?: string[] | null;
  allowedRegions?: string[] | null;
  createdAt?: string;
  latestFinishAt?: string | null;
  description?: string | null;
};

export default function TaskDetailsPage() {
  const params = useParams<{ taskId: string }>();
  const taskId = params.taskId ?? "";
  const [task, setTask] = useState<BackendTask | null>(null);
  const [strategies, setStrategies] = useState<TaskStrategySummary[]>([]);
  const [checkpoints, setCheckpoints] = useState<TaskCheckpoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const { showError } = useToast();

  useEffect(() => {
    if (!taskId) return;

    let cancelled = false;

    async function fetchTask() {
      setIsLoading(true);

      try {
        const data = (await fetchTaskById(taskId)) as BackendTask;
        if (!cancelled) {
          setTask(data);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to load task.";
          showError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchTask();

    return () => {
      cancelled = true;
    };
  }, [showError, taskId]);

  useEffect(() => {
    if (!taskId) return;

    let cancelled = false;

    async function loadRelatedData() {
      setIsLoadingRelated(true);
      try {
        const [strategiesData, checkpointsData] = await Promise.all([
          fetchTaskStrategies(taskId),
          fetchCheckpointsByTask(taskId),
        ]);
        if (cancelled) return;
        setStrategies(strategiesData);
        setCheckpoints(checkpointsData);
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error
              ? error.message
              : "Failed to load task data.";
          showError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingRelated(false);
        }
      }
    }

    loadRelatedData();

    return () => {
      cancelled = true;
    };
  }, [showError, taskId]);

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-5xl space-y-4">
        <BackLink href="/tasks" label="Back to tasks" />
        <PageHeader
          title={
            isLoading ? "Loading task..." : task ? task.name : "Task not found"
          }
          subtitle={`Task ID: ${taskId}`}
        />

        {isLoading ? (
          <LoadingState label="Loading task details..." />
        ) : !task ? (
          <EmptyState
            title="Task not found"
            description="This task may have been deleted or is unavailable."
          />
        ) : (
          <Card className="space-y-6">
            <div className="flex justify-end">
              <TaskStatusBadge status={mapTaskStatusToManaged(task.status)} />
            </div>

            <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
              <QuickKpi
                label="Provider"
                value={task?.allowedCloudProviders?.[0]?.toUpperCase() ?? "N/A"}
              />
              <QuickKpi
                label="Region"
                value={task?.allowedRegions?.[0] ?? "N/A"}
              />
              <QuickKpi label="CO2 saved" value="N/A" />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Detail label="Runtime type" value={task.codeType ?? "N/A"} />
              <Detail
                label="Execution mode"
                value={task.latestFinishAt ? "deadline" : "immediate"}
              />
              <Detail
                label="Provider"
                value={task.allowedCloudProviders?.[0] ?? "N/A"}
              />
              <Detail
                label="Region"
                value={task.allowedRegions?.[0] ?? "N/A"}
              />
              <Detail
                label="Created at"
                value={
                  task.createdAt
                    ? new Date(task.createdAt).toLocaleString()
                    : "N/A"
                }
              />
              <Detail
                label="Deadline"
                value={
                  task
                    ? task.latestFinishAt
                      ? new Date(task.latestFinishAt).toLocaleString()
                      : "No deadline"
                    : "N/A"
                }
              />
              <Detail label="Estimated CO2 saved" value="N/A" />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Notes
              </p>
              <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {task.description || "No notes available."}
              </p>
            </div>

            <TaskExecutionsPanel taskId={taskId} />
            <section className="grid gap-4 lg:grid-cols-2">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Strategies
                </p>
                {isLoadingRelated ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Loading strategies...
                  </p>
                ) : strategies.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">
                    No strategies attached.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {strategies.map((strategy) => (
                      <div
                        key={strategy.id}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        <p className="font-semibold text-slate-900">
                          {strategy.type}
                          {strategy.isActive ? " (active)" : ""}
                        </p>
                        <p className="text-xs text-slate-500">
                          {strategy.cronExpression || "No cron expression"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Checkpoints
                </p>
                {isLoadingRelated ? (
                  <p className="mt-2 text-sm text-slate-600">
                    Loading checkpoints...
                  </p>
                ) : checkpoints.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">
                    No checkpoints for this task.
                  </p>
                ) : (
                  <div className="mt-3 space-y-2">
                    {checkpoints.map((checkpoint) => (
                      <div
                        key={checkpoint.id}
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                      >
                        <p className="truncate font-semibold text-slate-900">
                          {checkpoint.uri}
                        </p>
                        <p className="text-xs text-slate-500">
                          Step {checkpoint.step ?? "-"} | Epoch{" "}
                          {checkpoint.epoch ?? "-"}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </article>
            </section>
          </Card>
        )}
      </main>
    </PageShell>
  );
}

function QuickKpi({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
    </article>
  );
}
