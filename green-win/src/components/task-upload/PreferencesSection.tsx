import { CLOUD_PROVIDER_OPTIONS, REGION_OPTIONS } from "@/lib/task/constants";
import { TaskFormState } from "@/lib/task/types";
import { TaskFormChangeHandler, TaskFormToggleArrayHandler } from "./types";

type PreferencesSectionProps = {
  form: TaskFormState;
  onChange: TaskFormChangeHandler;
  onToggleArrayValue: TaskFormToggleArrayHandler;
};

export function PreferencesSection({
  form,
  onChange,
  onToggleArrayValue,
}: PreferencesSectionProps) {
  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-slate-800">Preferred clouds *</p>
          <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            {CLOUD_PROVIDER_OPTIONS.map((cloud) => (
              <label key={cloud} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.preferredClouds.includes(cloud)}
                  onChange={() => onToggleArrayValue("preferredClouds", cloud)}
                />
                <span className="uppercase">{cloud}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">Preferred regions *</p>
          <div className="mt-2 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            {REGION_OPTIONS.map((region) => (
              <label key={region} className="flex items-center gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  checked={form.preferredRegions.includes(region)}
                  onChange={() => onToggleArrayValue("preferredRegions", region)}
                />
                <span>{region}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-slate-800">
          Optimization strategy
        </label>
        <select
          id="priority"
          value={form.priority ?? "balanced"}
          onChange={(event) =>
            onChange("priority", event.target.value as TaskFormState["priority"])
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
        >
          <option value="balanced">Balanced</option>
          <option value="co2">Minimize CO2</option>
          <option value="speed">Maximize speed</option>
        </select>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-slate-800">
          Notes
        </label>
        <textarea
          id="notes"
          value={form.notes ?? ""}
          onChange={(event) => onChange("notes", event.target.value)}
          className="mt-2 min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
          placeholder="Optional context for scheduler or operations."
        />
      </div>
    </>
  );
}
