"use client";

import { Suspense } from "react";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { LoadingState } from "@/components/ui/primitives";

export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingState label="Opening dashboard…" />}>
      <DashboardView />
    </Suspense>
  );
}
