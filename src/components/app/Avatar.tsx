"use client";

import { cn } from "@/lib/utils";

const SIZE_MAP = {
  sm: { box: "w-7 h-7", text: "text-xs" },
  md: { box: "w-9 h-9", text: "text-sm" },
  lg: { box: "w-14 h-14", text: "text-xl" },
} as const;

type Size = keyof typeof SIZE_MAP;

/** First grapheme of the first name, uppercase. Falls back to email's first
 *  letter, then "?" if neither produces a character. */
function firstInitial(name: string | undefined | null, email?: string): string {
  const trimmed = (name ?? "").trim();
  if (trimmed.length > 0) {
    const first = trimmed.split(/\s+/)[0];
    return first.charAt(0).toUpperCase();
  }
  if (email && email.length > 0) {
    return email.charAt(0).toUpperCase();
  }
  return "?";
}

export function Avatar({
  name,
  email,
  size = "md",
  className,
}: {
  name?: string | null;
  email?: string;
  size?: Size;
  className?: string;
}) {
  const s = SIZE_MAP[size];
  const initial = firstInitial(name, email);
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0 select-none",
        s.box,
        s.text,
        className,
      )}
      style={{
        background: "linear-gradient(135deg, #5645d4 0%, #7b3ff2 100%)",
        color: "#ffffff",
        fontWeight: 600,
        boxShadow: "0 1px 2px rgba(15,15,15,0.10), 0 0 0 0.5px rgba(255,255,255,0.20) inset",
      }}
      aria-hidden
    >
      {initial}
    </div>
  );
}
