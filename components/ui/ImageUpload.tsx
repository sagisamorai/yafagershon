"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, Image as ImageIcon, Link as LinkIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label,
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upload = useCallback(
    async (file: File) => {
      setError("");
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "שגיאה בהעלאה");
          return;
        }
        onChange(data.url);
      } catch {
        setError("שגיאה בהעלאת הקובץ");
      } finally {
        setUploading(false);
      }
    },
    [onChange]
  );

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) upload(file);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      upload(file);
    } else {
      setError("יש לגרור קובץ תמונה בלבד");
    }
  }

  function handleUrlSubmit() {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUrlInput("");
      setShowUrlInput(false);
    }
  }

  function handleRemove() {
    onChange("");
    setError("");
  }

  if (value) {
    return (
      <div className={cn("w-full", className)}>
        {label && (
          <span className="block text-sm font-medium text-stone-700 mb-1">
            {label}
          </span>
        )}
        <div className="relative group rounded-xl overflow-hidden border border-stone-200 bg-stone-50">
          <img
            src={value}
            alt="תצוגה מקדימה"
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 bg-white rounded-full text-stone-700 hover:bg-stone-100"
              title="החלף תמונה"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
              title="הסר תמונה"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            {value.startsWith("/uploads/") ? "קובץ מקומי" : "קישור חיצוני"}
          </div>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    );
  }

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <span className="block text-sm font-medium text-stone-700 mb-1">
          {label}
        </span>
      )}

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all",
          dragOver
            ? "border-primary-400 bg-primary-50"
            : "border-stone-300 bg-stone-50 hover:border-primary-300 hover:bg-primary-50/50",
          uploading && "pointer-events-none opacity-60"
        )}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2 text-stone-500">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
            <span className="text-sm">מעלה תמונה...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-stone-500">
            <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-700">
                גררו תמונה לכאן או לחצו לבחירה
              </p>
              <p className="text-xs text-stone-400 mt-1">
                JPG, PNG, WebP, GIF - עד 5MB
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="mt-2 flex items-center gap-2">
        {showUrlInput ? (
          <div className="flex gap-2 flex-1">
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleUrlSubmit())}
              placeholder="https://example.com/image.jpg"
              className="flex-1 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-sm focus:border-primary-500 focus:outline-none"
              dir="ltr"
            />
            <button
              type="button"
              onClick={handleUrlSubmit}
              className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-xs hover:bg-primary-700"
            >
              הוסף
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="px-2 py-1.5 text-stone-500 hover:bg-stone-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="flex items-center gap-1 text-xs text-stone-500 hover:text-primary-600"
          >
            <LinkIcon className="w-3 h-3" />
            או הזן קישור לתמונה
          </button>
        )}
      </div>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
