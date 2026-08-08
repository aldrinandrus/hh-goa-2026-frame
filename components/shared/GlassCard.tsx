import { cn } from "@/lib/utils";

export function GlassCard({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[4px] border-2 border-black/15 bg-white/45 p-6 shadow-[4px_4px_#fee10166] backdrop-blur-[12px]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
