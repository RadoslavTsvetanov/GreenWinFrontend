import { TaskFormState } from "@/lib/task/types";
import { TaskFormChangeHandler } from "./types";

type ExecutionSectionProps = {
  form: TaskFormState;
  onChange: TaskFormChangeHandler;
};

export function ExecutionSection({ form, onChange }: ExecutionSectionProps) {
  return (
    <>
      <div>
        <p className="block text-sm font-medium text-slate-800">Execution mode *</p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => onChange("executionMode", "immediate")}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              form.executionMode === "immediate"
                ? "border-cyan-400 bg-cyan-100 text-cyan-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Immediate
          </button>
          <button
            type="button"
            onClick={() => onChange("executionMode", "deadline")}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              form.executionMode === "deadline"
                ? "border-cyan-400 bg-cyan-100 text-cyan-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Run by deadline
          </button>
        </div>
      </div>

      {form.executionMode === "deadline" && (
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-slate-800">
            Latest execution time *
          </label>
          <input
            id="deadline"
            type="datetime-local"
            value={form.deadline ?? ""}
            onChange={(event) => onChange("deadline", event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100"
          />
        </div>
      )}
    </>
  );
}
