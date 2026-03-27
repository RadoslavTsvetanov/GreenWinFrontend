"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent } from "react";
import { TaskFormState } from "@/lib/task/types";
import { TaskFormChangeHandler } from "./types";
import { Button, Input } from "@/components/ui/primitives";

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
    const zipFile =
      incomingFiles.find((file) => file.name.toLowerCase().endsWith(".zip")) ?? null;
    if (!zipFile) {
      return;
    }
    onChange("lambdaFiles", [zipFile]);
  };

  const removeFile = () => {
    onChange("lambdaFiles", []);
  };

  const clearFiles = () => {
    onChange("lambdaFiles", []);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const totalSizeMB = (form.lambdaFiles.reduce((acc, file) => acc + file.size, 0) / 1024 / 1024).toFixed(2);

  const onDropZoneClick = (event: MouseEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("button")) return;
    openFilePicker();
  };

  const onDropZoneKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  return (
    <>
      <div>
        <p className="block text-sm font-medium text-slate-800">Runtime type *</p>
        <div className="mt-2 flex gap-3">
          <Button
            type="button"
            onClick={() => onChange("runtimeType", "lambda_code")}
            variant="secondary"
            className={`${
              form.runtimeType === "lambda_code"
                ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                : ""
            }`}
          >
            Lambda code
          </Button>
          <Button
            type="button"
            disabled
            variant="secondary"
            className={`${
              form.runtimeType === "docker_image"
                ? "border-emerald-400 bg-emerald-100 text-emerald-900"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            Docker image (coming soon)
          </Button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Current backend task creation expects Lambda zip uploads.
        </p>
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
            accept=".zip,application/zip,application/x-zip-compressed"
            onChange={(event) => addFiles(Array.from(event.target.files ?? []))}
            className="hidden"
          />

          <div
            tabIndex={0}
            aria-label="Choose Lambda zip file or drag and drop here"
            className={`mt-2 cursor-pointer rounded-2xl border-2 border-dashed px-5 py-8 transition outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 ${
              isDragging
                ? "border-emerald-400 bg-emerald-50/90"
                : "border-slate-300/90 bg-gradient-to-b from-slate-50/90 to-white hover:border-slate-400 hover:bg-slate-50/70"
            }`}
            onClick={onDropZoneClick}
            onKeyDown={onDropZoneKeyDown}
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
            <div className="mx-auto max-w-md text-center">
              <p className="text-sm font-semibold text-slate-800">
                Drag and drop your Lambda zip here
              </p>
              <p className="mt-1.5 text-xs text-slate-600">
                Or click anywhere in this area to choose a file from your computer.
              </p>
              <p className="mt-2 text-[11px] text-slate-500">
                One .zip file per task (multipart field matches API upload).
              </p>
            </div>

            {form.lambdaFiles.length > 0 && (
              <div className="mt-6 space-y-3 border-t border-slate-200/80 pt-5">
                <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-emerald-700">
                  <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 font-medium">
                    Zip ready
                  </span>
                  <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2.5 py-1 font-medium text-cyan-800">
                    {totalSizeMB} MB total
                  </span>
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      clearFiles();
                    }}
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                  >
                    Clear
                  </button>
                </div>
                <ul className="mx-auto max-w-lg space-y-2">
                  {form.lambdaFiles.map((file) => (
                    <li
                      key={`${file.name}-${file.size}-${file.lastModified}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/90 px-3 py-2.5 shadow-sm"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="min-w-0 text-left">
                        <p className="truncate text-sm font-medium text-slate-800">{file.name}</p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <Button
                        type="button"
                        onClick={() => removeFile()}
                        size="sm"
                        variant="ghost"
                        className="shrink-0 text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
                <p className="text-center text-[11px] text-slate-500">
                  Click the dashed area above to replace the file.
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div key="docker-runtime">
          <label htmlFor="dockerImage" className="block text-sm font-medium text-slate-800">
            Docker image URL *
          </label>
          <Input
            id="dockerImage"
            type="text"
            value={form.dockerImage ?? ""}
            onChange={(value) => onChange("dockerImage", value)}
            className="mt-2 bg-slate-50"
            placeholder="ghcr.io/org/image:latest"
          />
        </div>
      )}
    </>
  );
}
