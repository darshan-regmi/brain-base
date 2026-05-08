import Link from "next/link";
import { cn } from "@/lib/utils";

type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, { box: string; text: string; gap: string }> = {
  sm: {
    box: "w-6 h-6 text-sm",
    text: "text-sm font-semibold",
    gap: "gap-2",
  },
  md: {
    box: "w-7 h-7 text-base",
    text: "text-base font-semibold",
    gap: "gap-2",
  },
  lg: {
    box: "w-8 h-8 text-lg",
    text: "text-lg font-semibold",
    gap: "gap-2.5",
  },
};

export function Wordmark({
  size = "md",
  withLabel = true,
  href = "/",
  className,
}: {
  size?: Size;
  withLabel?: boolean;
  href?: string | null;
  className?: string;
  /** Legacy prop kept for callsite compatibility; intentionally ignored. */
  theme?: "dark" | "light";
}) {
  const s = SIZE_MAP[size];

  const mark = (
    <div className={cn("flex items-center", s.gap, className)}>
      {withLabel && <span className={cn("text-ink", s.text)}>Brain Base</span>}
    </div>
  );

  if (href) return <Link href={href}>{mark}</Link>;
  return mark;
}
