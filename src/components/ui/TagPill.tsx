import { Hash } from "lucide-react";
import { cn } from "@/lib/utils";

type Size = "xs" | "sm";

const SIZE: Record<Size, { wrap: string; icon: string }> = {
  xs: { wrap: "px-1.5 py-0.5 text-xs gap-1", icon: "w-2 h-2" },
  sm: { wrap: "px-2 py-1 text-xs gap-1", icon: "w-2.5 h-2.5" },
};

export function TagPill({
  tag,
  size = "sm",
  active = false,
  onClick,
  asButton = false,
}: {
  tag: string;
  size?: Size;
  active?: boolean;
  onClick?: () => void;
  asButton?: boolean;
}) {
  const s = SIZE[size];
  const Cmp = asButton || onClick ? "button" : "span";
  return (
    <Cmp
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-sm font-medium transition-colors",
        s.wrap,
        active
          ? "bg-tint-lavender text-brand-purple-800"
          : "bg-surface text-steel hover:bg-tint-lavender hover:text-brand-purple-800",
      )}
    >
      <Hash className={s.icon} />
      {tag}
    </Cmp>
  );
}
