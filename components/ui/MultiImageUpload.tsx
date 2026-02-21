"use client";

import { useState, useRef } from "react";
import { Plus, X, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface MultiImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
  max?: number;
}

export default function MultiImageUpload({
  value,
  onChange,
  label,
  max = 10,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList) {
    setError("");
    const remaining = max - value.length;
    const toUpload = Array.from(files).slice(0, remaining);
    if (toUpload.length === 0) {
      setError(`מותר עד ${max} תמונות`);
      return;
    }

    setUploading(true);
    const newUrls: string[] = [];

    for (const file of toUpload) {
      if (!file.type.startsWith("image/")) continue;
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: formData });
        const data = await res.json();
        if (res.ok) {
          newUrls.push(data.url);
        } else {
          setError(data.error || "שגיאה בהעלאה");
        }
      } catch {
        setError("שגיאה בהעלאת קובץ");
      }
    }

    if (newUrls.length > 0) {
      onChange([...value, ...newUrls]);
    }
    setUploading(false);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) handleFiles(e.target.files);
    e.target.value = "";
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
  }

  function removeImage(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  return (
    <div>
      {label && (
        <span className="block text-sm font-medium text-stone-700 mb-1">
          {label}
        </span>
      )}

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {value.map((url, i) => (
          <div
            key={`${url}-${i}`}
            className="relative group aspect-square rounded-lg overflow-hidden border border-stone-200 bg-stone-50"
          >
            <img src={url} alt={`תמונה ${i + 1}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(i)}
              className="absolute top-1 left-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {value.length < max && (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={cn(
              "aspect-square rounded-lg border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors",
              "border-stone-300 bg-stone-50 hover:border-primary-300 hover:bg-primary-50/50",
              uploading && "pointer-events-none opacity-60"
            )}
          >
            {uploading ? (
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
            ) : (
              <>
                <Plus className="w-6 h-6 text-stone-400" />
                <span className="text-xs text-stone-400 mt-1">הוסף</span>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
      <p className="mt-1 text-xs text-stone-400">
        {value.length}/{max} תמונות
      </p>
    </div>
  );
}
