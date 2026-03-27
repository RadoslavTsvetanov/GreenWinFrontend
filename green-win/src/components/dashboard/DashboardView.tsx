"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { fetchTasks } from "@/lib/task-management/api";
import { fetchAllExecutions, type TaskExecutionListItem } from "@/lib/task-executions/api";
import { fetchAllCheckpoints, type CheckpointRecord } from "@/lib/checkpoints/api";
import {
  fetchProjectsDetailed,
  type ProjectRecord,
} from "@/lib/projects/api";
import { readSession } from "@/lib/auth/storage";
import {
  readSelectedProjectId,
  saveSelectedProjectId,
} from "@/lib/projects/selection";
import {
  bucketCheckpointsByDay,
  bucketExecutionsByDay,
  countByField,
  countTasksByStatus,
  executionInstant,
  filterCheckpointsByRange,
  filterCheckpointsByTaskIds,
  filterExecutionsByRange,
  filterExecutionsByTaskIds,
  filterTasksByProject,
  successRate,
  taskIdSetForProjectFilter,
  totalActiveStrategies,
  type DashboardTaskRow,
  type TimeRangePreset,
} from "@/lib/dashboard/aggregate";
import { mapTasksToDashboardRows } from "@/lib/dashboard/taskRows";
import { useToast } from "@/components/ui/Toast";
import {
  Button,
  InlineAlert,
  LinkButton,
  LoadingState,
  PageHeader,
  PageShell,
  Select,
} from "@/components/ui/primitives";
import { DashboardKpiStrip } from "@/components/dashboard/DashboardKpiStrip";
import { ExecutionActivityChart } from "@/components/dashboard/ExecutionActivityChart";
import { ExecutionStatusDonut } from "@/components/dashboard/ExecutionStatusDonut";
import { ProviderBarChart } from "@/components/dashboard/ProviderBarChart";
import { TaskStatusBarChart } from "@/components/dashboard/TaskStatusBarChart";
import { CheckpointActivityChart } from "@/components/dashboard/CheckpointActivityChart";
import { RecentExecutionsTable } from "@/components/dashboard/RecentExecutionsTable";

function compareExecRecent(a: TaskExecutionListItem, b: TaskExecutionListItem) {
  const ta = executionInstant(a);
  const tb = executionInstant(b);
  if (!ta && !tb) return 0;
  if (!ta) return 1;
  if (!tb) return -1;
  return new Date(tb).getTime() - new Date(ta).getTime();
}

