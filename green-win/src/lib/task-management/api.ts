import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type BackendTaskItem = {
  id?: string;
  name?: string;
  status?: "draft" | "queued" | "running" | "succeeded" | "failed" | "postponed";
  codeType?: string;
  project?: {
    id?: string;
    name?: string;
  } | null;
  strategies?: Array<{
    id?: string;
    periodicity?: string;
    isActive?: boolean;
    activatedAt?: string | null;
    lastFiredAt?: string | null;
  }> | null;
  executions?: Array<{
    id?: string;
    status?: string;
    provider?: string | null;
    region?: string | null;
    metrics?: {
      estimatedEmissionsGco2?: number;
      estimatedEnergyKwh?: number;
    } | null;
    createdAt?: string;
    startedAt?: string | null;
    finishedAt?: string | null;
  }> | null;
  createdAt?: string;
  updatedAt?: string;
  description?: string | null;
};

export type TaskDetailResponse = BackendTaskItem & {
  summary?: {
    provider?: string | null;
    region?: string | null;
    totalCo2Grams?: number;
    totalEnergyKwh?: number;
    executionMode?: string | null;
    totalExecutions?: number;
    successfulExecutions?: number;
    failedExecutions?: number;
    lastExecutedAt?: string | null;
    lastRegion?: string | null;
  };
};

export async function fetchTasks(ownerId?: string): Promise<BackendTaskItem[]> {
  const path = ownerId ? `/tasks/owner/${ownerId}` : "/tasks";
  const response = await authorizedApiFetch(path);
  await ensureOk(response);
  return (await response.json()) as BackendTaskItem[];
}

export async function fetchTaskById(taskId: string): Promise<BackendTaskItem> {
  const response = await authorizedApiFetch(`/tasks/${taskId}`);
  await ensureOk(response);
  return (await response.json()) as BackendTaskItem;
}

export async function fetchTaskDetail(taskId: string): Promise<TaskDetailResponse> {
  const response = await authorizedApiFetch(`/tasks/${taskId}/detail`);
  await ensureOk(response);
  return (await response.json()) as TaskDetailResponse;
}

export async function fetchTaskStatus(taskId: string): Promise<{ id: string; status: string }> {
  const response = await authorizedApiFetch(`/tasks/${taskId}/status`);
  await ensureOk(response);
  return (await response.json()) as { id: string; status: string };
}

export async function deleteTask(taskId: string): Promise<void> {
  const response = await authorizedApiFetch(`/tasks/${taskId}`, { method: "DELETE" });
  await ensureOk(response);
}

