import type { BackendTaskItem } from "@/lib/task-management/api";
import type { DashboardTaskRow } from "@/lib/dashboard/aggregate";

type RawStrategy = { isActive?: boolean };

export function mapTasksToDashboardRows(
  items: BackendTaskItem[],
): DashboardTaskRow[] {
  return items.map((task) => {
    const raw = task as BackendTaskItem & { strategies?: RawStrategy[] };
    const strategies = Array.isArray(raw.strategies) ? raw.strategies : [];
    const activeStrategies = strategies.filter((s) => s.isActive === true).length;

    return {
      id: String(task.id ?? ""),
      name: String(task.name ?? ""),
      status: String(task.status ?? ""),
      codeType: String(task.codeType ?? ""),
      projectId: typeof task.project?.id === "string" ? task.project.id : null,
      createdAt: String(task.createdAt ?? new Date().toISOString()),
      activeStrategies,
    };
  });
}
