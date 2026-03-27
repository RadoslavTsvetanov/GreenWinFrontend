"use client";

import { ReactNode } from "react";
import { Card } from "@/components/ui/primitives";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
};

export function ChartCard({ title, subtitle, children, className }: ChartCardProps) {
  return (
    <Card className={className}>
      <div className="mb-3 sm:mb-4">
        <h3 className="text-sm font-semibold tracking-tight text-slate-900">{title}</h3>
        {subtitle ? (
          <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{subtitle}</p>
        ) : null}
      </div>
      {children}
    </Card>
  );
}
