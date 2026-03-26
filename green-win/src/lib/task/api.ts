import { CreateTaskPayload, TaskFormState } from "./types";

export async function createTask(
  payload: CreateTaskPayload,
  form: TaskFormState,
): Promise<void> {
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL?.trim() || "";
  const endpoint = `${apiBase}/api/tasks`;

  const response =
    form.runtimeType === "lambda_code"
      ? await fetch(endpoint, {
          method: "POST",
          body: buildMultipartPayload(payload, form.lambdaFiles),
        })
      : await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`);
  }
}

function buildMultipartPayload(
  payload: CreateTaskPayload,
  files: File[],
): FormData {
  const formData = new FormData();
  formData.append("task", JSON.stringify(payload));
  files.forEach((file) => formData.append("lambdaFiles", file));
  return formData;
}
