"use client";

import Link from "next/link";
import { ReactNode } from "react";

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

type CardProps = {
  children: ReactNode;
  className?: string;
  muted?: boolean;
};

export function Card({ children, className, muted = false }: CardProps) {
  return (
    <section
      className={cx(
        "rounded-2xl border p-4 shadow-sm sm:p-5",
        muted ? "border-slate-200 bg-slate-50" : "border-slate-200 bg-white",
        className,
      )}
    >
      {children}
    </section>
  );
}

type PageShellProps = {
  children: ReactNode;
  className?: string;
};

export function PageShell({ children, className }: PageShellProps) {
  return (
    <div className={cx("min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8", className)}>
      {children}
    </div>
  );
}

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
};

export function PageHeader({ eyebrow, title, subtitle, actions }: PageHeaderProps) {
  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          {eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700">
              {eyebrow}
            </p>
          ) : null}
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {title}
          </h1>
          {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </Card>
  );
}

type ButtonProps = {
  children: ReactNode;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  className,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cx(
        "inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-60",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variant === "primary" && "bg-slate-900 text-white hover:bg-slate-800",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100",
        variant === "danger" && "bg-rose-600 text-white hover:bg-rose-700",
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md";
  className?: string;
};

export function LinkButton({
  href,
  children,
  variant = "secondary",
  size = "md",
  className,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300",
        size === "sm" ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
        variant === "primary" && "bg-slate-900 text-white hover:bg-slate-800",
        variant === "secondary" &&
          "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50",
        variant === "ghost" && "text-slate-700 hover:bg-slate-100",
        className,
      )}
    >
      {children}
    </Link>
  );
}

type BackLinkProps = {
  href: string;
  label: string;
  className?: string;
};

export function BackLink({ href, label, className }: BackLinkProps) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700 transition hover:bg-emerald-50",
        className,
      )}
    >
      <span aria-hidden="true">&lt;</span>
      <span>{label}</span>
    </Link>
  );
}

type InputProps = {
  id?: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Input({
  type = "text",
  value,
  onChange,
  className,
  ...rest
}: InputProps) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cx(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100",
        className,
      )}
      {...rest}
    />
  );
}

type SelectProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function Select({
  value,
  onChange,
  children,
  className,
  ...rest
}: SelectProps) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={cx(
        "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:cursor-not-allowed disabled:bg-slate-100",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
}

type InlineAlertProps = {
  tone: "error" | "success" | "info";
  children: ReactNode;
  className?: string;
};

export function InlineAlert({ tone, children, className }: InlineAlertProps) {
  return (
    <div
      className={cx(
        "rounded-xl border px-3 py-2 text-sm",
        tone === "error" && "border-rose-200 bg-rose-50 text-rose-700",
        tone === "success" && "border-emerald-200 bg-emerald-50 text-emerald-700",
        tone === "info" && "border-slate-200 bg-slate-100 text-slate-700",
        className,
      )}
    >
      {children}
    </div>
  );
}

type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({
  label = "Loading...",
  className,
}: LoadingStateProps) {
  return (
    <Card className={cx("text-sm text-slate-600", className)}>
      <p>{label}</p>
    </Card>
  );
}

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <Card className={cx("text-center", className)} muted>
      <p className="text-base font-semibold text-slate-900">{title}</p>
      {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </Card>
  );
}

