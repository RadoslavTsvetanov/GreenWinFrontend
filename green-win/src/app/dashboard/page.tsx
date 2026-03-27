"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/components/ui/Toast";
import {
  Card,
  EmptyState,
  LoadingState,
  PageHeader,
  PageShell,
} from "@/components/ui/primitives";
import {
  fetchOrganizationRealFootprint,
  fetchOrganizationRegionalFootprint,
  fetchOrganizationDashboard,
  OrganizationDashboard,
} from "@/lib/organizations/dashboard";

function formatKg(value: number) {
  return `${formatFixed4(value)} kg CO2`;
}

function formatFixed4(value: number): string {
  return Number.isFinite(value) ? value.toFixed(4) : "0.0000";
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { showError } = useToast();
  const [dashboard, setDashboard] = useState<OrganizationDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [realFootprint, setRealFootprint] = useState<number | null>(null);
  const [regionalFootprint, setRegionalFootprint] = useState<number | null>(null);
  const [selectedRegion, setSelectedRegion] = useState("eu-west-1");
  const organizationId = user?.organizationId ?? null;

  useEffect(() => {
    if (!organizationId) {
      setDashboard(null);
      setIsLoading(false);
      return;
    }
    const orgId = organizationId;

    let cancelled = false;

    async function loadDashboard() {
      setIsLoading(true);
      try {
        const data = await fetchOrganizationDashboard(orgId);
        if (!cancelled) {
          setDashboard(data);
        }
      } catch (error) {
        if (!cancelled) {
          const message =
            error instanceof Error ? error.message : "Failed to load dashboard.";
          showError(message);
          setDashboard(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();
    return () => {
      cancelled = true;
    };
  }, [organizationId, showError]);

  useEffect(() => {
    if (!organizationId) {
      setRealFootprint(null);
      setRegionalFootprint(null);
      return;
    }
    const orgId = organizationId;
    let cancelled = false;

    async function loadFootprints() {
      try {
        const [real, regional] = await Promise.all([
          fetchOrganizationRealFootprint(orgId),
          fetchOrganizationRegionalFootprint(orgId, selectedRegion),
        ]);
        if (!cancelled) {
          setRealFootprint(real);
          setRegionalFootprint(regional);
        }
      } catch {
        // Keep dashboard resilient if footprint endpoints fail.
        if (!cancelled) {
          setRealFootprint(null);
          setRegionalFootprint(null);
        }
      }
    }

    loadFootprints();
    return () => {
      cancelled = true;
    };
  }, [organizationId, selectedRegion]);

  const topProjects = useMemo(() => {
    if (!dashboard) return [];
    return [...dashboard.projects]
      .sort((a, b) => b.totalEnergySaved - a.totalEnergySaved)
      .slice(0, 5);
  }, [dashboard]);

  return (
    <PageShell className="bg-gradient-to-b from-slate-50 via-emerald-50/35 to-cyan-50/35">
      <main className="mx-auto w-full max-w-[1500px] space-y-5 px-1 sm:px-2 lg:px-3">
        <PageHeader
          eyebrow="Company dashboard"
          title="Carbon and performance insights"
          subtitle="Interactive metrics from live backend organization analytics."
        />

        {isLoading ? (
          <LoadingState label="Loading organization dashboard..." />
        ) : !dashboard ? (
          <EmptyState
            title="No organization linked to your account"
            description="Recent executions and metrics are shown only for your own organization."
          />
        ) : (
          <>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Projects" value={String(dashboard.counts.projects)} />
              <MetricCard label="Tasks" value={String(dashboard.counts.tasks)} />
              <MetricCard label="Executions" value={String(dashboard.counts.executions)} />
              <MetricCard
                label="Active strategies"
                value={`${dashboard.counts.activeStrategies}/${dashboard.counts.strategies}`}
              />
            </section>

            <section className="grid gap-3 md:grid-cols-3">
              <MetricCard
                label="Real carbon footprint (gCO2)"
                value={realFootprint === null ? "N/A" : formatFixed4(realFootprint)}
              />
              <MetricCard
                label={`Regional footprint (${selectedRegion})`}
                value={
                  regionalFootprint === null ? "N/A" : formatFixed4(regionalFootprint)
                }
              />
              <Card className="min-h-[106px]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Regional estimator
                </p>
                <select
                  value={selectedRegion}
                  onChange={(event) => setSelectedRegion(event.target.value)}
                  className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
                >
                  <option value="eu-west-1">eu-west-1</option>
                  <option value="us-east-1">us-east-1</option>
                  <option value="eu-central-1">eu-central-1</option>
                </select>
              </Card>
            </section>

            <section className="grid gap-3 xl:grid-cols-12">
              <Card className="overflow-hidden border-emerald-200/80 bg-gradient-to-br from-white via-emerald-50 to-lime-50 text-slate-900 shadow-[0_14px_35px_-28px_rgba(15,23,42,0.45)] xl:col-span-7">
                <div className="grid items-center gap-5 sm:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                      Climate pulse
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold tracking-tight">
                      Sustainability radar
                    </h2>
                    <p className="mt-2 text-sm text-slate-700">
                      Live signal combining emissions pressure, strategy coverage, and green
                      execution volume.
                    </p>
                    <div className="mt-4">
                      <Sparkline data={buildSparklineData(dashboard)} />
                    </div>
                  </div>
                  <div className="flex items-center justify-center">
                    <RadialGauge
                      label="Eco score"
                      value={buildEcoScore(dashboard)}
                      suffix="/100"
                      tone="emerald"
                    />
                  </div>
                </div>
              </Card>

              <Card className="border-slate-200/90 bg-gradient-to-br from-white to-slate-50 xl:col-span-5">
                <h2 className="text-base font-semibold text-slate-900">Carbon balance</h2>
                <p className="mt-1 text-xs text-slate-700">
                  Visual split between monthly pressure and clean execution momentum.
                </p>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  <RadialGauge
                    label="Monthly target use"
                    value={Math.round(dashboard.carbon.monthlyEmissionsUsagePercent)}
                    suffix="%"
                    tone="emerald"
                  />
                  <RadialGauge
                    label="Annual target use"
                    value={Math.round(dashboard.carbon.annualEmissionsUsagePercent)}
                    suffix="%"
                    tone="cyan"
                  />
                </div>
              </Card>
            </section>

            <section className="grid gap-3 xl:grid-cols-12">
              <Card className="space-y-4 xl:col-span-7">
                <h2 className="text-base font-semibold text-slate-900">Emissions usage</h2>
                <ProgressBar
                  label="Monthly target"
                  value={dashboard.carbon.monthlyEmissionsUsagePercent}
                  hint={`${formatKg(dashboard.carbon.currentMonthEmissions)} / ${formatKg(dashboard.carbon.monthlyEmissionsTarget)}`}
                />
                <ProgressBar
                  label="Annual target"
                  value={dashboard.carbon.annualEmissionsUsagePercent}
                  hint={`${formatKg(dashboard.carbon.totalEmissions)} / ${formatKg(dashboard.carbon.annualEmissionsTarget)}`}
                />
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <MetricCard
                    label="Energy saved"
                    value={`${formatFixed4(dashboard.carbon.totalEnergySaved)} kWh`}
                    compact
                  />
                  <MetricCard
                    label="Tasks executed"
                    value={String(dashboard.carbon.totalTasksExecuted)}
                    compact
                  />
                </div>
              </Card>

              <Card className="space-y-4 xl:col-span-5">
                <h2 className="text-base font-semibold text-slate-900">Execution status mix</h2>
                <StatusBars data={dashboard.counts.executionsByStatus} />
              </Card>
            </section>

            <section className="grid gap-3 xl:grid-cols-12">
              <Card className="xl:col-span-7">
                <h2 className="text-base font-semibold text-slate-900">Top green projects</h2>
                <div className="mt-3 space-y-2">
                  {topProjects.length === 0 ? (
                    <p className="text-sm text-slate-600">No project metrics yet.</p>
                  ) : (
                    topProjects.map((project) => (
                      <div
                        key={project.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-semibold text-slate-900">{project.name}</p>
                          <p className="text-xs text-emerald-700">
                            {formatFixed4(project.totalEnergySaved)} kWh saved
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          Tasks: {project.taskCount} | Executions: {project.executionCount} |
                          Active strategies: {project.activeStrategies}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              <Card className="xl:col-span-5">
                <h2 className="text-base font-semibold text-slate-900">Recent executions</h2>
                <div className="mt-3 space-y-2">
                  {dashboard.recentExecutions.length === 0 ? (
                    <p className="text-sm text-slate-600">No recent executions.</p>
                  ) : (
                    dashboard.recentExecutions.map((execution) => (
                      <div
                        key={execution.id}
                        className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-sm font-semibold text-slate-900">
                            {execution.status.toUpperCase()}
                          </p>
                          <p className="text-xs text-slate-500">
                            {execution.createdAt
                              ? new Date(execution.createdAt).toLocaleString()
                              : "n/a"}
                          </p>
                        </div>
                        <p className="mt-1 text-xs text-slate-600">
                          {execution.provider ?? "n/a"} {execution.region ?? ""}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </section>
          </>
        )}
      </main>
    </PageShell>
  );
}

function MetricCard({
  label,
  value,
  compact = false,
}: {
  label: string;
  value: string;
  compact?: boolean;
}) {
  return (
    <Card
      className={
        compact
          ? "p-3"
          : "min-h-[106px] bg-gradient-to-br from-white to-emerald-50/45"
      }
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-2xl font-semibold text-slate-950">{value}</p>
    </Card>
  );
}

function ProgressBar({
  label,
  value,
  hint,
}: {
  label: string;
  value: number;
  hint: string;
}) {
  const capped = Math.max(0, Math.min(100, Number.isFinite(value) ? value : 0));
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-medium text-slate-800">{label}</span>
        <span className="font-semibold text-emerald-700">{capped.toFixed(1)}%</span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full bg-gradient-to-r from-emerald-500 via-lime-500 to-cyan-500"
          style={{ width: `${capped}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-slate-600">{hint}</p>
    </div>
  );
}

function StatusBars({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data);
  const total = entries.reduce((acc, [, count]) => acc + count, 0);

  if (entries.length === 0 || total === 0) {
    return <p className="text-sm text-slate-600">No execution distribution yet.</p>;
  }

  return (
    <div className="space-y-2">
      {entries.map(([status, count]) => {
        const pct = (count / total) * 100;
        return (
          <div key={status}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-slate-700">{status}</span>
              <span className="font-semibold text-slate-900">{count}</span>
            </div>
            <div className="h-2 rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function buildEcoScore(dashboard: OrganizationDashboard): number {
  const executionCoverage =
    dashboard.counts.executions > 0
      ? Math.min(100, (dashboard.counts.executions / Math.max(1, dashboard.counts.tasks)) * 100)
      : 0;
  const strategyCoverage =
    dashboard.counts.strategies > 0
      ? (dashboard.counts.activeStrategies / dashboard.counts.strategies) * 100
      : 0;
  const carbonPressure = Math.min(100, dashboard.carbon.monthlyEmissionsUsagePercent);
  const score = executionCoverage * 0.35 + strategyCoverage * 0.35 + (100 - carbonPressure) * 0.3;
  return Math.max(0, Math.min(100, Math.round(score)));
}

function buildSparklineData(dashboard: OrganizationDashboard): number[] {
  const taskLoad = Math.min(100, dashboard.counts.tasks * 10);
  const strategyLoad = Math.min(100, dashboard.counts.activeStrategies * 20);
  const energy = Math.min(100, dashboard.carbon.totalEnergySaved * 3);
  const execution = Math.min(100, dashboard.counts.executions * 12);
  const pressure = Math.min(100, dashboard.carbon.monthlyEmissionsUsagePercent);
  const rebound = Math.min(100, Math.max(0, 85 - pressure + strategyLoad * 0.15));
  return [taskLoad, strategyLoad, energy, execution, pressure, rebound];
}

function Sparkline({ data }: { data: number[] }) {
  if (data.length === 0) return null;
  const max = Math.max(...data, 1);
  const width = 360;
  const height = 90;
  const step = width / Math.max(1, data.length - 1);
  const points = data
    .map((value, idx) => {
      const x = idx * step;
      const y = height - (value / max) * (height - 8) - 4;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="h-24 w-full overflow-visible"
      role="img"
      aria-label="Sustainability trend line"
    >
      <defs>
        <linearGradient id="spark-fill" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#84cc16" stopOpacity="0.08" />
        </linearGradient>
        <linearGradient id="spark-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#10b981" />
          <stop offset="100%" stopColor="#65a30d" />
        </linearGradient>
      </defs>
      <polyline
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#spark-fill)"
        stroke="none"
      />
      <polyline
        points={points}
        fill="none"
        stroke="url(#spark-line)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function RadialGauge({
  label,
  value,
  suffix,
  tone = "mint",
}: {
  label: string;
  value: number;
  suffix: string;
  tone?: "mint" | "emerald" | "cyan";
}) {
  const normalized = Math.max(0, Math.min(100, value));
  const r = 44;
  const c = 2 * Math.PI * r;
  const dash = c - (normalized / 100) * c;
  const gradientId = `g-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const toneFrom =
    tone === "cyan" ? "#22d3ee" : tone === "emerald" ? "#22c55e" : "#10b981";
  const toneTo =
    tone === "cyan" ? "#0891b2" : tone === "emerald" ? "#15803d" : "#047857";

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 120 120" className="h-28 w-28">
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={toneFrom} />
            <stop offset="100%" stopColor={toneTo} />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r={r}
          stroke="#dbe3ef"
          strokeWidth="10"
          fill="none"
        />
        <circle
          cx="60"
          cy="60"
          r={r}
          stroke={`url(#${gradientId})`}
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dash}
          transform="rotate(-90 60 60)"
        />
        <text
          x="60"
          y="56"
          textAnchor="middle"
          className="fill-current text-[22px] font-semibold text-slate-900"
        >
          {normalized}
        </text>
        <text
          x="60"
          y="72"
          textAnchor="middle"
          className="fill-current text-[10px] font-semibold uppercase tracking-wide text-slate-500"
        >
          {suffix}
        </text>
      </svg>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-700">
        {label}
      </p>
    </div>
  );
}
