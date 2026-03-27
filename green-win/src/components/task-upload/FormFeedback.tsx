import { Button, InlineAlert } from "@/components/ui/primitives";

type FormFeedbackProps = {
  isSubmitting: boolean;
  canSubmit: boolean;
  errorMessage: string;
  successMessage: string;
};

export function FormFeedback({
  isSubmitting,
  canSubmit,
  errorMessage,
  successMessage,
}: FormFeedbackProps) {
  return (
    <>
      <Button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        variant="primary"
        className="w-full bg-gradient-to-r from-emerald-600 to-cyan-600 py-3 text-white hover:from-emerald-700 hover:to-cyan-700"
      >
        {isSubmitting ? "Uploading..." : "Upload task"}
      </Button>

      {errorMessage && (
        <InlineAlert tone="error">{errorMessage}</InlineAlert>
      )}
      {successMessage && (
        <InlineAlert tone="success">{successMessage}</InlineAlert>
      )}
    </>
  );
}
