export enum TextFieldState {
  DEFAULT = "default",
  ERROR = "error",
}

export type TextFieldProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;

  state?: TextFieldState;
  errorMessage?: string;

  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  type?: React.HTMLInputTypeAttribute;
  name?: string;

  readOnly?: boolean;
};
