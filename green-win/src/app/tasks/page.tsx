"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TaskFilters } from "@/components/task-management/TaskFilters";
import { TaskStats } from "@/components/task-management/TaskStats";
import { TaskTable } from "@/components/task-management/TaskTable";
import { ManagedTask, TaskStatus } from "@/lib/task-management/types";
import { readSession } from "@/lib/auth/storage";
import { useToast } from "@/components/ui/Toast";
import { fetchTasks } from "@/lib/task-management/api";
import { fetchProjectsDetailed, ProjectRecord } from "@/lib/projects/api";
import Link from "next/link";
import {
  readSelectedProjectId,
  saveSelectedProjectId,
} from "@/lib/projects/selection";
import {
  Button,
  Card,
  EmptyState,
  InlineAlert,
  LinkButton,
  LoadingState,
  PageHeader,
  PageShell,
  Select,
} from "@/components/ui/primitives";
import {
  mapTaskCodeTypeToRuntimeType,
  mapTaskRunModeToExecutionMode,
  mapTaskStatusToManaged,
} from "@/lib/task-management/adapters";

function TasksPageContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | TaskStatus>("all");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [tasks, setTasks] = useState<ManagedTask[]>([]);
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const { showError } = useToast();

  useEffect(() => {
    let isCancelled = false;

    async function loadTasks() {
      setErrorMessage("");

      const userId = readSession()?.user?.id;
      setIsLoading(true);

      try {
        const data = await fetchTasks(userId);

        if (isCancelled) return;

        const mapped: ManagedTask[] = data.map((task) => {
          const status = mapTaskStatusToManaged(task.status);
          const runtimeType = mapTaskCodeTypeToRuntimeType(task.codeType);
          const executionMode = mapTaskRunModeToExecutionMode(
            task.latestFinishAt ? "scheduled" : "immediate",
          );

          const providerRaw =
            Array.isArray(task.allowedCloudProviders) &&
            task.allowedCloudProviders.length > 0
              ? String(task.allowedCloudProviders[0])
              : null;
          const provider =
            providerRaw && providerRaw.trim().length > 0 ? providerRaw : null;

          const region =
            Array.isArray(task.allowedRegions) && task.allowedRegions.length > 0
              ? String(task.allowedRegions[0])
              : null;

          const estimatedCo2SavedGrams =
            typeof task.estimatedCo2SavedGrams === "number"
              ? task.estimatedCo2SavedGrams
              : typeof task.co2SavedGrams === "number"
                ? task.co2SavedGrams
                : null;

          return {
            id: String(task.id ?? ""),
            name: String(task.name ?? ""),
            projectId:
              typeof task.project?.id === "string" ? task.project.id : null,
            projectName:
              typeof task.project?.name === "string" ? task.project.name : null,
            status,
            runtimeType,
            executionMode,
            provider,
            region,
            createdAt: String(task.createdAt ?? new Date().toISOString()),
            deadline: task.latestFinishAt ? String(task.latestFinishAt) : null,
            estimatedCo2SavedGrams,
            notes: String(task.description ?? ""),
          };
        });

        setTasks(mapped);
      } catch (error) {
        if (!isCancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to load tasks.";
          setErrorMessage(message);
          showError(message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadTasks();

    return () => {
      isCancelled = true;
    };
  }, [showError]);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setIsLoadingProjects(true);
      try {
        const data = await fetchProjectsDetailed();
        if (cancelled) return;
        setProjects(data);

        const projectFromUrl = searchParams.get("projectId");
        if (
          projectFromUrl &&
          data.some((project) => project.id === projectFromUrl)
        ) {
          setSelectedProjectId(projectFromUrl);
          saveSelectedProjectId(projectFromUrl);
          return;
        }

        const stored = readSelectedProjectId();
        if (stored && data.some((project) => project.id === stored)) {
          setSelectedProjectId(stored);
        } else {
          setSelectedProjectId("all");
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to load projects.";
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
  }, [searchParams, showError]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesQuery = task.name
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesStatus = status === "all" ? true : task.status === status;
      const matchesProject =
        selectedProjectId === "all"
          ? true
          : selectedProjectId === "__unassigned__"
            ? task.projectId === null
            : task.projectId === selectedProjectId;
      return matchesQuery && matchesStatus && matchesProject;
    });
  }, [query, selectedProjectId, status, tasks]);

  const unassignedTasksCount = useMemo(
    () => tasks.filter((task) => task.projectId === null).length,
    [tasks],
  );

  const selectedProjectName = useMemo(() => {
    if (selectedProjectId === "all") return "All projects";
    if (selectedProjectId === "__unassigned__") return "Unassigned";
    return (
      projects.find((project) => project.id === selectedProjectId)?.name ||
      "Selected project"
    );
  }, [projects, selectedProjectId]);

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-6xl space-y-5">
        <PageHeader
          title="Task management"
          subtitle="Track, filter, and inspect scheduled jobs."
          actions={
            // <>
            //   <LinkButton href="/tasks/new" variant="primary">
            //     New task
            //   </LinkButton>
            //   <LinkButton href="/projects" variant="secondary">
            //     Projects
            //   </LinkButton>
            // </>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/projects"
                className="text-center w-30 rounded-sm bg-base-100 border-primary-900 border px-6 py-2 text-sm body1 text-primary-900
                 hover:bg-primary-700 hover:border-primary-700 hover:text-base-100 ease-out transition duration-300"
              >
                Projects
              </Link>

              <Link
                href="/tasks/new"
                className="text-center w-30 rounded-sm bg-primary-800 px-6 py-2 text-sm body1 text-base-100 hover:bg-primary-900 ease-out transition duration-300"
              >
                New Task
              </Link>
            </div>
          }
        />

        <Card>
          <div className="flex flex-wrap items-center gap-3">
            <label
              htmlFor="projectFilter"
              className="primary1-light text-base-900"
            >
              Project:
            </label>
            <Select
              id="projectFilter"
              value={selectedProjectId}
              onChange={(value) => {
                setSelectedProjectId(value);
                saveSelectedProjectId(
                  value === "all" || value === "__unassigned__" ? null : value,
                );
              }}
              disabled={isLoadingProjects}
              className="min-w-64 bg-slate-50"
            >
              <option value="all">
                {isLoadingProjects ? "Loading projects..." : "All projects"}
              </option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
              <option value="__unassigned__">
                Unassigned ({unassignedTasksCount})
              </option>
            </Select>
          </div>
        </Card>

        {errorMessage && <InlineAlert tone="error">{errorMessage}</InlineAlert>}
        {!isLoading &&
          selectedProjectId !== "all" &&
          filteredTasks.length === 0 &&
          tasks.length > 0 && (
            <InlineAlert tone="info">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span>
                  No tasks in "{selectedProjectName}". Some tasks may be
                  unassigned to any project.
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    onClick={() => {
                      setSelectedProjectId("all");
                      saveSelectedProjectId(null);
                    }}
                  >
                    Show all
                  </Button>
                  {unassignedTasksCount > 0 && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setSelectedProjectId("__unassigned__");
                        saveSelectedProjectId(null);
                      }}
                    >
                      Show unassigned
                    </Button>
                  )}
                </div>
              </div>
            </InlineAlert>
          )}

        <TaskStats tasks={filteredTasks} />
        <TaskFilters
          query={query}
          onQueryChange={setQuery}
          status={status}
          onStatusChange={setStatus}
        />
        {isLoading ? (
          <LoadingState label="Loading tasks..." />
        ) : filteredTasks.length === 0 ? (
          selectedProjectId !== "all" && tasks.length > 0 ? (
            <EmptyState
              title={`No tasks in "${selectedProjectName}"`}
              description="Switch to all tasks or view unassigned tasks."
              action={
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setSelectedProjectId("all");
                      saveSelectedProjectId(null);
                    }}
                  >
                    Show all
                  </Button>
                  {unassignedTasksCount > 0 && (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setSelectedProjectId("__unassigned__");
                        saveSelectedProjectId(null);
                      }}
                    >
                      Show unassigned
                    </Button>
                  )}
                </div>
              }
            />
          ) : (
            <EmptyState
              title="No tasks found"
              description="Try a different filter or create a new task."
              action={<LinkButton href="/tasks/new">Create task</LinkButton>}
            />
          )
        ) : (
          <TaskTable tasks={filteredTasks} />
        )}
      </main>
    </PageShell>
  );
}

export default function TasksPage() {
  return (
    <Suspense
      fallback={
        <PageShell>
          <LoadingState label="Loading tasks…" />
        </PageShell>
      }
    >
      <TasksPageContent />
    </Suspense>
  );
}
