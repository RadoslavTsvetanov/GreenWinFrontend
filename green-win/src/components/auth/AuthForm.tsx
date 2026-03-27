"use client";

import Link from "next/link";
import { FormEvent } from "react";
import { Button, Card, InlineAlert, Input } from "@/components/ui/primitives";

type AuthFormProps = {
  mode: "login" | "register";
  email: string;
  password: string;
  name: string;
  organizationName: string;
  isSubmitting: boolean;
  errorMessage: string;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onOrganizationNameChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function AuthForm({
  mode,
  email,
  password,
  name,
  organizationName,
  isSubmitting,
  errorMessage,
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onOrganizationNameChange,
  onSubmit,
}: AuthFormProps) {
  const isLogin = mode === "login";

  return (
    <Card className="w-full max-w-md p-6 sm:p-8">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
        {isLogin ? "Welcome back" : "Create account"}
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
        {isLogin ? "Login to GreenWin" : "Register for GreenWin"}
      </h1>
      <p className="mt-2 text-sm text-slate-600">
        {isLogin
          ? "Continue managing green task orchestration."
          : "Start orchestrating workloads with lower carbon impact."}
      </p>

      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {!isLogin && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                Name
              </label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={onNameChange}
                className="mt-1 bg-slate-50"
                placeholder="Jane Doe"
              />
            </div>

            <div>
              <label
                htmlFor="organizationName"
                className="block text-sm font-medium text-slate-700"
              >
                Organization name
              </label>
              <Input
                id="organizationName"
                type="text"
                required
                value={organizationName}
                onChange={onOrganizationNameChange}
                className="mt-1 bg-slate-50"
                placeholder="Your company or team"
              />
            </div>
          </>
        )}

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
          {isSubmitting
            ? "Please wait..."
            : isLogin
              ? "Login"
              : "Create account"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-slate-600">
        {isLogin ? "No account yet?" : "Already have an account?"}{" "}
        <Link
          href={isLogin ? "/auth/register" : "/auth/login"}
          className="font-semibold text-emerald-700 hover:underline"
        >
          {isLogin ? "Register" : "Login"}
        </Link>
      </p>
    </Card>
  );
}
