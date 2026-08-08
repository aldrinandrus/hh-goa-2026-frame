"use client";

import { useEffect, useState } from "react";
import { generateBuilderId } from "@/lib/builder-id";
import { randomBuilderTitle } from "@/lib/builder-titles";

/**
 * Hydration-safe origin for absolute share/QR URLs.
 * Prefers NEXT_PUBLIC_APP_URL; falls back to window only after mount.
 */
export function useClientOrigin(): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ?? "";
  const [origin, setOrigin] = useState(env);

  useEffect(() => {
    if (!env && typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, [env]);

  return origin;
}

/** IDs/titles created client-side after mount — no SSR random mismatch. */
export function useBuilderSession() {
  const [builderId, setBuilderId] = useState<string | null>(null);
  const [builderTitle, setBuilderTitle] = useState("AI Whisperer");

  useEffect(() => {
    setBuilderId(generateBuilderId());
    setBuilderTitle(randomBuilderTitle());
  }, []);

  return {
    builderId,
    setBuilderId,
    builderTitle,
    setBuilderTitle,
    displayId: builderId ?? "HHG26-······",
    rerollTitle: () => setBuilderTitle(randomBuilderTitle()),
    newSessionId: () => setBuilderId(generateBuilderId()),
  };
}
