"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";

export function GlobalNavbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, isBootstrapping } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isHome = pathname === "/";
  const isTasksRoute = pathname.startsWith("/tasks");
  const isProjectsRoute = pathname.startsWith("/projects");
  const isAuthRoute = pathname.startsWith("/auth");
  const initials = (user?.name || user?.email || "U").trim().charAt(0).toUpperCase();

  useEffect(() => {
    function onPointerDown(event: MouseEvent) {
      if (!menuRef.current) return;
      if (!menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    function onEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);
    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, []);

  const navLinkClass = (active: boolean) =>
    `rounded-full px-3 py-1.5 text-sm font-medium transition ${
      active
        ? "bg-emerald-100 text-emerald-800"
        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
    }`;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="flex w-full items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
            G
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-tight text-slate-900">GreenWin</p>
            <p className="hidden truncate text-xs text-slate-500 lg:block">
              Carbon-aware cloud orchestration
            </p>
          </div>
        </Link>

        {isBootstrapping ? (
          <div className="h-9 w-24 animate-pulse rounded-full bg-slate-100" />
        ) : isAuthenticated ? (
          <div className="relative flex items-center gap-2" ref={menuRef}>
            <Link
              href="/tasks"
              className={navLinkClass(isTasksRoute)}
            >
              Tasks
            </Link>
            <Link
              href="/projects"
              className={navLinkClass(isProjectsRoute)}
            >
              Projects
            </Link>
            <button
              type="button"
              onClick={() => setIsMenuOpen((open) => !open)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 transition hover:bg-slate-50"
              aria-label="Open user menu"
              aria-haspopup="menu"
              aria-expanded={isMenuOpen}
            >
              {initials}
            </button>

            {isMenuOpen && (
              <div
                className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl"
                role="menu"
              >
                <div className="rounded-xl bg-slate-50 px-3 py-2">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {user?.name || "User"}
                  </p>
                  <p className="truncate text-xs text-slate-500">{user?.email}</p>
                </div>
                <div className="mt-2 space-y-1">
                  <Link
                    href="/tasks/new"
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    New task
                  </Link>
                  <Link
                    href="/"
                    className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    onClick={() => setIsMenuOpen(false)}
                    role="menuitem"
                  >
                    Home
                  </Link>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      logout();
                      router.replace("/auth/login");
                    }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-sm text-rose-700 hover:bg-rose-50"
                    role="menuitem"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {isHome && (
              <>
                <a
                  href="#features"
                  className={`hidden lg:inline-flex ${navLinkClass(false)}`}
                >
                  Features
                </a>
                <a
                  href="#workflow"
                  className={`hidden lg:inline-flex ${navLinkClass(false)}`}
                >
                  Workflow
                </a>
              </>
            )}
            {isAuthRoute ? (
              <>
                <Link
                  href={pathname === "/auth/login" ? "/auth/register" : "/auth/login"}
                  className={navLinkClass(false)}
                >
                  {pathname === "/auth/login" ? "Register" : "Login"}
                </Link>
                <Link
                  href="/"
                  className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                  Home
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className={navLinkClass(pathname === "/auth/login")}
                >
                  Login
                </Link>
                <Link
                  href="/auth/register"
                  className={navLinkClass(pathname === "/auth/register")}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
