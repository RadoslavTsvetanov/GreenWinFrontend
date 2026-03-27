"use client";

import Button from "@/components/button/Button";
import TextField from "@/components/text-field/TextField";
import { ButtonVariant } from "@/lib/button/types";
import Link from "next/link";
import { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [errorMessageEmail, setErrorMessageEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [password, setPassword] = useState("");
  const [errorMessagePassword, setErrorMessagePassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

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

  const isValidPassword = (password: string) => {
    if (
      password.length >= 8 &&
      /[a-z]/.test(password) &&
      /[A-Z]/.test(password) &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password)
    ) {
      setValidPassword(true);
      setErrorMessagePassword("");
    } else {
      setValidPassword(false);
      setErrorMessagePassword(
        "Min 8 characters, uppercase, lowercase, number & special symbol",
      );
    }
  };

  return (
    <div className="max-w-107 gap-14 items-center flex flex-col">
      <div className="flex gap-3">
        <img src="/greenwin-logo.svg" alt="logo" />
        <p className="heading5 font-primary text-primary-900">Green Win</p>
      </div>
      <div className="py-7 px-6 gap-9 rounded-lg shadow-custom bg-base-100 flex flex-col items-center">
        <p className="heading5 font-primary text-base-900">Login</p>
        <div className="w-full gap-4">
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
        </div>
        <div className="flex flex-col gap-4 w-full items-center justify-center">
          <Button
            text="Login"
            variant={ButtonVariant.Primary}
            onClick={() => {}}
            disabled={!validEmail || !validPassword}
            isLoading={false}
            className="shadow-custom"
          />
          <div className="flex gap-2">
            <p className="paragraph1-light font-secondary text-base-900">
              Don't have an account?
            </p>
            <Link
              className="paragraph1-underlined font-secondary text-primary-800 hover:text-primary-900 cursor-pointer transition-colors duration-300 ease-out"
              href="/signup"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
