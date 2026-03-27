import { ManagedTask } from "./types";

export function mapTaskStatusToManaged(
  status: string | null | undefined,
): ManagedTask["status"] {
  switch (status) {
    case "queued":
      return "queued";
    case "running":
      return "running";
    case "failed":
      return "failed";
    case "succeeded":
      return "completed";
    case "postponed":
      return "scheduled";
    case "draft":
    default:
      return "queued";
  }
}

export function mapTaskCodeTypeToRuntimeType(
  codeType: string | null | undefined,
): ManagedTask["runtimeType"] {
  switch (codeType) {
    case "docker":
      return "docker_image";
    case "lambda":
    default:
      return "lambda_code";
  }
}

export function mapTaskRunModeToExecutionMode(
  mode: string | null | undefined,
): ManagedTask["executionMode"] {
  switch (mode) {
    case "scheduled":
      return "deadline";
    case "immediate":
    default:
      return "immediate";
  }
}

