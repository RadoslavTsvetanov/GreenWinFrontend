"use client";

import { useRef, useState } from "react";
import { TaskFormState } from "@/lib/task/types";
import { TaskFormChangeHandler } from "./types";

type RuntimeSectionProps = {
  form: TaskFormState;
  onChange: TaskFormChangeHandler;
};

export function RuntimeSection({ form, onChange }: RuntimeSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const addFiles = (incomingFiles: File[]) => {
    if (incomingFiles.length === 0) {
      return;
    }

    const existingKeys = new Set(
      form.lambdaFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`),
    );
    const uniqueIncoming = incomingFiles.filter(
      (file) => !existingKeys.has(`${file.name}-${file.size}-${file.lastModified}`),
    );

    onChange("lambdaFiles", [...form.lambdaFiles, ...uniqueIncoming]);
  };

  const removeFile = (targetIndex: number) => {
    onChange(
      "lambdaFiles",
      form.lambdaFiles.filter((_, index) => index !== targetIndex),
    );
  };

  const clearFiles = () => {
    onChange("lambdaFiles", []);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalSizeMB = (form.lambdaFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2);

  return (
    <>
      <div>
        <p className="block text-sm font-medium text-slate-800">Runtime type *</p>
        <div className="mt-2 flex gap-3">
          <button
            type="button"
            onClick={() => onChange("runtimeType", "lambda_code")}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              form.runtimeType === "lambda_code"
                ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Lambda code
          </button>
          <button
            type="button"
            onClick={() => onChange("runtimeType", "docker_image")}
            className={`rounded-xl border px-4 py-2 text-sm font-medium transition ${
              form.runtimeType === "docker_image"
                ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            Docker image
          </button>
        </div>
      </div>

      {form.runtimeType === "lambda_code" ? (
        <div key="lambda-runtime">
          <label htmlFor="lambdaFiles" className="block text-sm font-medium text-slate-800">
            Lambda files *
          </label>
          <input
            ref={fileInputRef}
            id="lambdaFiles"
            type="file"
            multiple
            onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
            className="hidden"
          />

          <div
            className={`mt-2 rounded-2xl border-2 border-dashed p-4 transition ${
              isDragging
                ? "border-emerald-400 bg-emerald-50"
                : "border-slate-300 bg-slate-50/80"
            }`}
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(event) => {
              event.preventDefault();
              setIsDragging(false);
              addFiles(Array.from(event.dataTransfer.files ?? []));
            }}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-slate-700">
                Drag and drop files here, or add from your computer.
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700"
                >
                  Add files
                </button>
                {form.lambdaFiles.length > 0 && (
                  <button
                    type="button"
                    onClick={clearFiles}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                  >
                    Clear all
                  </button>
                )}
              </div>
            </div>

            {form.lambdaFiles.length === 0 ? (
              <p className="mt-3 text-xs text-slate-500">
                No files selected yet. Add `index.js`, `package.json`, and all helper files.
              </p>
            ) : (
              <>
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-700">
                  <span className="rounded-full bg-emerald-100 px-2 py-1 font-medium">
                    {form.lambdaFiles.length} files ready
                  </span>
                  <span className="rounded-full bg-cyan-100 px-2 py-1 font-medium text-cyan-800">
                    {totalSizeMB} MB total
                  </span>
                </div>
                <ul className="mt-3 space-y-2">
                  {form.lambdaFiles.map((file, index) => (
                    <li
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </div>
      ) : (
        <div key="docker-runtime">
          <label htmlFor="dockerImage" className="block text-sm font-medium text-slate-800">
            Docker image URL *
          </label>
          <input
            id="dockerImage"
            type="text"
            value={form.dockerImage ?? ""}
            onChange={(event) => onChange("dockerImage", event.target.value)}
            className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100"
            placeholder="ghcr.io/org/image:latest"
          />
        </div>
      )}
    </>
  );
}
