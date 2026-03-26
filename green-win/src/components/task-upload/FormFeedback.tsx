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
      <button
        type="submit"
        disabled={!canSubmit || isSubmitting}
        className="w-full rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-100 transition hover:from-emerald-700 hover:to-cyan-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Uploading..." : "Upload task"}
      </button>

      {errorMessage && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          {successMessage}
        </p>
      )}
    </>
  );
}
