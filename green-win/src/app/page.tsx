import { Card, LinkButton, PageShell } from "@/components/ui/primitives";

const processCards = [
  {
    title: "Submit task",
    description:
      "Upload Lambda packages with metadata using backend-aligned multipart payloads.",
  },
  {
    title: "AI Analysis",
    description:
      "Validate payload quality and check workflow readiness before execution.",
  },
  {
    title: "Green execution",
    description:
      "Monitor execution, checkpoints, and strategy history in one interface.",
  },
];

const capabilityCards = [
  {
    title: "Project-first dashboard",
    description: "Switch between projects and keep task lists filtered by ownership.",
    tone: "dark",
  },
  {
    title: "Automated onboarding",
    description: "JWT login/register with protected routes and refresh token handling.",
    tone: "green",
  },
  {
    title: "Execution savings",
    description: "Contract-aligned requests reduce errors and keep operations efficient.",
    tone: "cyan",
  },
  {
    title: "ESG-ready reporting",
    description: "Task details expose status, checkpoints, and strategy state clearly.",
    tone: "light",
  },
] as const;

const workflow = [
  "Create a project in Workspace and keep ownership clear.",
  "Upload a Lambda zip and task metadata through the task form.",
  "Use dashboard filters to track status by project and task name.",
  "Open task details for executions, checkpoints, and strategy history.",
];

