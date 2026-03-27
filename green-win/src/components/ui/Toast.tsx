"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type ToastVariant = "error" | "success" | "info";

type ToastOptions = {
  id: number;
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showInfo: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function normalizeToastMessage(input: string): string {
  const trimmed = (input || "").trim();
  if (!trimmed) return "";

  const lower = trimmed.toLowerCase();
  if (
    lower.includes("<html") ||
    lower.includes("<body") ||
    lower.includes("<!doctype html") ||
    lower.includes("502 bad gateway") ||
    lower.includes("nginx")
  ) {
    return "Backend temporarily unavailable (502 Bad Gateway). Please try again.";
  }

  const withoutTags = trimmed.replace(/<[^>]+>/g, " ");
  const compact = withoutTags.replace(/\s+/g, " ").trim();
  if (!compact) return "";
  if (compact.length > 220) {
    return `${compact.slice(0, 217)}...`;
  }
  return compact;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastOptions[]>([]);

  const addToast = useCallback((message: string, variant: ToastVariant) => {
    const normalized = normalizeToastMessage(message);
    if (!normalized) return;

    setToasts((current) => {
      // Avoid stacking repeated identical errors.
      if (current.some((item) => item.message === normalized && item.variant === variant)) {
        return current;
      }
      const id = Date.now();
      return [...current, { id, message: normalized, variant }];
    });
  }, []);

  const showError = useCallback((message: string) => {
    addToast(message, "error");
  }, [addToast]);

  const showSuccess = useCallback((message: string) => {
    addToast(message, "success");
  }, [addToast]);

  const showInfo = useCallback((message: string) => {
    addToast(message, "info");
  }, [addToast]);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) =>
      setTimeout(
        () =>
          setToasts((current) =>
            current.filter((item) => item.id !== toast.id),
          ),
        5000,
      ),
    );

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [toasts]);

  const value: ToastContextValue = useMemo(
    () => ({
      showError,
      showSuccess,
      showInfo,
    }),
    [showError, showSuccess, showInfo],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-40 flex justify-center px-4 sm:px-6">
        <div className="flex w-full max-w-md flex-col gap-2">
          {toasts.map((toast) => {
            const base =
              "pointer-events-auto flex items-start gap-2 rounded-xl border px-3 py-2 text-sm shadow-md backdrop-blur";

            const variantClass =
              toast.variant === "error"
                ? "border-rose-200 bg-rose-50/95 text-rose-800"
                : toast.variant === "success"
                  ? "border-emerald-200 bg-emerald-50/95 text-emerald-900"
                  : "border-slate-200 bg-white/95 text-slate-900";

            const accentClass =
              toast.variant === "error"
                ? "bg-rose-500"
                : toast.variant === "success"
                  ? "bg-emerald-500"
                  : "bg-slate-500";

            return (
              <div key={toast.id} className={base + " " + variantClass}>
                <span className={`mt-1 inline-block h-2 w-2 rounded-full ${accentClass}`} />
                <p className="flex-1 text-sm">{toast.message}</p>
              </div>
            );
          })}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

