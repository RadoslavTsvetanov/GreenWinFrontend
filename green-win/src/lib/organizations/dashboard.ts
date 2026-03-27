import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

type DashboardResponse = {
  organization?: {
    id?: string;
    name?: string;
    email?: string;
    description?: string | null;
  };
  counts?: {
    projects?: number;
    activeProjects?: number;
    tasks?: number;
    executions?: number;
    strategies?: number;
    activeStrategies?: number;
    tasksByStatus?: Record<string, number>;
    executionsByStatus?: Record<string, number>;
  };
  carbon?: {
    monthlyEmissionsTarget?: number | string | null;
    currentMonthEmissions?: number | string | null;
    monthlyEmissionsUsagePercent?: number | null;
    annualEmissionsTarget?: number | string | null;
    totalEmissions?: number | string | null;
    annualEmissionsUsagePercent?: number | null;
    totalEnergySaved?: number | string | null;
    totalTasksExecuted?: number;
  };
  projects?: Array<{
    id?: string;
    name?: string;
    taskCount?: number;
    executionCount?: number;
    activeStrategies?: number;
    currentEmissions?: number | string | null;
    emissionsTarget?: number | string | null;
    totalCostSavings?: number | string | null;
    totalEnergySaved?: number | string | null;
  }>;
  recentExecutions?: Array<{
    id?: string;
    status?: string;
    provider?: string | null;
    region?: string | null;
    createdAt?: string;
  }>;
};

function toNumber(value: unknown): number {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

export type OrganizationDashboard = {
  organization: {
    id: string;
    name: string;
    email: string;
    description: string | null;
  };
  counts: {
    projects: number;
    activeProjects: number;
    tasks: number;
    executions: number;
    strategies: number;
    activeStrategies: number;
    tasksByStatus: Record<string, number>;
    executionsByStatus: Record<string, number>;
  };
  carbon: {
    monthlyEmissionsTarget: number;
    currentMonthEmissions: number;
    monthlyEmissionsUsagePercent: number;
    annualEmissionsTarget: number;
    totalEmissions: number;
    annualEmissionsUsagePercent: number;
    totalEnergySaved: number;
    totalTasksExecuted: number;
  };
  projects: Array<{
    id: string;
    name: string;
    taskCount: number;
    executionCount: number;
    activeStrategies: number;
    currentEmissions: number;
    emissionsTarget: number;
    totalCostSavings: number;
    totalEnergySaved: number;
  }>;
  recentExecutions: Array<{
    id: string;
    status: string;
    provider: string | null;
    region: string | null;
    createdAt: string | null;
  }>;
};

export async function fetchOrganizationDashboard(
  organizationId: string,
): Promise<OrganizationDashboard> {
  const response = await authorizedApiFetch(
    `/organizations/${encodeURIComponent(organizationId)}/dashboard`,
  );
  await ensureOk(response);
  const raw = (await response.json()) as DashboardResponse;

  return {
    organization: {
      id: String(raw.organization?.id ?? ""),
      name: String(raw.organization?.name ?? "Organization"),
      email: String(raw.organization?.email ?? ""),
      description:
        typeof raw.organization?.description === "string"
          ? raw.organization.description
          : null,
    },
    counts: {
      projects: Number(raw.counts?.projects ?? 0),
      activeProjects: Number(raw.counts?.activeProjects ?? 0),
      tasks: Number(raw.counts?.tasks ?? 0),
      executions: Number(raw.counts?.executions ?? 0),
      strategies: Number(raw.counts?.strategies ?? 0),
      activeStrategies: Number(raw.counts?.activeStrategies ?? 0),
      tasksByStatus: raw.counts?.tasksByStatus ?? {},
      executionsByStatus: raw.counts?.executionsByStatus ?? {},
    },
    carbon: {
      monthlyEmissionsTarget: toNumber(raw.carbon?.monthlyEmissionsTarget),
      currentMonthEmissions: toNumber(raw.carbon?.currentMonthEmissions),
      monthlyEmissionsUsagePercent: Number(raw.carbon?.monthlyEmissionsUsagePercent ?? 0),
      annualEmissionsTarget: toNumber(raw.carbon?.annualEmissionsTarget),
      totalEmissions: toNumber(raw.carbon?.totalEmissions),
      annualEmissionsUsagePercent: Number(raw.carbon?.annualEmissionsUsagePercent ?? 0),
      totalEnergySaved: toNumber(raw.carbon?.totalEnergySaved),
      totalTasksExecuted: Number(raw.carbon?.totalTasksExecuted ?? 0),
    },
    projects: (raw.projects ?? []).map((project) => ({
      id: String(project.id ?? ""),
      name: String(project.name ?? "Project"),
      taskCount: Number(project.taskCount ?? 0),
      executionCount: Number(project.executionCount ?? 0),
      activeStrategies: Number(project.activeStrategies ?? 0),
      currentEmissions: toNumber(project.currentEmissions),
      emissionsTarget: toNumber(project.emissionsTarget),
      totalCostSavings: toNumber(project.totalCostSavings),
      totalEnergySaved: toNumber(project.totalEnergySaved),
    })),
    recentExecutions: (raw.recentExecutions ?? []).map((execution) => ({
      id: String(execution.id ?? ""),
      status: String(execution.status ?? "unknown"),
      provider:
        typeof execution.provider === "string" ? execution.provider : null,
      region: typeof execution.region === "string" ? execution.region : null,
      createdAt:
        typeof execution.createdAt === "string" ? execution.createdAt : null,
    })),
  };
}

export async function fetchOrganizationRealFootprint(
  organizationId: string,
): Promise<number> {
  const response = await authorizedApiFetch(
    `/organizations/${encodeURIComponent(organizationId)}/carbon-footprint/real`,
  );
  await ensureOk(response);
  const data = (await response.json()) as unknown;
  return toNumber(data);
}

export async function fetchOrganizationRegionalFootprint(
  organizationId: string,
  region: string,
): Promise<number> {
  const response = await authorizedApiFetch(
    `/organizations/${encodeURIComponent(organizationId)}/carbon-footprint/regional/${encodeURIComponent(region)}`,
  );
  await ensureOk(response);
  const data = (await response.json()) as unknown;
  return toNumber(data);
}
