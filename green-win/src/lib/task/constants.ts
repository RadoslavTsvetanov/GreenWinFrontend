import { TaskFormState } from "./types";

export const INITIAL_TASK_FORM_STATE: TaskFormState = {
  taskName: "",
  projectId: "",
  runtimeType: "lambda_code",
  lambdaFiles: [],
  dockerImage: "",
  executionMode: "immediate",
  deadline: "",
  notes: "",
};
