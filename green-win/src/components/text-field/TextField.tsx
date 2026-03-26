"use client";

import { TextFieldProps, TextFieldState } from "@/lib/text-field/types";
import { useState } from "react";

const TextField = ({
  label,
  placeholder,
  value,
  onChange,
  state = TextFieldState.DEFAULT,
  errorMessage,
  leftIcon,
  rightIcon,
  type = "text",
  name,
  readOnly = false,
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const isError = state === TextFieldState.ERROR;
  const isFilled = value.length > 0;

  const getStateStyles = () => {
    if (isFocused && isError) {
      return "bg-base-100 text-base-900 shadow-custom border border-transparent";
    }

    if (isFocused) {
      return "bg-base-100 text-base-900 border border-transparent";
    }

    if (isFilled && isError) {
      return "bg-base-100 border border-functional-error text-base-800";
    }

    if (isFilled) {
      return "bg-base-100 border border-base-800 text-base-800";
    }

    if (isError) {
      return "bg-functional-error-light text-base-700 border border-transparent";
    }

    return "bg-base-200 text-base-600 border border-transparent";
  };

  return (
    <div className="gap-2 w-full flex flex-col">
      <div className="px-3 flex items-start">
        <label
          className={`caption1 font-secondary text-base-600 transition-opacity duration-150 ${isFocused || isFilled ? "opacity-100" : "opacity-0"}`}
        >
          {label}
        </label>
      </div>

      <div className={`base-input ${getStateStyles()}`}>
        {leftIcon && (
          <div className="flex justify-center items-center">{leftIcon}</div>
        )}
        <input
          type={type}
          name={name}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="flex-1 bg-transparent outline-none paragraph1-light placeholder:text-base-600 focus:outline-none focus:ring-0 focus:bg-transparent"
        />
        {rightIcon && (
          <div className="flex justify-center items-center">{rightIcon}</div>
        )}
      </div>
      <div className="px-3 flex justify-end items-end">
        <p
          className={`caption1 font-secondary text-functional-error transition-opacity duration-150 ${errorMessage ? "opacity-100" : "opacity-0"}`}
        >
          {errorMessage}
        </p>
      </div>
    </div>
  );
};

export default TextField;
