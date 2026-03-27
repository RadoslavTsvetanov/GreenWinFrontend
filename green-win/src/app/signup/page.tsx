"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import TextField from "@/components/text-field/TextField";
import Button from "@/components/button/Button";
import { useToast } from "@/components/ui/Toast";
import { register } from "@/lib/auth/api";
import { ButtonVariant } from "@/lib/button/types";
import {
  updateOrganization,
  UpdateOrganizationPayload,
} from "@/lib/organizations/api";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/dist/client/components/navigation";
import { useState } from "react";
import Link from "next/dist/client/link";

const SignupPage = () => {
  const [step, setStep] = useState<1 | 2>(1);

  const [name, setName] = useState("");
  const [errorMessageName, setErrorMessageName] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

  const [orgName, setOrgName] = useState("");
  const [errorMessageOrgName, setErrorMessageOrgName] = useState("");
  const [description, setDescription] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [errorMessageContactPerson, setErrorMessageContactPerson] =
    useState("");
  const [validContactPerson, setValidContactPerson] = useState(false);
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [monthlyTarget, setMonthlyTarget] = useState("");
  const [annualTarget, setAnnualTarget] = useState("");
  const [cloudProviders, setCloudProviders] = useState("");
  const [regions, setRegions] = useState("");

  const [globalErrorMessage, setGlobalErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setSession } = useAuth();
  const { showError, showSuccess } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) {
      setValidEmail(true);
      setErrorMessageEmail("");
    } else {
      setValidEmail(false);
      setErrorMessageEmail("Invalid email address");
    }
  };

  const isValidContactPerson = (contactPerson: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(contactPerson)) {
      setValidContactPerson(true);
      setErrorMessageContactPerson("");
    } else {
      setValidContactPerson(false);
      setErrorMessageContactPerson("Invalid contact person email");
    }
  };

  const isValidPassword = (password: string) => {
    if (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password)
    ) {
      setValidPassword(true);
      setErrorMessagePassword("");
    } else {
      setValidPassword(false);
      setErrorMessagePassword(
        "Min 8 characters, uppercase, lowercase & number",
      );
    }
  };

  const canProceed = name.length > 0 && validEmail && validPassword;

  const handleNext = () => {
    if (canProceed) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const parseOptionalNumber = (raw: string): number | undefined => {
    const t = raw.trim();
    if (!t) return undefined;
    const n = Number(t);
    return Number.isFinite(n) ? n : undefined;
  };

  const splitCsvList = (value: string): string[] | undefined => {
    const parts = value
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return parts.length > 0 ? parts : undefined;
  };

  const buildOrganizationUpdatePayload = (step2: {
    organizationDescription: string;
    organizationContactPerson: string;
    organizationPhone: string;
    organizationAddress: string;
    monthlyEmissionsTarget: string;
    annualEmissionsTarget: string;
    preferredCloudProviders: string;
    preferredRegions: string;
  }): UpdateOrganizationPayload => {
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
  };

  const handleSignup = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    setGlobalErrorMessage("");

    if (orgName.length <= 0) {
      setErrorMessageOrgName("Organization name is required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const session = await register({
        name: name.trim(),
        email: email.trim(),
        password,
        organizationName: orgName.trim(),
      });
      setSession(session);

      const orgId = session.user.organizationId;
      const orgPatch = buildOrganizationUpdatePayload({
        organizationDescription: description,
        organizationContactPerson: contactPerson,
        organizationPhone: phone,
        organizationAddress: address,
        monthlyEmissionsTarget: monthlyTarget,
        annualEmissionsTarget: annualTarget,
        preferredCloudProviders: cloudProviders,
        preferredRegions: regions,
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
      setGlobalErrorMessage(message);
      showError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-107 gap-14 items-center flex flex-col">
      <div className="flex gap-3">
        <img src="/greenwin-logo.svg" alt="logo" />
        <p className="heading5 font-primary text-primary-900">Green Win</p>
      </div>
      <div className="py-7 px-6 gap-9 rounded-lg shadow-custom bg-base-100 flex flex-col items-center">
        <p className="heading5 font-primary text-base-900">
          {step === 1 ? "Sign Up" : "Organization info"}
        </p>

        {step === 1 && (
          <div className="w-full gap-4 flex flex-col">
            <TextField
              label="Name"
              placeholder="Enter your name"
              value={name}
              onChange={setName}
              type="text"
              errorMessage={errorMessageName}
              onFocusClearError={() => setErrorMessageName("")}
              onBlurValidate={() => name.length > 0}
              leftIcon="/Person.svg"
            />
            <TextField
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={setEmail}
              type="email"
              errorMessage={errorMessageEmail}
              onFocusClearError={() => setErrorMessageEmail("")}
              onBlurValidate={isValidEmail}
              leftIcon="/email-icon.svg"
            />
            <TextField
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChange={setPassword}
              type="password"
              errorMessage={errorMessagePassword}
              onFocusClearError={() => setErrorMessagePassword("")}
              onBlurValidate={isValidPassword}
              leftIcon="/password-icon.svg"
            />
            <Button
              text="Continue"
              onClick={handleNext}
              disabled={!canProceed}
              variant={ButtonVariant.Primary}
            />
          </div>
        )}
        {step === 2 && (
          <form onSubmit={handleSignup}>
            <div className="w-full gap-4 flex flex-col">
              <div className="flex flex-col items-center">
                <TextField
                  label="Organization name*"
                  placeholder="Enter organization name*"
                  value={orgName}
                  onChange={setOrgName}
                  type="text"
                  errorMessage={errorMessageOrgName}
                  onFocusClearError={() => setErrorMessageOrgName("")}
                  onBlurValidate={() => orgName.length > 0}
                />
                <div className="flex gap-3 w-full">
                  <div className="flex flex-col flex-1">
                    <TextField
                      label="Description"
                      placeholder="Enter what your company does"
                      value={description}
                      onChange={setDescription}
                      type="text"
                    />
                    <TextField
                      label="Contact person email*"
                      placeholder="Enter email of contact person*"
                      value={contactPerson}
                      onChange={setContactPerson}
                      type="email"
                      errorMessage={errorMessageContactPerson}
                      onFocusClearError={() => setErrorMessageContactPerson("")}
                      onBlurValidate={isValidContactPerson}
                    />
                    <TextField
                      label="Phone"
                      placeholder="Enter phone number"
                      value={phone}
                      onChange={setPhone}
                      type="text"
                    />
                    <TextField
                      label="Address"
                      placeholder="Enter organization address"
                      value={address}
                      onChange={setAddress}
                      type="text"
                    />
                  </div>
                  <div className="flex flex-col flex-1">
                    <TextField
                      label="Monthly CO₂ target (kg)"
                      placeholder="Enter monthly CO₂ target (kg)"
                      value={monthlyTarget}
                      onChange={setMonthlyTarget}
                      type="number"
                    />
                    <TextField
                      label="Annual CO₂ target (kg)"
                      placeholder="Enter annual CO₂ target (kg)"
                      value={annualTarget}
                      onChange={setAnnualTarget}
                      type="number"
                    />
                    <TextField
                      label="Cloud providers"
                      placeholder="Enter preferred cloud providers, separated by commas"
                      value={cloudProviders}
                      onChange={setCloudProviders}
                      type="text"
                    />
                    <TextField
                      label="Regions"
                      placeholder="Enter preferred regions, separated by commas"
                      value={regions}
                      onChange={setRegions}
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-2 w-full">
                <Button
                  text="Back"
                  onClick={handleBack}
                  variant={ButtonVariant.Secondary}
                />
                <Button
                  text="Sign Up"
                  type="submit"
                  variant={ButtonVariant.Primary}
                  disabled={
                    isSubmitting || orgName.length <= 0 || !validContactPerson
                  }
                  isLoading={isSubmitting}
                />
              </div>
            </div>
          </form>
        )}
        <div className="flex gap-2">
          <p className="paragraph1-light font-secondary text-base-900">
            Already have an account?
          </p>
          <Link
            className="paragraph1-underlined font-secondary text-primary-800 hover:text-primary-900 cursor-pointer transition-colors duration-300 ease-out"
            href="/login"
          >
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
