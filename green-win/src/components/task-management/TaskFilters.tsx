import { TaskStatus } from "@/lib/task-management/types";

type TaskFiltersProps = {
  query: string;
  onQueryChange: (value: string) => void;
  status: "all" | TaskStatus;
  onStatusChange: (value: "all" | TaskStatus) => void;
};

export function TaskFilters({
  query,
  onQueryChange,
  status,
  onStatusChange,
}: TaskFiltersProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search by task name..."
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        />
        <select
          value={status}
          onChange={(event) => onStatusChange(event.target.value as "all" | TaskStatus)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:bg-white focus:ring-2 focus:ring-emerald-100"
        >
          <option value="all">All statuses</option>
          <option value="queued">Queued</option>
          <option value="scheduled">Scheduled</option>
          <option value="running">Running</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </section>
  );
}
