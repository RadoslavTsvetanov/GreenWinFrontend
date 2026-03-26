import Link from "next/link";

const steps = [
  { title: "Submit task", description: "Upload Lambda files or Docker image from your backend team." },
  { title: "Set constraints", description: "Choose providers, regions, and immediate or deadline mode." },
  { title: "Green execution", description: "GreenWin schedules runtime in cleaner energy windows automatically." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f7f6] text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 sm:px-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-700">GreenWin</p>
            <p className="text-xs font-medium text-slate-500">Run code where the grid is greener</p>
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <a href="#features" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Features</a>
            <a href="#workflow" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Workflow</a>
            <a href="#cta" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">Get started</a>
            <Link href="/tasks" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
              Dashboard
            </Link>
            <Link href="/tasks/new" className="rounded-lg bg-[#0f172a] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800">
              Launch task
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
          <div className="grid items-center gap-8 lg:grid-cols-2">
            <div className="space-y-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-700">
                Carbon-aware cloud orchestration
              </p>
              <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-slate-900 sm:text-6xl">
                Run your code where the grid is cleaner
              </h1>
              <p className="max-w-xl text-base leading-relaxed text-slate-600">
                GreenWin routes backend workloads to regions and time windows with lower carbon intensity,
                without changing your deployment process.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link href="/tasks/new" className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
                  Start with task
                </Link>
                <Link href="/tasks" className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  View tasks
                </Link>
              </div>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-cyan-100 via-emerald-100 to-sky-100 p-6 shadow-sm">
              <div className="rounded-2xl bg-white/85 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Live carbon score</p>
                <p className="mt-2 text-4xl font-semibold text-emerald-700">94.2%</p>
                <p className="text-sm text-slate-600">best current green window match</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <Stat title="Avg CO2 reduction" value="22%" />
                <Stat title="Tasks orchestrated" value="12.4k+" />
                <Stat title="Runtimes" value="Lambda + Docker" />
                <Stat title="Modes" value="Immediate / Deadline" />
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-center gap-6 px-6 py-10 sm:px-10">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Integrated with</span>
            {["AWS", "Azure", "GCP", "Vercel", "Cloudflare", "K8s"].map((item) => (
              <span key={item} className="text-sm font-semibold text-slate-600">{item}</span>
            ))}
          </div>
        </section>

        <section id="features" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Efficiency by design</p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">Built for clean operations</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <FeatureCard
              title="Real-time carbon mapping"
              description="Continuously evaluates regions and providers based on cleaner energy mix."
            />
            <FeatureCard
              title="Automatic scheduling"
              description="Decides immediate run or delayed execution windows against your deadlines."
            />
            <FeatureCard
              title="Cost and impact reporting"
              description="Keeps status, region and estimated CO2 savings in one management workspace."
            />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Panel className="bg-gradient-to-br from-[#0b2746] to-[#0e3558] text-white lg:col-span-2">
              <p className="text-sm font-semibold">Real-time carbon intensity mapping</p>
              <p className="mt-2 text-sm text-cyan-100">
                Continuously select execution windows where grid intensity is lower.
              </p>
            </Panel>
            <Panel className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <p className="text-sm font-semibold">Automated scheduling</p>
              <p className="mt-2 text-sm text-emerald-100">Immediate and deadline workloads, managed automatically.</p>
            </Panel>
          </div>
        </section>

        <section id="workflow" className="bg-[#07121f] py-20 text-white sm:py-24">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">Integrated workflow</p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight">Operational orchestration for backend teams</h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300">
                From upload to execution and reporting, GreenWin gives your team a clear carbon-aware path.
              </p>
              <ol className="mt-6 space-y-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">{index + 1}. {step.title}</p>
                    <p className="mt-1 text-sm text-slate-300">{step.description}</p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">Job summary</p>
              <div className="mt-4 space-y-3 text-sm">
                <CardRow label="Task" value="nightly-model-train" />
                <CardRow label="Mode" value="Run by deadline" />
                <CardRow label="Preferred regions" value="eu-central-1, europe-west1" />
                <CardRow label="Current best window" value="02:00 - 03:20 UTC" />
                <CardRow label="Estimated reduction" value="22% less CO2" />
              </div>
              <button className="mt-6 w-full rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">
                Run with GreenWin
              </button>
            </div>
          </div>
        </section>

        <section className="bg-emerald-700 py-14 text-center text-white">
          <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
            <blockquote className="text-2xl font-medium leading-relaxed">
              “Switching our batch processing to GreenWin reduced impact and improved planning within one sprint.”
            </blockquote>
            <p className="mt-4 text-sm text-emerald-100">— Hackathon pilot feedback</p>
          </div>
        </section>

        <section id="cta" className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Ready to launch?</p>
          <h2 className="mt-3 text-5xl font-semibold tracking-tight text-slate-900">Ready for the Green Revolution?</h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
            Start with your first workload and let GreenWin orchestrate greener execution from day one.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link href="/tasks/new" className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800">
              Create first task
            </Link>
            <Link href="/tasks" className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">
              Open dashboard
            </Link>
          </div>
          </div>
        </section>

        <footer className="border-t border-slate-200 px-6 py-6 text-xs text-slate-500 sm:px-10">
          <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-2">
            <p>GreenWin • Carbon-aware cloud orchestration</p>
            <p>Hackathon MVP</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

function Stat({ title, value }: { title: string; value: string }) {
  return (
    <article className="rounded-xl bg-white/85 p-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </article>
  );
}

function Panel({ className, children }: { className: string; children: React.ReactNode }) {
  return <article className={`rounded-2xl p-6 shadow-sm ${className}`}>{children}</article>;
}

function CardRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
