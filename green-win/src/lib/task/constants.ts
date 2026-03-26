import { TaskFormState } from "./types";

export const CLOUD_PROVIDER_OPTIONS = ["aws", "gcp", "azure"] as const;

export const REGION_OPTIONS = [
  "eu-central-1",
  "eu-west-1",
  "europe-west1",
  "westeurope",
] as const;

export const INITIAL_TASK_FORM_STATE: TaskFormState = {
  taskName: "",
  runtimeType: "lambda_code",
  lambdaFiles: [],
  dockerImage: "",
  executionMode: "immediate",
  deadline: "",
  preferredClouds: ["aws"],
  preferredRegions: ["eu-central-1"],
  priority: "balanced",
  notes: "",
};
