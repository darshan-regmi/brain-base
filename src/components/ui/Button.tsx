"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "dark" | "on-dark";
type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, string> = {
  sm: "h-8 px-3 text-xs gap-1.5",
  md: "h-10 px-[18px] text-sm gap-2",
  lg: "h-11 px-5 text-sm gap-2",
};

const VARIANT_MAP: Record<Variant, string> = {
  primary:
    "bg-primary text-on-primary hover:bg-primary-pressed font-medium shadow-[0_1px_2px_rgba(15,15,15,0.04)]",
  secondary:
    "bg-transparent text-ink border border-hairline-strong hover:bg-surface font-medium",
  ghost:
    "bg-transparent text-ink hover:bg-surface font-medium",
  dark:
    "bg-ink-deep text-on-primary hover:opacity-90 font-medium",
  "on-dark":
    "bg-white text-ink hover:opacity-90 font-medium",
};

export const Button = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button"> & { variant?: Variant; size?: Size }
>(function Button(
  { variant = "primary", size = "md", className, disabled, ...rest },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.12, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "inline-flex items-center justify-center rounded-md cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed leading-none",
        VARIANT_MAP[variant],
        SIZE_MAP[size],
        className,
      )}
      {...rest}
    />
  );
});

/* Backwards-compatible aliases — old code imports these names. The `pill`
   prop is accepted but ignored to avoid breaking call sites. */
export const CandleButton = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button"> & { size?: Size; pill?: boolean }
>(function CandleButton({ pill, ...rest }, ref) {
  void pill;
  return <Button ref={ref} variant="primary" {...rest} />;
});

export const GhostButton = forwardRef<
  HTMLButtonElement,
  HTMLMotionProps<"button"> & { size?: Size; pill?: boolean }
>(function GhostButton({ pill, ...rest }, ref) {
  void pill;
  return <Button ref={ref} variant="secondary" {...rest} />;
});
