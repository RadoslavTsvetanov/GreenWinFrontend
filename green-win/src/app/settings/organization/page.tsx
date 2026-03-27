"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  fetchOrganization,
  updateOrganization,
  type OrganizationRecord,
  type UpdateOrganizationPayload,
} from "@/lib/organizations/api";
import { useToast } from "@/components/ui/Toast";
import {
  BackLink,
  Button,
  Card,
  InlineAlert,
  Input,
  LoadingState,
  PageHeader,
  PageShell,
} from "@/components/ui/primitives";

const fieldClass =
  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100";

function splitCsv(value: string): string[] | undefined {
  const parts = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length > 0 ? parts : undefined;
}

function joinCsv(list: string[] | null | undefined): string {
  if (!list || list.length === 0) return "";
  return list.join(", ");
}

function optionalNumber(raw: string): number | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const n = Number(t);
  return Number.isFinite(n) ? n : undefined;
}

type FormSnapshot = {
  name: string;
  email: string;
  description: string;
  contactPerson: string;
  phoneNumber: string;
  address: string;
  monthlyEmissionsTarget: string;
  annualEmissionsTarget: string;
  preferredCloudProviders: string;
  preferredRegions: string;
};

function recordToForm(org: OrganizationRecord): FormSnapshot {
  return {
    name: org.name,
    email: org.email,
    description: org.description ?? "",
    contactPerson: org.contactPerson ?? "",
    phoneNumber: org.phoneNumber ?? "",
    address: org.address ?? "",
    monthlyEmissionsTarget:
      org.monthlyEmissionsTarget != null ? String(org.monthlyEmissionsTarget) : "",
    annualEmissionsTarget:
      org.annualEmissionsTarget != null ? String(org.annualEmissionsTarget) : "",
    preferredCloudProviders: joinCsv(org.preferredCloudProviders),
    preferredRegions: joinCsv(org.preferredRegions),
  };
}

function normalizeFormSnapshot(f: FormSnapshot): FormSnapshot {
  return {
    name: f.name.trim(),
    email: f.email.trim(),
    description: f.description.trim(),
    contactPerson: f.contactPerson.trim(),
    phoneNumber: f.phoneNumber.trim(),
    address: f.address.trim(),
    monthlyEmissionsTarget: f.monthlyEmissionsTarget.trim(),
    annualEmissionsTarget: f.annualEmissionsTarget.trim(),
    preferredCloudProviders: f.preferredCloudProviders.trim(),
    preferredRegions: f.preferredRegions.trim(),
  };
}

function snapshotsEqual(a: FormSnapshot, b: FormSnapshot): boolean {
  const x = normalizeFormSnapshot(a);
  const y = normalizeFormSnapshot(b);
  return (
    x.name === y.name &&
    x.email === y.email &&
    x.description === y.description &&
    x.contactPerson === y.contactPerson &&
    x.phoneNumber === y.phoneNumber &&
    x.address === y.address &&
    x.monthlyEmissionsTarget === y.monthlyEmissionsTarget &&
    x.annualEmissionsTarget === y.annualEmissionsTarget &&
    x.preferredCloudProviders === y.preferredCloudProviders &&
    x.preferredRegions === y.preferredRegions
  );
}

