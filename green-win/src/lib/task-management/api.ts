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

