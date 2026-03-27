import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type TaskCheckpoint = {
  id: string;
  uri: string;
  step: number | null;
  epoch: number | null;
  createdAt: string | null;
};

type RawCheckpoint = {
  id?: string;
  uri?: string;
  step?: number | null;
  epoch?: number | null;
  createdAt?: string | null;
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

