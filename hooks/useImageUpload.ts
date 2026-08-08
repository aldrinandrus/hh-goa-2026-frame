"use client";

import { useCallback, useState } from "react";
import { normalizeUpload } from "@/utils/heic";

/** Shared upload + HEIC normalize hook. */
export function useImageUpload() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const clear = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    setFile(null);
    setError(null);
  }, []);

  const upload = useCallback(async (incoming: File) => {
    setLoading(true);
    setError(null);
    try {
      const normalized = await normalizeUpload(incoming);
      const url = URL.createObjectURL(normalized);
      setPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return url;
      });
      setFile(normalized);
      return { file: normalized, previewUrl: url };
    } catch (e) {
      const message = e instanceof Error ? e.message : "Upload failed";
      setError(message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, []);

  return { previewUrl, file, error, loading, upload, clear };
}
