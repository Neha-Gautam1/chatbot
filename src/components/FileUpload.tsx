"use client"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"
import { IconUpload } from "@tabler/icons-react"
import { useDropzone } from "react-dropzone"
import React, { useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

interface FileUploadProps {
  onFiles: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
}

export default function FileUpload({
  onFiles,
  accept = "image/*,application/pdf",
  multiple = true,
  disabled = false,
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const validFiles = Array.from(files).filter(
      (f) => f.type.startsWith("image/") || f.type === "application/pdf"
    );
    if (validFiles.length) onFiles(validFiles);
  };

  return (
    <div
      className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl transition-colors cursor-pointer min-h-[220px] px-6 py-8
        ${dragActive ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-white dark:bg-slate-900"}
        ${disabled ? "opacity-60 pointer-events-none" : ""}
      `}
      onClick={() => !disabled && inputRef.current?.click()}
      onDragOver={e => {
        e.preventDefault();
        setDragActive(true);
      }}
      onDragLeave={e => {
        e.preventDefault();
        setDragActive(false);
      }}
      onDrop={e => {
        e.preventDefault();
        setDragActive(false);
        handleFiles(e.dataTransfer.files);
      }}
      tabIndex={0}
      role="button"
      aria-disabled={disabled}
    >
      <UploadCloud className="w-10 h-10 text-blue-500 mb-2" />
      <div className="text-lg font-semibold text-gray-700 mb-1">Drag & drop files here</div>
      <div className="text-sm text-gray-500 mb-2">or <span className="underline text-blue-600">click to browse</span> (PDF, JPG, PNG)</div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={e => handleFiles(e.target.files)}
        disabled={disabled}
      />
    </div>
  );
}

export function GridPattern() {
  const columns = 41
  const rows = 11
  return (
    <div className="flex bg-gray-100 dark:bg-neutral-900 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px  scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0
                  ? "bg-gray-50 dark:bg-neutral-950"
                  : "bg-gray-50 dark:bg-neutral-950 shadow-[0px_0px_1px_3px_rgba(255,255,255,1)_inset] dark:shadow-[0px_0px_1px_3px_rgba(0,0,0,1)_inset]"
              }`}
            />
          )
        })
      )}
    </div>
  )
}

