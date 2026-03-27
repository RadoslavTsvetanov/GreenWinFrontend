import type { TaskExecutionListItem } from "@/lib/task-executions/api";
import type { CheckpointRecord } from "@/lib/checkpoints/api";

export type TimeRangePreset = "7d" | "30d" | "90d" | "all";

export type DashboardTaskRow = {
  id: string;
  name: string;
  status: string;
  codeType: string;
  projectId: string | null;
  createdAt: string;
  activeStrategies: number;
};

const TERMINAL: Record<string, true> = {
  succeeded: true,
  failed: true,
  canceled: true,
  timed_out: true,
};

export function rangeStartDate(preset: TimeRangePreset): Date | null {
  if (preset === "all") return null;
  const now = new Date();
  const days = preset === "7d" ? 7 : preset === "30d" ? 30 : 90;
  const d = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  d.setUTCDate(d.getUTCDate() - days);
  return d;
}

export function isoDayUtc(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export function executionInstant(exec: TaskExecutionListItem): string | null {
  return exec.startedAt || exec.createdAt || exec.scheduledAt;
}

export function filterExecutionsByRange(
  items: TaskExecutionListItem[],
  preset: TimeRangePreset,
): TaskExecutionListItem[] {
  const start = rangeStartDate(preset);
  if (!start) return items;
  const t0 = start.getTime();
  return items.filter((e) => {
    const t = executionInstant(e);
    if (!t) return false;
    return new Date(t).getTime() >= t0;
  });
}

export function filterExecutionsByTaskIds(
  items: TaskExecutionListItem[],
  taskIds: Set<string> | null,
): TaskExecutionListItem[] {
  if (!taskIds) return items;
  return items.filter((e) => e.taskId && taskIds.has(e.taskId));
}

export function filterCheckpointsByRange(
  items: CheckpointRecord[],
  preset: TimeRangePreset,
): CheckpointRecord[] {
  const start = rangeStartDate(preset);
  if (!start) return items;
  const t0 = start.getTime();
  return items.filter((c) => new Date(c.createdAt).getTime() >= t0);
}

export function filterCheckpointsByTaskIds(
  items: CheckpointRecord[],
  taskIds: Set<string> | null,
): CheckpointRecord[] {
  if (!taskIds) return items;
  return items.filter((c) => c.taskId && taskIds.has(c.taskId));
}

export function filterTasksByProject(
  tasks: DashboardTaskRow[],
  projectId: string,
): DashboardTaskRow[] {
  if (projectId === "all") return tasks;
  if (projectId === "__unassigned__") {
    return tasks.filter((t) => t.projectId === null);
  }
  return tasks.filter((t) => t.projectId === projectId);
}

export function taskIdSetForProjectFilter(
  tasks: DashboardTaskRow[],
  projectId: string,
): Set<string> | null {
  if (projectId === "all") return null;
  return new Set(filterTasksByProject(tasks, projectId).map((t) => t.id));
}

export function bucketExecutionsByDay(
  items: TaskExecutionListItem[],
): { day: string; count: number }[] {
  const map = new Map<string, number>();
  for (const e of items) {
    const t = executionInstant(e);
    if (!t) continue;
    const day = isoDayUtc(t);
    if (!day) continue;
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, count]) => ({ day, count }));
}

export function bucketCheckpointsByDay(
  items: CheckpointRecord[],
): { day: string; count: number }[] {
  const map = new Map<string, number>();
  for (const c of items) {
    const day = isoDayUtc(c.createdAt);
    if (!day) continue;
    map.set(day, (map.get(day) ?? 0) + 1);
  }
  return [...map.entries()]
    .sort(([a], [b]) => (a < b ? -1 : 1))
    .map(([day, count]) => ({ day, count }));
}

export function countByField(
  items: TaskExecutionListItem[],
  pick: (e: TaskExecutionListItem) => string,
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const e of items) {
    const key = pick(e);
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

export function successRate(
  items: TaskExecutionListItem[],
): { rate: number | null; terminal: number; succeeded: number } {
  let terminal = 0;
  let succeeded = 0;
  for (const e of items) {
    if (!TERMINAL[e.status]) continue;
    terminal += 1;
    if (e.status === "succeeded") succeeded += 1;
  }
  if (terminal === 0) return { rate: null, terminal: 0, succeeded: 0 };
  return { rate: succeeded / terminal, terminal, succeeded };
}

export function totalActiveStrategies(tasks: DashboardTaskRow[]): number {
  return tasks.reduce((acc, t) => acc + t.activeStrategies, 0);
}

export function countTasksByStatus(
  tasks: DashboardTaskRow[],
): { name: string; value: number }[] {
  const map = new Map<string, number>();
  for (const t of tasks) {
    const key = (t.status && t.status.trim()) || "unknown";
    map.set(key, (map.get(key) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}
