import { CreateTaskPayload, TaskFormState } from "./types";
import { readSession } from "../auth/storage";

export function canSubmitTaskForm(form: TaskFormState): boolean {
  const hasRuntime =
    form.runtimeType === "lambda_code"
      ? form.lambdaFiles.length > 0
      : Boolean(form.dockerImage.trim());

  const schedulingEnabled =
    form.executionMode === "deadline" ? form.attachStrategy : true;

  const validWeeklyDay =
    Number.isInteger(form.strategyDayOfWeek) &&
    form.strategyDayOfWeek >= 0 &&
    form.strategyDayOfWeek <= 6;

  const validMonthlyDay =
    Number.isInteger(form.strategyDayOfMonth) &&
    form.strategyDayOfMonth >= 1 &&
    form.strategyDayOfMonth <= 31;

  const strategyValid = !form.attachStrategy
    ? true
    : form.strategyPeriodicity === "once"
      ? Boolean(form.strategyExecutionTime)
      : form.strategyPeriodicity === "daily"
        ? form.strategyTimesCsv
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean).length > 0
        : form.strategyPeriodicity === "weekly"
          ? Boolean(form.strategyExecutionTime) && validWeeklyDay
          : Boolean(form.strategyExecutionTime) && validMonthlyDay;

  return (
    Boolean(form.taskName.trim()) &&
    Boolean(form.projectId) &&
    hasRuntime &&
    schedulingEnabled &&
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

  if (form.attachStrategy) {
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
          ? form.strategyExecutionTime || undefined
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
