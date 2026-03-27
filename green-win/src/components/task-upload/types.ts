import { TaskFormState } from "@/lib/task/types";

export type TaskFormChangeHandler = <K extends keyof TaskFormState>(
  key: K,
  value: TaskFormState[K],
) => void;
