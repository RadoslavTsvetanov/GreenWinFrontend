import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type CarbonData = {
  monthlyEmissionsTarget: number | null;
  currentMonthEmissions: number;
  monthlyEmissionsUsagePercent: number;
  annualEmissionsTarget: number | null;
  totalEmissions: number;
  annualEmissionsUsagePercent: number;
  totalEnergySaved: number;
  totalTasksExecuted: number;
};

export async function fetchOrganizationDashboardCarbon(
  organizationId: string,
): Promise<CarbonData> {
  const response = await authorizedApiFetch(
    `/organizations/${encodeURIComponent(organizationId)}/dashboard`,
  );

  await ensureOk(response);

  const data = await response.json();

  return data.carbon as CarbonData;
}
