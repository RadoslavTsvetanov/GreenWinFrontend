"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { register } from "@/lib/auth/api";
import { updateOrganization, type UpdateOrganizationPayload } from "@/lib/organizations/api";
import { useToast } from "@/components/ui/Toast";
import { Button, Card, InlineAlert, Input } from "@/components/ui/primitives";

function splitCsvList(value: string): string[] | undefined {
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : undefined;
}

function parseOptionalNumber(raw: string): number | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

function buildOrganizationUpdatePayload(step2: {
  organizationDescription: string;
  organizationContactPerson: string;
  organizationPhone: string;
  organizationAddress: string;
  monthlyEmissionsTarget: string;
  annualEmissionsTarget: string;
  preferredCloudProviders: string;
  preferredRegions: string;
}): UpdateOrganizationPayload {
  const payload: UpdateOrganizationPayload = {};

  const d = step2.organizationDescription.trim();
  if (d) payload.description = d;

  const cp = step2.organizationContactPerson.trim();
  if (cp) payload.contactPerson = cp;

  const ph = step2.organizationPhone.trim();
  if (ph) payload.phoneNumber = ph;

  const ad = step2.organizationAddress.trim();
  if (ad) payload.address = ad;

  const m = parseOptionalNumber(step2.monthlyEmissionsTarget);
  if (m !== undefined) payload.monthlyEmissionsTarget = m;

  const a = parseOptionalNumber(step2.annualEmissionsTarget);
  if (a !== undefined) payload.annualEmissionsTarget = a;

  const providers = splitCsvList(step2.preferredCloudProviders);
  if (providers) payload.preferredCloudProviders = providers;

  const regions = splitCsvList(step2.preferredRegions);
  if (regions) payload.preferredRegions = regions;

  return payload;
}

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";

