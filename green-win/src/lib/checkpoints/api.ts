import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type TaskCheckpoint = {
  id: string;
  uri: string;
  step: number | null;
  epoch: number | null;
  createdAt: string | null;
};

export type CheckpointRecord = {
  id: string;
  createdAt: string;
  taskId: string | null;
  taskName: string | null;
  executionId: string | null;
  step: number | null;
  epoch: number | null;
};

type RawCheckpoint = {
  id?: string;
  uri?: string;
  createdAt?: string;
  step?: number | null;
  epoch?: number | null;
  task?: { id?: string; name?: string } | null;
  execution?: { id?: string } | null;
};

export async function fetchCheckpointsByTask(
  taskId: string,
): Promise<TaskCheckpoint[]> {
  const response = await authorizedApiFetch(`/checkpoints/task/${taskId}`);
  await ensureOk(response);
  const data = (await response.json()) as RawCheckpoint[];
  return data.map((item) => ({
    id: String(item.id ?? ""),
    uri: String(item.uri ?? ""),
    step: typeof item.step === "number" ? item.step : null,
    epoch: typeof item.epoch === "number" ? item.epoch : null,
    createdAt: item.createdAt ? String(item.createdAt) : null,
  }));
}

export async function fetchAllCheckpoints(): Promise<CheckpointRecord[]> {
  const response = await authorizedApiFetch("/checkpoints");
  await ensureOk(response);
  const data = (await response.json()) as RawCheckpoint[];

  return data.map((row) => ({
    id: String(row.id ?? ""),
    createdAt: String(row.createdAt ?? new Date().toISOString()),
    taskId: typeof row.task?.id === "string" ? row.task.id : null,
    taskName: typeof row.task?.name === "string" ? row.task.name : null,
    executionId: typeof row.execution?.id === "string" ? row.execution.id : null,
    step: typeof row.step === "number" ? row.step : null,
    epoch: typeof row.epoch === "number" ? row.epoch : null,
  }));
}
