import { CreateTaskPayload, TaskFormState } from "./types";
import { authorizedApiFetch, ensureOk } from "../api/http";

export async function createTask(
  payload: CreateTaskPayload,
  form: TaskFormState,
): Promise<void> {
  if (form.lambdaFiles.length === 0) {
    throw new Error("Please upload one Lambda zip file.");
  }

  const response = await authorizedApiFetch("/tasks", {
      method: "POST",
      headers: {},
      body: buildMultipartPayload(payload, form.lambdaFiles),
    });

  await ensureOk(response);
}

function buildMultipartPayload(
  payload: CreateTaskPayload,
  files: File[],
): FormData {
  const formData = new FormData();
  formData.append("data", JSON.stringify(payload));
  if (files.length > 0) {
    formData.append("lambdaZip", files[0]);
  }
  return formData;
}
