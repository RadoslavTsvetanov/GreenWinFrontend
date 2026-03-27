"use client";

type Kpi = {
  label: string;
  value: string;
  hint?: string;
};

type Props = {
  items: Kpi[];
};

export function DashboardKpiStrip({ items }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-emerald-200/80 hover:shadow-md"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
            {item.label}
          </p>
          <p className="mt-2 text-2xl font-semibold tabular-nums tracking-tight text-slate-900">
            {item.value}
          </p>
          {item.hint ? (
            <p className="mt-1 text-xs leading-relaxed text-slate-500">{item.hint}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}
