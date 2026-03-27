const PROJECT_SELECTION_KEY = "greenwin.selectedProjectId";

export function readSelectedProjectId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }
  const value = localStorage.getItem(PROJECT_SELECTION_KEY);
  return value ? value : null;
}

export function saveSelectedProjectId(projectId: string | null) {
  if (typeof window === "undefined") {
    return;
  }
  if (!projectId) {
    localStorage.removeItem(PROJECT_SELECTION_KEY);
    return;
  }
  localStorage.setItem(PROJECT_SELECTION_KEY, projectId);
}

