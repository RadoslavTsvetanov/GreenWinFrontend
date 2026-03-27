"use client";

import { ButtonProps, ButtonVariant } from "@/lib/button/types";

const Button = ({
  text,
  onClick,
  variant = ButtonVariant.Primary,
  disabled = false,
  isLoading = false,
  type = "button",
  className = "",
}: ButtonProps) => {
  const getVariantStyles = () => {
    return disabled || isLoading
      ? "cursor-not-allowed bg-base-200 text-base-600"
      : variant === ButtonVariant.Primary
        ? "bg-primary-800 text-base-100 hover:bg-primary-900 cursor-pointer"
        : "bg-secondary-800 text-base-100 hover:bg-secondary-900 cursor-pointer";
  };

  return (
    <button
      className={`${className} ${getVariantStyles()} base-button`}
      onClick={onClick}
      disabled={disabled}
      type={type}
    >
      {isLoading ? "Loading..." : text}
    </button>
  );
};

export default Button;
