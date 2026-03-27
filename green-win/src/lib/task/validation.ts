import { CreateTaskPayload, TaskFormState } from "./types";
import { readSession } from "../auth/storage";

export function canSubmitTaskForm(form: TaskFormState): boolean {
  const hasRuntime =
    form.runtimeType === "lambda_code"
      ? form.lambdaFiles.length > 0
      : Boolean(form.dockerImage.trim());

  const hasRequiredDeadline =
    form.executionMode === "deadline" ? Boolean(form.deadline) : true;

  const strategyValid = !form.attachStrategy
    ? true
    : form.strategyPeriodicity === "once"
      ? true
      : form.strategyPeriodicity === "daily"
        ? form.strategyTimesCsv
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean).length > 0
        : Boolean(form.strategyExecutionTime);

  return (
    Boolean(form.taskName.trim()) &&
    Boolean(form.projectId) &&
    hasRuntime &&
    hasRequiredDeadline &&
    strategyValid
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
    codeType: form.runtimeType === "lambda_code" ? "lambda" : "docker",
    ownerId: session.user.id,
    projectId: form.projectId,
  };

  if (form.runtimeType === "docker_image") {
    payload.dockerImage = form.dockerImage.trim();
  }

  if (form.executionMode === "deadline" && form.deadline) {
    payload.latestFinishAt = new Date(form.deadline).toISOString();
  }

  if (form.attachStrategy) {
    const now = new Date();
    const currentUtcTime = `${String(now.getUTCHours()).padStart(2, "0")}:${String(
      now.getUTCMinutes(),
    ).padStart(2, "0")}`;

    const strategy = {
      periodicity: form.strategyPeriodicity,
      times:
        form.strategyPeriodicity === "daily"
          ? form.strategyTimesCsv
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean)
          : undefined,
      executionTime:
        form.strategyPeriodicity === "once"
          ? currentUtcTime
          : form.strategyPeriodicity === "daily"
          ? undefined
          : form.strategyExecutionTime || undefined,
      dayOfWeek:
        form.strategyPeriodicity === "weekly"
          ? Number(form.strategyDayOfWeek)
          : undefined,
      dayOfMonth:
        form.strategyPeriodicity === "monthly"
          ? Number(form.strategyDayOfMonth)
          : undefined,
    };
    payload.strategies = [strategy];
  }

  return payload;
}
