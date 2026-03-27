import { TaskFormState } from "./types";

export const INITIAL_TASK_FORM_STATE: TaskFormState = {
  taskName: "",
  projectId: "",
  runtimeType: "lambda_code",
  lambdaFiles: [],
  dockerImage: "",
  executionMode: "immediate",
  deadline: "",
  attachStrategy: false,
  strategyPeriodicity: "once",
  strategyExecutionTime: "09:00",
  strategyTimesCsv: "09:00",
  strategyDayOfWeek: 1,
  strategyDayOfMonth: 1,
  activateStrategyOnCreate: false,
  notes: "",
};
