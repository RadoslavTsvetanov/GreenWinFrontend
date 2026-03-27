"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PayloadPreview } from "@/components/task-upload/PayloadPreview";
import { TaskUploadForm } from "@/components/task-upload/TaskUploadForm";
import { createTask } from "@/lib/task/api";
import { INITIAL_TASK_FORM_STATE } from "@/lib/task/constants";
import { buildCreateTaskPayload, canSubmitTaskForm } from "@/lib/task/validation";
import { TaskFormState } from "@/lib/task/types";
import { useToast } from "@/components/ui/Toast";
import { fetchProjects, ProjectOption } from "@/lib/projects/api";
import { BackLink, PageHeader, PageShell } from "@/components/ui/primitives";

export default function NewTaskPage() {
  const router = useRouter();
  const [form, setForm] = useState<TaskFormState>(INITIAL_TASK_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [payloadPreview, setPayloadPreview] = useState("");
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const { showError, showSuccess } = useToast();

  const normalizedForm = useMemo<TaskFormState>(
    () => ({
      ...INITIAL_TASK_FORM_STATE,
      ...form,
      taskName: form.taskName ?? "",
      projectId: form.projectId ?? "",
      lambdaFiles: form.lambdaFiles ?? [],
      dockerImage: form.dockerImage ?? "",
      deadline: form.deadline ?? "",
      notes: form.notes ?? "",
    }),
    [form],
  );

  const canSubmit = useMemo(() => canSubmitTaskForm(normalizedForm), [normalizedForm]);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setIsLoadingProjects(true);
      try {
        const data = await fetchProjects();
        if (cancelled) return;
        setProjects(data);
        if (!form.projectId && data.length > 0) {
          setForm((prev) => ({ ...prev, projectId: data[0].id }));
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to load projects.";
          setErrorMessage(message);
          showError(message);
        }
      } finally {
        if (!cancelled) {
          setIsLoadingProjects(false);
        }
      }
    }

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, [form.projectId, showError]);

  const onChange = <K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K],
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
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
      showSuccess("Task uploaded successfully.");
      const projectId = normalizedForm.projectId.trim();
      const path = projectId
        ? `/tasks?projectId=${encodeURIComponent(projectId)}`
        : "/tasks";
      router.replace(path);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Unknown error during upload.";
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-6xl space-y-4">
        <BackLink href="/tasks" label="Back to tasks" />
        <PageHeader
          eyebrow="Task setup"
          title="Create new task"
          subtitle="Define runtime and execution preferences, then upload your package."
        />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <TaskUploadForm
          form={normalizedForm}
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          errorMessage={errorMessage}
          successMessage={successMessage}
          projects={projects}
          isLoadingProjects={isLoadingProjects}
          onSubmit={onSubmit}
          onChange={onChange}
        />
        <PayloadPreview payloadPreview={payloadPreview} />
        </div>
      </main>
    </PageShell>
  );
}