export function RegisterWizard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setSession } = useAuth();
  const { showError, showSuccess } = useToast();

  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");
  const [organizationContactPerson, setOrganizationContactPerson] = useState("");
  const [organizationPhone, setOrganizationPhone] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [monthlyEmissionsTarget, setMonthlyEmissionsTarget] = useState("");
  const [annualEmissionsTarget, setAnnualEmissionsTarget] = useState("");
  const [preferredCloudProviders, setPreferredCloudProviders] = useState("");
  const [preferredRegions, setPreferredRegions] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const step1Valid = useMemo(() => {
    return (
      name.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length >= 8
    );
  }, [name, email, password]);

  const canSubmitOrg = useMemo(
    () => organizationName.trim().length > 0,
    [organizationName],
  );

  const goNext = () => {
    setErrorMessage("");
    if (!step1Valid) {
      setErrorMessage(
        "Enter your name, email, and a password that is at least 8 characters.",
      );
      return;
    }
    setStep(2);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    if (!canSubmitOrg) {
      setErrorMessage("Organization name is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const session = await register({
        name: name.trim() || undefined,
        email: email.trim(),
        password,
        organizationName: organizationName.trim(),
      });
      setSession(session);

      const orgId = session.user.organizationId;
      const orgPatch = buildOrganizationUpdatePayload({
        organizationDescription,
        organizationContactPerson,
        organizationPhone,
        organizationAddress,
        monthlyEmissionsTarget,
        annualEmissionsTarget,
        preferredCloudProviders,
        preferredRegions,
      });

      if (orgId && Object.keys(orgPatch).length > 0) {
        try {
          await updateOrganization(orgId, orgPatch);
        } catch (patchError) {
          const patchMessage =
            patchError instanceof Error
              ? patchError.message
              : "Could not save company profile.";
          showError(
            `${patchMessage} Your account is active; you can update the organization later.`,
          );
        }
      }

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
    <Card className="w-full max-w-3xl p-6 shadow-md sm:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-600">
            Create account
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Register for GreenWin
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {step === 1
              ? "Step 1: your profile"
              : "Step 2: company profile — saved to your organization after sign-up"}
          </p>
        </div>
        <div
          className="flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600"
          role="status"
          aria-live="polite"
        >
          <span
            className={
              step === 1
                ? "rounded-full bg-emerald-700 px-2 py-0.5 text-white"
                : "px-2 py-0.5"
            }
          >
            1
          </span>
          <span className="text-slate-300">/</span>
          <span
            className={
              step === 2
                ? "rounded-full bg-emerald-700 px-2 py-0.5 text-white"
                : "px-2 py-0.5"
            }
          >
            2
          </span>
        </div>
      </div>

      {step === 1 ? (
        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="reg-name" className="block text-sm font-medium text-slate-700">
              Your name
            </label>
            <Input
              id="reg-name"
              type="text"
              required
              value={name}
              onChange={setName}
              className="mt-1.5 bg-slate-50"
              placeholder="Jane Doe"
            />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-700">
              Email
            </label>
            <Input
              id="reg-email"
              type="email"
              required
              value={email}
              onChange={setEmail}
              className="mt-1.5 bg-slate-50"
              placeholder="you@company.com"
            />
          </div>
          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-slate-700">
              Password
            </label>
            <Input
              id="reg-password"
              type="password"
              required
              value={password}
              onChange={setPassword}
              className="mt-1.5 bg-slate-50"
              placeholder="At least 8 characters"
            />
            <p className="mt-1 text-xs text-slate-500">
              Minimum 8 characters
            </p>
          </div>

          {errorMessage && (
            <InlineAlert tone="error">{errorMessage}</InlineAlert>
          )}

          <Button
            type="button"
            variant="primary"
            className="w-full py-3 text-base"
            onClick={goNext}
          >
            Continue to organization
          </Button>
        </div>
      ) : (
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label
                htmlFor="org-name"
                className="block text-sm font-medium text-slate-700"
              >
                Organization name
              </label>
              <Input
                id="org-name"
                type="text"
                required
                value={organizationName}
                onChange={setOrganizationName}
                className="mt-1.5 bg-slate-50"
                placeholder="Your company or team"
              />
              <p className="mt-1 text-xs text-slate-500">
                If this name already exists, you&apos;ll join that organization.
              </p>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="org-description"
                className="block text-sm font-medium text-slate-700"
              >
                Description
              </label>
              <textarea
                id="org-description"
                value={organizationDescription}
                onChange={(e) => setOrganizationDescription(e.target.value)}
                rows={3}
                className={`${fieldClass} mt-1.5 resize-y min-h-[4.5rem]`}
                placeholder="What does your organization focus on?"
              />
            </div>

            <div>
              <label
                htmlFor="org-contact"
                className="block text-sm font-medium text-slate-700"
              >
                Contact person
              </label>
              <Input
                id="org-contact"
                type="text"
                value={organizationContactPerson}
                onChange={setOrganizationContactPerson}
                className="mt-1.5 bg-slate-50"
                placeholder="Name of primary contact"
              />
            </div>

            <div>
              <label
                htmlFor="org-phone"
                className="block text-sm font-medium text-slate-700"
              >
                Phone
              </label>
              <Input
                id="org-phone"
                type="tel"
                value={organizationPhone}
                onChange={setOrganizationPhone}
                className="mt-1.5 bg-slate-50"
                placeholder="+1 …"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="org-address"
                className="block text-sm font-medium text-slate-700"
              >
                Address
              </label>
              <textarea
                id="org-address"
                value={organizationAddress}
                onChange={(e) => setOrganizationAddress(e.target.value)}
                rows={2}
                className={`${fieldClass} mt-1.5 resize-y`}
                placeholder="Street, city, region"
              />
            </div>

            <div>
              <label
                htmlFor="org-monthly-target"
                className="block text-sm font-medium text-slate-700"
              >
                Monthly emissions target (kg CO₂)
              </label>
              <Input
                id="org-monthly-target"
                type="text"
                value={monthlyEmissionsTarget}
                onChange={setMonthlyEmissionsTarget}
                className="mt-1.5 bg-slate-50"
                placeholder="Optional"
              />
            </div>

            <div>
              <label
                htmlFor="org-annual-target"
                className="block text-sm font-medium text-slate-700"
              >
                Annual emissions target (kg CO₂)
              </label>
              <Input
                id="org-annual-target"
                type="text"
                value={annualEmissionsTarget}
                onChange={setAnnualEmissionsTarget}
                className="mt-1.5 bg-slate-50"
                placeholder="Optional"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="org-providers"
                className="block text-sm font-medium text-slate-700"
              >
                Preferred cloud providers
              </label>
              <Input
                id="org-providers"
                type="text"
                value={preferredCloudProviders}
                onChange={setPreferredCloudProviders}
                className="mt-1.5 bg-slate-50"
                placeholder="e.g. aws, gcp, azure"
              />
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="org-regions"
                className="block text-sm font-medium text-slate-700"
              >
                Preferred regions
              </label>
              <Input
                id="org-regions"
                type="text"
                value={preferredRegions}
                onChange={setPreferredRegions}
                className="mt-1.5 bg-slate-50"
                placeholder="e.g. eu-west-1, us-east-1"
              />
            </div>
          </div>

          {errorMessage && (
            <InlineAlert tone="error">{errorMessage}</InlineAlert>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              className="order-2 py-3 sm:order-1 sm:w-auto"
              disabled={isSubmitting}
              onClick={() => {
                setErrorMessage("");
                setStep(1);
              }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="order-1 py-3 text-base sm:order-2 sm:min-w-[200px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating account…" : "Create account"}
            </Button>
          </div>
        </form>
      )}

      <p className="mt-8 border-t border-slate-200 pt-6 text-sm text-slate-600">
        Already have an account?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-emerald-700 hover:underline"
        >
          Login
        </Link>
      </p>
    </Card>
  );
}
