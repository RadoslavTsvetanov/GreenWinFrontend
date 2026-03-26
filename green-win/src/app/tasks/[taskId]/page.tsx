import Link from "next/link";
import { notFound } from "next/navigation";
import { TaskStatusBadge } from "@/components/task-management/TaskStatusBadge";
import { MOCK_TASKS } from "@/lib/task-management/mock-data";

type TaskDetailsPageProps = {
  params: Promise<{ taskId: string }>;
};

export default async function TaskDetailsPage({ params }: TaskDetailsPageProps) {
  const { taskId } = await params;
  const task = MOCK_TASKS.find((item) => item.id === taskId);

  if (!task) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-cyan-50 to-emerald-50 p-6 sm:p-10">
      <main className="mx-auto w-full max-w-5xl">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/tasks"
                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600 hover:text-emerald-700"
              >
                <span aria-hidden="true">{"<"}</span>
                <span>Task details</span>
              </Link>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">{task.name}</h1>
              <p className="mt-2 text-sm text-slate-500">Task ID: {task.id}</p>
            </div>
            <TaskStatusBadge status={task.status} />
          </div>

          <div className="mt-5 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:grid-cols-3">
            <QuickKpi label="Provider" value={task.provider.toUpperCase()} />
            <QuickKpi label="Region" value={task.region} />
            <QuickKpi label="CO2 saved" value={`${task.estimatedCo2SavedGrams} g`} />
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Runtime type" value={task.runtimeType} />
            <Detail label="Execution mode" value={task.executionMode} />
            <Detail label="Provider" value={task.provider} />
            <Detail label="Region" value={task.region} />
            <Detail label="Created at" value={new Date(task.createdAt).toLocaleString()} />
            <Detail
              label="Deadline"
              value={task.deadline ? new Date(task.deadline).toLocaleString() : "No deadline"}
            />
            <Detail label="Estimated CO2 saved" value={`${task.estimatedCo2SavedGrams} g`} />
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{task.notes}</p>
          </div>
        </section>
      </main>
    </div>
  );
}

function QuickKpi({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white px-3 py-2">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{value}</p>
    </article>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1.5 text-sm font-semibold text-slate-900">{value}</p>
    </article>
  );
}