export default function Home() {
  return (
    <PageShell className="bg-[#f3f6f3] px-0 text-slate-900 sm:px-0 lg:px-0">
      <main className="w-full pt-4 sm:pt-6">
        <section className="mx-auto w-full max-w-[94vw] sm:max-w-[90vw] xl:max-w-[1600px]" id="hero">
          <div className="grid items-center gap-14 rounded-[2.2rem] border border-slate-200/90 bg-gradient-to-br from-white to-[#f7faf7] p-9 shadow-[0_18px_60px_-45px_rgba(16,24,40,0.4)] sm:p-14 lg:grid-cols-[1.05fr_0.95fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                GreenWin Platform
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
                Run your code where the sun shines
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                GreenWin helps teams organize workloads by project, submit Lambda tasks, and track
                execution details through one backend-connected interface.
              </p>
              <div className="mt-10 flex flex-wrap gap-3.5">
                <LinkButton
                  href="/tasks"
                  variant="primary"
                  className="rounded-full bg-emerald-700 px-6 py-2.5 hover:bg-emerald-800"
                >
                  Get started
                </LinkButton>
                <LinkButton href="/projects" variant="secondary" className="rounded-full px-6 py-2.5">
                  View docs
                </LinkButton>
              </div>
            </div>

            <div className="space-y-5">
              <Card className="overflow-hidden border-none bg-gradient-to-br from-cyan-100 via-emerald-100 to-lime-100 p-0 shadow-none">
                <div className="grid grid-cols-[1fr_auto] items-end gap-3 p-7">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                      Live workflow readiness
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-slate-900">94.2%</p>
                    <p className="mt-1 text-sm text-slate-600">
                      Organized execution with backend-connected flows
                    </p>
                  </div>
                  <div className="rounded-xl bg-white/85 px-3 py-2 text-right shadow-sm">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      Status
                    </p>
                    <p className="text-lg font-semibold text-emerald-700">Ready</p>
                  </div>
                </div>
              </Card>
              <div className="grid gap-3.5 sm:grid-cols-2">
                <MetricCard label="Project filter" value="Built-in" />
                <MetricCard label="Task upload" value="Multipart API" />
                <MetricCard label="Auth flow" value="JWT + refresh" />
                <MetricCard label="Task details" value="Exec + checkpoints" />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20 w-full border-y border-slate-200 bg-[#f8faf8]">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-center gap-x-8 gap-y-4 px-6 py-6 sm:px-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
              Backend connected
            </span>
            {["Auth", "Projects", "Tasks", "Executions", "Checkpoints"].map((item) => (
              <span key={item} className="text-sm font-semibold text-slate-600">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section
          className="mx-auto mt-24 w-full max-w-[94vw] space-y-10 sm:max-w-[90vw] xl:max-w-[1600px]"
          id="features"
        >
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Efficiency by design
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Built around real product workflows
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {processCards.map((item, index) => (
              <Card
                key={item.title}
                className="h-full rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-[#f8faf8] p-8 shadow-[0_10px_35px_-30px_rgba(15,23,42,0.5)]"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                  {index + 1}
                </p>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>
              </Card>
            ))}
          </div>

          <div className="mt-12 space-y-6 sm:mt-14">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                Platform capabilities
              </p>
              <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                One clean system, end to end
              </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {capabilityCards.map((item) => (
                <Card
                  key={item.title}
                  className="h-full rounded-2xl border border-slate-200 bg-gradient-to-br from-white to-[#f9fbf9] p-6 shadow-[0_12px_30px_-28px_rgba(15,23,42,0.5)] sm:p-7"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={
                        item.tone === "dark"
                          ? "h-2.5 w-2.5 rounded-full bg-slate-900"
                          : item.tone === "green"
                            ? "h-2.5 w-2.5 rounded-full bg-emerald-600"
                            : item.tone === "cyan"
                              ? "h-2.5 w-2.5 rounded-full bg-cyan-500"
                              : "h-2.5 w-2.5 rounded-full bg-slate-400"
                      }
                    />
                    <h4 className="text-xl font-semibold text-slate-900">{item.title}</h4>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-24 w-full bg-[#04111d] py-20 sm:py-24" id="workflow">
          <div className="mx-auto grid w-full max-w-[94vw] items-start gap-10 sm:max-w-[90vw] lg:grid-cols-[1.1fr_0.9fr] xl:max-w-[1600px]">
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300">
                Integrated with your workflow
              </p>
              <h2 className="mt-3 max-w-xl text-4xl font-semibold leading-tight sm:text-5xl">
                Operational visibility from upload to execution
              </h2>
              <ol className="mt-9 space-y-4">
                {workflow.map((step, index) => (
                  <li
                    key={step}
                    className="rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm leading-relaxed"
                  >
                    <span className="font-semibold text-emerald-300">{index + 1}.</span> {step}
                  </li>
                ))}
              </ol>
            </div>
            <Card className="rounded-3xl border-none bg-gradient-to-br from-white to-[#f7faf8] p-8 shadow-[0_18px_45px_-35px_rgba(0,0,0,0.6)] sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Live control panel
              </p>
              <div className="mt-5 space-y-3.5">
                {capabilityCards.map((item) => (
                  <div key={item.title} className="rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-5 py-3.5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-emerald-700">
                      {item.tone}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        <section className="w-full bg-emerald-700 py-16 text-white sm:py-20">
          <div className="mx-auto w-full max-w-[94vw] text-center sm:max-w-[90vw] xl:max-w-[1600px]">
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-emerald-50 sm:text-xl">
              "Switching our batch processing to GreenWin didn't just help with our net-zero targets
              early, it actually lowered our infrastructure bill by 22%."
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              Works for teams that ship
            </p>
          </div>
        </section>

        <section className="w-full bg-[#f7faf7] py-20 sm:py-24">
          <div className="mx-auto w-full max-w-[94vw] text-center sm:max-w-[90vw] xl:max-w-[1600px]">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Start now</p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
              Ready for the Green Revolution?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Create your first project workflow and manage tasks from one unified dashboard.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
              <LinkButton
                href="/projects"
                variant="primary"
                className="rounded-full bg-emerald-700 px-6 py-2.5 hover:bg-emerald-800"
              >
                Get started now
              </LinkButton>
              <LinkButton href="/tasks/new" variant="secondary" className="rounded-full px-6 py-2.5">
                Book a demo
              </LinkButton>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="rounded-2xl border-none bg-gradient-to-br from-emerald-50 to-cyan-50 p-5 shadow-none">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </Card>
  );
}
