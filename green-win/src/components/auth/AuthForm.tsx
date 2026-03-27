"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { Button, Card, InlineAlert, Input } from "@/components/ui/primitives";

type AuthFormProps = {
  email: string;
  password: string;
  isSubmitting: boolean;
  errorMessage: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AuthForm({
  email,
  password,
  isSubmitting,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: AuthFormProps) {
  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
        Welcome back
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        Login to GreenWin
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        Continue managing green task orchestration.
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={onEmailChange}
            className="mt-1 bg-slate-50"
            placeholder="you@company.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-slate-700">
            Password
          </label>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={onPasswordChange}
            className="mt-1 bg-slate-50"
            placeholder="••••••••"
          />
        </div>

        {errorMessage && (
          <InlineAlert tone="error">{errorMessage}</InlineAlert>
        )}

        <Button
          type="submit"
          disabled={isSubmitting}
          variant="primary"
          className="w-full py-2.5"
        >
          {isSubmitting ? "Please wait..." : "Login"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        No account yet?{" "}
        <Link
          href="/auth/register"
          className="font-semibold text-emerald-700 hover:underline"
        >
          Register
        </Link>
      </p>
    </Card>
  );
}
