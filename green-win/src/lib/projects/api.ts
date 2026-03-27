import { authorizedApiFetch, ensureOk } from "@/lib/api/http";

export type ProjectOption = {
  id: string;
  name: string;
};

export type ProjectRecord = {
  id: string;
  name: string;
  description: string | null;
  organizationId: string | null;
  tasksCount: number;
  isActive: boolean;
};

export type CreateProjectPayload = {
  name: string;
  organizationId: string;
  description?: string;
  emissionsTarget?: number;
  isActive?: boolean;
};

export type UpdateProjectPayload = Partial<{
  name: string;
  description: string;
  organizationId: string;
  emissionsTarget: number;
  isActive: boolean;
}>;

export async function fetchProjects(
  organizationId?: string | null,
): Promise<ProjectOption[]> {
  const query =
    organizationId && organizationId.trim().length > 0
      ? `?organizationId=${encodeURIComponent(organizationId)}`
      : "";
  const response = await authorizedApiFetch(`/projects${query}`);
  await ensureOk(response);

  const data = (await response.json()) as Array<{ id?: string; name?: string }>;
  return data
    .filter((project) => project.id && project.name)
    .map((project) => ({
      id: String(project.id),
      name: String(project.name),
    }));
}

type RawProject = {
  id?: string;
  name?: string;
  description?: string | null;
  organization?: { id?: string } | null;
  tasks?: unknown[] | null;
  isActive?: boolean;
};

export async function fetchProjectsDetailed(): Promise<ProjectRecord[]> {
  return fetchProjectsDetailedByOrganization();
}

export async function fetchProjectsDetailedByOrganization(
  organizationId?: string | null,
): Promise<ProjectRecord[]> {
  const query =
    organizationId && organizationId.trim().length > 0
      ? `?organizationId=${encodeURIComponent(organizationId)}`
      : "";
  const response = await authorizedApiFetch(`/projects${query}`);
  await ensureOk(response);
  const data = (await response.json()) as RawProject[];

  return data.map((project) => ({
    id: String(project.id ?? ""),
    name: String(project.name ?? ""),
    description:
      typeof project.description === "string" ? project.description : null,
    organizationId:
      typeof project.organization?.id === "string"
        ? project.organization.id
        : null,
    tasksCount: Array.isArray(project.tasks) ? project.tasks.length : 0,
    isActive: project.isActive !== false,
  }));
}

export async function createProject(
  payload: CreateProjectPayload,
): Promise<ProjectRecord> {
  const response = await authorizedApiFetch("/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  await ensureOk(response);
  const project = (await response.json()) as RawProject;
  return {
    id: String(project.id ?? ""),
    name: String(project.name ?? ""),
    description:
      typeof project.description === "string" ? project.description : null,
    organizationId:
      typeof project.organization?.id === "string"
        ? project.organization.id
        : null,
    tasksCount: Array.isArray(project.tasks) ? project.tasks.length : 0,
    isActive: project.isActive !== false,
  };
}

export async function updateProject(
  projectId: string,
  payload: UpdateProjectPayload,
): Promise<ProjectRecord> {
  const response = await authorizedApiFetch(
    `/projects/${encodeURIComponent(projectId)}`,
    {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    },
  );
  await ensureOk(response);
  const project = (await response.json()) as RawProject;
  return {
    id: String(project.id ?? ""),
    name: String(project.name ?? ""),
    description:
      typeof project.description === "string" ? project.description : null,
    organizationId:
      typeof project.organization?.id === "string"
        ? project.organization.id
        : null,
    tasksCount: Array.isArray(project.tasks) ? project.tasks.length : 0,
    isActive: project.isActive !== false,
  };
}

export async function deleteProject(projectId: string): Promise<void> {
  const response = await authorizedApiFetch(
    `/projects/${encodeURIComponent(projectId)}`,
    {
      method: "DELETE",
    },
  );
  await ensureOk(response);
}
