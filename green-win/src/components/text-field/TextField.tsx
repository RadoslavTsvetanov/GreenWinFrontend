"use client";

import { TextFieldProps } from "@/lib/text-field/types";
import { useState } from "react";
import Icon from "../icon/Icon";

const TextField = ({
  label,
  placeholder,
  value,
  onChange,
  errorMessage,
  leftIcon,
  rightIcon,
  type = "text",
  readOnly = false,
  onBlurValidate,
  onFocusClearError,
}: TextFieldProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const isError = !!errorMessage;
  const isFilled = value.length > 0;

  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" ? (showPassword ? "text" : "password") : type;

  const getStateStyles = () => {
    if (isFocused) {
      return "bg-base-100 text-base-900 border border-transparent shadow-custom";
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

  const getIconColor = () => {
    if (isError) {
      return "text-functional-error";
    }
    if (isFilled) {
      return "text-base-900";
    }
    return "text-base-600";
  };

  return (
    <div className="gap-2 flex flex-col w-95">
      <div className="px-3 flex items-start">
        <label
          className={`caption1 font-secondary text-base-600 transition-opacity duration-150 ${isFocused || isFilled ? "opacity-100" : "opacity-0"}`}
        >
          {label}
        </label>
      </div>

      <div className={`base-input ${getStateStyles()}`}>
        {leftIcon && <Icon src={leftIcon} className={getIconColor()} />}
        <input
          type={inputType}
          value={value}
          readOnly={readOnly}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            setIsFocused(true);
            onFocusClearError?.();
          }}
          onBlur={() => {
            setIsFocused(false);
            onBlurValidate?.(value);
          }}
          className="flex-1 bg-transparent outline-none paragraph1-light placeholder:text-base-600 focus:outline-none focus:ring-0 focus:bg-transparent"
        />
        <div className="flex items-center justify-center cursor-pointer">
          {type === "password" ? (
            <div onClick={() => setShowPassword((prev) => !prev)}>
              <Icon
                src={showPassword ? "/eye-off.svg" : "/eye.svg"}
                className={getIconColor()}
              />
            </div>
          ) : (
            rightIcon && <Icon src={rightIcon} className={getIconColor()} />
          )}
        </div>
      </div>
      <div className="px-3 flex justify-end items-end">
        <p
          className={`caption1 font-secondary text-functional-error transition-opacity duration-150 ${errorMessage ? "opacity-100" : "opacity-0"}`}
        >
          {errorMessage || "Placeholder for error message height"}
        </p>
      </div>
    </div>
  );
};

export default TextField;
