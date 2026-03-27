import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type StrategyPeriodicity = "once" | "daily" | "weekly" | "monthly";

export type TaskStrategySummary = {
  id: string;
  periodicity: StrategyPeriodicity | "unknown";
  cronExpression: string | null;
  isActive: boolean;
  activatedAt: string | null;
  lastFiredAt: string | null;
  parameters: Record<string, unknown> | null;
};

type RawTaskStrategy = {
  id?: string;
  periodicity?: string;
  cronExpression?: string | null;
  isActive?: boolean;
  activatedAt?: string | null;
  lastFiredAt?: string | null;
  parameters?: Record<string, unknown> | null;
};

export async function fetchTaskStrategies(
  taskId: string,
): Promise<TaskStrategySummary[]> {
  const response = await authorizedApiFetch(`/task-strategies/task/${taskId}`);
  await ensureOk(response);
  const data = (await response.json()) as RawTaskStrategy[];
  return data.map((item) => ({
    id: String(item.id ?? ""),
    periodicity:
      item.periodicity === "once" ||
      item.periodicity === "daily" ||
      item.periodicity === "weekly" ||
      item.periodicity === "monthly"
        ? item.periodicity
        : "unknown",
    cronExpression: item.cronExpression ? String(item.cronExpression) : null,
    isActive: Boolean(item.isActive),
    activatedAt: item.activatedAt ? String(item.activatedAt) : null,
    lastFiredAt: item.lastFiredAt ? String(item.lastFiredAt) : null,
    parameters: item.parameters ?? null,
  }));
}

type StrategyActionResponse = {
  id?: string;
};

async function strategyAction(
  strategyId: string,
  pathSuffix: "activate" | "deactivate" | "invoke",
  parameters?: Record<string, unknown>,
): Promise<StrategyActionResponse> {
  const response = await authorizedApiFetch(
    `/task-strategies/${encodeURIComponent(strategyId)}/${pathSuffix}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(parameters ? { parameters } : {}),
    },
  );
  await ensureOk(response);
  return (await response.json()) as StrategyActionResponse;
}

export function activateStrategy(
  strategyId: string,
  parameters?: Record<string, unknown>,
) {
  return strategyAction(strategyId, "activate", parameters);
}

export function deactivateStrategy(strategyId: string) {
  return strategyAction(strategyId, "deactivate");
}

export function invokeStrategyNow(
  strategyId: string,
  parameters?: Record<string, unknown>,
) {
  return strategyAction(strategyId, "invoke", parameters);
}

export type CreateTaskStrategyPayload = {
  taskId: string;
  periodicity: StrategyPeriodicity;
  times?: string[];
  executionTime?: string;
  dayOfWeek?: number;
  dayOfMonth?: number;
  cronExpression?: string;
};

export async function createTaskStrategy(
  payload: CreateTaskStrategyPayload,
): Promise<TaskStrategySummary> {
  const response = await authorizedApiFetch("/task-strategies", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await ensureOk(response);
  const item = (await response.json()) as RawTaskStrategy;
  return {
    id: String(item.id ?? ""),
    periodicity:
      item.periodicity === "once" ||
      item.periodicity === "daily" ||
      item.periodicity === "weekly" ||
      item.periodicity === "monthly"
        ? item.periodicity
        : "unknown",
    cronExpression: item.cronExpression ? String(item.cronExpression) : null,
    isActive: Boolean(item.isActive),
    activatedAt: item.activatedAt ? String(item.activatedAt) : null,
    lastFiredAt: item.lastFiredAt ? String(item.lastFiredAt) : null,
    parameters: item.parameters ?? null,
  };
}

