"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Download,
  ExternalLink,
  Loader2,
  RefreshCw,
  Share2,
} from "lucide-react";
import type { Area } from "react-easy-crop";
import { Navbar } from "@/components/shared/Navbar";
import { FloatingBackground } from "@/components/landing/FloatingBackground";
import { UploadZone } from "@/components/create/UploadZone";
import { CropEditor } from "@/components/create/CropEditor";
import { BuilderForm } from "@/components/create/BuilderForm";
import { LivePreview } from "@/components/create/LivePreview";
import { ProfileFrame } from "@/components/templates/ProfileFrame";
import { BuilderIdCard } from "@/components/templates/BuilderIdCard";
import { Button } from "@/components/ui/button";
import { getCroppedImageDataUrl } from "@/lib/face-crop";
import {
  buildShareTweet,
  downloadDataUrl,
  exportNodeToPng,
  sharePassportToX,
} from "@/utils/download";
import { persistCard } from "@/utils/persist-card";
import { builderPublicPath } from "@/lib/site";
import {
  useBuilderSession,
  useClientOrigin,
} from "@/hooks/useBuilderSession";
import type { FormatMode } from "@/types";
import {
  CARD_EXPORT_WIDTH,
  FRAME_EXPORT_SIZE,
} from "@/lib/design-tokens";
import { cn } from "@/lib/utils";

type Step = 1 | 2 | 3 | "result";

const STEPS_META = [
  { id: 1 as const, label: "Your Photo" },
  { id: 2 as const, label: "Your Identity" },
  { id: 3 as const, label: "Your Asset" },
];

