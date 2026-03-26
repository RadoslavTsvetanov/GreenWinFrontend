"use client";

import { FormEvent, useMemo, useState } from "react";
import { PayloadPreview } from "@/components/task-upload/PayloadPreview";
import { TaskUploadForm } from "@/components/task-upload/TaskUploadForm";
import { createTask } from "@/lib/task/api";
import { INITIAL_TASK_FORM_STATE } from "@/lib/task/constants";
import { buildCreateTaskPayload, canSubmitTaskForm } from "@/lib/task/validation";
import { TaskFormState } from "@/lib/task/types";

export default function NewTaskPage() {
  const [form, setForm] = useState<TaskFormState>(INITIAL_TASK_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [payloadPreview, setPayloadPreview] = useState("");

  const normalizedForm = useMemo<TaskFormState>(
    () => ({
      ...INITIAL_TASK_FORM_STATE,
      ...form,
      taskName: form.taskName ?? "",
      lambdaFiles: form.lambdaFiles ?? [],
      dockerImage: form.dockerImage ?? "",
      deadline: form.deadline ?? "",
      preferredClouds: form.preferredClouds ?? [],
      preferredRegions: form.preferredRegions ?? [],
      notes: form.notes ?? "",
    }),
    [form],
  );

  const canSubmit = useMemo(() => canSubmitTaskForm(normalizedForm), [normalizedForm]);

  const onChange = <K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onToggleArrayValue = (
    key: "preferredClouds" | "preferredRegions",
    value: string,
  ) => {
    setForm((prev) => {
      const source = prev[key];
      const nextValues = source.includes(value)
        ? source.filter((item) => item !== value)
        : [...source, value];
      return { ...prev, [key]: nextValues };
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      setErrorMessage("Please fill all required fields.");
      setSuccessMessage("");
      return;
    }

    const payload = buildCreateTaskPayload(normalizedForm);
    setPayloadPreview(JSON.stringify(payload, null, 2));
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      await createTask(payload, normalizedForm);
      setSuccessMessage("Task uploaded successfully.");
    } catch (error) {
      const message =
        error instanceof Error
          ? `${error.message}. If backend is not running yet, this is expected.`
          : "Unknown error during upload.";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50 to-emerald-50 p-6 text-slate-900 sm:p-10">
      <main className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
        <TaskUploadForm
          form={normalizedForm}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          errorMessage={errorMessage}
          successMessage={successMessage}
          onSubmit={onSubmit}
          onChange={onChange}
          onToggleArrayValue={onToggleArrayValue}
        />
        <PayloadPreview payloadPreview={payloadPreview} />
      </main>
    </div>
  );
}
