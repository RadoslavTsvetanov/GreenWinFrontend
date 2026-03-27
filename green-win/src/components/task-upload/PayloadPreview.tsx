"use client";

type PayloadPreviewProps = {
  payloadPreview: string;
};

export function PayloadPreview({ payloadPreview }: PayloadPreviewProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <h2 className="text-lg font-semibold text-slate-900">Payload preview</h2>
      <p className="mt-2 text-sm text-slate-600">
        JSON sent to backend for `POST /api/tasks`.
      </p>

      <pre className="mt-4 max-h-[70vh] overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
        {payloadPreview || "Submit form to preview task JSON payload."}
      </pre>
    </section>
  );
}