export function DashboardView() {
  const searchParams = useSearchParams();
  const { showError } = useToast();
  const [timeRange, setTimeRange] = useState<TimeRangePreset>("30d");
  const [selectedProjectId, setSelectedProjectId] = useState<string>("all");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [tasks, setTasks] = useState<DashboardTaskRow[]>([]);
  const [executions, setExecutions] = useState<TaskExecutionListItem[]>([]);
  const [checkpoints, setCheckpoints] = useState<CheckpointRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadDashboard = useCallback(async () => {
    setErrorMessage("");
    setIsLoading(true);
    const userId = readSession()?.user?.id;

    try {
      const [taskRows, execRows, cpRows] = await Promise.all([
        fetchTasks(userId).then(mapTasksToDashboardRows),
        fetchAllExecutions(),
        fetchAllCheckpoints(),
      ]);
      setTasks(taskRows);
      setExecutions(execRows);
      setCheckpoints(cpRows);
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Could not load dashboard data.";
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  useEffect(() => {
    let cancelled = false;

    async function loadProjects() {
      setIsLoadingProjects(true);
      try {
        const data = await fetchProjectsDetailed();
        if (cancelled) return;
        setProjects(data);

        const projectFromUrl = searchParams.get("projectId");
        if (projectFromUrl && data.some((project) => project.id === projectFromUrl)) {
          setSelectedProjectId(projectFromUrl);
          saveSelectedProjectId(projectFromUrl);
          return;
        }

        const stored = readSelectedProjectId();
        if (stored && data.some((project) => project.id === stored)) {
          setSelectedProjectId(stored);
        }
      } catch (e) {
        if (!cancelled) {
          const message =
            e instanceof Error ? e.message : "Failed to load projects.";
          showError(message);
        }
      } finally {
        if (!cancelled) setIsLoadingProjects(false);
      }
    }

    loadProjects();
    return () => {
      cancelled = true;
    };
  }, [searchParams, showError]);

  const scopedTasks = useMemo(
    () => filterTasksByProject(tasks, selectedProjectId),
    [tasks, selectedProjectId],
  );

  const taskIdFilter = useMemo(
    () => taskIdSetForProjectFilter(tasks, selectedProjectId),
    [tasks, selectedProjectId],
  );

  const filteredExecutions = useMemo(() => {
    const byRange = filterExecutionsByRange(executions, timeRange);
    return filterExecutionsByTaskIds(byRange, taskIdFilter);
  }, [executions, timeRange, taskIdFilter]);

  const filteredCheckpoints = useMemo(() => {
    const byRange = filterCheckpointsByRange(checkpoints, timeRange);
    return filterCheckpointsByTaskIds(byRange, taskIdFilter);
  }, [checkpoints, timeRange, taskIdFilter]);

  const execByDay = useMemo(
    () => bucketExecutionsByDay(filteredExecutions),
    [filteredExecutions],
  );

  const cpByDay = useMemo(
    () => bucketCheckpointsByDay(filteredCheckpoints),
    [filteredCheckpoints],
  );

  const statusSlices = useMemo(
    () => countByField(filteredExecutions, (e) => e.status),
    [filteredExecutions],
  );

  const providerRows = useMemo(
    () =>
      countByField(filteredExecutions, (e) =>
        e.provider?.trim() ? e.provider.trim() : "Unspecified",
      ),
    [filteredExecutions],
  );

  const taskStatusRows = useMemo(
    () => countTasksByStatus(scopedTasks),
    [scopedTasks],
  );

  const terminalStats = useMemo(
    () => successRate(filteredExecutions),
    [filteredExecutions],
  );

  const metricsRuns = useMemo(
    () => filteredExecutions.filter((e) => e.hasMetrics).length,
    [filteredExecutions],
  );

  const recentExecutions = useMemo(() => {
    const copy = [...filteredExecutions];
    copy.sort(compareExecRecent);
    return copy.slice(0, 8);
  }, [filteredExecutions]);

  const activeStrategies = useMemo(
    () => totalActiveStrategies(scopedTasks),
    [scopedTasks],
  );

  const kpis = useMemo(() => {
    const rateLabel =
      terminalStats.rate === null
        ? "—"
        : `${Math.round(terminalStats.rate * 1000) / 10}%`;

    return [
      {
        label: "Tasks in scope",
        value: String(scopedTasks.length),
        hint:
          selectedProjectId === "all"
            ? `${activeStrategies} active strateg${activeStrategies === 1 ? "y" : "ies"} across these tasks`
            : `${activeStrategies} active strateg${activeStrategies === 1 ? "y" : "ies"} in this filter`,
      },
      {
        label: "Executions",
        value: String(filteredExecutions.length),
        hint:
          metricsRuns > 0
            ? `${metricsRuns} run${metricsRuns === 1 ? "" : "s"} include a metrics payload`
            : "Filtered by time range and project",
      },
      {
        label: "Finished successfully",
        value: rateLabel,
        hint:
          terminalStats.terminal > 0
            ? `${terminalStats.succeeded} of ${terminalStats.terminal} terminal outcomes succeeded`
            : "No finished executions in this slice yet",
      },
      {
        label: "Checkpoints",
        value: String(filteredCheckpoints.length),
        hint: "Persisted progress records in the selected window",
      },
    ];
  }, [
    activeStrategies,
    filteredCheckpoints.length,
    filteredExecutions.length,
    metricsRuns,
    scopedTasks.length,
    selectedProjectId,
    terminalStats.rate,
    terminalStats.succeeded,
    terminalStats.terminal,
  ]);

  const unassignedTasksCount = useMemo(
    () => tasks.filter((task) => task.projectId === null).length,
    [tasks],
  );

  return (
    <PageShell className="bg-[#f3f6f3]">
      <main className="mx-auto w-full max-w-[1600px] space-y-5 pb-10">
        <PageHeader
          eyebrow="Analytics"
          title="Operations dashboard"
          subtitle="Live slices of tasks, executions, and checkpoints — all from your GreenWin API."
          actions={
            <>
              <Button
                type="button"
                variant="secondary"
                onClick={() => loadDashboard()}
                disabled={isLoading}
              >
                Refresh
              </Button>
              <LinkButton href="/tasks" variant="secondary">
                Task list
              </LinkButton>
              <LinkButton href="/tasks/new" variant="primary">
                New task
              </LinkButton>
            </>
          }
        />

        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
          <label className="flex flex-col gap-1.5 text-sm">
            <span className="font-medium text-slate-700">Time range</span>
            <Select
              value={timeRange}
              onChange={(v) => setTimeRange(v as TimeRangePreset)}
              className="bg-slate-50"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </Select>
          </label>
          <label className="flex flex-col gap-1.5 text-sm sm:col-span-2 lg:col-span-3">
            <span className="font-medium text-slate-700">Project focus</span>
            <Select
              value={selectedProjectId}
              onChange={(value) => {
                setSelectedProjectId(value);
                saveSelectedProjectId(
                  value === "all" || value === "__unassigned__" ? null : value,
                );
              }}
              disabled={isLoadingProjects}
              className="max-w-xl bg-slate-50"
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
          </label>
        </div>

        {errorMessage ? (
          <InlineAlert tone="error">{errorMessage}</InlineAlert>
        ) : null}

        {isLoading ? (
          <LoadingState label="Loading dashboard…" />
        ) : (
          <>
            <DashboardKpiStrip items={kpis} />

            <div className="grid gap-4 lg:grid-cols-2">
              <ExecutionActivityChart data={execByDay} />
              <ExecutionStatusDonut data={statusSlices} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <ProviderBarChart data={providerRows} />
              <TaskStatusBarChart data={taskStatusRows} />
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <CheckpointActivityChart data={cpByDay} />
              <RecentExecutionsTable rows={recentExecutions} />
            </div>
          </>
        )}
      </main>
    </PageShell>
  );
}
