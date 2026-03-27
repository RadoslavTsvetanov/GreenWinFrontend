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

export async function fetchProjects(): Promise<ProjectOption[]> {
  const response = await authorizedApiFetch("/projects");
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
  const response = await authorizedApiFetch("/projects");
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
