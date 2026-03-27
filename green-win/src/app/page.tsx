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
        </section>

        <section className="w-full bg-emerald-700 py-16 text-white sm:py-20">
          <div className="mx-auto w-full max-w-[94vw] text-center sm:max-w-[90vw] xl:max-w-[1600px]">
            <p className="mx-auto max-w-3xl text-base leading-relaxed text-emerald-50 sm:text-xl">
              "Switching our batch processing to GreenWin didn't just help with
              our net-zero targets early, it actually lowered our infrastructure
              bill by 22%."
            </p>
            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-100">
              Works for teams that ship
            </p>
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
