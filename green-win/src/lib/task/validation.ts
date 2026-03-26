import { CreateTaskPayload, TaskFormState } from "./types";

export function canSubmitTaskForm(form: TaskFormState): boolean {
  const hasRuntime =
    form.runtimeType === "lambda_code"
      ? form.lambdaFiles.length > 0
      : Boolean(form.dockerImage.trim());

  const hasRequiredDeadline =
    form.executionMode === "deadline" ? Boolean(form.deadline) : true;

  return (
    Boolean(form.taskName.trim()) &&
    hasRuntime &&
    form.preferredClouds.length > 0 &&
    form.preferredRegions.length > 0 &&
    hasRequiredDeadline
  );
}

export function buildCreateTaskPayload(form: TaskFormState): CreateTaskPayload {
  return {
    name: form.taskName.trim(),
    runtimeType: form.runtimeType,
    runtime:
      form.runtimeType === "lambda_code"
        ? {
            lambdaFiles: form.lambdaFiles.map((file) => ({
              name: file.name,
              size: file.size,
              type: file.type,
            })),
          }
        : { dockerImage: form.dockerImage.trim() },
    executionMode: form.executionMode,
    deadline:
      form.executionMode === "deadline"
        ? new Date(form.deadline).toISOString()
        : null,
    preferences: {
      clouds: form.preferredClouds,
      regions: form.preferredRegions,
      priority: form.priority,
    },
    notes: form.notes.trim() || null,
  };
}
