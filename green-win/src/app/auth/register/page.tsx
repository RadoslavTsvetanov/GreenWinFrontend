"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthForm } from "@/components/auth/AuthForm";
import { useAuth } from "@/components/auth/AuthProvider";
import { register } from "@/lib/auth/api";
import { useToast } from "@/components/ui/Toast";
import { PageShell } from "@/components/ui/primitives";

export default function RegisterPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const { showError, showSuccess } = useToast();
  const [name, setName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const session = await register({
        name,
        email,
        password,
        organizationName,
      });
      setSession(session);
      showSuccess("Account created.");
      const next = searchParams.get("next") || "/tasks";
      router.replace(next);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Registration failed.";
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
          mode="register"
          email={email}
          password={password}
          name={name}
          organizationName={organizationName}
          isSubmitting={isSubmitting}
          errorMessage={errorMessage}
          onEmailChange={setEmail}
          onPasswordChange={setPassword}
          onNameChange={setName}
          onOrganizationNameChange={setOrganizationName}
          onSubmit={onSubmit}
        />
      </main>
    </PageShell>
  );
}
