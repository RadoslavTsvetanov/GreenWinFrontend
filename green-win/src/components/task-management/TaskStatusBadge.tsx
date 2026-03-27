import { TaskStatus } from "@/lib/task-management/types";

const STATUS_STYLES: Record<TaskStatus, string> = {
  queued: "bg-slate-100 text-slate-700 border-slate-200",
  scheduled: "bg-sky-100 text-sky-700 border-sky-200",
  running: "bg-amber-100 text-amber-700 border-amber-200",
  completed: "bg-emerald-100 text-emerald-700 border-emerald-200",
  failed: "bg-rose-100 text-rose-700 border-rose-200",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
