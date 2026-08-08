"use client";

import { useCallback, useEffect, useRef } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useState } from "react";
import { detectFaceCrop, loadImage } from "@/lib/face-crop";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface CropEditorProps {
  imageUrl: string;
  onCropReady: (croppedAreaPixels: Area) => void;
}

export function CropEditor({ imageUrl, onCropReady }: CropEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1.15);
  const [autoApplied, setAutoApplied] = useState(false);
  const onCropReadyRef = useRef(onCropReady);
  onCropReadyRef.current = onCropReady;
  const lastImage = useRef<string | null>(null);

  useEffect(() => {
    if (lastImage.current === imageUrl) return;
    lastImage.current = imageUrl;
    let cancelled = false;
    setAutoApplied(false);
    (async () => {
      try {
        const img = await loadImage(imageUrl);
        try {
          await img.decode();
        } catch {
          /* decode optional */
        }
        const area = await detectFaceCrop(img, 1);
        if (cancelled) return;
        const cx = (area.x + area.width / 2) / img.naturalWidth;
        const cy = (area.y + area.height / 2) / img.naturalHeight;
        setCrop({
          x: (0.5 - cx) * 100,
          y: (0.5 - cy) * 100,
        });
        const coverZoom = Math.max(
          img.naturalWidth / area.width,
          img.naturalHeight / area.height
        );
        setZoom(Math.min(3, Math.max(1, coverZoom * 0.92)));
        setAutoApplied(true);
      } catch {
        if (!cancelled) setAutoApplied(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    onCropReadyRef.current(croppedAreaPixels);
  }, []);

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between gap-3">
        <Label>Fine-tune crop</Label>
        <span className="font-mono text-[10px] uppercase tracking-wider text-black/45">
          {autoApplied ? "Auto-centered" : "Detecting…"}
        </span>
      </div>
      <div className="relative h-64 overflow-hidden rounded-[4px] border-2 border-black bg-black/90 sm:h-80">
        <Cropper
          image={imageUrl}
          crop={crop}
          zoom={zoom}
          aspect={1}
          showGrid={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          objectFit="horizontal-cover"
        />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <Label htmlFor="zoom" className="shrink-0">
          Zoom
        </Label>
        <input
          id="zoom"
          type="range"
          min={1}
          max={3}
          step={0.01}
          value={zoom}
          onChange={(e) => setZoom(Number(e.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-full bg-[#0b6839]/20 accent-[#fee101]"
          aria-label="Zoom"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            setCrop({ x: 0, y: 0 });
            setZoom(1.15);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}
