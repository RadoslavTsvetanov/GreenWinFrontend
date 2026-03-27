export enum ButtonVariant {
  Primary = "primary",
  Secondary = "secondary",
}

export type ButtonProps = {
  text: string;
  onClick: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  isLoading?: boolean;
  className?: string;
};
