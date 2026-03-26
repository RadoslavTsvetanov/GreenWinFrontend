export type TaskExecutionMode = "immediate" | "deadline";
export type TaskRuntimeType = "lambda_code" | "docker_image";
export type TaskStatus = "queued" | "scheduled" | "running" | "completed" | "failed";

export type ManagedTask = {
  id: string;
  name: string;
  status: TaskStatus;
  runtimeType: TaskRuntimeType;
  executionMode: TaskExecutionMode;
  provider: "aws" | "gcp" | "azure";
  region: string;
  createdAt: string;
  deadline: string | null;
  estimatedCo2SavedGrams: number;
  notes: string;
};
