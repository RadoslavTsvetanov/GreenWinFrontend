"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useToast } from "@/components/ui/Toast";
import { readSession } from "@/lib/auth/storage";
import {
  createProject,
  fetchProjectsDetailed,
  ProjectRecord,
} from "@/lib/projects/api";
import { saveSelectedProjectId } from "@/lib/projects/selection";
import {
  Button,
  Card,
  Input,
  PageHeader,
  PageShell,
} from "@/components/ui/primitives";

export default function ProjectsPage() {
  const { showError, showSuccess } = useToast();
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [organizationIdInput, setOrganizationIdInput] = useState("");

  const organizationIdFromSession = readSession()?.user?.organizationId ?? null;
  const organizationIdFromProjects = useMemo(
    () => projects.find((project) => project.organizationId)?.organizationId ?? null,
    [projects],
  );
  const resolvedOrganizationId =
    organizationIdFromSession || organizationIdFromProjects || organizationIdInput.trim() || "";

  async function loadProjects() {
    setIsLoading(true);
    try {
      const data = await fetchProjectsDetailed();
      setProjects(data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to load projects.";
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  const onCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      showError("Project name is required.");
      return;
    }
    if (!resolvedOrganizationId) {
      showError("Organization ID is required to create a project.");
      return;
    }

    setIsCreating(true);
    try {
      const created = await createProject({
        name: trimmedName,
        description: description.trim() || undefined,
        organizationId: resolvedOrganizationId,
      });
      setProjects((prev) => [created, ...prev]);
      setName("");
      setDescription("");
      saveSelectedProjectId(created.id);
      showSuccess(`Project "${created.name}" created.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to create project.";
      showError(message);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-6xl space-y-4">
        <PageHeader
          eyebrow="Workspace"
          title="Projects"
          subtitle="Create and manage projects. Tasks can then be filtered by project."
        />

        <Card>
          <h2 className="text-base font-semibold text-slate-900">Create project</h2>
          <form className="mt-4 grid gap-3 md:grid-cols-2" onSubmit={onCreate}>
            <Input
              type="text"
              value={name}
              onChange={setName}
              placeholder="Project name"
              className="bg-slate-50"
            />
            <Input
              type="text"
              value={description}
              onChange={setDescription}
              placeholder="Description (optional)"
              className="bg-slate-50"
            />
            {!organizationIdFromSession && !organizationIdFromProjects && (
              <Input
                type="text"
                value={organizationIdInput}
                onChange={setOrganizationIdInput}
                placeholder="Organization ID (required)"
                className="bg-slate-50 md:col-span-2"
              />
            )}
            <Button
              type="submit"
              disabled={isCreating}
              variant="primary"
              className="md:col-span-2"
            >
              {isCreating ? "Creating..." : "Create project"}
            </Button>
          </form>
        </Card>

        <Card>
          <h2 className="text-base font-semibold text-slate-900">Existing projects</h2>

          {isLoading ? (
            <p className="mt-3 text-sm text-slate-600">Loading projects...</p>
          ) : projects.length === 0 ? (
            <p className="mt-3 text-sm text-slate-600">No projects found.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/tasks?projectId=${encodeURIComponent(project.id)}`}
                  className="group block rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm transition hover:border-emerald-300 hover:bg-emerald-50/40"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-semibold text-slate-900">{project.name}</p>
                    <span className="inline-flex min-w-24 items-center justify-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition group-hover:border-emerald-200 group-hover:bg-emerald-50 group-hover:text-emerald-700">
                      <span>View tasks</span>
                      <span aria-hidden="true">→</span>
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {project.description || "No description"} | {project.tasksCount} tasks
                  </p>
                </Link>
              ))}
            </div>
          )}
        </Card>
      </main>
    </PageShell>
  );
}

