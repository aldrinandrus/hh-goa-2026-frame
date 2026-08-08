"use client";

import { memo } from "react";
import { ProfileFrame } from "@/components/templates/ProfileFrame";
import { BuilderIdCard } from "@/components/templates/BuilderIdCard";
import type { FormatMode } from "@/types";
import { cn } from "@/lib/utils";

interface LivePreviewProps {
  mode: FormatMode;
  croppedUrl: string | null;
  name: string;
  role: string;
  twitter: string;
  builderTitle: string;
  builderId: string;
  qrUrl: string;
}

/**
 * Keeps Frame + Passport mounted once a photo exists.
 * Mode switch = opacity only — no remount, no AnimatePresence flash.
 */
export const LivePreview = memo(function LivePreview({
  mode,
  croppedUrl,
  name,
  role,
  twitter,
  builderTitle,
  builderId,
  qrUrl,
}: LivePreviewProps) {
  return (
    <aside className="flex w-full flex-col items-center lg:sticky lg:top-6">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-black/40">
        Live preview
      </p>
      <div
        className="relative flex w-full min-h-[320px] items-start justify-center px-2 sm:min-h-[420px]"
      >
        {!croppedUrl ? (
          <div className="flex h-72 w-full max-w-xs items-center justify-center rounded-[4px] border-2 border-dashed border-black/20 bg-white/40 font-mono text-sm text-black/40">
            Upload to preview
          </div>
        ) : (
          <>
            <div
              className={cn(
                "transition-opacity duration-200 ease-out",
                mode === "frame"
                  ? "relative z-10 opacity-100"
                  : "pointer-events-none absolute opacity-0"
              )}
              aria-hidden={mode !== "frame"}
            >
              <ProfileFrame photoUrl={croppedUrl} size={280} />
            </div>
            <div
              className={cn(
                "origin-top scale-[0.92] transition-opacity duration-200 ease-out sm:scale-100",
                mode === "card"
                  ? "relative z-10 opacity-100"
                  : "pointer-events-none absolute opacity-0"
              )}
              aria-hidden={mode !== "card"}
            >
              <BuilderIdCard
                photoUrl={croppedUrl}
                name={name}
                role={role}
                twitter={twitter}
                builderTitle={builderTitle}
                builderId={builderId}
                width={300}
                qrUrl={qrUrl}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
});
