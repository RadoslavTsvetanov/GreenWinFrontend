export type TextFieldProps = {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;

  errorMessage?: string;

  leftIcon?: string;
  rightIcon?: string;

  type?: React.HTMLInputTypeAttribute;

  readOnly?: boolean;

  onFocusClearError?: () => void;
  onBlurValidate?: (value: string) => void;
};
