import { TaskFormState } from "@/lib/task/types";
import { TaskFormChangeHandler } from "./types";
import { Button, Input } from "@/components/ui/primitives";

type ExecutionSectionProps = {
  form: TaskFormState;
  onChange: TaskFormChangeHandler;
};

export function ExecutionSection({ form, onChange }: ExecutionSectionProps) {
  const isScheduled = form.executionMode === "deadline";

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
            onClick={() => {
              onChange("executionMode", "deadline");
              if (!form.attachStrategy) onChange("attachStrategy", true);
            }}
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
        <p className="mt-2 text-xs text-slate-600">
          Backend scheduling is strategy-based: delayed runs require strategy timing + activation.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-medium text-slate-800">Strategy at creation</p>
        <label className="mt-2 inline-flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={form.attachStrategy}
            onChange={(event) => onChange("attachStrategy", event.target.checked)}
            disabled={isScheduled}
          />
          Add strategy during task creation
        </label>
        {isScheduled && (
          <p className="mt-1 text-xs text-cyan-700">
            Enabled automatically for scheduled execution mode.
          </p>
        )}

        {form.attachStrategy && (
          <div className="mt-3 space-y-3">
            <div>
              <label
                htmlFor="strategyPeriodicity"
                className="block text-sm font-medium text-slate-800"
              >
                Strategy type
              </label>
              <select
                id="strategyPeriodicity"
                value={form.strategyPeriodicity}
                onChange={(event) =>
                  onChange("strategyPeriodicity", event.target.value as TaskFormState["strategyPeriodicity"])
                }
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900"
              >
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {form.strategyPeriodicity === "daily" ? (
              <div>
                <label
                  htmlFor="strategyTimesCsv"
                  className="block text-sm font-medium text-slate-800"
                >
                  Times (UTC, comma-separated HH:mm)
                </label>
                <Input
                  id="strategyTimesCsv"
                  type="text"
                  value={form.strategyTimesCsv}
                  onChange={(value) => onChange("strategyTimesCsv", value)}
                  placeholder="09:00, 14:30"
                  className="mt-2 bg-white"
                />
              </div>
            ) : form.strategyPeriodicity === "once" ? (
              <div className="space-y-2">
                <div>
                  <label
                    htmlFor="strategyExecutionTime"
                    className="block text-sm font-medium text-slate-800"
                  >
                    Planned execution time (UTC, HH:mm)
                  </label>
                  <Input
                    id="strategyExecutionTime"
                    type="time"
                    value={form.strategyExecutionTime}
                    onChange={(value) => onChange("strategyExecutionTime", value)}
                    className="mt-2 bg-white"
                  />
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  ONCE strategy executes immediately when activated. For automatic delayed runs,
                  prefer DAILY/WEEKLY/MONTHLY and activate on create.
                </div>
              </div>
            ) : (
              <div>
                <label
                  htmlFor="strategyExecutionTime"
                  className="block text-sm font-medium text-slate-800"
                >
                  Execution time (UTC, HH:mm)
                </label>
                <Input
                  id="strategyExecutionTime"
                  type="time"
                  value={form.strategyExecutionTime}
                  onChange={(value) => onChange("strategyExecutionTime", value)}
                  className="mt-2 bg-white"
                />
              </div>
            )}

            {form.strategyPeriodicity === "weekly" && (
              <div>
                <label
                  htmlFor="strategyDayOfWeek"
                  className="block text-sm font-medium text-slate-800"
                >
                  Day of week (0=Sun ... 6=Sat)
                </label>
                <Input
                  id="strategyDayOfWeek"
                  type="number"
                  value={String(form.strategyDayOfWeek)}
                  onChange={(value) => onChange("strategyDayOfWeek", Number(value))}
                  className="mt-2 bg-white"
                />
              </div>
            )}

            {form.strategyPeriodicity === "monthly" && (
              <div>
                <label
                  htmlFor="strategyDayOfMonth"
                  className="block text-sm font-medium text-slate-800"
                >
                  Day of month (1-31)
                </label>
                <Input
                  id="strategyDayOfMonth"
                  type="number"
                  value={String(form.strategyDayOfMonth)}
                  onChange={(value) => onChange("strategyDayOfMonth", Number(value))}
                  className="mt-2 bg-white"
                />
              </div>
            )}

            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.activateStrategyOnCreate}
                onChange={(event) =>
                  onChange("activateStrategyOnCreate", event.target.checked)
                }
              />
              Activate strategy immediately after task is created
            </label>
          </div>
        )}
      </div>
    </>
  );
}
