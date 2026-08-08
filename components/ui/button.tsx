import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fee101] focus-visible:ring-offset-2 focus-visible:ring-offset-[#fffbe8] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-[#fee101] text-black border-2 border-black shadow-[4px_4px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_#000]",
        green:
          "bg-[#0b6839] text-[#fee101] border-2 border-black shadow-[4px_4px_#fee101] hover:brightness-110",
        outline:
          "bg-transparent text-black border-2 border-black hover:bg-[#fee101]/40",
        ghost: "bg-transparent text-black hover:bg-black/5",
        glass:
          "bg-white/50 backdrop-blur-[12px] text-black border border-black/20 hover:bg-white/70",
      },
      size: {
        default: "h-12 px-6 py-2 rounded-[4px]",
        sm: "h-9 px-4 rounded-[4px] text-xs",
        lg: "h-14 px-8 rounded-[4px] text-base",
        xl: "h-16 px-10 rounded-[4px] text-lg",
        icon: "h-12 w-12 rounded-[4px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
