import { TaskExecutionSummary } from "./types";
import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

type BackendExecution = {
  id?: string;
  status?: TaskExecutionSummary["status"];
  provider?: string | null;
  region?: string | null;
  periodicity?: string | null;
  scheduledAt?: string | null;
  executionDate?: string | null;
  createdAt?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  logsUri?: string | null;
  errorMessage?: string | null;
  metrics?: Record<string, unknown> | null;
  task?: { id?: string; name?: string } | null;
};

export type TaskExecutionListItem = {
  id: string;
  status: TaskExecutionSummary["status"];
  provider: string | null;
  region: string | null;
  periodicity: string | null;
  taskId: string | null;
  taskName: string | null;
  scheduledAt: string | null;
  createdAt: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  hasMetrics: boolean;
};

export async function fetchExecutionsForTask(
  taskId: string,
): Promise<TaskExecutionSummary[]> {
  const response = await authorizedApiFetch(`/task-executions/task/${taskId}`);

  if (!response.ok) {
    // Keep details page resilient when execution history is unavailable.
    return [];
  }

  const data = (await response.json()) as BackendExecution[];

  return data.map((exec) => ({
    id: String(exec.id ?? ""),
    status: (exec.status as TaskExecutionSummary["status"]) ?? "pending",
    provider: exec.provider ? String(exec.provider) : null,
    region: exec.region ? String(exec.region) : null,
    startedAt: exec.startedAt
      ? String(exec.startedAt)
      : exec.startDate
        ? String(exec.startDate)
        : null,
    finishedAt: exec.finishedAt
      ? String(exec.finishedAt)
      : exec.endDate
        ? String(exec.endDate)
        : null,
    logsUri: exec.logsUri ? String(exec.logsUri) : null,
    errorMessage: exec.errorMessage ? String(exec.errorMessage) : null,
  }));
}

export async function fetchAllExecutions(): Promise<TaskExecutionListItem[]> {
  const response = await authorizedApiFetch("/task-executions");
  await ensureOk(response);
  const data = (await response.json()) as BackendExecution[];

  return data.map((exec) => {
    const metrics = exec.metrics;
    const hasMetrics =
      metrics !== null &&
      metrics !== undefined &&
      typeof metrics === "object" &&
      Object.keys(metrics as object).length > 0;

    return {
      id: String(exec.id ?? ""),
      status: (exec.status as TaskExecutionSummary["status"]) ?? "pending",
      provider: exec.provider ? String(exec.provider) : null,
      region: exec.region ? String(exec.region) : null,
      periodicity: exec.periodicity ? String(exec.periodicity) : "once",
      taskId: typeof exec.task?.id === "string" ? exec.task.id : null,
      taskName: typeof exec.task?.name === "string" ? exec.task.name : null,
      scheduledAt: exec.scheduledAt ? String(exec.scheduledAt) : null,
      createdAt: exec.createdAt ? String(exec.createdAt) : null,
      startedAt: exec.startedAt ? String(exec.startedAt) : null,
      finishedAt: exec.finishedAt ? String(exec.finishedAt) : null,
      hasMetrics,
    };
  });
}

export async function invokeTaskNow(taskId: string) {
  const response = await authorizedApiFetch("/task-executions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        taskId,
        status: "pending",
        scheduledAt: new Date().toISOString(),
        periodicity: "once",
      }),
    });

  await ensureOk(response);
  return (await response.json()) as Record<string, unknown>;
}

