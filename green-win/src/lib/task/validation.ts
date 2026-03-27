import { CreateTaskPayload, TaskFormState } from "./types";
import { readSession } from "../auth/storage";

export function canSubmitTaskForm(form: TaskFormState): boolean {
  const hasRuntime =
    form.runtimeType === "lambda_code"
      ? form.lambdaFiles.length > 0
      : Boolean(form.dockerImage.trim());

  const hasRequiredDeadline =
    form.executionMode === "deadline" ? Boolean(form.deadline) : true;

  return (
    Boolean(form.taskName.trim()) &&
    Boolean(form.projectId) &&
    hasRuntime &&
    hasRequiredDeadline
  );
}

export function buildCreateTaskPayload(form: TaskFormState): CreateTaskPayload {
  const session = readSession();
  if (!session?.user?.id) {
    throw new Error("Please login first.");
  }

  const payload: CreateTaskPayload = {
    name: form.taskName.trim(),
    description: form.notes.trim() || undefined,
    projectId: form.projectId,
  };

  if (form.runtimeType === "docker_image") {
    payload.dockerImage = form.dockerImage.trim();
  }

  if (form.executionMode === "deadline" && form.deadline) {
    payload.latestFinishAt = new Date(form.deadline).toISOString();
  }

  return payload;
}
