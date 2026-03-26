"use client";

import { FormEvent } from "react";
import { TaskFormState } from "@/lib/task/types";
import { ExecutionSection } from "./ExecutionSection";
import { FormFeedback } from "./FormFeedback";
import { PreferencesSection } from "./PreferencesSection";
import { RuntimeSection } from "./RuntimeSection";
import { TaskFormChangeHandler, TaskFormToggleArrayHandler } from "./types";

type TaskUploadFormProps = {
  form: TaskFormState;
  isSubmitting: boolean;
  canSubmit: boolean;
  errorMessage: string;
  successMessage: string;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: TaskFormChangeHandler;
  onToggleArrayValue: TaskFormToggleArrayHandler;
};

export function TaskUploadForm({
  form,
  isSubmitting,
  canSubmit,
  errorMessage,
  successMessage,
  onSubmit,
  onChange,
  onToggleArrayValue,
}: TaskUploadFormProps) {
  return (
    <section className="rounded-3xl border border-white/70 bg-white/80 p-6 shadow-xl shadow-slate-200 backdrop-blur lg:col-span-2">
      <div className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
        Green scheduler
      </div>
      <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
        Create a new task
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Upload Lambda code or Docker image and let the scheduler run it in greener regions.
      </p>

      <form className="mt-8 space-y-6" onSubmit={onSubmit}>
        <div>
          <label htmlFor="taskName" className="block text-sm font-medium text-slate-800">
            Task name *
          </label>
          <input
            id="taskName"
            type="text"
            value={form.taskName ?? ""}
            onChange={(event) => onChange("taskName", event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder="train-vision-model-nightly"
          />
        </div>

        <RuntimeSection form={form} onChange={onChange} />
        <ExecutionSection form={form} onChange={onChange} />
        <PreferencesSection
          form={form}
          onChange={onChange}
          onToggleArrayValue={onToggleArrayValue}
        />
        <FormFeedback
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </form>
    </section>
  );
}
