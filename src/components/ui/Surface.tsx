import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variant = "card" | "panel" | "soft" | "tinted";

const VARIANTS: Record<Variant, string> = {
  card: "bg-canvas border border-hairline rounded-lg",
  panel: "bg-surface border border-hairline rounded-lg",
  soft: "bg-surface-soft border border-hairline-soft rounded-lg",
  tinted: "rounded-lg", // bg comes from caller
};

export const Surface = forwardRef<
  HTMLDivElement,
  HTMLAttributes<HTMLDivElement> & { variant?: Variant }
>(function Surface({ variant = "card", className, ...rest }, ref) {
  return (
    <div ref={ref} className={cn(VARIANTS[variant], className)} {...rest} />
  );
});