export function CreateStudio() {
  const [step, setStep] = useState<Step>(1);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);
  const [cropPixels, setCropPixels] = useState<Area | null>(null);
  const [mode, setMode] = useState<FormatMode>("card");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [twitter, setTwitter] = useState("");
  const [exporting, setExporting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const {
    builderId,
    builderTitle,
    setBuilderTitle,
    displayId,
    rerollTitle,
    newSessionId,
  } = useBuilderSession();
  const origin = useClientOrigin();

  const exportFrameRef = useRef<HTMLDivElement>(null);
  const exportCardRef = useRef<HTMLDivElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const cropGenRef = useRef(0);
  const exportCacheRef = useRef<{ key: string; dataUrl: string } | null>(null);
  const exportInflightRef = useRef<{
    key: string;
    promise: Promise<string>;
  } | null>(null);
  const exportPrefetchGen = useRef(0);

  const publicPath = builderPublicPath(displayId);
  const publicUrl = useMemo(() => {
    if (!origin || !builderId) return publicPath;
    return `${origin}${publicPath}`;
  }, [origin, publicPath, builderId]);

  const qrUrl = publicUrl.startsWith("http")
    ? publicUrl
    : `https://hhgoa.com${publicPath}`;

  // Crop → preview image: keep previous croppedUrl until next is ready (no blank flash)
  useEffect(() => {
    if (!previewUrl || !cropPixels) return;
    const gen = ++cropGenRef.current;
    const t = window.setTimeout(() => {
      void (async () => {
        try {
          const url = await getCroppedImageDataUrl(previewUrl, cropPixels, 1024);
          if (gen !== cropGenRef.current) return;
          setCroppedUrl(url);
        } catch {
          /* keep previous */
        }
      })();
    }, 100);
    return () => window.clearTimeout(t);
  }, [previewUrl, cropPixels]);

  const onUpload = useCallback((file: File, url: string) => {
    void file;
    const prev = previewUrlRef.current;
    previewUrlRef.current = url;
    setPreviewUrl(url);
    // Do NOT clear croppedUrl — swap when new crop lands
    setCropPixels(null);
    setStatus(null);
    setResultUrl(null);
    setStep(1);
    // Revoke previous object URL after swap paints
    if (prev && prev !== url) {
      requestAnimationFrame(() => {
        try {
          URL.revokeObjectURL(prev);
        } catch {
          /* ignore */
        }
      });
    }
  }, []);

  const onCropReady = useCallback((area: Area) => {
    setCropPixels(area);
  }, []);

  const onFormChange = useCallback(
    (field: "name" | "role" | "twitter" | "builderTitle", value: string) => {
      if (field === "name") setName(value);
      if (field === "role") setRole(value);
      if (field === "twitter") setTwitter(value);
      if (field === "builderTitle") setBuilderTitle(value);
    },
    [setBuilderTitle]
  );

  const canGoIdentity = Boolean(croppedUrl);
  const canGoAsset = Boolean(name.trim() && role.trim());

  const exportCacheKey = useCallback(() => {
    return [
      mode,
      builderId,
      croppedUrl,
      name,
      role,
      twitter,
      builderTitle,
    ].join("|");
  }, [mode, builderId, croppedUrl, name, role, twitter, builderTitle]);

  const captureExport = useCallback(async () => {
    const key = exportCacheKey();
    const cached = exportCacheRef.current;
    if (cached?.key === key) return cached.dataUrl;

    const inflight = exportInflightRef.current;
    if (inflight?.key === key) return inflight.promise;

    const node =
      mode === "frame" ? exportFrameRef.current : exportCardRef.current;
    if (!node) throw new Error("Preview not ready");

    const promise = (async () => {
      await new Promise<void>((r) =>
        requestAnimationFrame(() => requestAnimationFrame(() => r()))
      );
      const dataUrl = await exportNodeToPng(node, {
        pixelRatio: 2,
        cacheBust: false,
      });
      exportCacheRef.current = { key, dataUrl };
      return dataUrl;
    })();

    exportInflightRef.current = { key, promise };
    try {
      return await promise;
    } finally {
      if (exportInflightRef.current?.promise === promise) {
        exportInflightRef.current = null;
      }
    }
  }, [exportCacheKey, mode]);

  // Prefetch PNG while user is on the asset step so Download/Share feel instant
  useEffect(() => {
    if (step !== 3 || !croppedUrl || !builderId) return;
    if (mode === "card" && (!name.trim() || !role.trim())) return;

    const key = exportCacheKey();
    if (exportCacheRef.current?.key === key) return;

    const gen = ++exportPrefetchGen.current;
    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const dataUrl = await captureExport();
          if (gen !== exportPrefetchGen.current) return;
          exportCacheRef.current = { key, dataUrl };
        } catch {
          /* prefetch is best-effort */
        }
      })();
    }, 250);

    return () => {
      window.clearTimeout(timer);
      exportPrefetchGen.current += 1;
    };
  }, [
    step,
    croppedUrl,
    builderId,
    mode,
    name,
    role,
    twitter,
    builderTitle,
    exportCacheKey,
    captureExport,
  ]);

  const runExport = async (shareAfter: boolean) => {
    if (!croppedUrl || !builderId) {
      setStatus("Upload a photo first, then try again.");
      return;
    }
    if (mode === "card" && (!name.trim() || !role.trim())) {
      setStatus("Add your name and role for the Builder Passport.");
      setStep(2);
      return;
    }

    // Open tab early so X isn't blocked after async export/persist
    let shareTab: Window | null = null;
    if (shareAfter) {
      shareTab = window.open("about:blank", "_blank");
    }

    setExporting(true);
    setStatus(
      shareAfter ? "Preparing your passport for X…" : "Building your HH Goa pass…"
    );

    try {
      const dataUrl = await captureExport();

      const filename =
        mode === "frame"
          ? `HH-Goa-2026-Frame-${builderId}.png`
          : `HH-Goa-2026-Passport-${builderId}.png`;

      const base =
        origin ||
        (typeof window !== "undefined" ? window.location.origin : "");

      // Persist first so the public page / OG image is the created passport
      let shareLink = `${base}${builderPublicPath(builderId)}`;
      try {
        const saved = await persistCard({
          id: builderId,
          name: name || "Builder",
          role: role || "HH Goa Builder",
          twitter: twitter || undefined,
          builderTitle,
          format: mode,
          imageDataUrl: dataUrl,
          photoDataUrl: croppedUrl,
        });
        shareLink = saved.url.startsWith("http")
          ? saved.url
          : `${base}${saved.url}`;
      } catch (err) {
        console.warn("Card persist failed", err);
      }

      if (!shareAfter) {
        downloadDataUrl(dataUrl, filename);
      } else {
        const tweet = buildShareTweet({
          mode,
          name,
          builderId,
          url: shareLink,
          twitter,
        });

        const how = await sharePassportToX({
          dataUrl,
          filename,
          text: tweet,
          shareTab,
        });
        if (how === "intent") {
          setStatus("Passport downloaded — attach the PNG to your X post.");
        }
      }

      setResultUrl(dataUrl);
      setStep("result");
      if (!shareAfter) setStatus(null);
    } catch (e) {
      console.error(e);
      if (shareTab && !shareTab.closed) shareTab.close();
      setStatus("Export failed — try again in a moment.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="relative min-h-[100dvh] bg-[#fffbe8]">
      <FloatingBackground />
      <Navbar />

      <main className="relative z-10 mx-auto max-w-6xl px-4 pb-28 pt-2 sm:px-6 sm:pt-4">
        {step !== "result" ? (
          <>
            <header className="mb-6 sm:mb-8">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0b6839]">
                GOA, INDIA · 28–31 OCT 2026
              </p>
              <h1 className="mt-1 font-[family-name:var(--font-imbue)] text-4xl font-extrabold tracking-tight text-black sm:text-6xl">
                Create Yours
              </h1>

              <nav
                aria-label="Creation steps"
                className="mt-5 flex flex-wrap gap-2"
              >
                {STEPS_META.map((s) => {
                  const active = step === s.id;
                  const done = typeof step === "number" && step > s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => {
                        if (s.id === 1) setStep(1);
                        if (s.id === 2 && canGoIdentity) setStep(2);
                        if (s.id === 3 && canGoIdentity && canGoAsset) setStep(3);
                      }}
                      className={cn(
                        "border-2 border-black px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider transition-colors sm:text-xs",
                        active && "bg-[#fee101] shadow-[2px_2px_#000]",
                        done && !active && "bg-[#0b6839] text-[#fee101]",
                        !active && !done && "bg-white/50 text-black/45"
                      )}
                    >
                      0{s.id} · {s.label}
                    </button>
                  );
                })}
              </nav>
            </header>

            <div className="grid items-start gap-8 lg:grid-cols-[1fr_minmax(280px,400px)]">
              <div className="min-w-0 rounded-[4px] border-2 border-black/15 bg-white/50 p-4 shadow-[4px_4px_#fee10166] backdrop-blur-[12px] sm:p-6">
                {/* Steps: no exit animation / mode=wait — avoids blank flash */}
                {step === 1 ? (
                  <div className="hh-fade-in space-y-5">
                    <div>
                      <h2 className="font-[family-name:var(--font-imbue)] text-3xl font-bold text-black">
                        Your Photo
                      </h2>
                      <p className="mt-1 font-mono text-xs text-black/55">
                        Auto-center · zoom · reposition. Never stretched.
                      </p>
                    </div>
                    {!previewUrl ? (
                      <UploadZone onReady={onUpload} />
                    ) : (
                      <>
                        <CropEditor
                          imageUrl={previewUrl}
                          onCropReady={onCropReady}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const prev = previewUrlRef.current;
                            previewUrlRef.current = null;
                            setPreviewUrl(null);
                            setCroppedUrl(null);
                            setCropPixels(null);
                            if (prev) URL.revokeObjectURL(prev);
                          }}
                        >
                          Use a different photo
                        </Button>
                      </>
                    )}
                    <div className="flex justify-end pt-2">
                      <Button
                        size="lg"
                        disabled={!canGoIdentity}
                        onClick={() => setStep(2)}
                      >
                        Next · Identity
                        <ArrowRight />
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === 2 ? (
                  <div className="hh-fade-in space-y-5">
                    <div>
                      <h2 className="font-[family-name:var(--font-imbue)] text-3xl font-bold text-black">
                        Your Identity
                      </h2>
                      <p className="mt-1 font-mono text-xs text-black/55">
                        Name, stack, X — passport updates live.
                      </p>
                    </div>
                    <BuilderForm
                      name={name}
                      role={role}
                      twitter={twitter}
                      builderTitle={builderTitle}
                      onChange={onFormChange}
                    />
                    <div className="flex flex-wrap justify-between gap-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => setStep(1)}
                      >
                        <ArrowLeft />
                        Photo
                      </Button>
                      <Button
                        size="lg"
                        disabled={!canGoAsset}
                        onClick={() => setStep(3)}
                      >
                        Next · Asset
                        <ArrowRight />
                      </Button>
                    </div>
                  </div>
                ) : null}

                {step === 3 ? (
                  <div className="hh-fade-in space-y-5">
                    <div>
                      <h2 className="font-[family-name:var(--font-imbue)] text-3xl font-bold text-black">
                        Your HH Goa Asset
                      </h2>
                      <p className="mt-1 font-mono text-xs text-black/55">
                        Switch formats anytime — same photo.
                      </p>
                    </div>

                    <div
                      role="tablist"
                      aria-label="Asset format"
                      className="flex gap-2"
                    >
                      {(
                        [
                          ["card", "Builder Passport"],
                          ["frame", "Profile Frame"],
                        ] as const
                      ).map(([value, label]) => (
                        <button
                          key={value}
                          type="button"
                          role="tab"
                          aria-selected={mode === value}
                          onClick={() => setMode(value)}
                          className={cn(
                            "flex-1 border-2 border-black px-3 py-3 font-mono text-xs font-bold uppercase tracking-wider transition-colors sm:text-sm",
                            mode === value
                              ? "bg-[#fee101] shadow-[3px_3px_#000]"
                              : "bg-white/60 hover:bg-[#fee101]/30"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>

                    <p className="font-mono text-[10px] text-black/40">
                      Builder No. {displayId} · Public {publicPath}
                    </p>

                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        type="button"
                        variant="outline"
                        size="lg"
                        onClick={() => setStep(2)}
                      >
                        <ArrowLeft />
                        Identity
                      </Button>
                      <Button
                        size="lg"
                        className="flex-1"
                        disabled={!croppedUrl || exporting || !builderId}
                        onClick={() => void runExport(false)}
                        aria-busy={exporting}
                      >
                        {exporting ? (
                          <Loader2 className="animate-spin" />
                        ) : (
                          <Download />
                        )}
                        {exporting
                          ? "Building your HH Goa pass…"
                          : "Download PNG"}
                      </Button>
                      <Button
                        size="lg"
                        variant="green"
                        className="flex-1"
                        disabled={!croppedUrl || exporting || !builderId}
                        onClick={() => void runExport(true)}
                      >
                        <Share2 />
                        Share to X
                      </Button>
                    </div>
                    {status ? (
                      <p
                        className="font-mono text-xs text-[#0b6839]"
                        role="status"
                      >
                        {status}
                      </p>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <LivePreview
                mode={mode}
                croppedUrl={croppedUrl}
                name={name}
                role={role}
                twitter={twitter}
                builderTitle={builderTitle}
                builderId={displayId}
                qrUrl={qrUrl}
              />
            </div>
          </>
        ) : (
          <ResultView
            resultUrl={resultUrl}
            mode={mode}
            name={name}
            builderTitle={builderTitle}
            builderId={displayId}
            publicPath={publicPath}
            publicUrl={
              origin && builderId
                ? `${origin}${builderPublicPath(builderId)}`
                : publicPath
            }
            exporting={exporting}
            onDownload={() => {
              if (!resultUrl || !builderId) return;
              downloadDataUrl(
                resultUrl,
                mode === "frame"
                  ? `HH-Goa-2026-Frame-${builderId}.png`
                  : `HH-Goa-2026-Passport-${builderId}.png`
              );
            }}
            onShare={() => {
              if (!builderId || !resultUrl) return;
              const shareLink = origin
                ? `${origin}${builderPublicPath(builderId)}`
                : `${window.location.origin}${builderPublicPath(builderId)}`;
              const tweet = buildShareTweet({
                mode,
                name,
                builderId,
                url: shareLink,
                twitter,
              });
              const filename =
                mode === "frame"
                  ? `HH-Goa-2026-Frame-${builderId}.png`
                  : `HH-Goa-2026-Passport-${builderId}.png`;
              const shareTab = window.open("about:blank", "_blank");
              void sharePassportToX({
                dataUrl: resultUrl,
                filename,
                text: tweet,
                shareTab,
              }).then((how) => {
                if (how === "intent") {
                  setStatus(
                    "Passport downloaded — attach the PNG to your X post."
                  );
                }
              });
            }}
            onAnother={() => {
              setStep(1);
              setResultUrl(null);
              exportCacheRef.current = null;
              exportInflightRef.current = null;
              const prev = previewUrlRef.current;
              previewUrlRef.current = null;
              setPreviewUrl(null);
              setCroppedUrl(null);
              setCropPixels(null);
              setName("");
              setRole("");
              setTwitter("");
              rerollTitle();
              newSessionId();
              if (prev) URL.revokeObjectURL(prev);
            }}
          />
        )}
      </main>

      {/* Offscreen hi-res export — must NOT clip to 1×1 (breaks html-to-image) */}
      <div
        aria-hidden
        className="pointer-events-none fixed"
        style={{
          left: 0,
          top: 0,
          transform: "translate(-120vw, -120vh)",
          opacity: 0,
          zIndex: -1,
        }}
      >
        {croppedUrl && builderId ? (
          <>
            <ProfileFrame
              ref={exportFrameRef}
              photoUrl={croppedUrl}
              size={FRAME_EXPORT_SIZE / 2}
            />
            <BuilderIdCard
              ref={exportCardRef}
              photoUrl={croppedUrl}
              name={name}
              role={role}
              twitter={twitter}
              builderTitle={builderTitle}
              builderId={builderId}
              width={CARD_EXPORT_WIDTH}
              qrUrl={qrUrl}
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

function ResultView({
  resultUrl,
  mode,
  name,
  builderTitle,
  builderId,
  publicPath,
  publicUrl,
  exporting,
  onDownload,
  onShare,
  onAnother,
}: {
  resultUrl: string | null;
  mode: FormatMode;
  name: string;
  builderTitle: string;
  builderId: string;
  publicPath: string;
  publicUrl: string;
  exporting: boolean;
  onDownload: () => void;
  onShare: () => void;
  onAnother: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      className="mx-auto flex max-w-xl flex-col items-center text-center"
    >
      <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.25em] text-[#0b6839]">
        Official · {builderId}
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-imbue)] text-5xl font-extrabold tracking-tight text-black sm:text-6xl">
        You&apos;re in.
      </h1>
      <p className="mt-2 font-mono text-sm text-black/60">
        {name || "Builder"} · {builderTitle}
      </p>

      <div className="mt-8 aspect-[4/5] w-full max-w-sm">
        {resultUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={resultUrl}
            alt={`Generated HH Goa ${mode === "frame" ? "frame" : "passport"}`}
            className="h-full w-full object-contain drop-shadow-[6px_6px_0_#ff0080]"
            decoding="async"
          />
        ) : null}
      </div>

      <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:flex-wrap sm:justify-center">
        <Button
          size="lg"
          className="min-h-14 flex-1 sm:min-w-[160px]"
          onClick={onDownload}
          disabled={exporting}
        >
          <Download />
          Download PNG
        </Button>
        <Button
          size="lg"
          variant="green"
          className="min-h-14 flex-1 sm:min-w-[160px]"
          onClick={onShare}
        >
          <Share2 />
          Share to X
        </Button>
      </div>
      <div className="mt-3 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        <Button size="lg" variant="outline" className="min-h-12" onClick={onAnother}>
          <RefreshCw />
          Create Another
        </Button>
        <Button asChild size="lg" variant="ghost" className="min-h-12">
          <a href="https://hhgoa.com" target="_blank" rel="noopener noreferrer">
            Visit HH Goa
            <ExternalLink />
          </a>
        </Button>
      </div>
      <Link
        href={publicPath}
        className="mt-6 font-mono text-xs text-[#0b6839] underline underline-offset-4"
      >
        Public page · {publicUrl.replace(/^https?:\/\//, "")}
      </Link>
    </motion.div>
  );
}
