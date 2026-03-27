"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PayloadPreview } from "@/components/task-upload/PayloadPreview";
import { TaskUploadForm } from "@/components/task-upload/TaskUploadForm";
import { createTask } from "@/lib/task/api";
import { readSession } from "@/lib/auth/storage";
import {
  activateStrategy,
  fetchTaskStrategies,
  invokeStrategyNow,
} from "@/lib/task-strategies/api";
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
      attachStrategy: form.attachStrategy ?? false,
      strategyPeriodicity: form.strategyPeriodicity ?? "once",
      strategyExecutionTime: form.strategyExecutionTime ?? "09:00",
      strategyTimesCsv: form.strategyTimesCsv ?? "09:00",
      strategyDayOfWeek: Number.isFinite(form.strategyDayOfWeek)
        ? form.strategyDayOfWeek
        : 1,
      strategyDayOfMonth: Number.isFinite(form.strategyDayOfMonth)
        ? form.strategyDayOfMonth
        : 1,
      activateStrategyOnCreate: form.activateStrategyOnCreate ?? false,
    }),
    [form],
  );

  const canSubmit = useMemo(() => canSubmitTaskForm(normalizedForm), [normalizedForm]);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setIsLoadingProjects(true);
      try {
        const orgId = readSession()?.user?.organizationId ?? null;
        const data = await fetchProjects(orgId);
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

    const effectiveForm: TaskFormState =
      normalizedForm.executionMode === "immediate" && !normalizedForm.attachStrategy
        ? {
            ...normalizedForm,
            attachStrategy: true,
            strategyPeriodicity: "once",
          }
        : normalizedForm;

    const payload = buildCreateTaskPayload(effectiveForm);
    setPayloadPreview(JSON.stringify(payload, null, 2));
    setIsSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const created = await createTask(payload, normalizedForm);

      const shouldActivateAfterCreate =
        effectiveForm.attachStrategy &&
        created.id &&
        (effectiveForm.activateStrategyOnCreate ||
          (effectiveForm.executionMode === "immediate" &&
            effectiveForm.strategyPeriodicity === "once"));

      if (
        shouldActivateAfterCreate
      ) {
        const strategies = await fetchTaskStrategies(created.id);
        const newest = strategies[strategies.length - 1];
        if (newest?.id) {
          if (
            effectiveForm.executionMode === "immediate" &&
            effectiveForm.strategyPeriodicity === "once"
          ) {
            await invokeStrategyNow(newest.id);
          } else {
            await activateStrategy(newest.id);
          }
        }
      }

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
