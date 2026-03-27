import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type TaskStrategySummary = {
  id: string;
  type: string;
  cronExpression: string | null;
  isActive: boolean;
  lastActivatedAt: string | null;
};

type RawTaskStrategy = {
  id?: string;
  type?: string;
  cronExpression?: string | null;
  isActive?: boolean;
  lastActivatedAt?: string | null;
};

export async function fetchTaskStrategies(
  taskId: string,
): Promise<TaskStrategySummary[]> {
  const response = await authorizedApiFetch(`/task-strategies/task/${taskId}`);
  await ensureOk(response);
  const data = (await response.json()) as RawTaskStrategy[];
  return data.map((item) => ({
    id: String(item.id ?? ""),
    type: String(item.type ?? "unknown"),
    cronExpression: item.cronExpression ? String(item.cronExpression) : null,
    isActive: Boolean(item.isActive),
    lastActivatedAt: item.lastActivatedAt ? String(item.lastActivatedAt) : null,
  }));
}

