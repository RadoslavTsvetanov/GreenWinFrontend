"use client";

import { Suspense } from "react";
import { RegisterWizard } from "@/components/auth/RegisterWizard";
import { PageShell } from "@/components/ui/primitives";

export default function RegisterPage() {
  return (
    <PageShell className="bg-gradient-to-b from-slate-50 via-emerald-50/30 to-cyan-50/35">
      <main className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-6xl items-center justify-center px-4 py-10">
        <Suspense
          fallback={<p className="text-sm text-slate-600">Loading…</p>}
        >
          <RegisterWizard />
        </Suspense>
      </main>
    </PageShell>
  );
}
