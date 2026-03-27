import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type OrganizationRecord = {
  id: string;
  name: string;
  description: string | null;
  email: string;
  contactPerson: string | null;
  phoneNumber: string | null;
  address: string | null;
  monthlyEmissionsTarget: number | null;
  annualEmissionsTarget: number | null;
  preferredCloudProviders: string[] | null;
  preferredRegions: string[] | null;
  isActive: boolean;
};

function toNum(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function toNullableString(v: unknown): string | null {
  return typeof v === "string" ? v : null;
}

function parseOrganization(raw: Record<string, unknown>): OrganizationRecord {
  return {
    id: String(raw.id ?? ""),
    name: String(raw.name ?? ""),
    description: toNullableString(raw.description),
    email: String(raw.email ?? ""),
    contactPerson: toNullableString(raw.contactPerson),
    phoneNumber: toNullableString(raw.phoneNumber),
    address: toNullableString(raw.address),
    monthlyEmissionsTarget: toNum(raw.monthlyEmissionsTarget),
    annualEmissionsTarget: toNum(raw.annualEmissionsTarget),
    preferredCloudProviders: Array.isArray(raw.preferredCloudProviders)
      ? (raw.preferredCloudProviders as unknown[]).map(String)
      : null,
    preferredRegions: Array.isArray(raw.preferredRegions)
      ? (raw.preferredRegions as unknown[]).map(String)
      : null,
    isActive: raw.isActive !== false,
  };
}

export async function fetchOrganization(
  organizationId: string,
): Promise<OrganizationRecord> {
  const response = await authorizedApiFetch(
    `/organizations/${encodeURIComponent(organizationId)}`,
  );
  await ensureOk(response);
  const data = (await response.json()) as Record<string, unknown>;
  return parseOrganization(data);
}

/** PATCH body matching backend UpdateOrganizationDto / CreateOrganizationDto fields */
export type UpdateOrganizationPayload = Partial<{
  name: string;
  description: string;
  email: string;
  contactPerson: string;
  phoneNumber: string;
  address: string;
  monthlyEmissionsTarget: number;
  annualEmissionsTarget: number;
  preferredCloudProviders: string[];
  preferredRegions: string[];
  isActive: boolean;
}>;

export async function updateOrganization(
  organizationId: string,
  payload: UpdateOrganizationPayload,
): Promise<void> {
  const body = Object.fromEntries(
    Object.entries(payload).filter(([, v]) => v !== undefined && v !== null),
  );
  if (Object.keys(body).length === 0) {
    return;
  }

  const response = await authorizedApiFetch(
    `/organizations/${encodeURIComponent(organizationId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );
  await ensureOk(response);
}
