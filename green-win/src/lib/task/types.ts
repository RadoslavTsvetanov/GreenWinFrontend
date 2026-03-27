export type ExecutionMode = "immediate" | "deadline";
export type RuntimeType = "lambda_code" | "docker_image";
export type StrategyPeriodicity = "once" | "daily" | "weekly" | "monthly";

export type TaskFormState = {
  taskName: string;
  projectId: string;
  runtimeType: RuntimeType;
  lambdaFiles: File[];
  dockerImage: string;
  executionMode: ExecutionMode;
  deadline: string;
  attachStrategy: boolean;
  strategyPeriodicity: StrategyPeriodicity;
  strategyExecutionTime: string;
  strategyTimesCsv: string;
  strategyDayOfWeek: number;
  strategyDayOfMonth: number;
  activateStrategyOnCreate: boolean;
  notes: string;
};

export type CreateTaskPayload = {
  name: string;
  description?: string;
  codeType: "lambda" | "docker";
  dockerImage?: string;
  ownerId: string;
  projectId: string;
  strategies?: Array<{
    periodicity: StrategyPeriodicity;
    times?: string[];
    executionTime?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
  }>;
};
