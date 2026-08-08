import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#fffbe8] px-4 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.25em] text-[#0b6839]">
        404
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-imbue)] text-6xl font-extrabold text-black">
        Not found
      </h1>
      <p className="mt-3 max-w-sm font-mono text-sm text-black/60">
        This builder card doesn&apos;t exist yet — create yours in seconds.
      </p>
      <Button asChild size="lg" className="mt-8">
        <Link href="/create">Create Mine</Link>
      </Button>
    </div>
  );
}
