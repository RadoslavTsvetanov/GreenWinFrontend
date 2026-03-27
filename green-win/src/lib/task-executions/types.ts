export type ExecutionStatus =
  | "pending"
  | "running"
  | "succeeded"
  | "failed"
  | "canceled"
  | "timed_out"
  | "retrying";

export type TaskExecutionSummary = {
  id: string;
  status: ExecutionStatus;
  provider: string | null;
  region: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  logsUri: string | null;
  errorMessage: string | null;
};

