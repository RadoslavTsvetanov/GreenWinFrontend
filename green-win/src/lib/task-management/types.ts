export type TaskExecutionMode = "immediate" | "deadline";
export type TaskRuntimeType = "lambda_code" | "docker_image";
export type TaskStatus = "queued" | "scheduled" | "running" | "completed" | "failed";

export type ManagedTask = {
  id: string;
  name: string;
  projectId: string | null;
  projectName: string | null;
  status: TaskStatus;
  runtimeType: TaskRuntimeType;
  executionMode: TaskExecutionMode;
  provider: string | null;
  region: string | null;
  createdAt: string;
  deadline: string | null;
  estimatedCo2SavedGrams: number | null;
  notes: string;
};