export default function OrganizationSettingsPage() {
  const { user } = useAuth();
  const orgId = user?.organizationId ?? null;
  const { showError, showSuccess } = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [monthlyEmissionsTarget, setMonthlyEmissionsTarget] = useState("");
  const [annualEmissionsTarget, setAnnualEmissionsTarget] = useState("");
  const [preferredCloudProviders, setPreferredCloudProviders] = useState("");
  const [preferredRegions, setPreferredRegions] = useState("");
  const [baseline, setBaseline] = useState<FormSnapshot | null>(null);

  const currentSnapshot = useMemo<FormSnapshot>(
    () => ({
      name,
      email,
      description,
      contactPerson,
      phoneNumber,
      address,
      monthlyEmissionsTarget,
      annualEmissionsTarget,
      preferredCloudProviders,
      preferredRegions,
    }),
    [
      name,
      email,
      description,
      contactPerson,
      phoneNumber,
      address,
      monthlyEmissionsTarget,
      annualEmissionsTarget,
      preferredCloudProviders,
      preferredRegions,
    ],
  );

  const isDirty =
    baseline !== null && !snapshotsEqual(currentSnapshot, baseline);

  useEffect(() => {
    if (!orgId) {
      setIsLoading(false);
      return;
    }

    const id = orgId;
    let cancelled = false;

    async function load() {
      setIsLoading(true);
      setErrorMessage("");
      setBaseline(null);
      try {
        const org = await fetchOrganization(id);
        if (cancelled) return;
        const f = recordToForm(org);
        setName(f.name);
        setEmail(f.email);
        setDescription(f.description);
        setContactPerson(f.contactPerson);
        setPhoneNumber(f.phoneNumber);
        setAddress(f.address);
        setMonthlyEmissionsTarget(f.monthlyEmissionsTarget);
        setAnnualEmissionsTarget(f.annualEmissionsTarget);
        setPreferredCloudProviders(f.preferredCloudProviders);
        setPreferredRegions(f.preferredRegions);
        setBaseline(f);
      } catch (e) {
        if (!cancelled) {
          const message =
            e instanceof Error ? e.message : "Failed to load organization.";
          setErrorMessage(message);
          showError(message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [orgId, showError]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!orgId) return;

    setIsSaving(true);
    setErrorMessage("");
    try {
      const payload: UpdateOrganizationPayload = {
        name: name.trim(),
        email: email.trim(),
      };

      const d = description.trim();
      if (d) payload.description = d;

      const cp = contactPerson.trim();
      if (cp) payload.contactPerson = cp;

      const ph = phoneNumber.trim();
      if (ph) payload.phoneNumber = ph;

      const ad = address.trim();
      if (ad) payload.address = ad;

      const m = optionalNumber(monthlyEmissionsTarget);
      if (m !== undefined) payload.monthlyEmissionsTarget = m;

      const a = optionalNumber(annualEmissionsTarget);
      if (a !== undefined) payload.annualEmissionsTarget = a;

      payload.preferredCloudProviders =
        preferredCloudProviders.trim().length > 0
          ? splitCsv(preferredCloudProviders) ?? []
          : [];

      payload.preferredRegions =
        preferredRegions.trim().length > 0 ? splitCsv(preferredRegions) ?? [] : [];

      await updateOrganization(orgId, payload);
      showSuccess("Company profile updated.");
      setBaseline(normalizeFormSnapshot(currentSnapshot));
    } catch (e) {
      const message =
        e instanceof Error ? e.message : "Could not save organization.";
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!orgId) {
    return (
      <PageShell>
        <main className="mx-auto w-full max-w-3xl space-y-4">
          <BackLink href="/tasks" label="Back to tasks" />
          <PageHeader
            eyebrow="Settings"
            title="Company profile"
            subtitle="Your account is not linked to an organization."
          />
          <InlineAlert tone="info">
            Register with an organization name or contact an administrator to be added to a team.
          </InlineAlert>
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="mx-auto w-full max-w-3xl space-y-4 pb-12">
        <BackLink href="/tasks" label="Back to tasks" />
        <PageHeader
          eyebrow="Settings"
          title="Company profile"
          subtitle="Details are stored on your organization and shared with your team in GreenWin."
        />

        {isLoading ? (
          <LoadingState label="Loading organization…" />
        ) : (
          <form onSubmit={onSubmit} className="space-y-6">
            <Card className="space-y-5">
              <h2 className="text-sm font-semibold text-slate-900">Identity</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label htmlFor="org-name" className="block text-sm font-medium text-slate-700">
                    Organization name
                  </label>
                  <Input
                    id="org-name"
                    type="text"
                    required
                    value={name}
                    onChange={setName}
                    className="mt-1.5 bg-slate-50"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="org-email" className="block text-sm font-medium text-slate-700">
                    Organization email
                  </label>
                  <Input
                    id="org-email"
                    type="email"
                    required
                    value={email}
                    onChange={setEmail}
                    className="mt-1.5 bg-slate-50"
                  />
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
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className={`${fieldClass} mt-1.5 min-h-[4.5rem] resize-y`}
                  />
                </div>
              </div>
            </Card>

            <Card className="space-y-5">
              <h2 className="text-sm font-semibold text-slate-900">Contact</h2>
              <div className="grid gap-5 sm:grid-cols-2">
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
                    value={contactPerson}
                    onChange={setContactPerson}
                    className="mt-1.5 bg-slate-50"
                  />
                </div>
                <div>
                  <label htmlFor="org-phone" className="block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <Input
                    id="org-phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={setPhoneNumber}
                    className="mt-1.5 bg-slate-50"
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
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={2}
                    className={`${fieldClass} mt-1.5 resize-y`}
                  />
                </div>
              </div>
            </Card>

            <Card className="space-y-5">
              <h2 className="text-sm font-semibold text-slate-900">Sustainability &amp; cloud</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="org-monthly"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Monthly emissions target (kg CO₂)
                  </label>
                  <Input
                    id="org-monthly"
                    type="text"
                    value={monthlyEmissionsTarget}
                    onChange={setMonthlyEmissionsTarget}
                    className="mt-1.5 bg-slate-50"
                    placeholder="Optional"
                  />
                </div>
                <div>
                  <label
                    htmlFor="org-annual"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Annual emissions target (kg CO₂)
                  </label>
                  <Input
                    id="org-annual"
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
                  <label htmlFor="org-regions" className="block text-sm font-medium text-slate-700">
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
            </Card>

            {errorMessage ? (
              <InlineAlert tone="error">{errorMessage}</InlineAlert>
            ) : null}

            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="submit"
                variant="primary"
                disabled={isSaving || !isDirty}
                className="min-w-40"
              >
                {isSaving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </PageShell>
  );
}
