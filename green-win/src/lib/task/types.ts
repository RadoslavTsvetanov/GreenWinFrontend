export type ExecutionMode = "immediate" | "deadline";
export type RuntimeType = "lambda_code" | "docker_image";
export type OptimizationPriority = "balanced" | "co2" | "speed";

export type TaskFormState = {
  taskName: string;
  runtimeType: RuntimeType;
  lambdaFiles: File[];
  dockerImage: string;
  executionMode: ExecutionMode;
  deadline: string;
  preferredClouds: string[];
  preferredRegions: string[];
  priority: OptimizationPriority;
  notes: string;
};

export type CreateTaskPayload = {
  name: string;
  runtimeType: RuntimeType;
  runtime:
    | {
        lambdaFiles: Array<{
          name: string;
          size: number;
          type: string;
        }>;
      }
    | { dockerImage: string };
  executionMode: ExecutionMode;
  deadline: string | null;
  preferences: {
    clouds: string[];
    regions: string[];
    priority: OptimizationPriority;
  };
  notes: string | null;
};
