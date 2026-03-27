import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type BackendTaskItem = {
  id?: string;
  name?: string;
  status?: string;
  codeType?: string;
  project?: {
    id?: string;
    name?: string;
  } | null;
  latestFinishAt?: string | null;
  allowedCloudProviders?: string[] | null;
  allowedRegions?: string[] | null;
  estimatedCo2SavedGrams?: number | null;
  co2SavedGrams?: number | null;
  createdAt?: string;
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

