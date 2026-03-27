import { ManagedTask } from "@/lib/task-management/types";

function formatFixed4(value: number): string {
  return Number.isFinite(value) ? value.toFixed(4) : "0.0000";
}

export function TaskStats({ tasks }: { tasks: ManagedTask[] }) {
  const total = tasks.length;
  const running = tasks.filter((task) => task.status === "running").length;
  const draft = tasks.filter((task) => task.status === "draft").length;
  const co2Saved = tasks.reduce((acc, task) => acc + (task.estimatedCo2SavedGrams ?? 0), 0);

  const items = [
    { label: "Total tasks", value: total },
    { label: "Running now", value: running },
    { label: "Draft", value: draft },
    { label: "CO2 saved (g)", value: formatFixed4(co2Saved) },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {items.map((item) => (
        <article
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{item.label}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{item.value}</p>
        </article>
      ))}
    </section>
  );
}
