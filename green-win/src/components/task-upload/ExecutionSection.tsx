import { TaskFormState } from "@/lib/task/types";
import { TaskFormChangeHandler } from "./types";
import { Button, Input } from "@/components/ui/primitives";

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
          <Button
            type="button"
            onClick={() => onChange("executionMode", "immediate")}
            variant="secondary"
            className={`transition ${
              form.executionMode === "immediate"
                ? "border border-cyan-500 bg-cyan-50 font-semibold text-slate-900 shadow-sm ring-1 ring-cyan-400 ring-offset-1 ring-offset-white"
                : "border border-slate-200 bg-white font-medium text-slate-700 ring-0 hover:border-slate-300"
            }`}
          >
            Immediate
          </Button>
          <Button
            type="button"
            onClick={() => onChange("executionMode", "deadline")}
            variant="secondary"
            className={`transition ${
              form.executionMode === "deadline"
                ? "border border-cyan-500 bg-cyan-50 font-semibold text-slate-900 shadow-sm ring-1 ring-cyan-400 ring-offset-1 ring-offset-white"
                : "border border-slate-200 bg-white font-medium text-slate-700 ring-0 hover:border-slate-300"
            }`}
          >
            Run by deadline
          </Button>
        </div>
      </div>

      {form.executionMode === "deadline" && (
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-slate-800">
            Latest execution time *
          </label>
          <Input
            id="deadline"
            type="datetime-local"
            value={form.deadline ?? ""}
            onChange={(value) => onChange("deadline", value)}
            className="mt-2 bg-slate-50 focus:border-cyan-500 focus:ring-cyan-100"
          />
        </div>
      )}
    </>
  );
}
