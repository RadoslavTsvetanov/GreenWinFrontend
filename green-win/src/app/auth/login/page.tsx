"use client";

import { FormEvent, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { login } from "@/lib/auth/api";
import { useToast } from "@/components/ui/Toast";
import { PageShell } from "@/components/ui/primitives";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const { showError } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const session = await login({ email, password });
      setSession(session);

      const next = searchParams.get("next") || "/tasks";
      router.replace(next);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed.";
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell className="bg-gradient-to-b from-slate-50 via-emerald-50/30 to-cyan-50/35">
      <main className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-6xl items-center justify-center">
        <AuthForm
          mode="login"
          email={email}
          password={password}
          name=""
          organizationName=""
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onNameChange={() => {}}
          onOrganizationNameChange={() => {}}
          onSubmit={onSubmit}
        />
      </main>
    </PageShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <PageShell className="bg-gradient-to-b from-slate-50 via-emerald-50/30 to-cyan-50/35">
          <main className="mx-auto flex min-h-[calc(100dvh-6rem)] w-full max-w-6xl items-center justify-center">
            <p className="text-sm text-slate-600">Loading…</p>
          </main>
        </PageShell>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}
