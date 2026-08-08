"use client";

import { useCallback, useRef, useState } from "react";
import { Camera, ImagePlus, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { normalizeUpload, validateImageFile } from "@/utils/heic";

interface UploadZoneProps {
  onReady: (file: File, previewUrl: string) => void;
  disabled?: boolean;
}

async function decodeObjectUrl(url: string): Promise<void> {
  const img = new Image();
  img.src = url;
  try {
    if (typeof img.decode === "function") {
      await img.decode();
    } else {
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
      });
    }
  } catch {
    /* still usable */
  }
}

export function UploadZone({ onReady, disabled }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = useCallback(
    async (file: File | undefined | null) => {
      if (!file || disabled) return;
      setError(null);
      const validation = validateImageFile(file);
      if (validation) {
        setError(validation);
        return;
      }
      setLoading(true);
      try {
        const normalized = await normalizeUpload(file);
        const url = URL.createObjectURL(normalized);
        await decodeObjectUrl(url);
        onReady(normalized, url);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not process image.");
      } finally {
        setLoading(false);
      }
    },
    [disabled, onReady]
  );

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a photo"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          void handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => !loading && inputRef.current?.click()}
        className={cn(
          "relative flex min-h-[220px] cursor-pointer flex-col items-center justify-center gap-3 rounded-[4px] border-2 border-dashed border-black/30 bg-white/40 px-6 py-10 text-center backdrop-blur-[12px] transition-[border-color,background-color,box-shadow,transform] duration-150",
          "hover:scale-[1.01]",
          dragging && "border-[#fee101] bg-[#fee101]/20 shadow-[0_0_18px_4px_#fee1014d]",
          loading && "pointer-events-none opacity-70"
        )}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-black bg-[#fee101] shadow-[3px_3px_#000]">
          {loading ? (
            <Upload className="animate-pulse" aria-hidden />
          ) : (
            <ImagePlus aria-hidden />
          )}
        </div>
        <div>
          <p className="font-mono text-sm font-semibold text-black">
            {loading ? "Processing…" : "Drag & drop your photo"}
          </p>
          <p className="mt-1 font-mono text-xs text-black/55">
            JPG, PNG, WEBP, HEIC · max 20 MB
          </p>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          <span className="rounded-[4px] border-2 border-black bg-[#fee101] px-4 py-2 font-mono text-xs font-semibold shadow-[2px_2px_#000]">
            Browse Files
          </span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-[4px] border-2 border-black bg-white px-4 py-2 font-mono text-xs font-semibold shadow-[2px_2px_#fee101] sm:hidden"
            onClick={(e) => {
              e.stopPropagation();
              cameraRef.current?.click();
            }}
            aria-label="Take a photo with camera"
          >
            <Camera className="h-3.5 w-3.5" />
            Camera
          </button>
        </div>
      </div>

      {error ? (
        <p role="alert" className="mt-3 font-mono text-sm text-[#e40014]">
          {error}
        </p>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic,image/heif,.heic,.heif"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="user"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />
    </div>
  );
}
