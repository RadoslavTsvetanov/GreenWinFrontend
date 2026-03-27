"use client";

import { FormEvent } from "react";
import { TaskFormState } from "@/lib/task/types";
import { ExecutionSection } from "./ExecutionSection";
import { FormFeedback } from "./FormFeedback";
import { RuntimeSection } from "./RuntimeSection";
import { TaskFormChangeHandler } from "./types";
import { ProjectOption } from "@/lib/projects/api";
import { Card, Input, Select } from "@/components/ui/primitives";

type TaskUploadFormProps = {
  form: TaskFormState;
  isSubmitting: boolean;
  canSubmit: boolean;
  errorMessage: string;
  successMessage: string;
  projects: ProjectOption[];
  isLoadingProjects: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onChange: TaskFormChangeHandler;
};

export function TaskUploadForm({
  form,
  isSubmitting,
  canSubmit,
  errorMessage,
  successMessage,
  projects,
  isLoadingProjects,
  onSubmit,
  onChange,
}: TaskUploadFormProps) {
  return (
    <Card className="lg:col-span-2">
      <form className="space-y-6" onSubmit={onSubmit}>
        <div>
          <label htmlFor="taskName" className="block text-sm font-medium text-slate-800">
            Task name *
          </label>
          <Input
            id="taskName"
            type="text"
            value={form.taskName ?? ""}
            onChange={(value) => onChange("taskName", value)}
            className="mt-2 bg-slate-50"
            placeholder="train-vision-model-nightly"
          />
        </div>

        <div>
          <label htmlFor="projectId" className="block text-sm font-medium text-slate-800">
            Project *
          </label>
          <Select
            id="projectId"
            value={form.projectId}
            onChange={(value) => onChange("projectId", value)}
            disabled={isLoadingProjects}
            className="mt-2 bg-slate-50"
          >
            <option value="">
              {isLoadingProjects ? "Loading projects..." : "Select a project"}
            </option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </Select>
        </div>

        <RuntimeSection form={form} onChange={onChange} />
        <ExecutionSection form={form} onChange={onChange} />
        <FormFeedback
          isSubmitting={isSubmitting}
          canSubmit={canSubmit}
          errorMessage={errorMessage}
          successMessage={successMessage}
        />
      </form>
    </Card>
  );
}
