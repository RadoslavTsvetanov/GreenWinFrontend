"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { TaskStatusBadge } from "@/components/task-management/TaskStatusBadge";
import { TaskExecutionsPanel } from "@/components/task-management/TaskExecutionsPanel";
import { useToast } from "@/components/ui/Toast";
import {
  deleteTask,
  fetchTaskDetail,
  fetchTaskStatus,
  TaskDetailResponse,
} from "@/lib/task-management/api";
import {
  activateStrategy,
  createTaskStrategy,
  deactivateStrategy,
  fetchTaskStrategies,
  invokeStrategyNow,
  TaskStrategySummary,
} from "@/lib/task-strategies/api";
import {
  BackLink,
  Button,
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
  summary?: TaskDetailResponse["summary"];
};

export default function TaskDetailsPage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const taskId = params.taskId ?? "";
  const [task, setTask] = useState<BackendTask | null>(null);
  const [strategies, setStrategies] = useState<TaskStrategySummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [busyStrategyId, setBusyStrategyId] = useState<string | null>(null);
  const [isCreatingAndActivating, setIsCreatingAndActivating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    if (!taskId) return;

    let cancelled = false;

    async function fetchTask() {
      setIsLoading(true);

      try {
        const data = (await fetchTaskDetail(taskId)) as BackendTask;
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
    const timer = window.setInterval(async () => {
      try {
        const latest = await fetchTaskStatus(taskId);
        setTask((prev) => (prev ? { ...prev, status: latest.status as BackendTask["status"] } : prev));
      } catch {
        // Keep polling resilient and silent.
      }
    }, 15000);
    return () => window.clearInterval(timer);
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;

    let cancelled = false;

    async function loadRelatedData() {
      setIsLoadingRelated(true);
      try {
        const strategiesData = await fetchTaskStrategies(taskId);
        if (cancelled) return;
        setStrategies(strategiesData);
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to load task data.";
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

  const refreshRelatedData = async () => {
    if (!taskId) return;
    setIsLoadingRelated(true);
    try {
      const strategiesData = await fetchTaskStrategies(taskId);
      setStrategies(strategiesData);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to refresh task data.";
      showError(message);
    } finally {
      setIsLoadingRelated(false);
    }
  };

  const handleActivate = async (strategyId: string) => {
    setBusyStrategyId(strategyId);
    try {
      await activateStrategy(strategyId);
      await refreshRelatedData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to activate strategy.";
      showError(message);
    } finally {
      setBusyStrategyId(null);
    }
  };

  const handleDeactivate = async (strategyId: string) => {
    setBusyStrategyId(strategyId);
    try {
      await deactivateStrategy(strategyId);
      await refreshRelatedData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to deactivate strategy.";
      showError(message);
    } finally {
      setBusyStrategyId(null);
    }
  };

  const handleInvoke = async (strategyId: string) => {
    setBusyStrategyId(strategyId);
    try {
      await invokeStrategyNow(strategyId);
      await refreshRelatedData();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to invoke strategy.";
      showError(message);
    } finally {
      setBusyStrategyId(null);
    }
  };

  const handleCreateAndActivateOnce = async () => {
    if (!taskId) return;
    setIsCreatingAndActivating(true);
    try {
      const now = new Date();
      const hh = String(now.getUTCHours()).padStart(2, "0");
      const mm = String(now.getUTCMinutes()).padStart(2, "0");
      const strategy = await createTaskStrategy({
        taskId,
        periodicity: "once",
        executionTime: `${hh}:${mm}`,
      });
      await activateStrategy(strategy.id);
      await refreshRelatedData();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to create and activate strategy.";
      showError(message);
    } finally {
      setIsCreatingAndActivating(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskId || !task) return;
    const confirmed = window.confirm(`Delete task "${task.name}"?`);
    if (!confirmed) return;
    setIsDeleting(true);
    try {
      await deleteTask(taskId);
      router.replace("/tasks");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to delete task.";
      showError(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-5xl space-y-4">
        <BackLink href="/tasks" label="Back to tasks" />
        <PageHeader
          eyebrow="Task details"
          title={isLoading ? "Loading task..." : task ? task.name : "Task not found"}
          subtitle={`Task ID: ${taskId}`}
          actions={
            task ? (
              <Button
                type="button"
                variant="danger"
                size="sm"
                disabled={isDeleting}
                onClick={handleDeleteTask}
              >
                {isDeleting ? "Deleting..." : "Delete task"}
              </Button>
            ) : undefined
          }
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
              value={task.summary?.provider?.toUpperCase() ?? "N/A"}
            />
            <QuickKpi label="Region" value={task.summary?.region ?? "N/A"} />
            <QuickKpi
              label="CO2 saved"
              value={
                typeof task.summary?.totalCo2Grams === "number"
                  ? `${task.summary.totalCo2Grams.toFixed(2)} g`
                  : "N/A"
              }
            />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
            <Detail label="Runtime type" value={task.codeType ?? "N/A"} />
            <Detail
              label="Execution mode"
              value={task.summary?.executionMode ?? "N/A"}
            />
            <Detail label="Provider" value={task.summary?.provider ?? "N/A"} />
            <Detail label="Region" value={task.summary?.region ?? "N/A"} />
            <Detail
              label="Created at"
              value={
                task.createdAt ? new Date(task.createdAt).toLocaleString() : "N/A"
              }
            />
            <Detail
              label="Last executed"
              value={
                task.summary?.lastExecutedAt
                  ? new Date(task.summary.lastExecutedAt).toLocaleString()
                  : "Not yet"
              }
            />
            <Detail
              label="Total energy"
              value={
                typeof task.summary?.totalEnergyKwh === "number"
                  ? `${task.summary.totalEnergyKwh.toFixed(4)} kWh`
                  : "N/A"
              }
            />
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">
                {task.description || "No notes available."}
            </p>
            </div>

            <TaskExecutionsPanel taskId={taskId} />
            <section className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">
                Quick run
              </p>
              <p className="mt-1 text-sm text-emerald-900">
                No strategy yet? Create a one-time strategy and activate it immediately.
              </p>
              <div className="mt-3">
                <Button
                  type="button"
                  variant="primary"
                  disabled={isCreatingAndActivating}
                  onClick={handleCreateAndActivateOnce}
                >
                  {isCreatingAndActivating
                    ? "Creating and activating..."
                    : "Create + activate one-time strategy"}
                </Button>
              </div>
            </section>
            <section className="grid gap-4 lg:grid-cols-1">
              <article className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Strategies
              </p>
              {isLoadingRelated ? (
                  <p className="mt-2 text-sm text-slate-600">Loading strategies...</p>
              ) : strategies.length === 0 ? (
                  <p className="mt-2 text-sm text-slate-600">No strategies attached.</p>
              ) : (
                  <div className="mt-3 space-y-2">
                  {strategies.map((strategy) => (
                    <div
                      key={strategy.id}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm"
                    >
                      <p className="font-semibold text-slate-900">
                        {strategy.periodicity.toUpperCase()}
                        {strategy.isActive ? " (active)" : ""}
                      </p>
                      <p className="text-xs text-slate-500">
                        {strategy.cronExpression || "No cron expression"}
                      </p>
                      <p className="mt-1 text-[11px] text-slate-500">
                        Activated:{" "}
                        {strategy.activatedAt
                          ? new Date(strategy.activatedAt).toLocaleString()
                          : "never"}{" "}
                        | Last fired:{" "}
                        {strategy.lastFiredAt
                          ? new Date(strategy.lastFiredAt).toLocaleString()
                          : "never"}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {strategy.isActive ? (
                          <Button
                            type="button"
                            size="sm"
                            variant="secondary"
                            disabled={busyStrategyId === strategy.id}
                            onClick={() => handleDeactivate(strategy.id)}
                          >
                            {busyStrategyId === strategy.id
                              ? "Working..."
                              : "Deactivate"}
                          </Button>
                        ) : (
                          <Button
                            type="button"
                            size="sm"
                            variant="primary"
                            disabled={busyStrategyId === strategy.id}
                            onClick={() => handleActivate(strategy.id)}
                          >
                            {busyStrategyId === strategy.id ? "Working..." : "Activate"}
                          </Button>
                        )}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          disabled={busyStrategyId === strategy.id}
                          onClick={() => handleInvoke(strategy.id)}
                        >
                          Invoke once
                        </Button>
                      </div>
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
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
    </article>
  );
}
