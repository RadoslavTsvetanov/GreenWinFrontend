export type ExecutionMode = "immediate" | "deadline";
export type RuntimeType = "lambda_code" | "docker_image";

export type TaskFormState = {
  taskName: string;
  projectId: string;
  runtimeType: RuntimeType;
  lambdaFiles: File[];
  dockerImage: string;
  executionMode: ExecutionMode;
  deadline: string;
  notes: string;
};

export type CreateTaskPayload = {
  name: string;
  description?: string;
  dockerImage?: string;
  projectId: string;
  latestFinishAt?: string;
};
