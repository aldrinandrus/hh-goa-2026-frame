import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-[4px] border-2 border-black bg-white/70 px-4 py-2 font-mono text-sm text-black shadow-[3px_3px_#fee101] backdrop-blur-[12px] transition-colors placeholder:text-black/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fee101] disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
