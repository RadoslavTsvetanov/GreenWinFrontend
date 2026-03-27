"use client";
import Link from "next/link";

import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const steps = [
  {
    title: "Submit task",
    description: "Upload Lambda files or Docker image from your backend team.",
  },
  {
    title: "Set constraints",
    description: "Choose providers, regions, and immediate or deadline mode.",
  },
  {
    title: "Green execution",
    description:
      "GreenWin schedules runtime in cleaner energy windows automatically.",
  },
];

export function NavLink({ href, children }: any) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`nav-bar-button transition
        ${isActive ? "bg-primary-900 text-base-100" : ""}`}
    >
      {children}
    </Link>
  );
}

export function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const [hover, setHover] = useState(false);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`nav-bar-button flex items-center gap-2 transition-colors
    ${open ? "bg-primary-900 text-base-100" : "hover:bg-primary-900 hover:text-base-100"}`}
      >
        <img
          src={open || hover ? "/PersonBase100.svg" : "/Person.svg"}
          alt="Profile"
          className="h-6 w-6 transition"
        />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-44 rounded-lg border border-base-200 bg-base-100 shadow-lg">
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-base-200">
            Profile
          </button>
          <button className="w-full px-4 py-2 text-left text-sm hover:bg-base-200">
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen text-base-900">
      <div className="absolute top-5 left-0 right-0 -z-10">
        {" "}
        <img
          src="/BGimage.svg"
          alt="background"
          className="w-full h-auto object-top"
        />{" "}
      </div>

      <header className="sticky top-0 z-20 border-b border-base-200 bg-base-100">
        <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-3 sm:px-10">
          <div>
            <p className="heading8 text-secondary-900">Green Win</p>
          </div>
          <div className="hidden items-center gap-10 md:flex">
            <NavLink href="/tasks">Jobs</NavLink>
            <NavLink href="/stats">States</NavLink>
            <ProfileDropdown />
          </div>
        </nav>
      </header>

      <main>
        <section className="mx-auto min-h-[85vh] flex flex-col justify-center  w-full max-w-6xl px-6 py-16 text-center">
          <div className="flex flex-col items-center space-y-20">
            <div className="flex flex-col items-center space-y-10">
              <h1 className="heading1 text-base-900">
                Run your code where the grid is cleaner
              </h1>

              <p className="paragraph1-light text-base-700 max-w-126">
                GreenWin routes backend workloads to regions and time windows
                with lower carbon intensity, without changing your deployment
                process.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link
                href="/tasks/new"
                className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Start with task
              </Link>

              <Link
                href="/tasks"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                View tasks
              </Link>
            </div>
          </div>
        </section>

        <section
          id="features"
          className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20"
        >
          <div className="mb-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Efficiency by design
            </p>
            <h2 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
              Built for clean operations
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
          <div className="mt-4 grid gap-4 lg:grid-cols-3">
            <Panel className="bg-gradient-to-br from-[#0b2746] to-[#0e3558] text-white lg:col-span-2">
              <p className="text-sm font-semibold">
                Real-time carbon intensity mapping
              </p>
              <p className="mt-2 text-sm text-cyan-100">
                Continuously select execution windows where grid intensity is
                lower.
              </p>
            </Panel>
            <Panel className="bg-gradient-to-br from-emerald-600 to-emerald-700 text-white">
              <p className="text-sm font-semibold">Automated scheduling</p>
              <p className="mt-2 text-sm text-emerald-100">
                Immediate and deadline workloads, managed automatically.
              </p>
            </Panel>
          </div>
        </section>

        <section
          id="workflow"
          className="bg-[#07121f] py-20 text-white sm:py-24"
        >
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 sm:px-10 lg:grid-cols-2">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-300">
                Integrated workflow
              </p>
              <h2 className="mt-2 text-4xl font-semibold tracking-tight">
                Operational orchestration for backend teams
              </h2>
              <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-300">
                From upload to execution and reporting, GreenWin gives your team
                a clear carbon-aware path.
              </p>
              <ol className="mt-6 space-y-3">
                {steps.map((step, index) => (
                  <li key={step.title} className="rounded-xl bg-white/5 p-4">
                    <p className="text-sm font-semibold text-white">
                      {index + 1}. {step.title}
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      {step.description}
                    </p>
                  </li>
                ))}
              </ol>
            </div>
            <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-lg">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
                Job summary
              </p>
              <div className="mt-4 space-y-3 text-sm">
                <CardRow label="Task" value="nightly-model-train" />
                <CardRow label="Mode" value="Run by deadline" />
                <CardRow
                  label="Preferred regions"
                  value="eu-central-1, europe-west1"
                />
                <CardRow
                  label="Current best window"
                  value="02:00 - 03:20 UTC"
                />
                <CardRow label="Estimated reduction" value="22% less CO2" />
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

        <section className="bg-emerald-700 py-14 text-center text-white">
          <div className="mx-auto w-full max-w-4xl px-6 sm:px-10">
            <blockquote className="text-2xl font-medium leading-relaxed">
              “Switching our batch processing to GreenWin reduced impact and
              improved planning within one sprint.”
            </blockquote>
            <p className="mt-4 text-sm text-emerald-100">
              — Hackathon pilot feedback
            </p>
          </div>
        </section>

        <section
          id="cta"
          className="mx-auto w-full max-w-6xl px-6 py-16 sm:px-10 sm:py-20"
        >
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Ready to launch?
            </p>
            <h2 className="mt-3 text-5xl font-semibold tracking-tight text-slate-900">
              Ready for the Green Revolution?
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600">
              Start with your first workload and let GreenWin orchestrate
              greener execution from day one.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/tasks/new"
                className="rounded-lg bg-emerald-700 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Create first task
              </Link>
              <Link
                href="/tasks"
                className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
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
    </PageShell>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-xl bg-white/85 p-3 shadow-sm">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        {title}
      </p>
      <p className="mt-1 text-xl font-semibold text-slate-900">{value}</p>
    </article>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {description}
      </p>
    </article>
  );
}

function Panel({
  className,
  children,
}: {
  className: string;
  children: React.ReactNode;
}) {
  return (
    <article className={`rounded-2xl p-6 shadow-sm ${className}`}>
      {children}
    </article>
  );
}

function CardRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 px-3 py-2">
      <p className="text-[11px] uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-1 font-semibold text-slate-900">{value}</p>
    </div>
  );
}
