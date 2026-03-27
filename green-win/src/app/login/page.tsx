"use client";

import TextField from "@/components/text-field/TextField";
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
      </div>
    </div>
  );
};

export default LoginPage;
